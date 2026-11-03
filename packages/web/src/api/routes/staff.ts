import { z } from "zod";
import { asc, eq } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import { base } from "../__core/app";
import { db } from "../database";
import * as schema from "../database/schema";
import { auth } from "../auth";
import { adminProcedure, staffProcedure } from "../lib/guards";

export const staff = {
  /**
   * Creates an employee account. Requires the shelter invite code, so the
   * register page cannot be used by the public. The first account ever created
   * becomes the administrator.
   */
  register: base
    .input(
      z.object({
        name: z.string().min(2).max(120),
        email: z.string().email().max(160),
        password: z.string().min(8).max(200),
        inviteCode: z.string().max(120),
      }),
    )
    .handler(async ({ input }) => {
      const expected = process.env.STAFF_INVITE_CODE;
      if (!expected || input.inviteCode !== expected) {
        throw new ORPCError("FORBIDDEN", {
          message: "Λάθος κωδικός προσκλήσεως / Wrong invite code",
        });
      }

      const existing = await db.select({ id: schema.user.id }).from(schema.user).limit(1);
      const isFirst = existing.length === 0;

      try {
        await auth.api.signUpEmail({
          body: { name: input.name, email: input.email, password: input.password },
        });
      } catch {
        throw new ORPCError("BAD_REQUEST", {
          message: "Το email χρησιμοποιείται ήδη / That email is already registered",
        });
      }

      await db
        .update(schema.user)
        .set({ role: isFirst ? "admin" : "staff" })
        .where(eq(schema.user.email, input.email));

      return { ok: true, role: isFirst ? "admin" : "staff" };
    }),

  /** Who am I — drives the admin layout and the role-gated menu items. */
  me: staffProcedure.handler(async ({ context }) => context.staff),

  list: adminProcedure.handler(async () => {
    const rows = await db
      .select({
        id: schema.user.id,
        name: schema.user.name,
        email: schema.user.email,
        role: schema.user.role,
        createdAt: schema.user.createdAt,
      })
      .from(schema.user)
      .orderBy(asc(schema.user.createdAt));
    return rows;
  }),

  setRole: adminProcedure
    .input(z.object({ id: z.string(), role: z.enum(["admin", "staff"]) }))
    .handler(async ({ input, context }) => {
      if (input.id === context.staff.id && input.role !== "admin") {
        throw new ORPCError("BAD_REQUEST", {
          message: "Δεν μπορείτε να αφαιρέσετε τον δικό σας ρόλο / You cannot demote yourself",
        });
      }
      await db.update(schema.user).set({ role: input.role }).where(eq(schema.user.id, input.id));
      return { ok: true };
    }),

  remove: adminProcedure.input(z.object({ id: z.string() })).handler(async ({ input, context }) => {
    if (input.id === context.staff.id) {
      throw new ORPCError("BAD_REQUEST", {
        message: "Δεν μπορείτε να διαγράψετε τον εαυτό σας / You cannot delete your own account",
      });
    }
    await db.delete(schema.session).where(eq(schema.session.userId, input.id));
    await db.delete(schema.account).where(eq(schema.account.userId, input.id));
    await db.delete(schema.user).where(eq(schema.user.id, input.id));
    return { ok: true };
  }),
};

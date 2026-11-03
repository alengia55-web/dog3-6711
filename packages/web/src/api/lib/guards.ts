import { ORPCError } from "@orpc/server";
import { base } from "../__core/app";
import { auth } from "../auth";

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

/** Reads the Better Auth session from the request headers, or null. */
export async function readStaff(headers: Headers): Promise<StaffUser | null> {
  const session = await auth.api.getSession({ headers });
  if (!session?.user) return null;
  const user = session.user as unknown as StaffUser;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role === "admin" ? "admin" : "staff",
  };
}

/** Any signed-in shelter employee. */
export const staffProcedure = base.use(async ({ context, next }) => {
  const staff = await readStaff(context.headers);
  if (!staff) {
    throw new ORPCError("UNAUTHORIZED", { message: "Απαιτείται σύνδεση / Sign in required" });
  }
  return next({ context: { ...context, staff } });
});

/** Employees with the admin role — settings and staff management. */
export const adminProcedure = base.use(async ({ context, next }) => {
  const staff = await readStaff(context.headers);
  if (!staff) {
    throw new ORPCError("UNAUTHORIZED", { message: "Απαιτείται σύνδεση / Sign in required" });
  }
  if (staff.role !== "admin") {
    throw new ORPCError("FORBIDDEN", {
      message: "Μόνο διαχειριστές / Administrators only",
    });
  }
  return next({ context: { ...context, staff } });
});

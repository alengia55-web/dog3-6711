import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import { base } from "../__core/app";
import { db } from "../database";
import * as schema from "../database/schema";
import { renderRows, sendNotification } from "../services/email";
import { staffProcedure } from "../lib/guards";
import { isProposedDate } from "../../shared/in-kind";

const adoptionInput = z.object({
  dogSlug: z.string().max(80).optional(),
  dogName: z.string().max(120).optional(),
  fullName: z.string().min(2).max(160),
  birthYear: z.string().max(20).optional(),
  idNumber: z.string().max(40).optional(),
  phone: z.string().min(6).max(40),
  email: z.string().email().max(160),
  address: z.string().min(3).max(200),
  city: z.string().min(2).max(120),
  job: z.string().max(160).optional(),
  household: z.string().max(300).optional(),
  homeType: z.string().max(80).optional(),
  ownership: z.string().max(80).optional(),
  yard: z.string().max(120).optional(),
  whereDogStays: z.string().max(200).optional(),
  hoursAlone: z.string().max(120).optional(),
  otherPets: z.string().max(400).optional(),
  pastPets: z.string().max(400).optional(),
  vacationPlan: z.string().max(400).optional(),
  vetBudget: z.string().max(200).optional(),
  reason: z.string().min(5).max(2000),
  agreeVisit: z.boolean(),
  agreeTerms: z.boolean(),
  agreeGdpr: z.boolean(),
  locale: z.enum(["el", "en"]).default("el"),
});

const volunteerInput = z.object({
  fullName: z.string().min(2).max(160),
  fatherName: z.string().max(160).optional(),
  birthDate: z.string().max(40).optional(),
  idNumber: z.string().max(40).optional(),
  phone: z.string().min(6).max(40),
  email: z.string().email().max(160),
  address: z.string().min(3).max(200),
  city: z.string().min(2).max(120),
  interests: z.array(z.string().max(80)).default([]),
  availability: z.string().max(300).optional(),
  hasVehicle: z.string().max(40).optional(),
  experience: z.string().max(1500).optional(),
  notes: z.string().max(1500).optional(),
  agreeTerms: z.boolean(),
  agreeGdpr: z.boolean(),
  locale: z.enum(["el", "en"]).default("el"),
});

const yesNo = (value: boolean) => (value ? "Ναι / Yes" : "Όχι / No");

const inKindInput = z.object({
  fullName: z.string().trim().min(2).max(160),
  phone: z.string().trim().min(6).max(40),
  email: z.string().trim().email().max(160),
  items: z.string().trim().min(3).max(2000),
  quantity: z.string().trim().min(1).max(200),
  proposedDate: z.string().refine(isProposedDate, "Επίλεξε έγκυρη ημερομηνία από σήμερα και μετά / Choose a valid date from today onwards"),
  proposedTime: z.string().regex(/^$|^([01]\d|2[0-3]):[0-5]\d$/).default(""),
  notes: z.string().trim().max(1500).default(""),
  agreeContact: z.literal(true),
  locale: z.enum(["el", "en"]).default("el"),
});

const statusInput = z.object({
  kind: z.enum(["adoption", "volunteer", "inKind"]),
  id: z.number(),
  status: z.enum(["new", "review", "approved", "rejected"]),
});

const tableFor = (kind: "adoption" | "volunteer" | "inKind") =>
  kind === "adoption" ? schema.adoptionApplications : kind === "volunteer" ? schema.volunteerApplications : schema.inKindDonations;

export const applications = {
  /** Adoption form — stored in the database and emailed to the shelter. */
  submitAdoption: base.input(adoptionInput).handler(async ({ input }) => {
    if (!input.agreeTerms || !input.agreeGdpr) {
      throw new ORPCError("BAD_REQUEST", {
        message: "Πρέπει να αποδεχτείτε τους όρους / You must accept the terms",
      });
    }
    const [row] = await db.insert(schema.adoptionApplications).values(input).returning();

    const mail = await sendNotification({
      subject: `Νέα αίτηση υιοθεσίας — ${input.fullName}${input.dogName ? ` (${input.dogName})` : ""}`,
      replyTo: input.email,
      html: renderRows("Νέα αίτηση υιοθεσίας / New adoption application", [
        ["Σκύλος / Dog", input.dogName ?? "—"],
        ["Ονοματεπώνυμο", input.fullName],
        ["Έτος γέννησης", input.birthYear],
        ["ΑΔΤ", input.idNumber],
        ["Τηλέφωνο", input.phone],
        ["Email", input.email],
        ["Διεύθυνση", `${input.address}, ${input.city}`],
        ["Επάγγελμα", input.job],
        ["Σύνθεση σπιτιού", input.household],
        ["Τύπος κατοικίας", input.homeType],
        ["Ιδιόκτητο / ενοίκιο", input.ownership],
        ["Αυλή / περίφραξη", input.yard],
        ["Πού θα μένει ο σκύλος", input.whereDogStays],
        ["Ώρες μόνος", input.hoursAlone],
        ["Άλλα ζώα", input.otherPets],
        ["Προηγούμενα ζώα", input.pastPets],
        ["Διακοπές / απουσία", input.vacationPlan],
        ["Κτηνιατρικά έξοδα", input.vetBudget],
        ["Γιατί θέλει υιοθεσία", input.reason],
        ["Δέχεται επίσκεψη", yesNo(input.agreeVisit)],
        ["Αποδοχή όρων", yesNo(input.agreeTerms)],
        ["Συναίνεση GDPR", yesNo(input.agreeGdpr)],
        ["Γλώσσα φόρμας", input.locale],
      ]),
    });

    return { id: row?.id ?? 0, emailed: mail.sent };
  }),

  /** Volunteer ("φιλόζωος") form — stored and emailed to the shelter. */
  submitVolunteer: base.input(volunteerInput).handler(async ({ input }) => {
    if (!input.agreeTerms || !input.agreeGdpr) {
      throw new ORPCError("BAD_REQUEST", {
        message: "Πρέπει να αποδεχτείτε τους όρους / You must accept the terms",
      });
    }
    const [row] = await db
      .insert(schema.volunteerApplications)
      .values({ ...input, interests: input.interests.join(", ") })
      .returning();

    const mail = await sendNotification({
      subject: `Νέα αίτηση εθελοντή — ${input.fullName}`,
      replyTo: input.email,
      html: renderRows("Νέα αίτηση εθελοντή / New volunteer application", [
        ["Ονοματεπώνυμο", input.fullName],
        ["Πατρώνυμο", input.fatherName],
        ["Ημ. γέννησης", input.birthDate],
        ["ΑΔΤ", input.idNumber],
        ["Τηλέφωνο", input.phone],
        ["Email", input.email],
        ["Διεύθυνση", `${input.address}, ${input.city}`],
        ["Ενδιαφέρομαι για", input.interests.join(", ")],
        ["Διαθεσιμότητα", input.availability],
        ["Όχημα", input.hasVehicle],
        ["Εμπειρία", input.experience],
        ["Σχόλια", input.notes],
        ["Αποδοχή όρων", yesNo(input.agreeTerms)],
        ["Συναίνεση GDPR", yesNo(input.agreeGdpr)],
        ["Γλώσσα φόρμας", input.locale],
      ]),
    });

    return { id: row?.id ?? 0, emailed: mail.sent };
  }),

  /** In-kind offers are stored before any optional email notification. */
  submitInKind: base.input(inKindInput).handler(async ({ input }) => {
    const [row] = await db.insert(schema.inKindDonations).values(input).returning();
    const mail = await sendNotification({
      subject: `Νέα προσφορά δωρεάς σε είδος — ${input.fullName}`,
      replyTo: input.email,
      html: renderRows("Προσφορά δωρεάς σε είδος / In-kind donation offer", [
        ["Ονοματεπώνυμο / Name", input.fullName],
        ["Τηλέφωνο / Phone", input.phone], ["Email", input.email],
        ["Προσφορά / Goods", input.items], ["Ποσότητα / Quantity", input.quantity],
        ["Προτεινόμενη ημερομηνία / Proposed date", input.proposedDate],
        ["Προτεινόμενη ώρα / Proposed time (Europe/Athens)", input.proposedTime],
        ["Σχόλια / Notes", input.notes],
        ["Συναίνεση επικοινωνίας / Contact consent", yesNo(input.agreeContact)],
        ["Σημείωση / Note", "Η παράδοση χρειάζεται επιβεβαίωση / Delivery requires confirmation"],
      ]),
    });
    return { id: row.id, emailed: mail.sent };
  }),

  /** Back office list — every application, newest first. */
  adminList: staffProcedure.handler(async () => {
    const [adoptions, volunteers, inKind] = await Promise.all([
      db
        .select()
        .from(schema.adoptionApplications)
        .orderBy(desc(schema.adoptionApplications.createdAt))
        .limit(500),
      db
        .select()
        .from(schema.volunteerApplications)
        .orderBy(desc(schema.volunteerApplications.createdAt))
        .limit(500),
      db.select().from(schema.inKindDonations).orderBy(desc(schema.inKindDonations.createdAt)).limit(500),
    ]);
    return { adoptions, volunteers, inKind };
  }),

  /** Moves an application through new → review → approved/rejected. */
  setStatus: staffProcedure.input(statusInput).handler(async ({ input, context }) => {
    const table = tableFor(input.kind);
    await db
      .update(table)
      .set({ status: input.status, handledBy: context.staff.name, updatedAt: new Date() })
      .where(eq(table.id, input.id));
    return { ok: true };
  }),

  /** Internal notes staff keep on an application. */
  setNotes: staffProcedure
    .input(
      z.object({
        kind: z.enum(["adoption", "volunteer", "inKind"]),
        id: z.number(),
        staffNotes: z.string().max(4000),
      }),
    )
    .handler(async ({ input, context }) => {
      const table = tableFor(input.kind);
      await db
        .update(table)
        .set({ staffNotes: input.staffNotes, handledBy: context.staff.name, updatedAt: new Date() })
        .where(eq(table.id, input.id));
      return { ok: true };
    }),

  remove: staffProcedure
    .input(z.object({ kind: z.enum(["adoption", "volunteer", "inKind"]), id: z.number() }))
    .handler(async ({ input }) => {
      const table = tableFor(input.kind);
      await db.delete(table).where(eq(table.id, input.id));
      return { ok: true };
    }),
};

import { z } from "zod";
import { asc, eq, inArray, sql } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import { base } from "../__core/app";
import { db } from "../database";
import * as schema from "../database/schema";
import { seedDogsIfEmpty } from "../database/seed-dogs";
import { staffProcedure } from "../lib/guards";
import { slugify } from "../lib/slug";
import { isPetGovListingUrl } from "../../shared/pet-gov";

const petGovUrlInput = z.string().trim().max(500).refine(
  value => value === "" || isPetGovListingUrl(value),
  "Χρειάζεται έγκυρος σύνδεσμος συγκεκριμένης αγγελίας pet.gov.gr / Enter an official individual pet.gov.gr listing URL",
);

const dogInput = z.object({
  name: z.string().min(1).max(120),
  nameEn: z.string().min(1).max(120),
  photo: z.string().min(1).max(500),
  sex: z.enum(["male", "female"]),
  ageEl: z.string().min(1).max(80),
  ageEn: z.string().min(1).max(80),
  sizeEl: z.string().min(1).max(120),
  sizeEn: z.string().min(1).max(120),
  storyEl: z.string().min(1).max(6000),
  storyEn: z.string().min(1).max(6000),
  traitsEl: z.string().max(300).default(""),
  traitsEn: z.string().max(300).default(""),
  sterilized: z.boolean().default(true),
  vaccinated: z.boolean().default(true),
  microchip: z.boolean().default(true),
  petGovUrl: petGovUrlInput.default(""),
  adopted: z.boolean().default(false),
  adoptedAt: z.string().max(20).nullable().default(null),
  gallery: z.array(z.string().max(500)).max(12).default([]),
});

/** Attaches the gallery rows to a list of dogs in one query. */
async function withGallery<T extends { id: number }>(rows: T[]) {
  if (rows.length === 0) return rows.map((row) => ({ ...row, gallery: [] as string[] }));
  const photos = await db
    .select()
    .from(schema.dogPhotos)
    .where(
      inArray(
        schema.dogPhotos.dogId,
        rows.map((row) => row.id),
      ),
    )
    .orderBy(asc(schema.dogPhotos.sortOrder), asc(schema.dogPhotos.id));
  return rows.map((row) => ({
    ...row,
    gallery: photos.filter((photo) => photo.dogId === row.id).map((photo) => photo.url),
  }));
}

async function replaceGallery(dogId: number, gallery: string[]) {
  await db.delete(schema.dogPhotos).where(eq(schema.dogPhotos.dogId, dogId));
  if (gallery.length === 0) return;
  await db.insert(schema.dogPhotos).values(
    gallery.map((url, index) => ({ dogId, url, sortOrder: index })),
  );
}

/** Builds a slug that is not taken yet, e.g. "bobos", "bobos-2". */
async function uniqueSlug(name: string, ignoreId?: number) {
  const wanted = slugify(name);
  const taken = await db.select({ id: schema.dogs.id, slug: schema.dogs.slug }).from(schema.dogs);
  const used = new Set(
    taken.filter((row) => row.id !== ignoreId).map((row) => row.slug),
  );
  if (!used.has(wanted)) return wanted;
  for (let i = 2; i < 200; i++) {
    if (!used.has(`${wanted}-${i}`)) return `${wanted}-${i}`;
  }
  return `${wanted}-${Date.now()}`;
}

async function requireDog(id: number) {
  const [row] = await db.select().from(schema.dogs).where(eq(schema.dogs.id, id)).limit(1);
  if (!row) throw new ORPCError("NOT_FOUND", { message: "Ο σκύλος δεν βρέθηκε / Dog not found" });
  return row;
}

export const dogs = {
  /** Public list of every dog, available first, then the adopted ones. */
  list: base.handler(async () => {
    await seedDogsIfEmpty();
    const rows = await db
      .select()
      .from(schema.dogs)
      .orderBy(asc(schema.dogs.adopted), asc(schema.dogs.sortOrder));
    return withGallery(rows);
  }),

  /** Counters used in the transparency strip on the homepage. */
  stats: base.handler(async () => {
    await seedDogsIfEmpty();
    const rows = await db.select().from(schema.dogs);
    return {
      total: rows.length,
      adopted: rows.filter((d) => d.adopted).length,
      available: rows.filter((d) => !d.adopted).length,
    };
  }),

  /** Back office: every dog in admin order, adopted ones included. */
  adminList: staffProcedure.handler(async () => {
    const rows = await db
      .select()
      .from(schema.dogs)
      .orderBy(asc(schema.dogs.sortOrder), asc(schema.dogs.id));
    return withGallery(rows);
  }),

  get: staffProcedure.input(z.object({ id: z.number() })).handler(async ({ input }) => {
    const row = await requireDog(input.id);
    const [withPhotos] = await withGallery([row]);
    return withPhotos;
  }),

  create: staffProcedure.input(dogInput).handler(async ({ input }) => {
    const { gallery, ...values } = input;
    const slug = await uniqueSlug(input.nameEn || input.name);
    const [max] = await db
      .select({ value: sql<number>`coalesce(max(${schema.dogs.sortOrder}), -1)` })
      .from(schema.dogs);
    const [row] = await db
      .insert(schema.dogs)
      .values({
        ...values,
        slug,
        adoptedAt: values.adopted ? values.adoptedAt : null,
        sortOrder: (max?.value ?? -1) + 1,
        updatedAt: new Date(),
      })
      .returning();
    await replaceGallery(row.id, gallery);
    return row;
  }),

  update: staffProcedure
    .input(dogInput.partial().extend({ id: z.number(), petGovUrl: petGovUrlInput.optional() }))
    .handler(async ({ input }) => {
      const { id, gallery, ...values } = input;
      const current = await requireDog(id);
      const next: Record<string, unknown> = { ...values, updatedAt: new Date() };
      const nextNameEn = values.nameEn ?? current.nameEn;
      const nextName = values.name ?? current.name;
      if (nextNameEn !== current.nameEn || nextName !== current.name) {
        next.slug = await uniqueSlug(nextNameEn || nextName, id);
      }
      if (values.adopted === false) next.adoptedAt = null;
      const [row] = await db
        .update(schema.dogs)
        .set(next)
        .where(eq(schema.dogs.id, id))
        .returning();
      if (gallery) await replaceGallery(id, gallery);
      return row;
    }),

  remove: staffProcedure.input(z.object({ id: z.number() })).handler(async ({ input }) => {
    await requireDog(input.id);
    await db.delete(schema.dogPhotos).where(eq(schema.dogPhotos.dogId, input.id));
    await db.delete(schema.dogs).where(eq(schema.dogs.id, input.id));
    return { ok: true };
  }),

  /** Quick toggle from the list — records the month of the adoption. */
  toggleAdopted: staffProcedure
    .input(z.object({ id: z.number(), adopted: z.boolean(), adoptedAt: z.string().max(20).optional() }))
    .handler(async ({ input }) => {
      await requireDog(input.id);
      const month = new Date().toISOString().slice(0, 7);
      const [row] = await db
        .update(schema.dogs)
        .set({
          adopted: input.adopted,
          adoptedAt: input.adopted ? (input.adoptedAt || month) : null,
          updatedAt: new Date(),
        })
        .where(eq(schema.dogs.id, input.id))
        .returning();
      return row;
    }),

  /** Moves one dog up or down in the public order, or straight to the top. */
  reorder: staffProcedure
    .input(z.object({ id: z.number(), direction: z.enum(["up", "down", "top"]) }))
    .handler(async ({ input }) => {
      const rows = await db
        .select({ id: schema.dogs.id })
        .from(schema.dogs)
        .orderBy(asc(schema.dogs.sortOrder), asc(schema.dogs.id));
      const index = rows.findIndex((row) => row.id === input.id);
      if (index === -1) {
        throw new ORPCError("NOT_FOUND", { message: "Ο σκύλος δεν βρέθηκε / Dog not found" });
      }
      const ordered = [...rows];
      const [moved] = ordered.splice(index, 1);
      const target =
        input.direction === "top" ? 0 : input.direction === "up" ? Math.max(0, index - 1) : Math.min(ordered.length, index + 1);
      ordered.splice(target, 0, moved);

      for (let i = 0; i < ordered.length; i++) {
        await db.update(schema.dogs).set({ sortOrder: i }).where(eq(schema.dogs.id, ordered[i].id));
      }
      return { ok: true };
    }),
};

import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export * from "./auth-schema";

/** Key/value site settings edited from the back office (contact details, bank account). */
export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull().default(""),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

/** Extra gallery photos for a dog — the cover photo stays on dogs.photo. */
export const dogPhotos = sqliteTable("dog_photos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  dogId: integer("dog_id").notNull(),
  url: text("url").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

/** Dogs available at the municipal shelter. */
export const dogs = sqliteTable("dogs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  nameEn: text("name_en").notNull(),
  photo: text("photo").notNull(),
  sex: text("sex", { enum: ["male", "female"] }).notNull(),
  ageEl: text("age_el").notNull(),
  ageEn: text("age_en").notNull(),
  sizeEl: text("size_el").notNull(),
  sizeEn: text("size_en").notNull(),
  storyEl: text("story_el").notNull(),
  storyEn: text("story_en").notNull(),
  traitsEl: text("traits_el").notNull(),
  traitsEn: text("traits_en").notNull(),
  sterilized: integer("sterilized", { mode: "boolean" }).notNull().default(true),
  vaccinated: integer("vaccinated", { mode: "boolean" }).notNull().default(true),
  microchip: integer("microchip", { mode: "boolean" }).notNull().default(true),
  adopted: integer("adopted", { mode: "boolean" }).notNull().default(false),
  adoptedAt: text("adopted_at"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

/** Adoption applications submitted through the site. */
export const adoptionApplications = sqliteTable("adoption_applications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  dogSlug: text("dog_slug"),
  dogName: text("dog_name"),
  fullName: text("full_name").notNull(),
  birthYear: text("birth_year"),
  idNumber: text("id_number"),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  job: text("job"),
  household: text("household"),
  homeType: text("home_type"),
  ownership: text("ownership"),
  yard: text("yard"),
  whereDogStays: text("where_dog_stays"),
  hoursAlone: text("hours_alone"),
  otherPets: text("other_pets"),
  pastPets: text("past_pets"),
  vacationPlan: text("vacation_plan"),
  vetBudget: text("vet_budget"),
  reason: text("reason").notNull(),
  agreeVisit: integer("agree_visit", { mode: "boolean" }).notNull().default(false),
  agreeTerms: integer("agree_terms", { mode: "boolean" }).notNull().default(false),
  agreeGdpr: integer("agree_gdpr", { mode: "boolean" }).notNull().default(false),
  locale: text("locale").notNull().default("el"),
  status: text("status", { enum: ["new", "review", "approved", "rejected"] })
    .notNull()
    .default("new"),
  staffNotes: text("staff_notes"),
  handledBy: text("handled_by"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

/** Volunteer ("φιλόζωος") applications. */
export const volunteerApplications = sqliteTable("volunteer_applications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fullName: text("full_name").notNull(),
  fatherName: text("father_name"),
  birthDate: text("birth_date"),
  idNumber: text("id_number"),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  interests: text("interests").notNull().default(""),
  availability: text("availability"),
  hasVehicle: text("has_vehicle"),
  experience: text("experience"),
  notes: text("notes"),
  agreeTerms: integer("agree_terms", { mode: "boolean" }).notNull().default(false),
  agreeGdpr: integer("agree_gdpr", { mode: "boolean" }).notNull().default(false),
  locale: text("locale").notNull().default("el"),
  status: text("status", { enum: ["new", "review", "approved", "rejected"] })
    .notNull()
    .default("new"),
  staffNotes: text("staff_notes"),
  handledBy: text("handled_by"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

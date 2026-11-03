import { z } from "zod";
import { eq } from "drizzle-orm";
import { base } from "../__core/app";
import { db } from "../database";
import * as schema from "../database/schema";
import { adminProcedure } from "../lib/guards";

/** Contact and bank details shown across the public site. */
export const SETTING_KEYS = [
  "phone",
  "email",
  "address",
  "instagram",
  "facebook",
  "bankName",
  "iban",
  "beneficiary",
  "reference",
] as const;

export type SettingKey = (typeof SETTING_KEYS)[number];

export const DEFAULT_SETTINGS: Record<SettingKey, string> = {
  phone: "",
  email: "",
  address: "",
  instagram: "https://www.instagram.com/",
  facebook: "",
  bankName: "",
  iban: "",
  beneficiary: "",
  reference: "STRAYDOGS",
};

async function readSettings() {
  const rows = await db.select().from(schema.settings);
  const map = { ...DEFAULT_SETTINGS } as Record<string, string>;
  for (const row of rows) {
    if ((SETTING_KEYS as readonly string[]).includes(row.key)) map[row.key] = row.value;
  }
  return map as Record<SettingKey, string>;
}

const settingsInput = z.object(
  Object.fromEntries(SETTING_KEYS.map((key) => [key, z.string().max(300).default("")])) as Record<
    SettingKey,
    z.ZodDefault<z.ZodString>
  >,
);

export const settings = {
  /** Public read — footer, donate page and homepage use this. */
  get: base.handler(async () => readSettings()),

  /** Administrators edit the contact block and the bank account. */
  update: adminProcedure.input(settingsInput).handler(async ({ input }) => {
    for (const key of SETTING_KEYS) {
      const value = (input as Record<string, string>)[key] ?? "";
      const existing = await db
        .select({ key: schema.settings.key })
        .from(schema.settings)
        .where(eq(schema.settings.key, key))
        .limit(1);
      if (existing.length > 0) {
        await db
          .update(schema.settings)
          .set({ value, updatedAt: new Date() })
          .where(eq(schema.settings.key, key));
      } else {
        await db.insert(schema.settings).values({ key, value });
      }
    }
    return readSettings();
  }),
};

/** Internal flag helpers (used to stop the placeholder seed coming back). */
export async function getFlag(key: string) {
  const [row] = await db
    .select()
    .from(schema.settings)
    .where(eq(schema.settings.key, key))
    .limit(1);
  return row?.value ?? null;
}

export async function setFlag(key: string, value: string) {
  const existing = await getFlag(key);
  if (existing === null) {
    await db.insert(schema.settings).values({ key, value });
  } else {
    await db
      .update(schema.settings)
      .set({ value, updatedAt: new Date() })
      .where(eq(schema.settings.key, key));
  }
}

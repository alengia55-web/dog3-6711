import type { Client, Transaction } from "@libsql/client";

/** Additive and repeatable: existing dogs, listings and other data are never overwritten. */
export async function ensurePetGovColumn(client: Client | Transaction) {
  const columns = await client.execute('PRAGMA table_info("dogs")');
  if (!columns.rows.some(row => row.name === "pet_gov_url")) {
    await client.execute('ALTER TABLE "dogs" ADD COLUMN "pet_gov_url" TEXT NOT NULL DEFAULT \'\'');
    console.log("[migration] Added blank pet_gov_url field; existing dog data preserved.");
  }
}
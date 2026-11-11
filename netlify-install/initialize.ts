import { readFile } from "node:fs/promises";
import { createClient, type InValue } from "@libsql/client";
import { ensurePetGovColumn } from "./migrate-pet-gov";
import { ensureInKindTable } from "./migrate-in-kind";

type RecordRow = Record<string, InValue>;
type Snapshot = {
  version: number;
  capturedAt: string;
  schema: string[];
  dogs: RecordRow[];
  photos: RecordRow[];
  settings: RecordRow[];
};

const url = process.env.DATABASE_URL;
const testing = process.env.NETLIFY_INSTALL_TEST === "1";
if (!url || (!url.startsWith("libsql://") && !(testing && url.startsWith("file:")))) {
  throw new Error("Set DATABASE_URL to your new remote Turso libsql:// database.");
}
if (!testing && !process.env.DATABASE_AUTH_TOKEN) {
  throw new Error("DATABASE_AUTH_TOKEN is required for first installation.");
}
if (process.env.CONTEXT && process.env.CONTEXT !== "production" && !testing) {
  throw new Error("First-install builds are production-only. Configure a separate database before enabling previews.");
}

const snapshot: Snapshot = JSON.parse(await readFile(new URL("./current-public-data.json", import.meta.url), "utf8"));
if (snapshot.version !== 1 || !snapshot.dogs.length) throw new Error("Invalid initial public-data snapshot.");
const client = createClient({ url, authToken: testing ? undefined : process.env.DATABASE_AUTH_TOKEN });
const tx = await client.transaction("write");
const quote = (name: string) => `"${name.replaceAll('"', '""')}"`;

try {
  // Only additive creation; never DROP, DELETE, reset, or overwrite existing rows.
  for (const sql of snapshot.schema) {
    if (!/^CREATE (?:TABLE|(?:UNIQUE )?INDEX)\s/i.test(sql)) throw new Error("Unsupported schema statement.");
    await tx.execute(sql.replace(/^CREATE (TABLE|(?:UNIQUE )?INDEX)\s/i, "CREATE $1 IF NOT EXISTS "));
  }
  await ensurePetGovColumn(tx);
  await ensureInKindTable(tx);

  let hasExistingData = false;
  for (const table of ["dogs", "dog_photos", "settings", "user", "account", "session", "verification", "adoption_applications", "volunteer_applications", "in_kind_donations"]) {
    const result = await tx.execute(`SELECT count(*) AS n FROM ${quote(table)}`);
    if (Number(result.rows[0].n) > 0) hasExistingData = true;
  }

  if (hasExistingData) {
    console.log("[first-install] Existing database detected: public data was NOT reimported or overwritten.");
  } else {
    async function insert(table: string, rows: RecordRow[]) {
      const columns = (await tx.execute(`PRAGMA table_info(${quote(table)})`)).rows.map(row => String(row.name));
      for (const row of rows) {
        const keys = Object.keys(row);
        if (keys.some(key => !columns.includes(key))) throw new Error(`Unknown column in ${table}.`);
        await tx.execute({
          sql: `INSERT INTO ${quote(table)} (${keys.map(quote).join(",")}) VALUES (${keys.map(() => "?").join(",")})`,
          args: keys.map(key => row[key]),
        });
      }
    }
    await insert("dogs", snapshot.dogs);
    await insert("dog_photos", snapshot.photos);
    await insert("settings", snapshot.settings);
    await insert("settings", [
      { key: "dogsSeeded", value: "true", updated_at: Math.floor(Date.now() / 1000) },
      { key: "netlifyFirstInstall", value: snapshot.capturedAt, updated_at: Math.floor(Date.now() / 1000) },
    ]);
    console.log(`[first-install] Installed ${snapshot.dogs.length} current dogs, galleries and public settings. Staff/accounts/applications start empty.`);
  }
  await tx.commit();
} catch (error) {
  await tx.rollback();
  throw error;
} finally {
  tx.close();
  client.close();
}

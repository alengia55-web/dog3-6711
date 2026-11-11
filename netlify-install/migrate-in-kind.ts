import type { Client, Transaction } from "@libsql/client";

export async function ensureInKindTable(client: Client | Transaction) {
  await client.execute(`CREATE TABLE IF NOT EXISTS in_kind_donations (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    full_name TEXT NOT NULL, phone TEXT NOT NULL, email TEXT NOT NULL,
    items TEXT NOT NULL, quantity TEXT NOT NULL,
    proposed_date TEXT NOT NULL, proposed_time TEXT NOT NULL DEFAULT '',
    notes TEXT NOT NULL DEFAULT '', agree_contact INTEGER NOT NULL DEFAULT 0,
    locale TEXT NOT NULL DEFAULT 'el', status TEXT NOT NULL DEFAULT 'new',
    staff_notes TEXT, handled_by TEXT, created_at INTEGER NOT NULL, updated_at INTEGER
  )`);
}
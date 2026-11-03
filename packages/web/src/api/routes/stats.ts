import { desc } from "drizzle-orm";
import { db } from "../database";
import * as schema from "../database/schema";
import { staffProcedure } from "../lib/guards";

function countBy<T>(rows: T[], pick: (row: T) => string | null | undefined) {
  const map: Record<string, number> = {};
  for (const row of rows) {
    const key = pick(row);
    if (!key) continue;
    map[key] = (map[key] ?? 0) + 1;
  }
  return map;
}

/** Last 12 months as YYYY-MM, oldest first. */
function lastMonths(count: number) {
  const out: string[] = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return out;
}

export const stats = {
  /** Everything the back-office dashboard shows, in one call. */
  dashboard: staffProcedure.handler(async () => {
    const [dogRows, adoptions, volunteers] = await Promise.all([
      db.select().from(schema.dogs),
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
    ]);

    const adoptedByMonth = countBy(
      dogRows.filter((dog) => dog.adopted),
      (dog) => dog.adoptedAt?.slice(0, 7),
    );

    return {
      dogs: {
        total: dogRows.length,
        available: dogRows.filter((dog) => !dog.adopted).length,
        adopted: dogRows.filter((dog) => dog.adopted).length,
      },
      adoptionsByMonth: lastMonths(12).map((month) => ({
        month,
        count: adoptedByMonth[month] ?? 0,
      })),
      adoptionApplications: {
        total: adoptions.length,
        byStatus: countBy(adoptions, (row) => row.status),
      },
      volunteerApplications: {
        total: volunteers.length,
        byStatus: countBy(volunteers, (row) => row.status),
      },
      recent: [
        ...adoptions.slice(0, 5).map((row) => ({
          kind: "adoption" as const,
          id: row.id,
          fullName: row.fullName,
          detail: row.dogName ?? "",
          status: row.status,
          createdAt: row.createdAt,
        })),
        ...volunteers.slice(0, 5).map((row) => ({
          kind: "volunteer" as const,
          id: row.id,
          fullName: row.fullName,
          detail: row.interests ?? "",
          status: row.status,
          createdAt: row.createdAt,
        })),
      ]
        .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
        .slice(0, 8),
    };
  }),
};

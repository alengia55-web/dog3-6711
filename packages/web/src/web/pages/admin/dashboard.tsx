import { Link } from "wouter";
import { Dog, Heart, HeartHandshake, PawPrint, Plus, Users } from "lucide-react";
import { AdminShell } from "../../components/admin/shell";
import { useAdminText, useDashboard } from "../../queries/admin";

function Stat({
  label,
  value,
  tone,
  icon: Icon,
}: {
  label: string;
  value: number;
  tone: string;
  icon: typeof Dog;
}) {
  return (
    <div className={`comic-card p-5 ${tone}`}>
      <Icon className="size-6" />
      <div className="mt-2 font-display text-4xl font-bold">{value}</div>
      <div className="text-sm font-semibold text-ink/70">{label}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const { a, locale } = useAdminText();
  const { data, isPending } = useDashboard();

  const statusLabel: Record<string, string> = {
    new: a.apps.statusNew,
    review: a.apps.statusReview,
    approved: a.apps.statusApproved,
    rejected: a.apps.statusRejected,
  };

  const peak = Math.max(1, ...(data?.adoptionsByMonth.map((m) => m.count) ?? [1]));

  return (
    <AdminShell title={a.dashboard.title}>
      {isPending || !data ? (
        <p className="text-ink/60">{a.common.loading}</p>
      ) : (
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Stat label={a.dashboard.totalDogs} value={data.dogs.total} tone="bg-paper" icon={Dog} />
            <Stat
              label={a.dashboard.available}
              value={data.dogs.available}
              tone="bg-mint"
              icon={PawPrint}
            />
            <Stat
              label={a.dashboard.adopted}
              value={data.dogs.adopted}
              tone="bg-pink"
              icon={Heart}
            />
            <Stat
              label={a.dashboard.adoptionApps}
              value={data.adoptionApplications.total}
              tone="bg-yellow"
              icon={HeartHandshake}
            />
            <Stat
              label={a.dashboard.volunteerApps}
              value={data.volunteerApplications.total}
              tone="bg-sky"
              icon={Users}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/admin/dogs/new" className="comic-btn bg-mint-deep px-5 py-2.5 no-underline">
              <Plus className="size-4" /> {a.dashboard.quickAdd}
            </Link>
            <Link
              to="/admin/applications"
              className="comic-btn bg-paper px-5 py-2.5 no-underline"
            >
              {a.nav.applications}
            </Link>
          </div>

          <section className="comic-card bg-paper p-5">
            <h2 className="text-2xl">{a.dashboard.byMonth}</h2>
            <div className="mt-5 flex h-40 items-end gap-2">
              {data.adoptionsByMonth.map((month) => (
                <div key={month.month} className="flex flex-1 flex-col items-center gap-1.5">
                  <span className="font-display text-xs font-bold">{month.count || ""}</span>
                  <div
                    className="w-full rounded-t-lg border-2 border-ink bg-pink-deep"
                    style={{ height: `${Math.max(4, (month.count / peak) * 110)}px` }}
                  />
                  <span className="text-[10px] text-ink/60">{month.month.slice(2)}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="comic-card bg-paper p-5">
            <h2 className="text-2xl">{a.dashboard.recent}</h2>
            {data.recent.length === 0 ? (
              <p className="mt-3 text-ink/60">{a.dashboard.none}</p>
            ) : (
              <ul className="mt-4 divide-y divide-ink/10">
                {data.recent.map((row) => (
                  <li
                    key={`${row.kind}-${row.id}`}
                    className="flex flex-wrap items-center gap-2 py-2.5 text-sm"
                  >
                    <span className="rounded-full border-2 border-ink bg-stone px-2 py-0.5 text-xs font-bold">
                      {row.kind === "adoption" ? a.apps.adoptions : a.apps.volunteers}
                    </span>
                    <span className="font-semibold">{row.fullName}</span>
                    {row.detail ? <span className="text-ink/60">· {row.detail}</span> : null}
                    <span className="ml-auto text-xs text-ink/60">
                      {statusLabel[row.status] ?? row.status} ·{" "}
                      {new Date(row.createdAt as unknown as string).toLocaleDateString(
                        locale === "el" ? "el-GR" : "en-GB",
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </AdminShell>
  );
}

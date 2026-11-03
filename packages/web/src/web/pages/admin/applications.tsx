import { useState } from "react";
import { ChevronDown, ChevronUp, Download, Trash2 } from "lucide-react";
import { AdminShell } from "../../components/admin/shell";
import { ConfirmButton } from "../../components/admin/confirm-button";
import { useAdminApplications, useAdminText, useApplicationMutations } from "../../queries/admin";
import { TextArea } from "../../components/ui/field";
import { cn } from "../../lib/utils";

type Kind = "adoption" | "volunteer";
type Row = Record<string, unknown> & { id: number; status: string };

const STATUSES = ["new", "review", "approved", "rejected"] as const;

const statusTone: Record<string, string> = {
  new: "bg-sky-deep",
  review: "bg-yellow-deep",
  approved: "bg-mint-deep",
  rejected: "bg-pink-deep",
};

/** Quoted CSV so Excel opens Greek text and commas correctly. */
function downloadCsv(rows: Row[], name: string) {
  if (rows.length === 0) return;
  const columns = Object.keys(rows[0]);
  const escape = (value: unknown) => {
    const raw =
      value instanceof Date
        ? `${value.toISOString().slice(0, 10)} ${value.toISOString().slice(11, 16)}`
        : String(value ?? "");
    return `"${raw.replace(/"/g, '""')}"`;
  };
  const csv = [
    columns.join(","),
    ...rows.map((row) => columns.map((column) => escape(row[column])).join(",")),
  ].join("\n");
  const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${name}-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function Card({ kind, row, fields }: { kind: Kind; row: Row; fields: [string, string][] }) {
  const { a, locale } = useAdminText();
  const { setStatus, setNotes, remove } = useApplicationMutations();
  const [open, setOpen] = useState(false);
  const [notes, setNotesValue] = useState(String(row.staffNotes ?? ""));

  const statusLabel: Record<string, string> = {
    new: a.apps.statusNew,
    review: a.apps.statusReview,
    approved: a.apps.statusApproved,
    rejected: a.apps.statusRejected,
  };

  return (
    <li className="comic-card bg-paper p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-40 flex-1">
          <div className="font-display text-lg font-bold">{String(row.fullName)}</div>
          <div className="text-xs text-ink/60">
            {String(row.email)} · {String(row.phone)} ·{" "}
            {new Date(row.createdAt as string).toLocaleDateString(
              locale === "el" ? "el-GR" : "en-GB",
            )}
            {row.dogName ? ` · ${String(row.dogName)}` : ""}
            {row.handledBy ? ` · ${a.apps.handledBy}: ${String(row.handledBy)}` : ""}
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {STATUSES.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatus.mutate({ kind, id: row.id, status })}
              className={cn(
                "comic-btn px-2.5 py-1 text-xs",
                row.status === status ? statusTone[status] : "bg-paper",
              )}
            >
              {statusLabel[status]}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="comic-btn bg-paper p-2"
          aria-label={a.apps.details}
        >
          {open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>
        <ConfirmButton
          label={a.apps.remove}
          title={a.apps.confirmRemove}
          onConfirm={() => remove.mutate({ kind, id: row.id })}
          className="comic-btn bg-pink-deep p-2"
        >
          <Trash2 className="size-4" />
        </ConfirmButton>
      </div>

      {open ? (
        <div className="mt-4 space-y-4 border-t-2 border-ink/10 pt-4">
          <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
            {fields.map(([key, label]) =>
              row[key] === null || row[key] === undefined || row[key] === "" ? null : (
                <div key={key} className="flex gap-2">
                  <dt className="shrink-0 font-display text-xs font-bold uppercase text-ink/60">
                    {label}
                  </dt>
                  <dd className="min-w-0 break-words">
                    {typeof row[key] === "boolean"
                      ? row[key]
                        ? "✓"
                        : "—"
                      : String(row[key])}
                  </dd>
                </div>
              ),
            )}
          </dl>

          <div>
            <span className="mb-1.5 block font-display text-sm font-bold">{a.apps.notes}</span>
            <TextArea value={notes} rows={3} onChange={(e) => setNotesValue(e.target.value)} />
            <button
              type="button"
              onClick={() => setNotes.mutate({ kind, id: row.id, staffNotes: notes })}
              className="comic-btn mt-2 bg-sky-deep px-4 py-1.5 text-sm"
            >
              {a.apps.saveNotes}
            </button>
          </div>
        </div>
      ) : null}
    </li>
  );
}

export default function AdminApplications() {
  const { a } = useAdminText();
  const { data, isPending } = useAdminApplications();
  const [tab, setTab] = useState<Kind>("adoption");
  const [filter, setFilter] = useState<"all" | (typeof STATUSES)[number]>("all");

  const adoptionFields: [string, string][] = [
    ["dogName", "Dog"],
    ["birthYear", "Year"],
    ["idNumber", "ID"],
    ["address", "Address"],
    ["city", "City"],
    ["job", "Job"],
    ["household", "Household"],
    ["homeType", "Home"],
    ["ownership", "Ownership"],
    ["yard", "Yard"],
    ["whereDogStays", "Stays"],
    ["hoursAlone", "Alone"],
    ["otherPets", "Other pets"],
    ["pastPets", "Past pets"],
    ["vacationPlan", "Holidays"],
    ["vetBudget", "Vet budget"],
    ["reason", "Reason"],
    ["agreeVisit", "Home visit"],
  ];

  const volunteerFields: [string, string][] = [
    ["fatherName", "Father"],
    ["birthDate", "Born"],
    ["idNumber", "ID"],
    ["address", "Address"],
    ["city", "City"],
    ["interests", "Interests"],
    ["availability", "Availability"],
    ["hasVehicle", "Vehicle"],
    ["experience", "Experience"],
    ["notes", "Notes"],
  ];

  const rows = ((tab === "adoption" ? data?.adoptions : data?.volunteers) ?? []) as Row[];
  const visible = filter === "all" ? rows : rows.filter((row) => row.status === filter);

  const statusLabel: Record<string, string> = {
    new: a.apps.statusNew,
    review: a.apps.statusReview,
    approved: a.apps.statusApproved,
    rejected: a.apps.statusRejected,
  };

  return (
    <AdminShell title={a.apps.title}>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="inline-flex overflow-hidden rounded-full border-2 border-ink">
          {(
            [
              ["adoption", `${a.apps.adoptions} (${data?.adoptions.length ?? 0})`],
              ["volunteer", `${a.apps.volunteers} (${data?.volunteers.length ?? 0})`],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              className={cn(
                "px-4 py-1.5 font-display text-sm font-bold",
                tab === value ? "bg-ink text-paper" : "bg-paper hover:bg-stone",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1">
          {(["all", ...STATUSES] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={cn(
                "comic-btn px-3 py-1 text-xs",
                filter === status ? "bg-ink text-paper" : "bg-paper",
              )}
            >
              {status === "all" ? a.apps.filterAll : statusLabel[status]}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => downloadCsv(rows, tab)}
          className="comic-btn ml-auto bg-yellow-deep px-4 py-2 text-sm"
        >
          <Download className="size-4" /> {a.apps.export}
        </button>
      </div>

      {isPending ? (
        <p className="text-ink/60">{a.common.loading}</p>
      ) : visible.length === 0 ? (
        <p className="comic-card bg-paper p-5 text-ink/70">{a.apps.none}</p>
      ) : (
        <ul className="space-y-3">
          {visible.map((row) => (
            <Card
              key={row.id}
              kind={tab}
              row={row}
              fields={tab === "adoption" ? adoptionFields : volunteerFields}
            />
          ))}
        </ul>
      )}
    </AdminShell>
  );
}

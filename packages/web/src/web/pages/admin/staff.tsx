import { Trash2 } from "lucide-react";
import { AdminShell } from "../../components/admin/shell";
import { ConfirmButton } from "../../components/admin/confirm-button";
import { useAdminText, useStaffList, useStaffMutations, useStaffSession } from "../../queries/admin";
import { Select } from "../../components/ui/field";

export default function AdminStaff() {
  const { a, locale } = useAdminText();
  const { data, isPending } = useStaffList();
  const session = useStaffSession();
  const { setRole, remove } = useStaffMutations();

  return (
    <AdminShell title={a.staff.title} adminOnly>
      <p className="mb-5 text-ink/70">{a.staff.inviteHint}</p>

      {isPending ? (
        <p className="text-ink/60">{a.common.loading}</p>
      ) : (
        <ul className="space-y-3">
          {(data ?? []).map((member) => (
            <li
              key={member.id}
              className="comic-card flex flex-wrap items-center gap-3 bg-paper p-4"
            >
              <div className="min-w-40 flex-1">
                <div className="font-display text-lg font-bold">{member.name}</div>
                <div className="text-xs text-ink/60">
                  {member.email} · {a.staff.since}{" "}
                  {new Date(member.createdAt as unknown as string).toLocaleDateString(
                    locale === "el" ? "el-GR" : "en-GB",
                  )}
                </div>
              </div>

              <Select
                value={member.role ?? "staff"}
                disabled={member.id === session.data?.id}
                onChange={(e) =>
                  setRole.mutate({ id: member.id, role: e.target.value as "admin" | "staff" })
                }
                className="w-44"
              >
                <option value="staff">{a.staff.member}</option>
                <option value="admin">{a.staff.admin}</option>
              </Select>

              {member.id === session.data?.id ? (
                <button
                  type="button"
                  disabled
                  className="comic-btn bg-pink-deep p-2 opacity-30"
                  aria-label={a.staff.remove}
                >
                  <Trash2 className="size-4" />
                </button>
              ) : (
                <ConfirmButton
                  label={a.staff.remove}
                  title={a.staff.confirmRemove}
                  onConfirm={() => remove.mutate({ id: member.id })}
                  className="comic-btn bg-pink-deep p-2"
                >
                  <Trash2 className="size-4" />
                </ConfirmButton>
              )}
            </li>
          ))}
        </ul>
      )}
    </AdminShell>
  );
}

import { Link } from "wouter";
import { ArrowDown, ArrowUp, ChevronsUp, Pencil, Plus, Trash2 } from "lucide-react";
import { AdminShell } from "../../components/admin/shell";
import { ConfirmButton } from "../../components/admin/confirm-button";
import { useAdminDogs, useAdminText, useDogMutations } from "../../queries/admin";

export default function AdminDogs() {
  const { a } = useAdminText();
  const { data, isPending } = useAdminDogs();
  const { remove, toggleAdopted, reorder } = useDogMutations();

  return (
    <AdminShell title={a.dogs.title}>
      <div className="mb-5">
        <Link to="/admin/dogs/new" className="comic-btn bg-mint-deep px-5 py-2.5 no-underline">
          <Plus className="size-4" /> {a.dogs.add}
        </Link>
      </div>

      {isPending ? (
        <p className="text-ink/60">{a.common.loading}</p>
      ) : !data || data.length === 0 ? (
        <p className="comic-card bg-paper p-5 text-ink/70">{a.dogs.empty}</p>
      ) : (
        <ul className="space-y-3">
          {data.map((dog, index) => (
            <li
              key={dog.id}
              className="comic-card flex flex-wrap items-center gap-4 bg-paper p-3 sm:flex-nowrap"
            >
              <img
                src={dog.photo}
                alt=""
                className="h-20 w-16 shrink-0 rounded-xl border-2 border-ink object-cover"
              />
              <div className="min-w-40 flex-1">
                <div className="font-display text-lg font-bold">
                  {dog.name}
                  <span className="ml-2 text-sm font-semibold text-ink/50">{dog.nameEn}</span>
                </div>
                <div className="text-xs text-ink/60">
                  /{dog.slug} · {dog.sex === "male" ? a.form.male : a.form.female} · {dog.ageEl}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    toggleAdopted.mutate({ id: dog.id, adopted: !dog.adopted })
                  }
                  className={`comic-btn mt-2 px-3 py-1 text-xs ${
                    dog.adopted ? "bg-pink-deep" : "bg-mint-deep"
                  }`}
                >
                  {dog.adopted
                    ? `${a.dogs.markAdopted}${dog.adoptedAt ? ` · ${dog.adoptedAt}` : ""}`
                    : a.dogs.markAvailable}
                </button>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  aria-label={a.dogs.top}
                  disabled={index === 0}
                  onClick={() => reorder.mutate({ id: dog.id, direction: "top" })}
                  className="comic-btn bg-paper p-2 disabled:opacity-30"
                >
                  <ChevronsUp className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label={a.dogs.up}
                  disabled={index === 0}
                  onClick={() => reorder.mutate({ id: dog.id, direction: "up" })}
                  className="comic-btn bg-paper p-2 disabled:opacity-30"
                >
                  <ArrowUp className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label={a.dogs.down}
                  disabled={index === data.length - 1}
                  onClick={() => reorder.mutate({ id: dog.id, direction: "down" })}
                  className="comic-btn bg-paper p-2 disabled:opacity-30"
                >
                  <ArrowDown className="size-4" />
                </button>
                <Link
                  to={`/admin/dogs/${dog.id}`}
                  className="comic-btn bg-sky-deep p-2 no-underline"
                  aria-label={a.dogs.edit}
                >
                  <Pencil className="size-4" />
                </Link>
                <ConfirmButton
                  label={a.dogs.remove}
                  title={a.dogs.confirmRemove}
                  onConfirm={() => remove.mutate({ id: dog.id })}
                  className="comic-btn bg-pink-deep p-2"
                >
                  <Trash2 className="size-4" />
                </ConfirmButton>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AdminShell>
  );
}

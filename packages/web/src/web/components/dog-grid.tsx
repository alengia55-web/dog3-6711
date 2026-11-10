import { useState } from "react";
import { ArrowUpRight, PawPrint } from "lucide-react";
import { useLocale } from "../hooks/use-locale";
import { useDogs } from "../queries/dogs";
import { cn } from "../lib/utils";
import { DogPreview } from "./dog-preview";

type Dog = NonNullable<ReturnType<typeof useDogs>["data"]>[number];
type Filter = "all" | "available" | "adopted";

const cardTones = ["bg-pink", "bg-yellow", "bg-mint", "bg-sky"];

function DogCard({ dog, index, onOpen }: { dog: Dog; index: number; onOpen: () => void }) {
  const { locale, t } = useLocale();
  const name = locale === "el" ? dog.name : dog.nameEn;
  const age = locale === "el" ? dog.ageEl : dog.ageEn;
  const size = locale === "el" ? dog.sizeEl : dog.sizeEn;

  return (
    <a
      href={`/dogs/${dog.slug}`}
      aria-haspopup="dialog"
      onClick={event => {
        if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
          event.preventDefault(); onOpen();
        }
      }}
      aria-label={`${t.dogs.meetDog}: ${name}`}
      className={cn(
        "comic-card card-hover rise block h-full overflow-hidden text-ink no-underline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-ink",
        cardTones[index % cardTones.length],
      )}
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <div className="relative aspect-4/5 overflow-hidden border-b-2 border-ink">
        <img
          src={dog.photo}
          alt={name}
          loading="lazy"
          className={cn(
            "h-full w-full object-cover transition-all duration-300",
            dog.adopted && "grayscale",
          )}
        />
        {dog.adopted ? (
          <>
            <div className="absolute inset-0 bg-paper/25" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="-rotate-12 rounded-lg border-[3px] border-ink bg-paper/85 px-4 py-1.5 font-display text-xl font-bold tracking-[0.15em] text-ink shadow-[4px_4px_0_var(--color-ink)] sm:text-2xl">
                {t.dogs.adopted}
              </span>
            </div>
            {dog.adoptedAt ? (
              <span className="absolute bottom-2 left-2 rounded-full border-2 border-ink bg-mint-deep px-2.5 py-0.5 text-[11px] font-bold">
                {t.dogs.adoptedOn} {dog.adoptedAt}
              </span>
            ) : null}
          </>
        ) : (
          <span className="absolute top-2 left-2 inline-flex -rotate-3 items-center gap-1 rounded-full border-2 border-ink bg-paper px-2.5 py-0.5 text-[11px] font-bold">
            <PawPrint className="size-3" /> {t.dogs.available}
          </span>
        )}
      </div>

      <div className="flex h-44 flex-col gap-2 p-4">
        <h3 className="truncate font-display text-xl" title={name}>{name}</h3>
        <p className="text-xs font-semibold text-ink/70">
          {dog.sex === "male" ? t.dogs.male : t.dogs.female} · {age}
        </p>
        <p className="line-clamp-2 text-xs font-semibold text-ink/70" title={size}>{size}</p>
        <span className="comic-btn mt-auto w-full bg-paper px-3 py-2 text-sm">
          {t.dogs.meetDog} <ArrowUpRight className="size-4 shrink-0" />
        </span>
      </div>
    </a>
  );
}

export function DogGrid() {
  const { t } = useLocale();
  const dogs = useDogs();
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Dog | null>(null);

  const all = dogs.data ?? [];
  const list =
    filter === "all" ? all : all.filter((d) => (filter === "adopted" ? d.adopted : !d.adopted));

  const filters: Array<{ key: Filter; label: string; count: number }> = [
    { key: "all", label: t.dogs.filterAll, count: all.length },
    { key: "available", label: t.dogs.filterAvailable, count: all.filter((d) => !d.adopted).length },
    { key: "adopted", label: t.dogs.filterAdopted, count: all.filter((d) => d.adopted).length },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={cn(
              "comic-btn px-4 py-2 text-sm",
              filter === f.key ? "bg-ink text-paper" : "bg-paper",
            )}
          >
            {f.label}
            {dogs.data ? <span className="opacity-60"> ({f.count})</span> : null}
          </button>
        ))}
      </div>

      {dogs.isLoading ? (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="comic-card animate-pulse overflow-hidden">
              <div className="aspect-4/5 w-full border-b-2 border-ink bg-stone" />
              <div className="space-y-2 p-4">
                <div className="h-4 w-1/2 rounded bg-stone" />
                <div className="h-3 w-full rounded bg-stone" />
                <div className="h-3 w-4/5 rounded bg-stone" />
              </div>
            </div>
          ))}
        </div>
      ) : dogs.isError ? (
        <p className="comic-card bg-pink p-6">{t.forms.errorText}</p>
      ) : list.length === 0 ? (
        <p className="comic-card bg-stone p-6">{t.dogs.empty}</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {list.map((dog, i) => (
            <DogCard key={dog.id} dog={dog} index={i} onOpen={() => setSelected(dog)} />
          ))}
        </div>
      )}
      {selected && <DogPreview dog={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

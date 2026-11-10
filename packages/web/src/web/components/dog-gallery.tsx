import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "../hooks/use-locale";
import { cn } from "../lib/utils";

export function DogGallery({ photos, name, adopted, compact = false }: {
  photos: string[]; name: string; adopted: boolean; compact?: boolean;
}) {
  const { locale, t } = useLocale();
  const [selected, setSelected] = useState(0);
  const touchStart = useRef<number | null>(null);
  const previous = locale === "el" ? "Προηγούμενη φωτογραφία" : "Previous photo";
  const next = locale === "el" ? "Επόμενη φωτογραφία" : "Next photo";
  function move(direction: number) {
    setSelected(index => (index + direction + photos.length) % photos.length);
  }

  return (
    <div className="min-w-0 space-y-3" role="region" aria-label={`${t.dogs.gallery}: ${name}`}>
      <div
        className={cn("relative overflow-hidden rounded-2xl border-2 border-ink bg-stone focus-visible:outline-4", compact ? "h-[min(43dvh,420px)] min-h-60" : "aspect-4/5")}
        tabIndex={photos.length > 1 ? 0 : undefined}
        onKeyDown={event => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault(); move(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}
        onTouchStart={event => { touchStart.current = event.touches[0].clientX; }}
        onTouchEnd={event => {
          if (touchStart.current !== null) {
            const distance = event.changedTouches[0].clientX - touchStart.current;
            if (Math.abs(distance) > 45 && photos.length > 1) move(distance > 0 ? -1 : 1);
          }
          touchStart.current = null;
        }}
      >
        <img src={photos[selected]} alt={`${name} — ${selected + 1}/${photos.length}`} className={cn("h-full w-full object-contain", adopted && "grayscale")} draggable={false} />
        {photos.length > 1 && <>
          <button type="button" aria-label={previous} onClick={() => move(-1)} className="absolute left-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-ink bg-paper/95 shadow-sm hover:bg-yellow"><ChevronLeft className="size-6" /></button>
          <button type="button" aria-label={next} onClick={() => move(1)} className="absolute right-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-ink bg-paper/95 shadow-sm hover:bg-yellow"><ChevronRight className="size-6" /></button>
        </>}
        <span aria-live="polite" aria-atomic="true" className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border-2 border-ink bg-paper/95 px-3 py-1 text-xs font-bold">{selected + 1} / {photos.length}</span>
      </div>
      {photos.length > 1 && (
        <div role="group" aria-label={t.dogs.gallery} className="flex gap-2 overflow-x-auto p-1 pb-2">
          {photos.map((photo, index) => (
            <button key={photo} type="button" onClick={() => setSelected(index)} aria-label={`${t.dogs.gallery}: ${name} ${index + 1}`} aria-pressed={selected === index} className={cn("size-16 shrink-0 overflow-hidden rounded-lg border-2 border-ink focus-visible:outline-offset-2", selected === index ? "ring-2 ring-mint-deep" : "opacity-60 hover:opacity-100")}>
              <img src={photo} alt="" loading="lazy" className={cn("h-full w-full object-cover", adopted && "grayscale")} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
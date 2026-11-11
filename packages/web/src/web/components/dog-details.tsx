import { Link } from "wouter";
import { Check, ExternalLink, Heart, PawPrint } from "lucide-react";
import { useDogs } from "../queries/dogs";
import { useLocale } from "../hooks/use-locale";
import { DogGallery } from "./dog-gallery";
import { cn } from "../lib/utils";
import { isPetGovListingUrl, PET_GOV_PLATFORM_URL } from "../../shared/pet-gov";

export type Dog = NonNullable<ReturnType<typeof useDogs>["data"]>[number];

export function DogDetails({ dog, compact = false, onNavigate }: { dog: Dog; compact?: boolean; onNavigate?: () => void }) {
  const { locale, t } = useLocale();
  const name = locale === "el" ? dog.name : dog.nameEn;
  const story = locale === "el" ? dog.storyEl : dog.storyEn;
  const traits = locale === "el" ? dog.traitsEl : dog.traitsEn;
  const age = locale === "el" ? dog.ageEl : dog.ageEn;
  const size = locale === "el" ? dog.sizeEl : dog.sizeEn;
  const photos = [...new Set([dog.photo, ...dog.gallery].filter(Boolean))];
  const officialUrl = isPetGovListingUrl(dog.petGovUrl) ? dog.petGovUrl : "";
  const health = [
    { present: dog.sterilized, label: t.dogs.sterilized },
    { present: dog.vaccinated, label: t.dogs.vaccinated },
    { present: dog.microchip, label: t.dogs.microchip },
  ].filter(item => item.present);

  return (
    <div className={cn("grid items-start", compact ? "gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]" : "gap-10 md:grid-cols-2 md:gap-14")}>
      <DogGallery key={dog.slug} photos={photos} name={name} adopted={dog.adopted} compact={compact} />
      <div className="min-w-0 space-y-5">
        <div>
          {!compact && <h1 className="break-words text-4xl md:text-5xl">{name}</h1>}
          <span className={cn("mb-3 inline-flex items-center gap-2 rounded-full border-2 border-ink px-3 py-1 text-xs font-bold", dog.adopted ? "bg-mint-deep" : "bg-paper")}><PawPrint className="size-3" /> {dog.adopted ? t.dogs.adopted : t.dogs.available}</span>
          <p className="font-semibold text-ink/70">{dog.sex === "male" ? t.dogs.male : t.dogs.female} · {age} · {size}</p>
          {dog.adopted && dog.adoptedAt && <p className="mt-3 font-semibold">{t.dogs.adoptedOn} · {dog.adoptedAt}</p>}
        </div>
        <section className="rounded-2xl border-2 border-ink bg-yellow p-5">
          <h2 className="mb-3 text-xl">{t.dogs.biography}</h2>
          <p className="whitespace-pre-wrap break-words leading-relaxed">{story}</p>
        </section>
        {traits && <section><h2 className="mb-2 text-lg">{t.dogs.personality}</h2><p className="whitespace-pre-wrap break-words leading-relaxed">{traits}</p></section>}
        {health.length > 0 && <section>
          <h2 className="mb-3 text-lg">{t.dogs.health}</h2>
          <div className="flex flex-wrap gap-2">{health.map(item => <span key={item.label} className="inline-flex items-center gap-1 rounded-full border-2 border-ink bg-mint px-3 py-1 text-xs font-semibold"><Check className="size-3" /> {item.label}</span>)}</div>
        </section>}
        <section className="rounded-2xl border-2 border-ink bg-sky p-5" data-pet-gov-reference>
          <h2 className="mb-3 text-lg">{t.dogs.officialListing}</h2>
          {!officialUrl && <p className="mb-3 text-sm leading-relaxed">{t.dogs.petGovMissing}</p>}
          <a
            href={officialUrl || PET_GOV_PLATFORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-start gap-2 font-semibold underline underline-offset-4"
            aria-label={`${officialUrl ? `${t.dogs.petGovLink} — ${name}` : t.dogs.petGovPlatform} (${t.dogs.newTab})`}
          >
            <ExternalLink className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>{officialUrl ? t.dogs.petGovLink : t.dogs.petGovPlatform}</span>
          </a>
          <p className="mt-2 text-xs text-ink/70">{t.dogs.newTab}</p>
        </section>
        {!dog.adopted && <Link to={`/adopt?dog=${encodeURIComponent(dog.slug)}`} onClick={onNavigate} className="comic-btn w-full bg-pink-deep px-5 py-3 text-center no-underline"><Heart className="size-5 shrink-0" /> {t.dogs.adoptCta}</Link>}
      </div>
    </div>
  );
}
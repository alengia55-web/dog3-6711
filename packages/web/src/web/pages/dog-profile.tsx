import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import { ArrowLeft, Check, Heart, PawPrint } from "lucide-react";
import { useDogs } from "../queries/dogs";
import { useLocale } from "../hooks/use-locale";
import { cn } from "../lib/utils";

export default function DogProfile() {
  const [, params] = useRoute("/dogs/:slug");
  const dogs = useDogs();
  const { locale, t } = useLocale();
  const [selected, setSelected] = useState(0);
  const dog = dogs.data?.find((item) => item.slug === params?.slug);

  useEffect(() => {
    setSelected(0);
    window.scrollTo(0, 0);
  }, [params?.slug]);

  const back = (
    <Link to="/#dogs" className="mb-8 inline-flex items-center gap-2 font-semibold text-ink no-underline hover:underline">
      <ArrowLeft className="size-4" /> {t.dogs.backToDogs}
    </Link>
  );

  if (dogs.isLoading || !dog) {
    return (
      <article className="mx-auto max-w-6xl px-4 py-12">
        {back}
        <p role="status" className="comic-card bg-stone p-8">
          {dogs.isLoading ? t.dogs.loading : dogs.isError ? t.forms.errorText : t.dogs.notFound}
        </p>
      </article>
    );
  }

  const name = locale === "el" ? dog.name : dog.nameEn;
  const story = locale === "el" ? dog.storyEl : dog.storyEn;
  const traits = locale === "el" ? dog.traitsEl : dog.traitsEn;
  const age = locale === "el" ? dog.ageEl : dog.ageEn;
  const size = locale === "el" ? dog.sizeEl : dog.sizeEn;
  const photos = [...new Set([dog.photo, ...dog.gallery])];
  const health = [
    { present: dog.sterilized, label: t.dogs.sterilized },
    { present: dog.vaccinated, label: t.dogs.vaccinated },
    { present: dog.microchip, label: t.dogs.microchip },
  ].filter((item) => item.present);

  return (
    <article className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      {back}
      <div className="grid items-start gap-10 md:grid-cols-2 md:gap-14">
        <div className="space-y-5">
          <div className="comic-card relative aspect-4/5 overflow-hidden bg-stone">
            <img src={photos[selected] ?? dog.photo} alt={name} className={cn("h-full w-full object-cover", dog.adopted && "grayscale")} />
            <span className={cn("absolute left-4 top-4 inline-flex -rotate-3 items-center gap-2 rounded-full border-2 border-ink px-4 py-2 text-sm font-bold", dog.adopted ? "bg-mint-deep" : "bg-paper")}>
              <PawPrint className="size-4" /> {dog.adopted ? t.dogs.adopted : t.dogs.available}
            </span>
          </div>
          {photos.length > 1 ? (
            <div role="group" aria-label={t.dogs.gallery} className="grid grid-cols-4 gap-3">
              {photos.map((photo, index) => (
                <button key={photo} type="button" onClick={() => setSelected(index)} aria-label={`${t.dogs.gallery}: ${name} ${index + 1}`} aria-pressed={selected === index} className={cn("aspect-4/5 overflow-hidden rounded-xl border-2 border-ink focus-visible:outline-4 focus-visible:outline-offset-2", selected === index ? "ring-4 ring-mint-deep" : "opacity-65 hover:opacity-100")}>
                  <img src={photo} alt="" loading="lazy" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="min-w-0 space-y-7">
          <div>
            <h1 className="break-words text-4xl md:text-5xl">{name}</h1>
            <p className="mt-4 font-semibold text-ink/70">{dog.sex === "male" ? t.dogs.male : t.dogs.female} · {age} · {size}</p>
            {dog.adopted && dog.adoptedAt ? <p className="mt-3 font-semibold">{t.dogs.adoptedOn} · {dog.adoptedAt}</p> : null}
          </div>
          <section className="comic-card bg-yellow p-6">
            <h2 className="mb-4 text-xl">{t.dogs.biography}</h2>
            <p className="whitespace-pre-wrap break-words leading-relaxed">{story}</p>
          </section>
          {traits ? (
            <section>
              <h2 className="mb-3 text-xl">{t.dogs.personality}</h2>
              <p className="whitespace-pre-wrap break-words leading-relaxed">{traits}</p>
            </section>
          ) : null}
          {health.length > 0 ? (
            <section>
              <h2 className="mb-3 text-xl">{t.dogs.health}</h2>
              <div className="flex flex-wrap gap-2">
                {health.map((item) => (
                  <span key={item.label} className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-mint px-3 py-1 text-sm font-semibold"><Check className="size-4" /> {item.label}</span>
                ))}
              </div>
            </section>
          ) : null}
          {!dog.adopted ? (
            <Link to={`/adopt?dog=${encodeURIComponent(dog.slug)}`} className="comic-btn w-full bg-pink-deep px-5 py-4 text-center no-underline">
              <Heart className="size-5 shrink-0" /> {t.dogs.adoptCta}
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
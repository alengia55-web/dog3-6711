import { useEffect } from "react";
import { Link, useRoute } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useDogs } from "../queries/dogs";
import { useLocale } from "../hooks/use-locale";
import { DogDetails } from "../components/dog-details";

export default function DogProfile() {
  const [, params] = useRoute("/dogs/:slug");
  const dogs = useDogs();
  const { t } = useLocale();
  const dog = dogs.data?.find(item => item.slug === params?.slug);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [params?.slug]);

  return (
    <article className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <Link to="/#dogs" className="mb-8 inline-flex items-center gap-2 font-semibold text-ink no-underline hover:underline"><ArrowLeft className="size-4" /> {t.dogs.backToDogs}</Link>
      {dog ? <DogDetails dog={dog} /> : <p role="status" className="comic-card bg-stone p-8">{dogs.isLoading ? t.dogs.loading : dogs.isError ? t.forms.errorText : t.dogs.notFound}</p>}
    </article>
  );
}
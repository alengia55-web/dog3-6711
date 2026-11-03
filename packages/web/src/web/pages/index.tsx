import {
  ClipboardList,
  Dog,
  Handshake,
  Heart,
  HeartHandshake,
  Home,
  Instagram,
  PawPrint,
  Search,
  Stethoscope,
  Syringe,
  Users,
} from "lucide-react";
import { useLocale } from "../hooks/use-locale";
import { useDogStats } from "../queries/dogs";
import { DogGrid } from "../components/dog-grid";
import { ComicLink, PawTrail, SectionTitle, Sticker, Wave } from "../components/ui/comic";
import { useContact } from "../hooks/use-contact";

function Hero() {
  const { t } = useLocale();
  const stats = useDogStats();

  const numbers = [
    { value: stats.data?.total, label: t.hero.stat1, tone: "bg-pink" },
    { value: stats.data?.adopted, label: t.hero.stat2, tone: "bg-mint" },
    { value: stats.data?.available, label: t.hero.stat3, tone: "bg-yellow" },
  ];

  return (
    <section className="relative overflow-hidden bg-pink">
      <div className="dots absolute inset-0" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:py-20 lg:grid-cols-2">
        <div className="rise">
          <Sticker tone="white">
            <PawPrint className="size-3.5" /> {t.hero.badge}
          </Sticker>
          <h1 className="mt-4 text-[clamp(2.4rem,6vw,4.4rem)]">{t.hero.title}</h1>
          <p className="mt-5 max-w-xl text-lg">{t.hero.text}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <ComicLink href="#dogs" tone="ink" size="lg">
              <Dog className="size-5" /> {t.hero.ctaDogs}
            </ComicLink>
            <ComicLink to="/donate" tone="yellow" size="lg">
              <Heart className="size-5" /> {t.hero.ctaDonate}
            </ComicLink>
          </div>
          <PawTrail className="mt-8" />
        </div>

        <div className="rise relative" style={{ animationDelay: "120ms" }}>
          <img
            src="/images/site/hero.jpg"
            alt=""
            className="comic-card aspect-4/3 w-full object-cover"
          />
          <div className="comic-card floaty absolute -bottom-6 -left-2 flex items-center gap-2 bg-mint px-4 py-2 sm:-left-6">
            <HeartHandshake className="size-5" />
            <span className="font-display text-sm font-bold">
              {stats.isLoading ? "…" : stats.data?.adopted} {t.hero.stat2}
            </span>
          </div>
        </div>
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-4 px-4 pb-16 sm:grid-cols-3">
        {numbers.map((n, i) => (
          <div
            key={n.label}
            className={`comic-card rise ${n.tone} px-5 py-4`}
            style={{ animationDelay: `${200 + i * 80}ms` }}
          >
            <div className="font-display text-4xl font-bold">
              {stats.isLoading ? "…" : (n.value ?? 0)}
            </div>
            <div className="text-sm font-semibold text-ink/75">{n.label}</div>
          </div>
        ))}
      </div>

      <div className="text-paper">
        <Wave />
      </div>
    </section>
  );
}

function Dogs() {
  const { t } = useLocale();
  return (
    <section id="dogs" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 md:py-24">
      <SectionTitle
        eyebrow={t.nav.dogs}
        title={t.dogs.title}
        text={t.dogs.subtitle}
      />
      <div className="mt-10">
        <DogGrid />
      </div>
    </section>
  );
}

function Steps() {
  const { t } = useLocale();
  const steps = [
    { icon: Search, title: t.steps.s1t, text: t.steps.s1d, tone: "bg-pink" },
    { icon: ClipboardList, title: t.steps.s2t, text: t.steps.s2d, tone: "bg-yellow" },
    { icon: Handshake, title: t.steps.s3t, text: t.steps.s3d, tone: "bg-sky" },
    { icon: Home, title: t.steps.s4t, text: t.steps.s4d, tone: "bg-mint" },
  ];

  return (
    <section className="relative bg-sky">
      <div className="rotate-180 text-sky">
        <Wave flip />
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-20">
        <SectionTitle title={t.steps.title} />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className={`comic-card card-hover ${s.tone} p-5`}>
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-full border-2 border-ink bg-paper font-display text-lg font-bold">
                  {i + 1}
                </span>
                <s.icon className="size-6" />
              </div>
              <h3 className="mt-4 font-display text-xl">{s.title}</h3>
              <p className="mt-2 text-sm">{s.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <ComicLink to="/adopt" tone="ink" size="lg">
            <Heart className="size-5" /> {t.nav.adopt}
          </ComicLink>
          <ComicLink to="/volunteer" tone="white" size="lg">
            <Users className="size-5" /> {t.nav.volunteer}
          </ComicLink>
        </div>
      </div>
    </section>
  );
}

function About() {
  const { t } = useLocale();
  const values = [
    { icon: PawPrint, label: t.about.v1 },
    { icon: Syringe, label: t.about.v2 },
    { icon: Home, label: t.about.v3 },
    { icon: Stethoscope, label: t.about.v4 },
  ];

  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="relative">
          <img
            src="/images/site/about.jpg"
            alt=""
            className="comic-card aspect-4/3 w-full object-cover"
          />
          <img
            src="/images/site/shelter.jpg"
            alt=""
            className="comic-card absolute -right-3 -bottom-8 hidden w-40 rotate-3 object-cover sm:block"
          />
        </div>
        <div>
          <SectionTitle title={t.about.title} />
          <div className="mt-5 space-y-4 text-ink/85">
            <p>{t.about.p1}</p>
            <p>{t.about.p2}</p>
            <p className="font-semibold text-ink">{t.about.p3}</p>
          </div>
          <h3 className="mt-8 font-display text-lg">{t.about.valuesTitle}</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {values.map((v) => (
              <li
                key={v.label}
                className="flex items-center gap-2 rounded-full border-2 border-ink bg-stone px-3 py-2 text-sm font-semibold"
              >
                <v.icon className="size-4 shrink-0" /> {v.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function VolunteerBand() {
  const { t } = useLocale();
  const CONTACT = useContact();
  return (
    <section className="relative bg-mint">
      <div className="rotate-180 text-mint">
        <Wave flip />
      </div>
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-20 lg:grid-cols-2">
        <div>
          <SectionTitle title={t.volunteer.title} text={t.volunteer.intro} />
          <div className="mt-6 flex flex-wrap gap-2">
            {[t.volunteer.i1, t.volunteer.i2, t.volunteer.i3, t.volunteer.i4, t.volunteer.i5].map(
              (label) => (
                <span
                  key={label}
                  className="rounded-full border-2 border-ink bg-paper px-3 py-1.5 text-sm font-semibold"
                >
                  {label}
                </span>
              ),
            )}
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <ComicLink to="/volunteer" tone="ink" size="lg">
              <Users className="size-5" /> {t.volunteer.title}
            </ComicLink>
            <ComicLink href={CONTACT.instagram} tone="white" size="lg" external>
              <Instagram className="size-5" /> Instagram
            </ComicLink>
          </div>
        </div>
        <img
          src="/images/site/volunteer.jpg"
          alt=""
          className="comic-card aspect-4/5 w-full max-w-md justify-self-center object-cover lg:justify-self-end"
        />
      </div>
    </section>
  );
}

function DonateBand() {
  const { t } = useLocale();
  const CONTACT = useContact();
  return (
    <section id="donate" className="bg-paper">
      <div className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20">
        <div className="comic-card bg-yellow p-6 md:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <SectionTitle title={t.donate.title} text={t.donate.text} />
              <ul className="mt-6 space-y-2 text-sm">
                {[t.donate.t1, t.donate.t2, t.donate.t3].map((line) => (
                  <li key={line} className="flex items-start gap-2">
                    <PawPrint className="mt-0.5 size-4 shrink-0" /> {line}
                  </li>
                ))}
              </ul>
            </div>
            <div className="comic-card bg-paper p-5">
              <div className="font-display text-sm font-bold text-ink/60">
                {t.donate.referenceLabel}
              </div>
              <div className="mt-1 font-display text-3xl font-bold">{CONTACT.reference}</div>
              <div className="mt-4 space-y-2 text-sm">
                <div>
                  <span className="font-semibold">{t.donate.ibanLabel}: </span>
                  <span className="text-ink/60">{CONTACT.iban || t.donate.pending}</span>
                </div>
                <div>
                  <span className="font-semibold">{t.donate.bankLabel}: </span>
                  <span className="text-ink/60">{CONTACT.bankName || t.donate.pending}</span>
                </div>
              </div>
              <ComicLink to="/donate" tone="pink" className="mt-5 w-full">
                <Heart className="size-4" /> {t.nav.donate}
              </ComicLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Index() {
  return (
    <>
      <Hero />
      <Dogs />
      <Steps />
      <About />
      <VolunteerBand />
      <DonateBand />
    </>
  );
}

export default Index;

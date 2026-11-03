import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "wouter";
import { CheckCircle2, Dog, PawPrint, Send, TriangleAlert } from "lucide-react";
import { useLocale } from "../hooks/use-locale";
import { useDogs } from "../queries/dogs";
import { useSubmitAdoption } from "../queries/applications";
import { CheckRow, Field, Select, TextArea, TextInput } from "../components/ui/field";
import { ComicButton, ComicLink, Sticker } from "../components/ui/comic";

type FormState = {
  dogSlug: string;
  fullName: string;
  birthYear: string;
  idNumber: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  job: string;
  household: string;
  homeType: string;
  ownership: string;
  yard: string;
  whereDogStays: string;
  hoursAlone: string;
  otherPets: string;
  pastPets: string;
  vacationPlan: string;
  vetBudget: string;
  reason: string;
};

const empty: FormState = {
  dogSlug: "",
  fullName: "",
  birthYear: "",
  idNumber: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  job: "",
  household: "",
  homeType: "",
  ownership: "",
  yard: "",
  whereDogStays: "",
  hoursAlone: "",
  otherPets: "",
  pastPets: "",
  vacationPlan: "",
  vetBudget: "",
  reason: "",
};

function SectionCard({
  step,
  title,
  tone,
  children,
}: {
  step: string;
  title: string;
  tone: string;
  children: React.ReactNode;
}) {
  return (
    <section className="comic-card bg-paper p-5 sm:p-7">
      <div className="mb-5 flex items-center gap-3">
        <span
          className={`flex size-9 items-center justify-center rounded-full border-2 border-ink font-display text-sm font-bold ${tone}`}
        >
          {step}
        </span>
        <h2 className="text-2xl">{title}</h2>
      </div>
      <div className="grid gap-4">{children}</div>
    </section>
  );
}

export default function AdoptPage() {
  const { t, locale } = useLocale();
  const dogs = useDogs();
  const submit = useSubmitAdoption();
  const [params] = useSearchParams();
  const preselect = params.get("dog") ?? "";

  const [form, setForm] = useState<FormState>({ ...empty, dogSlug: preselect });
  const [agreeVisit, setAgreeVisit] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeGdpr, setAgreeGdpr] = useState(false);

  useEffect(() => {
    if (preselect) setForm((f) => ({ ...f, dogSlug: preselect }));
  }, [preselect]);

  const available = useMemo(
    () => (dogs.data ?? []).filter((d) => !d.adopted),
    [dogs.data],
  );
  const selected = available.find((d) => d.slug === form.dogSlug);

  const set = <K extends keyof FormState>(key: K) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const canSubmit = agreeTerms && agreeGdpr && !submit.isPending;

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;
    submit.mutate({
      ...form,
      dogSlug: form.dogSlug || undefined,
      dogName: selected ? `${selected.name} / ${selected.nameEn}` : undefined,
      agreeVisit,
      agreeTerms,
      agreeGdpr,
      locale,
    });
  }

  if (submit.isSuccess) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <div className="comic-card rise bg-mint p-8 text-center">
          <CheckCircle2 className="mx-auto size-14" />
          <h1 className="mt-4 text-3xl">{t.forms.successTitle}</h1>
          <p className="mt-3 text-lg">{t.forms.successText}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <ComicLink to="/" tone="white">
              {t.brand}
            </ComicLink>
            <ComicButton tone="ink" onClick={() => submit.reset()}>
              {t.forms.newAnother}
            </ComicButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone">
      <div className="relative overflow-hidden bg-pink">
        <div className="dots pointer-events-none absolute inset-0" />
        <div className="relative">
          <div className="mx-auto max-w-4xl px-4 py-14">
            <Sticker tone="white">
              <PawPrint className="size-3.5" /> {t.nav.adopt}
            </Sticker>
            <h1 className="mt-4 text-[clamp(2.2rem,5vw,3.4rem)]">{t.adopt.title}</h1>
            <p className="mt-4 max-w-2xl text-lg">{t.adopt.intro}</p>
            {selected ? (
              <div className="comic-card mt-6 inline-flex items-center gap-3 bg-paper px-4 py-3">
                <img
                  src={selected.photo}
                  alt=""
                  className="size-12 rounded-full border-2 border-ink object-cover"
                />
                <span className="font-display font-bold">
                  {t.adopt.forDog}: {locale === "el" ? selected.name : selected.nameEn}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mx-auto grid max-w-4xl gap-6 px-4 py-12">
        <SectionCard step="1" title={t.adopt.sectionYou} tone="bg-pink">
          <Field label={t.adopt.dog}>
            <Select
              value={form.dogSlug}
              onChange={(e) => set("dogSlug")(e.target.value)}
            >
              <option value="">{t.adopt.anyDog}</option>
              {available.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {locale === "el" ? d.name : d.nameEn}
                </option>
              ))}
            </Select>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t.adopt.fullName} required>
              <TextInput
                required
                value={form.fullName}
                onChange={(e) => set("fullName")(e.target.value)}
              />
            </Field>
            <Field label={t.adopt.birthYear}>
              <TextInput
                inputMode="numeric"
                value={form.birthYear}
                onChange={(e) => set("birthYear")(e.target.value)}
              />
            </Field>
            <Field label={t.adopt.phone} required>
              <TextInput
                required
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone")(e.target.value)}
              />
            </Field>
            <Field label={t.adopt.email} required>
              <TextInput
                required
                type="email"
                value={form.email}
                onChange={(e) => set("email")(e.target.value)}
              />
            </Field>
            <Field label={t.adopt.idNumber}>
              <TextInput
                value={form.idNumber}
                onChange={(e) => set("idNumber")(e.target.value)}
              />
            </Field>
            <Field label={t.adopt.job}>
              <TextInput value={form.job} onChange={(e) => set("job")(e.target.value)} />
            </Field>
            <Field label={t.adopt.address} required>
              <TextInput
                required
                value={form.address}
                onChange={(e) => set("address")(e.target.value)}
              />
            </Field>
            <Field label={t.adopt.city} required>
              <TextInput
                required
                value={form.city}
                onChange={(e) => set("city")(e.target.value)}
              />
            </Field>
          </div>
        </SectionCard>

        <SectionCard step="2" title={t.adopt.sectionHome} tone="bg-yellow">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label={t.adopt.homeType}>
              <Select
                value={form.homeType}
                onChange={(e) => set("homeType")(e.target.value)}
              >
                <option value="">{t.forms.selectPlaceholder}</option>
                <option value={t.adopt.homeApartment}>{t.adopt.homeApartment}</option>
                <option value={t.adopt.homeHouse}>{t.adopt.homeHouse}</option>
                <option value={t.adopt.homeFarm}>{t.adopt.homeFarm}</option>
              </Select>
            </Field>
            <Field label={t.adopt.ownership}>
              <Select
                value={form.ownership}
                onChange={(e) => set("ownership")(e.target.value)}
              >
                <option value="">{t.forms.selectPlaceholder}</option>
                <option value={t.adopt.owned}>{t.adopt.owned}</option>
                <option value={t.adopt.rented}>{t.adopt.rented}</option>
              </Select>
            </Field>
            <Field label={t.adopt.yard}>
              <Select value={form.yard} onChange={(e) => set("yard")(e.target.value)}>
                <option value="">{t.forms.selectPlaceholder}</option>
                <option value={t.adopt.yardFenced}>{t.adopt.yardFenced}</option>
                <option value={t.adopt.yardOpen}>{t.adopt.yardOpen}</option>
                <option value={t.adopt.yardNone}>{t.adopt.yardNone}</option>
              </Select>
            </Field>
          </div>
          <Field label={t.adopt.household}>
            <TextArea
              value={form.household}
              onChange={(e) => set("household")(e.target.value)}
            />
          </Field>
          <Field label={t.adopt.whereDogStays}>
            <TextArea
              value={form.whereDogStays}
              onChange={(e) => set("whereDogStays")(e.target.value)}
            />
          </Field>
        </SectionCard>

        <SectionCard step="3" title={t.adopt.sectionLife} tone="bg-sky">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t.adopt.hoursAlone}>
              <TextInput
                value={form.hoursAlone}
                onChange={(e) => set("hoursAlone")(e.target.value)}
              />
            </Field>
            <Field label={t.adopt.vetBudget}>
              <TextInput
                value={form.vetBudget}
                onChange={(e) => set("vetBudget")(e.target.value)}
              />
            </Field>
          </div>
          <Field label={t.adopt.otherPets}>
            <TextArea
              value={form.otherPets}
              onChange={(e) => set("otherPets")(e.target.value)}
            />
          </Field>
          <Field label={t.adopt.pastPets}>
            <TextArea
              value={form.pastPets}
              onChange={(e) => set("pastPets")(e.target.value)}
            />
          </Field>
          <Field label={t.adopt.vacationPlan}>
            <TextArea
              value={form.vacationPlan}
              onChange={(e) => set("vacationPlan")(e.target.value)}
            />
          </Field>
          <Field label={t.adopt.reason} required>
            <TextArea
              required
              minLength={5}
              value={form.reason}
              onChange={(e) => set("reason")(e.target.value)}
            />
          </Field>
        </SectionCard>

        <SectionCard step="4" title={t.adopt.sectionAgree} tone="bg-mint">
          <CheckRow label={t.adopt.agreeVisit} checked={agreeVisit} onChange={setAgreeVisit} />
          <CheckRow
            label={t.adopt.agreeTerms}
            checked={agreeTerms}
            onChange={setAgreeTerms}
            required
          />
          <CheckRow
            label={t.adopt.agreeGdpr}
            checked={agreeGdpr}
            onChange={setAgreeGdpr}
            required
          />
        </SectionCard>

        {submit.isError ? (
          <div className="comic-card flex items-start gap-3 bg-pink-deep p-5">
            <TriangleAlert className="mt-0.5 size-5 shrink-0" />
            <div>
              <div className="font-display font-bold">{t.forms.errorTitle}</div>
              <p className="text-sm">{t.forms.errorText}</p>
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-4">
          <ComicButton type="submit" size="lg" tone="ink" disabled={!canSubmit}>
            <Send className="size-5" />
            {submit.isPending ? t.forms.submitting : t.forms.submit}
          </ComicButton>
          <Link to="/#dogs" className="inline-flex items-center gap-2 font-display font-bold">
            <Dog className="size-4" /> {t.nav.dogs}
          </Link>
        </div>
      </form>
    </div>
  );
}

import { useState } from "react";
import { CheckCircle2, HeartHandshake, Send, TriangleAlert } from "lucide-react";
import { useLocale } from "../hooks/use-locale";
import { useSubmitVolunteer } from "../queries/applications";
import { CheckRow, ChipCheck, Field, Select, TextArea, TextInput } from "../components/ui/field";
import { ComicButton, ComicLink, Sticker } from "../components/ui/comic";

type FormState = {
  fullName: string;
  fatherName: string;
  birthDate: string;
  idNumber: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  availability: string;
  hasVehicle: string;
  experience: string;
  notes: string;
};

const empty: FormState = {
  fullName: "",
  fatherName: "",
  birthDate: "",
  idNumber: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  availability: "",
  hasVehicle: "",
  experience: "",
  notes: "",
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

export default function VolunteerPage() {
  const { t, locale } = useLocale();
  const submit = useSubmitVolunteer();
  const [form, setForm] = useState<FormState>(empty);
  const [interests, setInterests] = useState<string[]>([]);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeGdpr, setAgreeGdpr] = useState(false);

  const options = [
    t.volunteer.i1,
    t.volunteer.i2,
    t.volunteer.i3,
    t.volunteer.i4,
    t.volunteer.i5,
    t.volunteer.i6,
    t.volunteer.i7,
  ];

  const set = <K extends keyof FormState>(key: K) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggle = (label: string, checked: boolean) =>
    setInterests((list) =>
      checked ? [...list, label] : list.filter((item) => item !== label),
    );

  const canSubmit = agreeTerms && agreeGdpr && !submit.isPending;

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;
    submit.mutate({ ...form, interests, agreeTerms, agreeGdpr, locale });
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
      <div className="relative overflow-hidden bg-mint">
        <div className="dots pointer-events-none absolute inset-0" />
        <div className="relative">
          <div className="mx-auto max-w-4xl px-4 py-14">
            <Sticker tone="white">
              <HeartHandshake className="size-3.5" /> {t.nav.volunteer}
            </Sticker>
            <h1 className="mt-4 text-[clamp(2.2rem,5vw,3.4rem)]">{t.volunteer.title}</h1>
            <p className="mt-4 max-w-2xl text-lg">{t.volunteer.intro}</p>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mx-auto grid max-w-4xl gap-6 px-4 py-12">
        <SectionCard step="1" title={t.volunteer.sectionYou} tone="bg-mint">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t.adopt.fullName} required>
              <TextInput
                required
                value={form.fullName}
                onChange={(e) => set("fullName")(e.target.value)}
              />
            </Field>
            <Field label={t.volunteer.fatherName}>
              <TextInput
                value={form.fatherName}
                onChange={(e) => set("fatherName")(e.target.value)}
              />
            </Field>
            <Field label={t.volunteer.birthDate}>
              <TextInput
                value={form.birthDate}
                onChange={(e) => set("birthDate")(e.target.value)}
                placeholder="01/01/1990"
              />
            </Field>
            <Field label={t.adopt.idNumber}>
              <TextInput
                value={form.idNumber}
                onChange={(e) => set("idNumber")(e.target.value)}
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

        <SectionCard step="2" title={t.volunteer.sectionHelp} tone="bg-yellow">
          <div>
            <span className="mb-2 block font-display text-sm font-bold">
              {t.volunteer.interests}
            </span>
            <div className="flex flex-wrap gap-2.5">
              {options.map((label) => (
                <ChipCheck
                  key={label}
                  label={label}
                  checked={interests.includes(label)}
                  onChange={(checked) => toggle(label, checked)}
                />
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t.volunteer.availability}>
              <TextInput
                value={form.availability}
                onChange={(e) => set("availability")(e.target.value)}
              />
            </Field>
            <Field label={t.volunteer.hasVehicle}>
              <Select
                value={form.hasVehicle}
                onChange={(e) => set("hasVehicle")(e.target.value)}
              >
                <option value="">{t.forms.selectPlaceholder}</option>
                <option value={t.forms.yes}>{t.forms.yes}</option>
                <option value={t.forms.no}>{t.forms.no}</option>
              </Select>
            </Field>
          </div>
          <Field label={t.volunteer.experience}>
            <TextArea
              value={form.experience}
              onChange={(e) => set("experience")(e.target.value)}
            />
          </Field>
          <Field label={t.volunteer.notes}>
            <TextArea value={form.notes} onChange={(e) => set("notes")(e.target.value)} />
          </Field>
        </SectionCard>

        <SectionCard step="3" title={t.adopt.sectionAgree} tone="bg-sky">
          <CheckRow
            label={t.volunteer.agreeTerms}
            checked={agreeTerms}
            onChange={setAgreeTerms}
            required
          />
          <CheckRow
            label={t.volunteer.agreeGdpr}
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

        <div>
          <ComicButton type="submit" size="lg" tone="ink" disabled={!canSubmit}>
            <Send className="size-5" />
            {submit.isPending ? t.forms.submitting : t.forms.submit}
          </ComicButton>
        </div>
      </form>
    </div>
  );
}

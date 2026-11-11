import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { useLocale } from "../hooks/use-locale";
import { useContact } from "../hooks/use-contact";
import { useSubmitInKind } from "../queries/applications";
import { shelterToday } from "../../shared/in-kind";
import { CheckRow, Field, TextArea, TextInput } from "./ui/field";
import { ComicButton } from "./ui/comic";

const empty = { fullName: "", phone: "", email: "", items: "", quantity: "", proposedDate: "", proposedTime: "", notes: "" };

export function InKindForm() {
  const { t, locale } = useLocale();
  const contact = useContact();
  const submit = useSubmitInKind();
  const [form, setForm] = useState(empty);
  const [consent, setConsent] = useState(false);
  const successHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (submit.isSuccess) successHeading.current?.focus(); }, [submit.isSuccess]);
  const set = (key: keyof typeof empty) => (value: string) => setForm(previous => ({ ...previous, [key]: value }));

  if (submit.isSuccess) return (
    <section id="in-kind-form" className="comic-card mt-8 bg-mint p-6 sm:p-8" aria-live="polite">
      <CheckCircle2 className="mb-3 size-10" aria-hidden="true" />
      <h2 ref={successHeading} tabIndex={-1} className="text-2xl">{t.inKind.success}</h2>
      <p className="mt-3 leading-relaxed">{t.inKind.successText}</p>
      <ComicButton className="mt-5" tone="white" onClick={() => { setForm(empty); setConsent(false); submit.reset(); }}>{t.inKind.another}</ComicButton>
    </section>
  );

  return (
    <section id="in-kind-form" className="comic-card mt-8 bg-paper p-5 sm:p-8" aria-labelledby="in-kind-title">
      <h2 id="in-kind-title" className="text-2xl">{t.inKind.title}</h2>
      <p className="mt-3 max-w-3xl leading-relaxed">{t.inKind.intro}</p>
      <form className="mt-6 space-y-5" onSubmit={event => {
        event.preventDefault();
        if (consent && !submit.isPending) submit.mutate({ ...form, agreeContact: true, locale });
      }}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t.adopt.fullName} required><TextInput name="fullName" autoComplete="name" required minLength={2} maxLength={160} value={form.fullName} onChange={e => set("fullName")(e.target.value)} /></Field>
          <Field label={t.adopt.phone} required><TextInput name="phone" autoComplete="tel" type="tel" required minLength={6} maxLength={40} value={form.phone} onChange={e => set("phone")(e.target.value)} /></Field>
          <Field label={t.adopt.email} required className="sm:col-span-2"><TextInput name="email" autoComplete="email" type="email" required maxLength={160} value={form.email} onChange={e => set("email")(e.target.value)} /></Field>
          <Field label={t.inKind.items} hint={t.inKind.itemsHint} required className="sm:col-span-2"><TextArea name="items" required minLength={3} maxLength={2000} rows={3} value={form.items} onChange={e => set("items")(e.target.value)} /></Field>
          <Field label={t.inKind.quantity} hint={t.inKind.quantityHint} required className="sm:col-span-2"><TextInput name="quantity" required maxLength={200} value={form.quantity} onChange={e => set("quantity")(e.target.value)} /></Field>
          <Field label={t.inKind.date} required><TextInput name="proposedDate" type="date" required min={shelterToday()} value={form.proposedDate} onChange={e => set("proposedDate")(e.target.value)} /></Field>
          <Field label={t.inKind.time}><TextInput name="proposedTime" type="time" value={form.proposedTime} onChange={e => set("proposedTime")(e.target.value)} /></Field>
          <Field label={t.inKind.notes} className="sm:col-span-2"><TextArea name="notes" maxLength={1500} rows={3} value={form.notes} onChange={e => set("notes")(e.target.value)} /></Field>
        </div>
        <p className="rounded-xl border-2 border-ink bg-sky p-4 text-sm leading-relaxed">{t.inKind.confirmation}</p>
        <CheckRow label={t.inKind.consent} required checked={consent} onChange={setConsent} />
        {submit.isError && <div role="alert" className="rounded-xl border-2 border-ink bg-pink p-4 text-sm">
          <p>{t.inKind.error}</p>
          <p className="mt-2 break-words">{submit.error.message}</p>
          <a className="mt-2 inline-block break-all underline" href={`mailto:${contact.email}`}>{contact.email}</a>
        </div>}
        <ComicButton type="submit" tone="pink" disabled={!consent || submit.isPending} className="w-full sm:w-auto"><Send className="size-4" aria-hidden="true" />{submit.isPending ? t.forms.submitting : t.inKind.submit}</ComicButton>
      </form>
    </section>
  );
}
import { useState } from "react";
import {
  Camera,
  Car,
  Check,
  Copy,
  Dog,
  Heart,
  Home,
  PackageOpen,
  Receipt,
  ShieldCheck,
} from "lucide-react";
import { useLocale } from "../hooks/use-locale";
import { useContact } from "../hooks/use-contact";
import { ComicButton, ComicLink, Sticker, Wave } from "../components/ui/comic";

function CopyRow({
  label,
  value,
  pending,
  copyText,
  copiedText,
  highlight,
}: {
  label: string;
  value: string;
  pending: string;
  copyText: string;
  copiedText: string;
  highlight?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const filled = value.trim().length > 0;

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div
      className={`comic-card flex flex-wrap items-center justify-between gap-3 p-4 ${
        highlight ? "bg-yellow" : "bg-paper"
      }`}
    >
      <div>
        <div className="font-display text-xs font-bold uppercase tracking-wide text-ink/60">
          {label}
        </div>
        <div className={`font-display text-lg font-bold ${filled ? "" : "text-ink/45"}`}>
          {filled ? value : pending}
        </div>
      </div>
      {filled ? (
        <ComicButton type="button" tone="white" size="sm" onClick={copy}>
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? copiedText : copyText}
        </ComicButton>
      ) : null}
    </div>
  );
}

export default function DonatePage() {
  const { t } = useLocale();
  const CONTACT = useContact();

  const commitments = [
    { icon: Receipt, text: t.donate.t1 },
    { icon: ShieldCheck, text: t.donate.t2 },
    { icon: Heart, text: t.donate.t3 },
  ];

  const ways = [
    { icon: Home, text: t.donate.w1, tone: "bg-pink" },
    { icon: Car, text: t.donate.w2, tone: "bg-yellow" },
    { icon: Camera, text: t.donate.w3, tone: "bg-sky" },
    { icon: Dog, text: t.donate.w4, tone: "bg-mint" },
  ];

  return (
    <div>
      <section className="relative overflow-hidden bg-yellow">
        <div className="dots pointer-events-none absolute inset-0" />
        <div className="relative">
          <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-14 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <Sticker tone="white">
                <Heart className="size-3.5" /> {t.nav.donate}
              </Sticker>
              <h1 className="mt-4 text-[clamp(2.2rem,5vw,3.6rem)]">{t.donate.title}</h1>
              <p className="mt-4 max-w-2xl text-lg">{t.donate.text}</p>

              <div className="mt-8 grid gap-3">
                <CopyRow
                  label={t.donate.referenceLabel}
                  value={CONTACT.reference}
                  pending={t.donate.pending}
                  copyText={t.donate.copy}
                  copiedText={t.donate.copied}
                  highlight
                />
                <CopyRow
                  label={t.donate.ibanLabel}
                  value={CONTACT.iban}
                  pending={t.donate.pending}
                  copyText={t.donate.copy}
                  copiedText={t.donate.copied}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <CopyRow
                    label={t.donate.bankLabel}
                    value={CONTACT.bankName}
                    pending={t.donate.pending}
                    copyText={t.donate.copy}
                    copiedText={t.donate.copied}
                  />
                  <CopyRow
                    label={t.donate.beneficiaryLabel}
                    value={CONTACT.beneficiary}
                    pending={t.donate.pending}
                    copyText={t.donate.copy}
                    copiedText={t.donate.copied}
                  />
                </div>
                <p className="text-sm text-ink/70">{t.donate.pendingNote}</p>
              </div>
            </div>

            <div className="comic-card bg-paper p-6">
              <h2 className="flex items-center gap-2 text-2xl">
                <ShieldCheck className="size-6" /> {t.donate.transparencyTitle}
              </h2>
              <ul className="mt-5 grid gap-3">
                {commitments.map((c) => (
                  <li key={c.text} className="flex items-start gap-3 text-[15px]">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-mint">
                      <c.icon className="size-4" />
                    </span>
                    <span>{c.text}</span>
                  </li>
                ))}
              </ul>
              <img
                src="/images/site/shelter.jpg"
                alt=""
                className="mt-6 aspect-16/9 w-full rounded-2xl border-2 border-ink object-cover object-top"
              />
            </div>
          </div>
        </div>
        <div className="text-paper">
          <Wave />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="comic-card bg-pink p-6">
            <h2 className="flex items-center gap-2 text-2xl">
              <PackageOpen className="size-6" /> {t.donate.inKindTitle}
            </h2>
            <p className="mt-4 text-[15px]">{t.donate.inKindText}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ComicLink href={CONTACT.instagram} external tone="white">
                {t.contact.instagram}
              </ComicLink>
              <ComicLink to="/volunteer" tone="ink">
                {t.nav.volunteer}
              </ComicLink>
            </div>
          </div>

          <div className="comic-card bg-paper p-6">
            <h2 className="text-2xl">{t.donate.otherWaysTitle}</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {ways.map((w) => (
                <div
                  key={w.text}
                  className={`flex items-start gap-3 rounded-2xl border-2 border-ink p-3.5 text-sm ${w.tone}`}
                >
                  <w.icon className="mt-0.5 size-5 shrink-0" />
                  <span>{w.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

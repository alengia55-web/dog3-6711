import { useState } from "react";
import { Link, useLocation } from "wouter";
import { KeyRound, Loader2 } from "lucide-react";
import { authClient } from "../../lib/auth";
import { client } from "../../lib/api";
import { useAdminText } from "../../queries/admin";
import { useLocale } from "../../hooks/use-locale";
import { Field, TextInput } from "../../components/ui/field";
import { cn } from "../../lib/utils";

type Mode = "signIn" | "register";

/** Server + Better Auth errors arrive in English; show them in the panel's language. */
function localizeError(raw: string, a: ReturnType<typeof useAdminText>["a"]) {
  const text = raw.toLowerCase();
  if (text.includes("invite")) return a.login.badInvite;
  if (text.includes("invalid email") || (text.includes("email") && text.includes("valid")))
    return a.login.invalidEmail;
  if (text.includes("password") && (text.includes("short") || text.includes("8")))
    return a.login.shortPassword;
  if (text.includes("already") || text.includes("exists") || text.includes("taken"))
    return a.login.emailTaken;
  if (text.includes("invalid") || text.includes("credential") || text.includes("unauthorized"))
    return a.login.failed;
  return raw;
}

export default function AdminLogin() {
  const { a } = useAdminText();
  const { t } = useLocale();
  const [, navigate] = useLocation();
  const [mode, setMode] = useState<Mode>("signIn");
  const [form, setForm] = useState({ name: "", email: "", password: "", inviteCode: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (mode === "register") {
        await client.staff.register({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          inviteCode: form.inviteCode.trim(),
        });
      }
      const result = await authClient.signIn.email({
        email: form.email.trim(),
        password: form.password,
      });
      if (result.error) throw new Error(result.error.message ?? a.login.failed);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? localizeError(err.message, a) : a.login.failed);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone/50 px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex items-center justify-center gap-3 no-underline">
          <img src="/images/site/logo.png" alt="" className="size-12" />
          <span className="font-display text-xl font-bold leading-snug">{t.brand}</span>
        </Link>

        <div className="comic-card bg-paper p-6">
          <h1 className="flex items-center gap-2 text-2xl">
            <KeyRound className="size-6" /> {a.login.title}
          </h1>
          <p className="mt-1 text-sm text-ink/60">{a.login.subtitle}</p>

          <div className="mt-5 inline-flex overflow-hidden rounded-full border-2 border-ink">
            {(
              [
                ["signIn", a.login.tabSignIn],
                ["register", a.login.tabRegister],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setMode(value);
                  setError("");
                }}
                className={cn(
                  "px-4 py-1.5 font-display text-sm font-bold",
                  mode === value ? "bg-ink text-paper" : "bg-paper hover:bg-stone",
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-5 space-y-4">
            {mode === "register" ? (
              <Field label={a.login.name} required>
                <TextInput
                  value={form.name}
                  onChange={(e) => set("name")(e.target.value)}
                  required
                  autoComplete="name"
                />
              </Field>
            ) : null}

            <Field label={a.login.email} required>
              <TextInput
                type="email"
                value={form.email}
                onChange={(e) => set("email")(e.target.value)}
                required
                autoComplete="email"
              />
            </Field>

            <Field label={a.login.password} required hint={a.login.passwordHint}>
              <TextInput
                type="password"
                value={form.password}
                onChange={(e) => set("password")(e.target.value)}
                required
                minLength={8}
                autoComplete={mode === "register" ? "new-password" : "current-password"}
              />
            </Field>

            {mode === "register" ? (
              <Field label={a.login.inviteCode} required hint={a.login.inviteHint}>
                <TextInput
                  value={form.inviteCode}
                  onChange={(e) => set("inviteCode")(e.target.value)}
                  required
                />
              </Field>
            ) : null}

            {error ? (
              <p className="rounded-xl border-2 border-ink bg-pink px-3 py-2 text-sm">{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={busy}
              className="comic-btn w-full bg-mint-deep px-5 py-2.5 disabled:opacity-60"
            >
              {busy ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> {a.login.working}
                </>
              ) : mode === "register" ? (
                a.login.submitRegister
              ) : (
                a.login.submitSignIn
              )}
            </button>
          </form>
        </div>

        <Link
          to="/"
          className="mt-5 block text-center text-sm text-ink/60 no-underline hover:text-ink"
        >
          ← {a.common.back}
        </Link>
      </div>
    </div>
  );
}

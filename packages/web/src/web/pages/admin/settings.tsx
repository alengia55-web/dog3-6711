import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { AdminShell } from "../../components/admin/shell";
import { useAdminText, useSettingsMutation, useSiteSettings } from "../../queries/admin";
import { Field, TextInput } from "../../components/ui/field";

const FIELDS = [
  "phone",
  "email",
  "address",
  "facebook",
  "bankName",
  "iban",
  "beneficiary",
  "reference",
] as const;

type Values = Record<(typeof FIELDS)[number], string>;

const blank = Object.fromEntries(FIELDS.map((key) => [key, ""])) as Values;

export default function AdminSettings() {
  const { a } = useAdminText();
  const { data, isPending } = useSiteSettings();
  const save = useSettingsMutation();
  const [values, setValues] = useState<Values>(blank);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (data) setValues({ ...blank, ...data });
  }, [data]);

  return (
    <AdminShell title={a.settings.title} adminOnly>
      {isPending ? (
        <p className="text-ink/60">{a.common.loading}</p>
      ) : (
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            setDone(false);
            await save.mutateAsync({ ...values, instagram: "" });
            setDone(true);
          }}
          className="space-y-6"
        >
          <p className="text-ink/70">{a.settings.subtitle}</p>

          <section className="comic-card grid gap-4 bg-paper p-5 sm:grid-cols-2">
            {FIELDS.map((key) => (
              <Field key={key} label={a.settings[key]}>
                <TextInput
                  value={values[key]}
                  onChange={(e) => setValues((prev) => ({ ...prev, [key]: e.target.value }))}
                />
              </Field>
            ))}
          </section>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={save.isPending}
              className="comic-btn bg-mint-deep px-5 py-2.5 disabled:opacity-60"
            >
              <Save className="size-4" /> {a.settings.save}
            </button>
            {done ? <span className="text-sm text-ink/70">{a.settings.saved}</span> : null}
          </div>
        </form>
      )}
    </AdminShell>
  );
}

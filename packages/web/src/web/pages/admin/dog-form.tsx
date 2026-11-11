import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Save, X } from "lucide-react";
import { AdminShell } from "../../components/admin/shell";
import { CoverPhotoInput, GalleryInput } from "../../components/admin/photo-uploader";
import { orpc } from "../../lib/api";
import { useAdminText, useDogMutations } from "../../queries/admin";
import { CheckRow, Field, Select, TextArea, TextInput } from "../../components/ui/field";
import { isPetGovListingUrl } from "../../../shared/pet-gov";

interface DogForm {
  name: string;
  nameEn: string;
  photo: string;
  sex: "male" | "female";
  ageEl: string;
  ageEn: string;
  sizeEl: string;
  sizeEn: string;
  storyEl: string;
  storyEn: string;
  traitsEl: string;
  traitsEn: string;
  sterilized: boolean;
  vaccinated: boolean;
  microchip: boolean;
  petGovUrl: string;
  adopted: boolean;
  adoptedAt: string;
  gallery: string[];
}

const empty: DogForm = {
  name: "",
  nameEn: "",
  photo: "",
  sex: "male",
  ageEl: "",
  ageEn: "",
  sizeEl: "",
  sizeEn: "",
  storyEl: "",
  storyEn: "",
  traitsEl: "",
  traitsEn: "",
  sterilized: true,
  vaccinated: true,
  microchip: true,
  petGovUrl: "",
  adopted: false,
  adoptedAt: "",
  gallery: [],
};

export default function AdminDogForm() {
  const { a } = useAdminText();
  const [, navigate] = useLocation();
  const [, params] = useRoute("/admin/dogs/:id");
  const id = params?.id && params.id !== "new" ? Number(params.id) : null;

  const existing = useQuery(
    orpc.dogs.get.queryOptions({ input: { id: id ?? 0 }, enabled: id !== null, retry: false }),
  );
  const { create, update } = useDogMutations();
  const [form, setForm] = useState<DogForm>(empty);
  const [error, setError] = useState("");

  useEffect(() => {
    const dog = existing.data;
    if (!dog) return;
    setForm({
      name: dog.name,
      nameEn: dog.nameEn,
      photo: dog.photo,
      sex: dog.sex,
      ageEl: dog.ageEl,
      ageEn: dog.ageEn,
      sizeEl: dog.sizeEl,
      sizeEn: dog.sizeEn,
      storyEl: dog.storyEl,
      storyEn: dog.storyEn,
      traitsEl: dog.traitsEl,
      traitsEn: dog.traitsEn,
      sterilized: dog.sterilized,
      vaccinated: dog.vaccinated,
      microchip: dog.microchip,
      petGovUrl: dog.petGovUrl,
      adopted: dog.adopted,
      adoptedAt: dog.adoptedAt ?? "",
      gallery: dog.gallery,
    });
  }, [existing.data]);

  const set =
    <K extends keyof DogForm>(key: K) =>
    (value: DogForm[K]) =>
      setForm((prev) => ({ ...prev, [key]: value }));

  const busy = create.isPending || update.isPending;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const required = [
      form.name,
      form.nameEn,
      form.photo,
      form.ageEl,
      form.ageEn,
      form.sizeEl,
      form.sizeEn,
      form.storyEl,
      form.storyEn,
    ];
    if (required.some((value) => value.trim().length === 0)) {
      setError(a.form.required);
      return;
    }
    const petGovUrl = form.petGovUrl.trim();
    if (petGovUrl && !isPetGovListingUrl(petGovUrl)) {
      setError(a.form.petGovInvalid);
      return;
    }
    const payload = { ...form, petGovUrl, adoptedAt: form.adopted ? form.adoptedAt || null : null };
    try {
      if (id === null) await create.mutateAsync(payload);
      else await update.mutateAsync({ ...payload, id });
      navigate("/admin/dogs");
    } catch (err) {
      setError(err instanceof Error ? err.message : a.common.error);
    }
  }

  const folder = form.nameEn || form.name || "dogs";

  return (
    <AdminShell title={id === null ? a.form.newTitle : a.form.editTitle}>
      {id !== null && existing.isPending ? (
        <p className="text-ink/60">{a.common.loading}</p>
      ) : (
        <form onSubmit={submit} className="space-y-6">
          <section className="comic-card space-y-5 bg-paper p-5">
            <div>
              <h2 className="mb-3 font-display text-lg font-bold">{a.form.cover}</h2>
              <CoverPhotoInput value={form.photo} folder={folder} onChange={set("photo")} />
            </div>
            <div>
              <h2 className="mb-3 font-display text-lg font-bold">{a.form.gallery}</h2>
              <GalleryInput value={form.gallery} folder={folder} onChange={set("gallery")} />
            </div>
          </section>

          <section className="comic-card grid gap-4 bg-paper p-5 sm:grid-cols-2">
            <Field label={a.form.nameEl} required>
              <TextInput value={form.name} onChange={(e) => set("name")(e.target.value)} />
            </Field>
            <Field label={a.form.nameEn} required>
              <TextInput value={form.nameEn} onChange={(e) => set("nameEn")(e.target.value)} />
            </Field>
            <Field label={a.form.sex} required>
              <Select
                value={form.sex}
                onChange={(e) => set("sex")(e.target.value as "male" | "female")}
              >
                <option value="male">{a.form.male}</option>
                <option value="female">{a.form.female}</option>
              </Select>
            </Field>
            <div />
            <Field label={a.form.ageEl} required>
              <TextInput value={form.ageEl} onChange={(e) => set("ageEl")(e.target.value)} />
            </Field>
            <Field label={a.form.ageEn} required>
              <TextInput value={form.ageEn} onChange={(e) => set("ageEn")(e.target.value)} />
            </Field>
            <Field label={a.form.sizeEl} required>
              <TextInput value={form.sizeEl} onChange={(e) => set("sizeEl")(e.target.value)} />
            </Field>
            <Field label={a.form.sizeEn} required>
              <TextInput value={form.sizeEn} onChange={(e) => set("sizeEn")(e.target.value)} />
            </Field>
            <Field label={a.form.traitsEl} hint={a.form.traitsHint}>
              <TextInput value={form.traitsEl} onChange={(e) => set("traitsEl")(e.target.value)} />
            </Field>
            <Field label={a.form.traitsEn} hint={a.form.traitsHint}>
              <TextInput value={form.traitsEn} onChange={(e) => set("traitsEn")(e.target.value)} />
            </Field>
            <Field label={a.form.storyEl} required className="sm:col-span-2">
              <TextArea
                value={form.storyEl}
                onChange={(e) => set("storyEl")(e.target.value)}
                rows={5}
              />
            </Field>
            <Field label={a.form.storyEn} required className="sm:col-span-2">
              <TextArea
                value={form.storyEn}
                onChange={(e) => set("storyEn")(e.target.value)}
                rows={5}
              />
            </Field>
          </section>

          <section className="comic-card bg-sky p-5">
            <Field label={a.form.petGovUrl} hint={a.form.petGovHint}>
              <TextInput
                type="url"
                value={form.petGovUrl}
                placeholder="https://pet.gov.gr/emzs-pet-adoption-gateway/details?id=…"
                onChange={(e) => set("petGovUrl")(e.target.value)}
              />
            </Field>
          </section>

          <section className="comic-card space-y-3 bg-paper p-5">
            <h2 className="font-display text-lg font-bold">{a.form.health}</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <CheckRow
                label={a.form.sterilized}
                checked={form.sterilized}
                onChange={set("sterilized")}
              />
              <CheckRow
                label={a.form.vaccinated}
                checked={form.vaccinated}
                onChange={set("vaccinated")}
              />
              <CheckRow
                label={a.form.microchip}
                checked={form.microchip}
                onChange={set("microchip")}
              />
            </div>
            <CheckRow label={a.form.adopted} checked={form.adopted} onChange={set("adopted")} />
            {form.adopted ? (
              <Field label={a.form.adoptedAt}>
                <TextInput
                  value={form.adoptedAt}
                  placeholder="2026-09"
                  onChange={(e) => set("adoptedAt")(e.target.value)}
                />
              </Field>
            ) : null}
          </section>

          {error ? (
            <p className="rounded-xl border-2 border-ink bg-pink px-3 py-2 text-sm">{error}</p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={busy}
              className="comic-btn bg-mint-deep px-5 py-2.5 disabled:opacity-60"
            >
              <Save className="size-4" /> {busy ? a.form.saving : a.form.save}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/dogs")}
              className="comic-btn bg-paper px-5 py-2.5"
            >
              <X className="size-4" /> {a.form.cancel}
            </button>
          </div>
        </form>
      )}
    </AdminShell>
  );
}

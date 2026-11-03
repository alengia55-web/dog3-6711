import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { uploadDogPhoto } from "../../lib/photo";
import { useAdminText } from "../../queries/admin";

/** Single cover photo: pick → crop to 1000x1250 → upload → keep the URL. */
export function CoverPhotoInput({
  value,
  folder,
  onChange,
}: {
  value: string;
  folder: string;
  onChange: (url: string) => void;
}) {
  const { a } = useAdminText();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function pick(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      onChange(await uploadDogPhoto(file, folder));
    } catch (err) {
      setError(err instanceof Error ? err.message : a.common.error);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div>
      <div className="flex items-start gap-4">
        <div className="relative h-40 w-32 shrink-0 overflow-hidden rounded-2xl border-2 border-ink bg-stone">
          {value ? (
            <img src={value} alt="" className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center text-ink/30">
              <ImagePlus className="size-8" />
            </div>
          )}
          {busy ? (
            <div className="absolute inset-0 flex items-center justify-center bg-paper/80">
              <Loader2 className="size-6 animate-spin" />
            </div>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => input.current?.click()}
            className="comic-btn bg-sky-deep px-4 py-2 text-sm disabled:opacity-60"
          >
            {busy ? a.form.uploading : a.form.choosePhoto}
          </button>
          {value ? (
            <button
              type="button"
              onClick={() => onChange("")}
              className="comic-btn bg-paper px-4 py-2 text-sm"
            >
              <Trash2 className="size-4" /> {a.form.removePhoto}
            </button>
          ) : null}
          {error ? <span className="text-xs text-pink-deep">{error}</span> : null}
        </div>
      </div>
      <input
        ref={input}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => void pick(e.target.files?.[0])}
      />
    </div>
  );
}

/** Extra photos shown in the dog's gallery, in the order they are added. */
export function GalleryInput({
  value,
  folder,
  onChange,
}: {
  value: string[];
  folder: string;
  onChange: (urls: string[]) => void;
}) {
  const { a } = useAdminText();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function add(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files).slice(0, 12 - value.length)) {
        uploaded.push(await uploadDogPhoto(file, folder));
      }
      onChange([...value, ...uploaded]);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {value.map((url, index) => (
          <div
            key={url}
            className="relative h-24 w-20 overflow-hidden rounded-xl border-2 border-ink bg-stone"
          >
            <img src={url} alt="" className="size-full object-cover" />
            <button
              type="button"
              aria-label={a.form.removePhoto}
              onClick={() => onChange(value.filter((_, i) => i !== index))}
              className="absolute right-1 top-1 rounded-full border-2 border-ink bg-paper p-1"
            >
              <Trash2 className="size-3" />
            </button>
          </div>
        ))}
        {value.length < 12 ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => input.current?.click()}
            className="flex h-24 w-20 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-ink/50 text-xs text-ink/60 disabled:opacity-60"
          >
            {busy ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <>
                <ImagePlus className="size-5" />
                {a.form.addPhoto}
              </>
            )}
          </button>
        ) : null}
      </div>
      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => void add(e.target.files)}
      />
    </div>
  );
}

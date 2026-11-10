import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ExternalLink, X } from "lucide-react";
import { useLocale } from "../hooks/use-locale";
import { DogDetails, type Dog } from "./dog-details";

export function DogPreview({ dog, onClose }: { dog: Dog; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const { locale } = useLocale();
  const name = locale === "el" ? dog.name : dog.nameEn;
  function close() {
    dialog.current?.close();
    onClose();
  }

  useEffect(() => {
    const element = dialog.current;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    element?.showModal();
    return () => {
      element?.close();
      document.body.style.overflow = overflow;
    };
  }, []);

  return createPortal(
    <dialog ref={dialog} aria-labelledby="dog-preview-title" className="dog-preview" onCancel={event => { event.preventDefault(); close(); }} onClick={event => {
      if (event.target === dialog.current) {
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
      }
    }}>
      <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b-2 border-ink bg-paper px-5 py-4">
        <h2 id="dog-preview-title" className="min-w-0 break-words text-2xl">{name}</h2>
        <button type="button" onClick={close} aria-label={locale === "el" ? "Κλείσιμο" : "Close"} className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-yellow hover:bg-yellow-deep"><X className="size-5" /></button>
      </header>
      <div className="p-5 text-[15px] sm:p-6">
        <DogDetails dog={dog} compact onNavigate={close} />
        <a href={`/dogs/${dog.slug}`} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4"><ExternalLink className="size-4" /> {locale === "el" ? "Άνοιγμα πλήρους προφίλ σε νέα καρτέλα" : "Open full profile in a new tab"}</a>
      </div>
    </dialog>, document.body,
  );
}
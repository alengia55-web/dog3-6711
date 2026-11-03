import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { dict, type Dict, type Locale } from "../lib/translations";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dict;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);
const STORAGE_KEY = "amores-perros-locale";

function initialLocale(): Locale {
  if (typeof window === "undefined") return "el";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "el" || stored === "en") return stored;
  return navigator.language?.toLowerCase().startsWith("el") ? "el" : "el";
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale: setLocaleState,
      t: dict[locale] as unknown as Dict,
    }),
    [locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside LocaleProvider");
  return ctx;
}

import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Heart, Instagram, Menu, X } from "lucide-react";
import { useLocale } from "../hooks/use-locale";
import { useContact } from "../hooks/use-contact";
import { ComicLink, PawTrail } from "./ui/comic";
import { cn } from "../lib/utils";

function LocaleToggle() {
  const { locale, setLocale } = useLocale();
  return (
    <div className="inline-flex overflow-hidden rounded-full border-2 border-ink">
      {(["el", "en"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          className={cn(
            "px-3 py-1 font-display text-xs font-bold uppercase",
            locale === code ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-stone",
          )}
        >
          {code}
        </button>
      ))}
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { t } = useLocale();
  const CONTACT = useContact();
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    setOpen(false);
    if (!window.location.hash) window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);

  const links = [
    { href: "/#dogs", label: t.nav.dogs },
    { href: "/adopt", label: t.nav.adopt },
    { href: "/volunteer", label: t.nav.volunteer },
    { href: "/#about", label: t.nav.about },
    { href: "/#contact", label: t.nav.contact },
  ];

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-50 border-b-2 border-ink bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-3 py-3 sm:gap-4 sm:px-4">
          <Link to="/" className="flex min-w-0 items-center gap-2.5 no-underline">
            <img
              src="/images/site/logo.png"
              alt="Amores Perros"
              className="wag size-9 shrink-0 sm:size-11 md:size-12"
            />
            <span className="leading-tight">
              <span className="block font-display text-sm font-bold sm:text-lg md:text-xl">
                Amores Perros
              </span>
              <span className="hidden text-[11px] text-ink/60 sm:block">{t.brandSub}</span>
            </span>
          </Link>

          <nav className="ml-auto hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3 py-2 font-display text-sm font-bold no-underline hover:bg-stone",
                  location === link.href && "bg-stone",
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <LocaleToggle />
            <ComicLink to="/donate" tone="yellow" size="sm" className="min-h-11 shrink-0 px-2 text-xs sm:px-4 sm:text-sm">
              <Heart className="hidden size-4 sm:block" /> {t.nav.donate}
            </ComicLink>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
              className="comic-btn bg-paper p-2 lg:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {open ? (
          <nav className="border-t-2 border-ink bg-pink px-4 py-3 lg:hidden">
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2 font-display font-bold no-underline"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/donate"
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2 font-display font-bold no-underline"
              >
                {t.nav.donate}
              </a>
            </div>
          </nav>
        ) : null}
      </header>

      <main>{children}</main>

      <footer id="contact" className="border-t-2 border-ink bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-3">
                <img src="/images/site/logo.png" alt="" className="size-12" />
                <span className="font-display text-2xl font-bold">Amores Perros</span>
              </div>
              <p className="mt-3 text-sm text-paper/70">{t.brandSub}</p>
              <p className="mt-4 text-sm text-paper/70">{t.footer.madeWith}</p>
            </div>

            <div>
              <h3 className="font-display text-lg">{t.contact.title}</h3>
              <ul className="mt-3 space-y-2 text-sm text-paper/80">
                <li>
                  {t.contact.phone}:{" "}
                  {CONTACT.phone ? (
                    <a href={`tel:${CONTACT.phone}`} className="text-yellow-deep">
                      {CONTACT.phone}
                    </a>
                  ) : (
                    <span className="text-paper/50">{t.contact.soon}</span>
                  )}
                </li>
                <li>
                  {t.contact.email}:{" "}
                  {CONTACT.email ? (
                    <a href={`mailto:${CONTACT.email}`} className="text-yellow-deep">
                      {CONTACT.email}
                    </a>
                  ) : (
                    <span className="text-paper/50">{t.contact.soon}</span>
                  )}
                </li>
                <li>
                  {t.contact.address}:{" "}
                  {CONTACT.address ? (
                    CONTACT.address
                  ) : (
                    <span className="text-paper/50">{t.contact.soon}</span>
                  )}
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-display text-lg">{t.contact.follow}</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                <ComicLink href={CONTACT.instagram} tone="pink" size="sm" external>
                  <Instagram className="size-4" /> Instagram
                </ComicLink>
                <ComicLink to="/adopt" tone="mint" size="sm">
                  {t.nav.adopt}
                </ComicLink>
                <ComicLink to="/volunteer" tone="sky" size="sm">
                  {t.nav.volunteer}
                </ComicLink>
              </div>
              <Link
                to="/admin"
                className="mt-6 inline-block text-xs text-paper/40 no-underline hover:text-paper/70"
              >
                {t.footer.staff}
              </Link>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center gap-4 border-t border-paper/20 pt-6 text-center text-xs text-paper/50">
            <PawTrail className="text-paper/20" />
            <span>
              © {new Date().getFullYear()} {t.footer.rights}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

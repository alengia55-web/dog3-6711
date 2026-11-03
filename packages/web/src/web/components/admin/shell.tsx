import type { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  ClipboardList,
  Dog,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Phone,
  Users,
} from "lucide-react";
import { signOutStaff } from "../../lib/auth";
import { useAdminText, useStaffSession } from "../../queries/admin";
import { useLocale } from "../../hooks/use-locale";
import { cn } from "../../lib/utils";

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
            "px-2.5 py-0.5 font-display text-[11px] font-bold uppercase",
            locale === code ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-stone",
          )}
        >
          {code}
        </button>
      ))}
    </div>
  );
}

/**
 * Back-office frame: signs the user out to the login page when the session is
 * gone, and draws the staff navigation around every admin page.
 */
export function AdminShell({
  children,
  title,
  adminOnly,
}: {
  children: ReactNode;
  title: string;
  adminOnly?: boolean;
}) {
  const { a } = useAdminText();
  const [location, navigate] = useLocation();
  const session = useStaffSession();

  if (session.isPending) {
    return <div className="p-10 text-center text-ink/60">{a.common.loading}</div>;
  }
  if (session.isError || !session.data) {
    if (location !== "/admin/login") navigate("/admin/login", { replace: true });
    return <div className="p-10 text-center text-ink/60">{a.common.loading}</div>;
  }

  const staff = session.data;
  const items = [
    { to: "/admin", label: a.nav.dashboard, icon: LayoutDashboard },
    { to: "/admin/dogs", label: a.nav.dogs, icon: Dog },
    { to: "/admin/applications", label: a.nav.applications, icon: ClipboardList },
    ...(staff.role === "admin"
      ? [
          { to: "/admin/settings", label: a.nav.settings, icon: Phone },
          { to: "/admin/staff", label: a.nav.staff, icon: Users },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-stone/40">
      <header className="border-b-2 border-ink bg-paper">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <Link to="/admin" className="flex items-center gap-2.5 no-underline">
            <img src="/images/site/logo.png" alt="" className="size-9" />
            <span className="font-display text-lg font-bold">{a.brand}</span>
          </Link>
          <span className="ml-auto hidden text-sm text-ink/60 sm:inline">
            {staff.name}
            {staff.role === "admin" ? ` · ${a.staff.admin}` : ""}
          </span>
          <LocaleToggle />
          <a
            href="/"
            className="comic-btn bg-paper px-3 py-1.5 text-xs no-underline"
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink className="size-3.5" /> {a.nav.site}
          </a>
          <button
            type="button"
            onClick={async () => {
              await signOutStaff();
              window.location.href = "/admin/login";
            }}
            className="comic-btn bg-pink-deep px-3 py-1.5 text-xs"
          >
            <LogOut className="size-3.5" /> {a.nav.signOut}
          </button>
        </div>
        <nav className="border-t-2 border-ink bg-yellow">
          <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2">
            {items.map((item) => {
              const active = location === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 font-display text-sm font-bold no-underline",
                    active ? "bg-ink text-paper" : "hover:bg-paper/70",
                  )}
                >
                  <item.icon className="size-4" /> {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-6 text-[clamp(1.75rem,3vw,2.5rem)]">{title}</h1>
        {adminOnly && staff.role !== "admin" ? (
          <p className="comic-card bg-paper p-5 text-ink/70">{a.staff.adminOnly}</p>
        ) : (
          children
        )}
      </main>
    </div>
  );
}

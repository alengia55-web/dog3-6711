import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "wouter";
import { cn } from "../../lib/utils";

type Tone = "pink" | "yellow" | "mint" | "sky" | "ink" | "white";

const toneBg: Record<Tone, string> = {
  pink: "bg-pink-deep text-ink",
  yellow: "bg-yellow-deep text-ink",
  mint: "bg-mint-deep text-ink",
  sky: "bg-sky-deep text-ink",
  ink: "bg-ink text-paper",
  white: "bg-paper text-ink",
};

const sizes = {
  sm: "px-4 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-7 py-3.5 text-lg",
};

interface ComicButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: Tone;
  size?: keyof typeof sizes;
}

export function ComicButton({
  tone = "pink",
  size = "md",
  className,
  children,
  ...props
}: ComicButtonProps) {
  return (
    <button
      className={cn(
        "comic-btn inline-flex items-center justify-center gap-2",
        toneBg[tone],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

interface ComicLinkProps {
  to?: string;
  href?: string;
  tone?: Tone;
  size?: keyof typeof sizes;
  className?: string;
  children: ReactNode;
  external?: boolean;
}

export function ComicLink({
  to,
  href,
  tone = "pink",
  size = "md",
  className,
  children,
  external,
}: ComicLinkProps) {
  const classes = cn(
    "comic-btn inline-flex items-center justify-center gap-2 no-underline",
    toneBg[tone],
    sizes[size],
    className,
  );
  // Donation CTAs use a normal URL: reliable on repeated taps, direct refresh,
  // and when navigating from an in-page anchor far down the homepage.
  if (to && to !== "/donate") {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={to ?? href}
      className={classes}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

export function Sticker({
  children,
  tone = "yellow",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border-2 border-ink px-3 py-1 font-display text-xs font-bold",
        toneBg[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  text,
  className,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow ? (
        <div className="mb-3">
          <Sticker tone="white">{eyebrow}</Sticker>
        </div>
      ) : null}
      <h2 className="text-[clamp(2rem,4vw,3rem)]">{title}</h2>
      {text ? <p className="mt-4 text-lg text-ink/80">{text}</p> : null}
    </div>
  );
}

/** Wavy top edge used between white and pastel bands. */
export function Wave({ className, flip }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 1440 60"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn("block h-[34px] w-full", flip && "rotate-180", className)}
    >
      <path
        d="M0,30 C120,60 240,0 360,30 C480,60 600,0 720,30 C840,60 960,0 1080,30 C1200,60 1320,0 1440,30 L1440,60 L0,60 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PawTrail({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 text-ink/25", className)} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ transform: `rotate(${i % 2 ? 14 : -14}deg) translateY(${i % 2 ? 6 : 0}px)` }}
        >
          <ellipse cx="12" cy="16" rx="5.5" ry="4.5" />
          <circle cx="5.5" cy="9.5" r="2.4" />
          <circle cx="10" cy="6.5" r="2.4" />
          <circle cx="14.6" cy="6.5" r="2.4" />
          <circle cx="18.8" cy="9.5" r="2.4" />
        </svg>
      ))}
    </div>
  );
}

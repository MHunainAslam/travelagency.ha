import type { SVGProps } from "react";
import { siteConfig } from "@/data/site";
import { cn, hashString, seededRandom } from "@/lib/utils";

export function Logo({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-display text-[26px] leading-none font-extrabold tracking-[-0.04em]",
        tone === "light" ? "text-white" : "text-ink-900",
        className,
      )}
    >
      <span className="grid size-8 -rotate-12 place-items-center rounded-full bg-brand-500 text-white" aria-hidden>
        <svg viewBox="0 0 24 24" className="size-4.5" fill="currentColor">
          <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5Z" />
        </svg>
      </span>
      <span>
        {siteConfig.name}
        <span className="text-brand-500">.</span>
      </span>
    </span>
  );
}

/** Decorative barcode, generated deterministically from `value`. Size it with `className` (e.g. "h-10 w-full"). */
export function Barcode({ value, className }: { value: string; className?: string }) {
  const random = seededRandom(hashString(value));
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  while (x < 200) {
    const w = 1 + Math.floor(random() * 4);
    if (random() > 0.35) bars.push({ x, w });
    x += w + 1 + Math.floor(random() * 2);
  }
  return (
    <svg viewBox="0 0 200 48" preserveAspectRatio="none" className={cn("block", className)} aria-hidden>
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y="0" width={b.w} height="48" fill="currentColor" />
      ))}
    </svg>
  );
}

/** Passport-style ink stamp. */
export function Stamp({
  top,
  main,
  bottom,
  color = "brand",
  className,
}: {
  top: string;
  main: string;
  bottom: string;
  color?: "brand" | "coral" | "mint";
  className?: string;
}) {
  const tone = { brand: "text-brand-500", coral: "text-coral-500", mint: "text-mint-500" }[color];
  return (
    <div
      className={cn(
        "grid size-28 place-items-center rounded-full border-[3px] border-current p-1.5 font-mono uppercase sm:size-40 sm:p-2",
        tone,
        className,
      )}
    >
      <div className="grid size-full place-items-center rounded-full border border-dashed border-current text-center">
        <div>
          <p className="text-[7px] tracking-[0.18em] sm:text-[10px] sm:tracking-[0.2em]">{top}</p>
          <p className="my-0.5 font-display text-base leading-none font-extrabold tracking-tight normal-case sm:my-1 sm:text-2xl">{main}</p>
          <p className="text-[7px] tracking-[0.18em] sm:text-[10px] sm:tracking-[0.2em]">{bottom}</p>
        </div>
      </div>
    </div>
  );
}

/* Brand icons (not shipped by lucide). */
type IconProps = SVGProps<SVGSVGElement>;

export const InstagramIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const FacebookIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.9v3h2.6V21h3Z" />
  </svg>
);

export const XIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z" />
  </svg>
);

export const LinkedInIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M6.9 8.8H3.5V20h3.4V8.8ZM5.2 3.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM20.5 13.6c0-3-1.6-5.1-4.4-5.1-1.5 0-2.6.8-3 1.6V8.8H9.8V20h3.4v-5.6c0-1.5.3-2.9 2.1-2.9 1.8 0 1.8 1.7 1.8 3V20h3.4v-6.4Z" />
  </svg>
);

export const socialLinks = [
  { label: "Instagram", href: "#", Icon: InstagramIcon },
  { label: "Facebook", href: "#", Icon: FacebookIcon },
  { label: "X (Twitter)", href: "#", Icon: XIcon },
  { label: "LinkedIn", href: "#", Icon: LinkedInIcon },
];

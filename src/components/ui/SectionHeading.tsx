"use client";

import { useRef, type ReactNode } from "react";
import { MOTION_OK, SplitText, gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** Gate number shown in the label, e.g. "01". */
  index: string;
  label: string;
  title: ReactNode;
  description?: ReactNode;
  tone?: "dark" | "light";
  align?: "left" | "center";
  className?: string;
}

/**
 * Word wrapped in a yellow marker that sweeps in with the heading.
 * `box` fills the whole word (use it on dark or coloured backgrounds).
 */
export function Highlight({ children, variant = "marker" }: { children: ReactNode; variant?: "marker" | "box" }) {
  return (
    <span className={cn("relative inline-block whitespace-nowrap", variant === "box" && "px-[0.08em] text-ink-950")}>
      <span
        data-marker
        aria-hidden
        className={cn(
          "absolute -z-10 origin-left -skew-x-6 rounded-sm bg-signal-400",
          variant === "box" ? "inset-x-0 top-[0.1em] bottom-[0.02em]" : "inset-x-[-0.08em] bottom-[0.06em] h-[0.42em]",
        )}
      />
      {children}
    </span>
  );
}

/** Gate-style label chip, a big grotesk title whose lines rise in, and an optional intro. */
export function SectionHeading({
  index,
  label,
  title,
  description,
  tone = "dark",
  align = "left",
  className,
}: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.set(ref.current, { visibility: "visible" });
        const split = SplitText.create(titleRef.current, { type: "lines", mask: "lines" });
        const tl = gsap
          .timeline({ scrollTrigger: { trigger: ref.current, start: "top 85%", once: true } })
          .from("[data-chip]", { y: 12, autoAlpha: 0, duration: 0.4 })
          .from(split.lines, { yPercent: 100, duration: 0.8, stagger: 0.08, ease: "power4.out" }, "-=0.2");
        if (ref.current?.querySelector("[data-marker]")) {
          tl.from("[data-marker]", { scaleX: 0, duration: 0.6, ease: "power3.inOut" }, "-=0.4");
        }
        if (ref.current?.querySelector("[data-description]")) {
          tl.from("[data-description]", { autoAlpha: 0, y: 10, duration: 0.6 }, "-=0.5");
        }
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const light = tone === "light";

  return (
    <div ref={ref} data-anim className={cn(align === "center" && "mx-auto text-center", "max-w-3xl", className)}>
      <p
        data-chip
        className={cn(
          "inline-flex items-center gap-2 font-mono text-xs tracking-[0.18em] uppercase",
          light ? "text-white/70" : "text-ink-700",
        )}
      >
        <span className="rounded-md bg-ink-900 px-2 py-1 text-signal-400 ring-1 ring-white/10">Gate {index}</span>
        {label}
      </p>
      <h2
        ref={titleRef}
        className={cn(
          "isolate mt-5 font-display text-[40px] leading-[1.02] font-extrabold tracking-[-0.035em] text-balance sm:text-6xl lg:text-7xl",
          light ? "text-white" : "text-ink-900",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          data-description
          className={cn(
            "mt-5 max-w-xl text-base leading-relaxed sm:text-lg",
            align === "center" && "mx-auto",
            light ? "text-white/70" : "text-ink-700",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

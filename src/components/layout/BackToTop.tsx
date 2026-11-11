"use client";

import { useRef } from "react";
import { ArrowUp } from "lucide-react";
import { ScrollTrigger, gsap, scrollToTarget, useGSAP } from "@/lib/gsap";

const RADIUS = 25;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Floating "back to top" button. Appears after the first screen, shows scroll
 * progress as a ring, and glides back to the top with GSAP when clicked.
 */
export function BackToTop() {
  const ref = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const show = gsap.to(el, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: reduce ? 0 : 0.4,
        ease: "back.out(2)",
        paused: true,
      });

      ScrollTrigger.create({
        start: 600,
        end: "max",
        onToggle: (self) => (self.isActive ? show.play() : show.reverse()),
      });

      // Progress ring fills as the page scrolls.
      gsap.fromTo(
        "[data-ring]",
        { strokeDashoffset: CIRCUMFERENCE },
        { strokeDashoffset: 0, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } },
      );
    },
    { scope: ref },
  );

  const onClick = () => {
    gsap.fromTo("[data-arrow-up]", { y: 0 }, { y: -6, duration: 0.15, yoyo: true, repeat: 1, ease: "power1.out" });
    scrollToTarget("#top");
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-label="Back to top"
      style={{ transform: "translateY(16px) scale(0.8)" }}
      className="group invisible fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 grid size-14 cursor-pointer place-items-center rounded-full bg-ink-900 text-white opacity-0 shadow-lift transition-colors hover:bg-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 sm:right-6 sm:bottom-6"
    >
      <svg viewBox="0 0 56 56" className="absolute inset-0 size-full -rotate-90" aria-hidden>
        <circle cx="28" cy="28" r={RADIUS} fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="2.5" />
        <circle
          data-ring
          cx="28"
          cy="28"
          r={RADIUS}
          fill="none"
          stroke="#ffd23f"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
        />
      </svg>
      <ArrowUp
        data-arrow-up
        className="size-5 transition-transform duration-200 group-hover:-translate-y-0.5"
        aria-hidden
      />
    </button>
  );
}

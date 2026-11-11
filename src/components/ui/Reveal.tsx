"use client";

import { useRef, type ReactNode } from "react";
import { MOTION_OK, gsap, useGSAP } from "@/lib/gsap";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Animate matching descendants in sequence instead of the wrapper itself. */
  stagger?: string;
  y?: number;
  delay?: number;
  /** ScrollTrigger start position. */
  start?: string;
}

/** Fades and slides content in once it scrolls into view. */
export function Reveal({ children, className, stagger, y = 24, delay = 0, start = "top 85%" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const targets = stagger ? gsap.utils.toArray<HTMLElement>(stagger, el) : [el];
      if (!targets.length) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Wrapper is hidden by CSS ([data-anim]) until now; children start at opacity 0.
        if (stagger) gsap.set(el, { visibility: "visible" });
        gsap.from(targets, {
          y,
          autoAlpha: 0,
          duration: 0.8,
          delay,
          stagger: 0.08,
          scrollTrigger: { trigger: el, start, once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} data-anim className={className}>
      {children}
    </div>
  );
}

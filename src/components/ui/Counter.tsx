"use client";

import { useRef } from "react";
import { MOTION_OK, gsap, useGSAP } from "@/lib/gsap";

interface CounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}

/** Counts up from zero the first time it scrolls into view. */
export function Counter({ value, prefix = "", suffix = "", decimals = 0, duration = 2.2, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  const format = (n: number) =>
    `${prefix}${n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const counter = { n: 0 };
        el.textContent = format(0);
        gsap.to(counter, {
          n: value,
          duration,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => {
            el.textContent = format(counter.n);
          },
        });
        return () => {
          el.textContent = format(value);
        };
      });
      return () => mm.revert();
    },
    { dependencies: [value] },
  );

  // Server-rendered with the final value so it's correct without JS / reduced motion.
  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}

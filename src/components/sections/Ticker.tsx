"use client";

import { useRef } from "react";
import { Plane } from "lucide-react";
import { tickerRoutes } from "@/data/content";
import { MOTION_OK, gsap, useGSAP } from "@/lib/gsap";

/** Slanted yellow band with routes and fares scrolling past, like an airport info screen. */
export function Ticker() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const loop = gsap.to("[data-track]", { xPercent: -50, duration: 30, ease: "none", repeat: -1 });
        // Scrolling the page nudges the ticker faster for a moment.
        let settle: gsap.core.Tween | undefined;
        const onScroll = () => {
          settle?.kill();
          loop.timeScale(3);
          settle = gsap.to(loop, { timeScale: 1, duration: 1.2, ease: "power2.out" });
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const items = [...tickerRoutes, ...tickerRoutes];

  return (
    <div ref={ref} className="relative z-10 overflow-hidden py-6">
      <div className="-mx-[5%] -rotate-[1.5deg] overflow-hidden bg-signal-400 py-3.5 text-ink-950 shadow-soft">
      <p className="sr-only">Sample fares: {tickerRoutes.join(", ")}</p>
      <div data-track className="flex w-max gap-10 pr-10 font-mono text-sm font-semibold tracking-[0.12em] uppercase" aria-hidden>
        {items.map((route, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap">
            {route}
            <Plane className="size-4" />
          </span>
        ))}
      </div>
      </div>
    </div>
  );
}

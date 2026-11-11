"use client";

import { useRef } from "react";
import { stats, whyUs } from "@/data/content";
import { MOTION_OK, gsap, useGSAP } from "@/lib/gsap";
import { Container } from "@/components/ui/Container";
import { Counter } from "@/components/ui/Counter";
import { Stamp } from "@/components/ui/Misc";
import { Highlight, SectionHeading } from "@/components/ui/SectionHeading";

const STAMPS = [
  { top: "Approved", main: "1 person", bottom: "Start to finish", color: "brand" as const, tilt: -8 },
  { top: "24 / 7", main: "Real humans", bottom: "Weekends too", color: "coral" as const, tilt: 6 },
  { top: "Guaranteed", main: "Price match", bottom: "Within 24 h", color: "mint" as const, tilt: -4 },
];

export function WhyUs() {
  const ref = useRef<HTMLElement>(null);

  // Stamps thump down onto the page one after another, like at passport control.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.set("[data-stamps]", { visibility: "visible" });
        gsap.from("[data-stamp]", {
          scale: 1.9,
          autoAlpha: 0,
          rotation: (i: number) => STAMPS[i].tilt - 18,
          duration: 0.5,
          ease: "power4.in",
          stagger: 0.28,
          scrollTrigger: { trigger: "[data-stamps]", start: "top 75%", once: true },
          onComplete: () => {
            gsap.fromTo("[data-stamps]", { x: -3 }, { x: 0, duration: 0.3, ease: "elastic.out(1, 0.3)" });
          },
        });
        gsap.from("[data-stat]", {
          y: 30,
          autoAlpha: 0,
          stagger: 0.1,
          duration: 0.7,
          scrollTrigger: { trigger: "[data-stats]", start: "top 85%", once: true },
        });
        gsap.set("[data-stats]", { visibility: "visible" });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="why-us" className="relative scroll-mt-20 overflow-hidden bg-paper-100 py-24 sm:py-32">
      <Container>
        <SectionHeading
          index="02"
          label="Why HA Travel"
          title={
            <>
              Stamped, checked <Highlight>&amp; approved.</Highlight>
            </>
          }
          description="We've been doing the boring parts since 2012. Three promises we put in writing:"
        />

        <div data-stamps data-anim className="mt-14 grid gap-10 md:grid-cols-3">
          {whyUs.map((item, i) => (
            <div key={item.title} className="flex flex-row items-center gap-5 sm:gap-6 md:flex-col md:items-start">
              <div data-stamp className="shrink-0" style={{ rotate: `${STAMPS[i].tilt}deg` }}>
                <Stamp top={STAMPS[i].top} main={STAMPS[i].main} bottom={STAMPS[i].bottom} color={STAMPS[i].color} />
              </div>
              <div>
                <h3 className="font-display text-xl font-extrabold tracking-[-0.02em] sm:text-2xl">{item.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-700">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats on a cobalt "flight info" strip */}
        <div
          data-stats
          data-anim
          className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-[28px] bg-brand-400 shadow-lift lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <div data-stat key={stat.label} className="bg-brand-500 p-5 text-white sm:p-8">
              <Counter
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                decimals={stat.decimals}
                className="block font-display text-[34px] leading-none font-extrabold tracking-[-0.04em] tabular-nums sm:text-6xl"
              />
              <p className="mt-2 font-mono text-[11px] tracking-[0.16em] text-white/75 uppercase">{stat.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

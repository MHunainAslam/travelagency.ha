"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { testimonials } from "@/data/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Highlight, SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 7000;
const POSTMARKS = ["JTR", "HND", "DPS", "ZRH", "LHR"];

export function Testimonials() {
  const scope = useRef<HTMLDivElement>(null);
  // Previous slide: skip the transition on mount (and on React Strict Mode's re-run).
  const prevIndex = useRef<number | null>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((dir: number) => {
    setIndex((i) => (i + dir + testimonials.length) % testimonials.length);
  }, []);

  // Autoplay, paused on hover / focus.
  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => go(1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, go, index]);

  // The postcard flips over to reveal the next message.
  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const slides = gsap.utils.toArray<HTMLElement>("[data-slide]");
      const prev = prevIndex.current;
      prevIndex.current = index;
      const show = () => slides.forEach((s) => gsap.set(s, { autoAlpha: Number(s.dataset.i) === index ? 1 : 0 }));

      if (prev === null || prev === index || reduce) {
        show();
        return;
      }
      gsap
        .timeline()
        .to("[data-card]", { rotationY: 90, duration: 0.3, ease: "power2.in", overwrite: true })
        .add(show)
        .fromTo("[data-card]", { rotationY: -90 }, { rotationY: 0, duration: 0.55, ease: "back.out(1.4)" })
        .fromTo(
          `[data-slide][data-i="${index}"] [data-postmark]`,
          { scale: 1.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.35, ease: "power4.in" },
          "-=0.2",
        );
    },
    { scope, dependencies: [index] },
  );

  return (
    <section id="testimonials" className="scroll-mt-20 overflow-hidden bg-brand-500 py-24 text-white sm:py-32">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <SectionHeading
              index="04"
              label="Postcards home"
              tone="light"
              title={
                <>
                  Wish you were <Highlight variant="box">here.</Highlight>
                </>
              }
              description="4.9 on Google from 1,240 reviews. We read every one, including the grumpy ones."
            />
            <div className="mt-8 flex items-center gap-3">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous review"
                className="grid size-12 cursor-pointer place-items-center rounded-full border-2 border-white/40 transition-colors hover:border-white hover:bg-white hover:text-brand-600"
              >
                <ArrowLeft className="size-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next review"
                className="grid size-12 cursor-pointer place-items-center rounded-full bg-signal-400 text-ink-950 transition-colors hover:bg-signal-300"
              >
                <ArrowRight className="size-5" aria-hidden />
              </button>
              <span className="ml-2 font-mono text-sm tabular-nums text-white/70">
                {String(index + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          <Reveal className="lg:col-span-7">
            <div
              ref={scope}
              className="[perspective:1400px]"
              onPointerEnter={() => setPaused(true)}
              onPointerLeave={() => setPaused(false)}
              onFocus={() => setPaused(true)}
              onBlur={() => setPaused(false)}
              role="region"
              aria-roledescription="carousel"
              aria-label="Customer reviews"
            >
              <div
                data-card
                className="relative grid rotate-[1.5deg] rounded-[26px] bg-paper-50 p-6 text-ink-900 shadow-lift sm:p-10 md:grid-cols-[1fr_auto_13rem] md:gap-8"
              >
                {/* Message side */}
                <div className="grid">
                  {testimonials.map((item, i) => (
                    <blockquote
                      key={item.id}
                      data-slide
                      data-i={i}
                      aria-hidden={i !== index}
                      className={cn("[grid-area:1/1]", i !== 0 && "invisible")}
                    >
                      <p className="font-display text-2xl leading-snug font-bold tracking-[-0.02em] sm:text-[28px]">
                        “{item.quote}”
                      </p>
                    </blockquote>
                  ))}
                </div>

                <div className="my-6 border-t-2 border-dashed border-ink-900/15 md:my-0 md:border-t-0 md:border-l-2" aria-hidden />

                {/* Address side: one stacked block per review so text never swaps mid-flip. */}
                <div className="grid">
                  {testimonials.map((item, i) => (
                    <div
                      key={item.id}
                      data-slide
                      data-i={i}
                      aria-hidden={i !== index}
                      className={cn("relative flex flex-col [grid-area:1/1]", i !== 0 && "invisible")}
                    >
                      <span
                        data-postmark
                        className="absolute -top-2 right-0 grid size-20 rotate-12 place-items-center rounded-full border-2 border-dashed border-coral-500 font-mono text-xs font-semibold text-coral-500"
                        aria-hidden
                      >
                        {POSTMARKS[i % POSTMARKS.length]}
                      </span>
                      <div className="mt-20 space-y-3 font-mono text-[13px] md:mt-24">
                        <p className="border-b border-ink-900/15 pb-1 font-semibold">{item.name}</p>
                        <p className="border-b border-ink-900/15 pb-1 text-ink-700">{item.role}</p>
                        <p className="border-b border-ink-900/15 pb-1 text-ink-700">{item.location}</p>
                      </div>
                      <p className="mt-4 text-xs leading-relaxed text-ink-700">
                        {item.trip}
                        {item.rating < 5 && ` · rated ${item.rating}/5`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

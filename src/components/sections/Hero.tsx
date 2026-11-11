"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, Plane, Stamp as StampIcon } from "lucide-react";
import { departures } from "@/data/content";
import { useSearch } from "@/context/SearchContext";
import { useClock } from "@/hooks/useClock";
import { MOTION_OK, SplitText, gsap, useGSAP } from "@/lib/gsap";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Highlight } from "@/components/ui/SectionHeading";
import { SplitFlap } from "@/components/ui/SplitFlap";
import { cn, formatPrice } from "@/lib/utils";

/** Seconds each departure stays on the board before the next one flips in. */
const CYCLE_SECONDS = 5;

const STATUS_STYLE: Record<string, string> = {
  Boarding: "text-signal-400",
  "Final call": "text-coral-500",
  "Gate open": "text-mint-500",
  "On time": "text-white/60",
};

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { openSearch } = useSearch();
  const clock = useClock();
  const [index, setIndex] = useState(0);
  // Previous departure: skip the transition on mount (and on React Strict Mode's re-run).
  const prevIndex = useRef<number | null>(null);
  // The board's progress-line tween also drives autoplay (onComplete flips to the next row).
  const cycle = useRef<gsap.core.Tween | null>(null);
  const hovering = useRef(false);

  const dep = departures[index];

  // Intro sequence + ambient loops (plane orbit, swinging luggage tag).
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create("[data-hero-title]", { type: "lines", mask: "lines" });
        gsap.set("[data-hero-title]", { visibility: "visible" });

        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .from(split.lines, { yPercent: 110, duration: 1, stagger: 0.1 }, 0.1)
          .from("[data-marker]", { scaleX: 0, duration: 0.7, ease: "power3.inOut" }, 0.75)
          .from("[data-hero-fade]", { y: 16, autoAlpha: 0, duration: 0.7, stagger: 0.08 }, 0.45)
          .from("[data-window]", { y: 70, rotation: 8, autoAlpha: 0, duration: 1.3, ease: "back.out(1.3)" }, 0.35)
          .from("[data-tag]", { y: -40, rotation: -40, autoAlpha: 0, duration: 1, ease: "back.out(2)" }, 1.0)
          .from("[data-orbit]", { autoAlpha: 0, duration: 0.8 }, 1.1)
          .from("[data-board]", { y: 60, autoAlpha: 0, duration: 1 }, 0.7)
          .from("[data-board-row]", { x: -24, autoAlpha: 0, stagger: 0.06, duration: 0.5 }, 1.1);

        // Little plane circling the window on a dashed flight path.
        gsap.to("[data-plane]", {
          motionPath: { path: "#hero-orbit", align: "#hero-orbit", alignOrigin: [0.5, 0.5], autoRotate: 90 },
          duration: 12,
          ease: "none",
          repeat: -1,
        });

        // Luggage tag swings gently on its strap.
        gsap.to("[data-tag-swing]", {
          rotation: 7,
          duration: 2.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          transformOrigin: "50% 0%",
        });

        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  // Departure change: the window blind drops, the photo swaps, the blind lifts.
  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const photos = gsap.utils.toArray<HTMLElement>("[data-window-img]");
      const prev = prevIndex.current;
      prevIndex.current = index;
      const show = () => photos.forEach((p, i) => gsap.set(p, { autoAlpha: i === index ? 1 : 0 }));

      if (prev === null || prev === index || reduce) {
        show();
      } else {
        gsap
          .timeline()
          .to("[data-shade]", { yPercent: 100, duration: 0.4, ease: "power2.in", overwrite: true })
          .add(show)
          .fromTo(photos[index], { scale: 1.18 }, { scale: 1, duration: 1.6, ease: "power2.out" })
          .to("[data-shade]", { yPercent: 0, duration: 0.6, ease: "power3.out" }, "<0.05");
      }

      if (reduce) return;
      cycle.current?.kill();
      cycle.current = gsap.fromTo(
        "[data-cycle]",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: CYCLE_SECONDS,
          ease: "none",
          onComplete: () => setIndex((i) => (i + 1) % departures.length),
        },
      );
      if (hovering.current) cycle.current.pause();
    },
    { scope: ref, dependencies: [index] },
  );

  const pause = () => {
    hovering.current = true;
    cycle.current?.pause();
  };
  const resume = () => {
    hovering.current = false;
    cycle.current?.resume();
  };

  return (
    <section ref={ref} id="top" className="relative overflow-hidden pt-28 pb-20 sm:pt-32 lg:pt-36">
      <div aria-hidden className="bg-dots absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,#000,transparent_85%)]" />

      <Container>
        <div className="grid items-center gap-12 md:grid-cols-12 md:gap-6 lg:gap-8">
          {/* Copy */}
          <div className="md:col-span-7">
            <p
              data-hero-fade
              data-anim
              className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 font-mono text-[11px] tracking-[0.14em] text-ink-800 uppercase ring-1 ring-ink-900/10"
            >
              <span className="blink size-2 rounded-full bg-mint-500" aria-hidden />
              Now boarding · {departures.length} trips this week
            </p>

            <h1
              data-hero-title
              data-anim
              className="isolate mt-6 font-display text-[50px] leading-[0.92] font-extrabold tracking-[-0.045em] text-ink-900 sm:text-[76px] md:text-[64px] lg:text-[100px]"
            >
              Your next trip, <Highlight>sorted.</Highlight>
            </h1>

            <p data-hero-fade data-anim className="mt-6 max-w-lg text-lg leading-relaxed text-ink-700">
              Visas, flights, hotels and rental cars, handled by one small team. You pick the place. We do the queues,
              the forms and the fine print.
            </p>

            <div data-hero-fade data-anim className="mt-8 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
              <Button href="#search" size="lg" className="px-4 sm:px-7">
                Plan a trip <ArrowRight className="size-4.5" aria-hidden />
              </Button>
              <Button type="button" variant="outline" size="lg" className="px-4 sm:px-7" onClick={() => openSearch("visa")}>
                <StampIcon className="hidden size-4.5 sm:block" aria-hidden /> Check a visa
              </Button>
            </div>

            <p
              data-hero-fade
              data-anim
              className="mt-8 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] tracking-[0.14em] text-ink-700 uppercase"
            >
              <span>★ 4.9 on Google</span>
              <span>48,000 travellers</span>
              <span>IATA accredited</span>
            </p>
          </div>

          {/* Airplane window */}
          <div className="relative mx-auto md:col-span-5">
            <svg
              data-orbit
              data-anim
              viewBox="0 0 500 560"
              className="pointer-events-none absolute top-1/2 left-1/2 -z-10 w-[150%] -translate-x-1/2 -translate-y-1/2 text-brand-500"
              aria-hidden
            >
              <path
                id="hero-orbit"
                d="M250 30 C 430 30, 480 160, 480 280 C 480 420, 400 530, 250 530 C 100 530, 20 420, 20 280 C 20 160, 70 30, 250 30 Z"
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.35"
                strokeWidth="2"
                strokeDasharray="2 10"
                strokeLinecap="round"
              />
              <g data-plane>
                <circle r="16" fill="#2f4bff" />
                <path
                  transform="translate(-9 -9) scale(0.75)"
                  fill="#fff"
                  d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5Z"
                />
              </g>
            </svg>

            <div
              data-window
              data-anim
              className="relative w-[13.5rem] rounded-[44%] bg-gradient-to-b from-white to-paper-100 p-3 shadow-lift ring-1 ring-ink-900/5 sm:w-[17rem] sm:p-4 lg:w-[19rem]"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-[42%] bg-ink-800 shadow-[inset_0_6px_18px_rgb(0_0_0/0.45)]">
                {departures.map((d, i) => (
                  <div
                    key={d.id}
                    data-window-img
                    className={cn("absolute inset-0", i !== 0 && "invisible")}
                    aria-hidden={i !== index}
                  >
                    <Image
                      src={d.image}
                      alt={d.alt}
                      fill
                      priority={i === 0}
                      sizes="(min-width: 1024px) 19rem, (min-width: 640px) 17rem, 13.5rem"
                      className="object-cover"
                    />
                  </div>
                ))}
                {/* Window blind: sits above the frame and slides down between trips. */}
                <div
                  data-shade
                  aria-hidden
                  className="absolute inset-x-0 bottom-full z-10 h-full bg-[repeating-linear-gradient(to_bottom,#e9e6dc_0_10px,#dcd8cb_10px_11px)]"
                >
                  <span className="absolute bottom-2 left-1/2 h-1.5 w-12 -translate-x-1/2 rounded-full bg-ink-900/25" />
                </div>
                {/* Glass reflection */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(135deg,rgb(255_255_255/0.28)_0%,transparent_35%)]"
                />
              </div>
            </div>

            {/* Luggage tag */}
            <div data-tag data-anim className="absolute -top-5 -right-12 sm:-right-14">
              <div data-tag-swing className="rotate-6">
                <div className="relative w-32 rounded-xl bg-signal-400 p-3 pt-6 text-ink-950 shadow-soft sm:w-36">
                  <span className="absolute top-2 left-1/2 size-2.5 -translate-x-1/2 rounded-full bg-paper-50 ring-2 ring-ink-950/20" />
                  <p className="font-mono text-[10px] tracking-[0.18em] uppercase">Destination</p>
                  <p className="font-display text-3xl leading-none font-extrabold tracking-tight sm:text-4xl">{dep.code}</p>
                  <p className="mt-1 text-xs font-medium">
                    {dep.city} · from {formatPrice(dep.fare)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Departures board */}
        <div
          data-board
          data-anim
          onPointerEnter={pause}
          onPointerLeave={resume}
          onFocus={pause}
          onBlur={resume}
          className="mt-16 rounded-[28px] bg-ink-950 p-4 text-white shadow-lift ring-1 ring-white/5 sm:p-7 lg:mt-20"
        >
          <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.18em] text-white/60 uppercase">
            <span className="flex items-center gap-2 text-signal-400">
              <Plane className="size-4" aria-hidden /> Departures
            </span>
            <span>
              Local <span className="text-white tabular-nums">{clock}</span>
            </span>
          </div>

          <div className="mt-5 flex flex-wrap items-end gap-x-5 gap-y-3">
            <SplitFlap
              text={dep.city}
              length={10}
              label={`${dep.city}, ${dep.country}`}
              className="gap-[3px] sm:gap-1.5"
              tileClassName="h-10 w-[1.6rem] text-xl sm:h-16 sm:w-11 sm:text-4xl lg:h-20 lg:w-14 lg:text-5xl"
            />
            <SplitFlap
              text={dep.code}
              length={3}
              label={dep.code}
              delay={0.3}
              className="gap-[3px] sm:gap-1.5"
              tileClassName="h-10 w-[1.6rem] text-xl text-white sm:h-16 sm:w-11 sm:text-4xl lg:h-20 lg:w-14 lg:text-5xl"
            />
            <div className="ml-auto text-right">
              <p className="font-mono text-[11px] tracking-[0.18em] text-white/50 uppercase">Return from</p>
              <p className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{formatPrice(dep.fare)}</p>
            </div>
          </div>

          <div className="mt-5 h-0.5 overflow-hidden rounded-full bg-white/10" aria-hidden>
            <div data-cycle className="h-full origin-left bg-signal-400" style={{ transform: "scaleX(0)" }} />
          </div>

          <div className="mt-4 font-mono text-[13px]" role="listbox" aria-label="Departures">
            <div className="hidden grid-cols-[5rem_1fr_6rem_4rem_8rem] px-3 pb-2 text-[10px] tracking-[0.18em] text-white/40 uppercase sm:grid">
              <span>Time</span>
              <span>Destination</span>
              <span>Flight</span>
              <span>Gate</span>
              <span>Status</span>
            </div>
            {departures.map((d, i) => (
              <button
                key={d.id}
                type="button"
                role="option"
                aria-selected={i === index}
                data-board-row
                onClick={() => setIndex(i)}
                className={cn(
                  "grid w-full cursor-pointer grid-cols-[3.5rem_1fr_auto] items-center gap-x-2 rounded-lg px-3 py-2.5 text-left uppercase transition-colors sm:grid-cols-[5rem_1fr_6rem_4rem_8rem]",
                  i === index ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5",
                )}
              >
                <span className="tabular-nums">{d.time}</span>
                <span className="truncate">
                  {d.city} <span className="text-white/40">{d.code}</span>
                </span>
                <span className="hidden sm:block">{d.flight}</span>
                <span className="hidden sm:block">{d.gate}</span>
                <span className={cn("flex items-center gap-2", STATUS_STYLE[d.status])}>
                  {(d.status === "Boarding" || d.status === "Final call") && (
                    <span className="blink size-1.5 rounded-full bg-current" aria-hidden />
                  )}
                  {d.status}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-white/60">
              Pick a row, or let the board flip. Fares are return, per person.
            </p>
            <Button type="button" variant="accent" onClick={() => openSearch(dep.action.tab, dep.action.preset)}>
              Plan {dep.city} <ArrowRight className="size-4" aria-hidden />
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

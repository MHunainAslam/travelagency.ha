"use client";

import { useRef } from "react";
import { ArrowUpRight, BedDouble, CarFront, Check, Plane, Stamp, type LucideIcon } from "lucide-react";
import type { Service, ServiceId } from "@/types";
import { useHoverTimeline } from "@/hooks/useHoverEffects";
import { Barcode } from "@/components/ui/Misc";
import { cn } from "@/lib/utils";

const ICONS: Record<ServiceId, LucideIcon> = { visa: Stamp, flights: Plane, hotels: BedDouble, cars: CarFront };

/** Each pass gets its own colourway so the row reads like a fan of tickets. */
const THEMES = [
  { card: "bg-signal-400 text-ink-950", muted: "text-ink-950/65", line: "border-ink-950/25", icon: "bg-ink-950 text-signal-400", cta: "bg-ink-950 text-white" },
  { card: "bg-brand-500 text-white", muted: "text-white/70", line: "border-white/30", icon: "bg-white text-brand-500", cta: "bg-white text-brand-600" },
  { card: "bg-white text-ink-950 ring-1 ring-ink-900/10", muted: "text-ink-700", line: "border-ink-900/15", icon: "bg-brand-500 text-white", cta: "bg-brand-500 text-white" },
  { card: "bg-ink-900 text-white", muted: "text-white/60", line: "border-white/20", icon: "bg-signal-400 text-ink-950", cta: "bg-signal-400 text-ink-950" },
];

interface ServiceCardProps {
  service: Service;
  index: number;
  onSelect: () => void;
}

export function ServiceCard({ service, index, onSelect }: ServiceCardProps) {
  const ref = useRef<HTMLElement>(null);
  const theme = THEMES[index % THEMES.length];
  const Icon = ICONS[service.id];

  // Hover: the pass lifts and tilts, the stub swings like it's about to be torn off.
  useHoverTimeline(ref, (tl) => {
    tl.to(ref.current, { y: -10, rotation: index % 2 ? 1.2 : -1.2, duration: 0.4, ease: "back.out(2)" }, 0)
      .to("[data-icon]", { rotation: -12, scale: 1.08, duration: 0.4, ease: "back.out(3)" }, 0)
      .to("[data-plane]", { x: 10, duration: 0.5 }, 0)
      .to("[data-stub]", { rotation: index % 2 ? -2.5 : 2.5, y: 4, transformOrigin: "0% 0%", duration: 0.45 }, 0.05);
  });

  return (
    <article ref={ref} data-service-card className="relative flex w-[85%] shrink-0 snap-center sm:w-auto">
      <div className={cn("relative flex w-full flex-col rounded-[26px] shadow-soft", theme.card)}>
        <div className="flex flex-1 flex-col p-6">
          <div className={cn("flex items-center justify-between font-mono text-[11px] tracking-[0.16em] uppercase", theme.muted)}>
            <span>Gate A{index + 1}</span>
            <span>{service.highlight}</span>
          </div>

          <span data-icon className={cn("mt-6 grid size-14 place-items-center rounded-2xl", theme.icon)}>
            <Icon className="size-6" aria-hidden />
          </span>

          <h3 className="mt-5 font-display text-[32px] leading-none font-extrabold tracking-[-0.03em]">{service.title}</h3>

          {/* Route line: YOU ── ✈ ── SERVICE */}
          <div className={cn("mt-4 flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] uppercase", theme.muted)}>
            <span>You</span>
            <span className={cn("relative flex-1 border-t-2 border-dotted", theme.line)}>
              <Plane data-plane className="absolute -top-[9px] left-1/2 size-4 -translate-x-1/2 rotate-45" aria-hidden />
            </span>
            <span>Sorted</span>
          </div>

          <p className={cn("mt-5 text-[15px] leading-relaxed", theme.muted)}>{service.description}</p>

          <ul className="mt-5 space-y-2 text-sm font-medium">
            {service.features.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 shrink-0" aria-hidden /> {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Perforation with notches cut out of both edges */}
        <div className="relative" aria-hidden>
          <span className="absolute top-1/2 -left-3 size-6 -translate-y-1/2 rounded-full bg-paper-50" />
          <span className="absolute top-1/2 -right-3 size-6 -translate-y-1/2 rounded-full bg-paper-50" />
          <div className={cn("mx-5 border-t-2 border-dashed", theme.line)} />
        </div>

        <div data-stub className="flex items-center justify-between gap-4 p-6 pt-5">
          <Barcode value={service.id} className="h-9 w-16 shrink-0 opacity-80 sm:w-20" />
          <button
            type="button"
            onClick={onSelect}
            className={cn(
              "inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-transform after:absolute after:inset-0 active:scale-95",
              theme.cta,
            )}
          >
            {service.cta} <ArrowUpRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </article>
  );
}

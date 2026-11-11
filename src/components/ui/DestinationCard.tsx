"use client";

import { useRef } from "react";
import Image from "next/image";
import type { Destination } from "@/types";
import { useHoverTimeline } from "@/hooks/useHoverEffects";
import { cn, formatPrice } from "@/lib/utils";

interface DestinationCardProps {
  destination: Destination;
  /** Resting tilt in degrees, so the grid looks like postcards pinned to a wall. */
  tilt?: number;
  className?: string;
  onFindHotels: () => void;
  onCheckVisa: () => void;
}

/** A postcard: photo with a big airport code, a postage-stamp price and a caption. */
export function DestinationCard({ destination, tilt = 0, className, onFindHotels, onCheckVisa }: DestinationCardProps) {
  const ref = useRef<HTMLElement>(null);

  // Hover: the card straightens and lifts, the photo eases in, the stamp wiggles.
  useHoverTimeline(ref, (tl) => {
    tl.to(ref.current, { rotation: 0, y: -10, scale: 1.03, duration: 0.45, ease: "back.out(2)" }, 0)
      .to("[data-img]", { scale: 1.08, duration: 0.9, ease: "power2.out" }, 0)
      .to("[data-postage]", { rotation: 12, scale: 1.1, duration: 0.4, ease: "back.out(3)" }, 0.05);
  });

  return (
    <article
      ref={ref}
      data-dest
      style={{ transform: `rotate(${tilt}deg)` }}
      className={cn("w-[72%] shrink-0 snap-center rounded-2xl bg-white p-2.5 pb-4 shadow-soft ring-1 ring-ink-900/5 sm:w-auto sm:p-3 sm:pb-5", className)}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-paper-200 sm:aspect-[5/4] lg:aspect-[4/5]">
        <Image
          data-img
          src={destination.image}
          alt={`${destination.city}, ${destination.country}`}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 72vw"
          className="object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />

        <span
          data-postage
          className="absolute top-2.5 right-2.5 rotate-6 border-[3px] border-dotted border-white bg-signal-400 px-2 py-1.5 text-center text-ink-950 shadow-sm"
        >
          <span className="block font-mono text-[9px] tracking-[0.14em] uppercase">From</span>
          <span className="block font-display text-base leading-none font-extrabold">
            {formatPrice(destination.priceFrom)}
          </span>
        </span>

        {destination.tag && (
          <span className="absolute top-3 left-3 hidden rounded-full bg-white/90 px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] text-ink-900 uppercase sm:block">
            {destination.tag}
          </span>
        )}

        <p
          aria-hidden
          className="absolute bottom-2 left-3 font-display text-5xl leading-none font-extrabold tracking-[-0.05em] text-white sm:text-6xl"
        >
          {destination.code}
        </p>
      </div>

      <div className="px-1 pt-3">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-display text-xl font-extrabold tracking-[-0.02em] text-ink-900 sm:text-2xl">
            {destination.city}
          </h3>
          <span className="shrink-0 font-mono text-xs text-ink-700">★ {destination.rating.toFixed(1)}</span>
        </div>
        <p className="font-mono text-[11px] tracking-[0.1em] text-ink-700 uppercase">
          {destination.country} · {destination.nights} nights
        </p>
        {destination.tag && (
          <p className="mt-1 font-mono text-[10px] tracking-[0.1em] text-brand-600 uppercase sm:hidden">{destination.tag}</p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onFindHotels}
            className="cursor-pointer rounded-full bg-brand-500 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-600"
          >
            Hotels
          </button>
          <button
            type="button"
            onClick={onCheckVisa}
            className="cursor-pointer rounded-full bg-paper-100 px-3.5 py-1.5 text-xs font-semibold text-ink-900 transition-colors hover:bg-paper-200"
          >
            Visa info
          </button>
        </div>
      </div>
    </article>
  );
}

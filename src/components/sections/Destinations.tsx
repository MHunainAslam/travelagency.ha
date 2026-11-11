"use client";

import { destinations } from "@/data/content";
import { useSearch } from "@/context/SearchContext";
import { Container } from "@/components/ui/Container";
import { DestinationCard } from "@/components/ui/DestinationCard";
import { Reveal } from "@/components/ui/Reveal";
import { Highlight, SectionHeading } from "@/components/ui/SectionHeading";

/** Resting tilts for the postcards (degrees), repeated across the grid. */
const TILTS = [-2.5, 1.8, -1.2, 2.4, 1.6, -2, 2.2, -1.6];

export function Destinations() {
  const { openSearch } = useSearch();

  return (
    <section id="destinations" className="scroll-mt-20 overflow-hidden py-24 sm:py-32">
      <Container>
        <SectionHeading
          index="03"
          label="Where people are going"
          title={
            <>
              Postcards from <Highlight>this season.</Highlight>
            </>
          }
          description="Return flights from London plus a hotel we'd happily stay in ourselves. Prices are per person."
        />

        <p className="mt-10 font-mono text-[11px] tracking-[0.16em] text-ink-700 uppercase sm:hidden">Swipe for more postcards →</p>
        <Reveal
          stagger="[data-dest]"
          y={80}
          className="mt-2 -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 py-6 [scrollbar-width:none] sm:mx-0 sm:grid sm:overflow-visible sm:px-0 sm:py-0 [&::-webkit-scrollbar]:hidden sm:mt-16 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-14"
        >
          {destinations.map((d, i) => (
            <DestinationCard
              key={d.id}
              destination={d}
              tilt={TILTS[i % TILTS.length]}
              onFindHotels={() => openSearch("hotels", { hotelCity: d.city })}
              onCheckVisa={() => openSearch("visa", { visaDestination: d.visaCountry })}
            />
          ))}
        </Reveal>
      </Container>
    </section>
  );
}

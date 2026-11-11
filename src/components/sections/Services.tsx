"use client";

import { services } from "@/data/content";
import { useSearch } from "@/context/SearchContext";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Highlight, SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/ui/ServiceCard";

export function Services() {
  const { openSearch } = useSearch();

  return (
    <section id="services" className="scroll-mt-20 py-24 sm:py-32">
      <Container>
        <SectionHeading
          index="01"
          label="What we do"
          title={
            <>
              Four passes. <Highlight>One</Highlight> team.
            </>
          }
          description="Book one, or let us handle all four. Either way you deal with the same person from first message to wheels up."
        />

        <p className="mt-10 font-mono text-[11px] tracking-[0.16em] text-ink-700 uppercase sm:hidden">Swipe to see all four →</p>
        <Reveal stagger="[data-service-card]" y={60} className="mt-2 -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 py-6 [scrollbar-width:none] sm:mx-0 sm:grid sm:overflow-visible sm:px-0 sm:py-0 [&::-webkit-scrollbar]:hidden sm:mt-16 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} onSelect={() => openSearch(service.id)} />
          ))}
        </Reveal>
      </Container>
    </section>
  );
}

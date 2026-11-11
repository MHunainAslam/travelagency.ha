"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";
import { BedDouble, CarFront, Plane, Stamp, type LucideIcon } from "lucide-react";
import type { ServiceId } from "@/types";
import { useSearch } from "@/context/SearchContext";
import { MOTION_OK, gsap, useGSAP } from "@/lib/gsap";
import { Container } from "@/components/ui/Container";
import { FlightSearch } from "@/components/search/FlightSearch";
import { HotelSearch } from "@/components/search/HotelSearch";
import { CarSearch } from "@/components/search/CarSearch";
import { VisaSearch } from "@/components/search/VisaSearch";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/data/site";
import { Ticket } from "@/components/ui/Ticket";
import { Barcode } from "@/components/ui/Misc";

const TABS: { id: ServiceId; label: string; short: string; icon: LucideIcon }[] = [
  { id: "flights", label: "Flights", short: "Flights", icon: Plane },
  { id: "hotels", label: "Hotels", short: "Hotels", icon: BedDouble },
  { id: "cars", label: "Car rental", short: "Cars", icon: CarFront },
  { id: "visa", label: "Visa check", short: "Visa", icon: Stamp },
];

export function SearchPanel() {
  const { activeTab, setActiveTab, preset, presetVersion } = useSearch();
  const sectionRef = useRef<HTMLElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);
  // Previous tab: lets us skip animating on first mount (and on React Strict Mode's re-run).
  const prevTab = useRef<ServiceId | null>(null);
  // Panel height captured just before a tab click, so the switch can ease between heights.
  const heightBefore = useRef<number | null>(null);

  /** Slide the underline beneath the given tab. */
  const moveLine = (tabId: ServiceId, animate: boolean) => {
    const tab = tabsRef.current?.querySelector<HTMLElement>(`[data-tab="${tabId}"]`);
    if (!tab || !lineRef.current) return;
    const props = { x: tab.offsetLeft, width: tab.offsetWidth };
    // `overwrite` kills any in-flight tween so two animations never fight.
    if (animate) gsap.to(lineRef.current, { ...props, duration: 0.35, ease: "power3.out", overwrite: true });
    else gsap.set(lineRef.current, { ...props, overwrite: true });
  };

  const selectTab = (id: ServiceId) => {
    if (id === activeTab) return;
    heightBefore.current = panelsRef.current?.offsetHeight ?? null;
    setActiveTab(id);
  };

  // Card fades up when it scrolls into view.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-search-card]", {
          y: 24,
          autoAlpha: 0,
          duration: 0.8,
          scrollTrigger: { trigger: sectionRef.current, start: "top 90%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  // Underline + panel transition whenever the tab changes.
  useGSAP(
    () => {
      const changed = prevTab.current !== null && prevTab.current !== activeTab;
      prevTab.current = activeTab;
      moveLine(activeTab, changed);
      if (!changed) return;

      gsap.fromTo(
        `[data-panel="${activeTab}"]`,
        { autoAlpha: 0, y: 6 },
        { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out", clearProps: "transform" },
      );

      // Ease the container between the old and new panel heights instead of snapping.
      const panels = panelsRef.current;
      const from = heightBefore.current;
      heightBefore.current = null;
      if (panels && from !== null && from !== panels.offsetHeight) {
        gsap.fromTo(
          panels,
          { height: from, overflow: "hidden" },
          { height: panels.offsetHeight, duration: 0.35, ease: "power2.out", clearProps: "height,overflow" },
        );
      }
    },
    { scope: sectionRef, dependencies: [activeTab] },
  );

  // Keep the underline aligned when the tab strip genuinely resizes.
  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    let lastWidth = el.offsetWidth;
    const observer = new ResizeObserver(() => {
      if (el.offsetWidth === lastWidth) return; // ignore the initial callback / no-op changes
      lastWidth = el.offsetWidth;
      const current = el.querySelector<HTMLElement>('[aria-selected="true"]')?.dataset.tab as ServiceId | undefined;
      if (current) moveLine(current, false);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const onTabKeyDown = (e: KeyboardEvent, index: number) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = TABS[(index + dir + TABS.length) % TABS.length];
    selectTab(next.id);
    tabsRef.current?.querySelector<HTMLElement>(`[data-tab="${next.id}"]`)?.focus();
  };

  return (
    <section ref={sectionRef} id="search" aria-label="Search and book" className="scroll-mt-24 pt-20 sm:pt-28">
      <Container>
        <div data-search-card data-anim>
          <Ticket
            stubWidth="15rem"
            stubClassName="hidden lg:flex lg:flex-col bg-paper-50/60"
            stub={<SearchStub tab={activeTab} />}
          >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-[11px] tracking-[0.18em] text-brand-600 uppercase">Boarding pass · Search</p>
                <h2 className="mt-1 font-display text-3xl font-extrabold tracking-[-0.03em] text-ink-900 sm:text-4xl">
                  Where to next?
                </h2>
              </div>
              <p className="text-sm text-ink-700">Demo data only. Nothing is booked or charged.</p>
            </div>

            <div
              ref={tabsRef}
              role="tablist"
              aria-label="Booking type"
              className="relative mt-6 flex w-full gap-1 overflow-x-auto rounded-full bg-paper-100 p-1 sm:w-auto sm:max-w-max"
            >
              <span ref={lineRef} aria-hidden className="absolute inset-y-1 left-0 rounded-full bg-brand-500 shadow-[0_6px_16px_-6px_rgb(47_75_255/0.8)]" />
              {TABS.map(({ id, label, short, icon: Icon }, i) => {
                const selected = activeTab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    id={`tab-${id}`}
                    data-tab={id}
                    aria-selected={selected}
                    aria-controls={`panel-${id}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => selectTab(id)}
                    onKeyDown={(e) => onTabKeyDown(e, i)}
                    className={cn(
                      "relative z-10 flex flex-1 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full px-3 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors duration-200 sm:flex-none sm:px-5",
                      selected ? "text-white" : "text-ink-700 hover:text-ink-900",
                    )}
                  >
                    <Icon className="hidden size-4 sm:block" aria-hidden />
                    <span className="sm:hidden">{short}</span>
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                );
              })}
            </div>

            <div ref={panelsRef} className="mt-7">
            {/* Panels stay mounted so each form keeps its state when switching tabs. */}
            <div role="tabpanel" id="panel-flights" aria-labelledby="tab-flights" data-panel="flights" hidden={activeTab !== "flights"}>
              <FlightSearch />
            </div>
            <div role="tabpanel" id="panel-hotels" aria-labelledby="tab-hotels" data-panel="hotels" hidden={activeTab !== "hotels"}>
              <HotelSearch key={`hotels-${presetVersion}`} initialCity={preset.hotelCity} />
            </div>
            <div role="tabpanel" id="panel-cars" aria-labelledby="tab-cars" data-panel="cars" hidden={activeTab !== "cars"}>
              <CarSearch />
            </div>
            <div role="tabpanel" id="panel-visa" aria-labelledby="tab-visa" data-panel="visa" hidden={activeTab !== "visa"}>
              <VisaSearch key={`visa-${presetVersion}`} initialDestination={preset.visaDestination} />
            </div>
          </div>
          </Ticket>
        </div>
      </Container>
    </section>
  );
}

const STUB_DETAILS: Record<ServiceId, { title: string; rows: [string, string][] }> = {
  flights: { title: "Flights", rows: [["Class", "Any"], ["Seat", "Window"], ["Bags", "Included"]] },
  hotels: { title: "Hotels", rows: [["Rooms", "Hand-picked"], ["Cancel", "Free*"], ["Check-in", "14:00"]] },
  cars: { title: "Cars", rows: [["Cover", "Full"], ["Mileage", "Unlimited"], ["Pick-up", "Airport"]] },
  visa: { title: "Visa", rows: [["Countries", "120"], ["Approval", "98%"], ["Updates", "WhatsApp"]] },
};

/** Decorative tear-off stub that mirrors the active tab. */
function SearchStub({ tab }: { tab: ServiceId }) {
  const details = STUB_DETAILS[tab];
  return (
    <>
      <p className="font-mono text-[11px] tracking-[0.18em] text-ink-700 uppercase">Passenger</p>
      <p className="font-display text-xl font-extrabold tracking-tight">You + {siteConfig.name}</p>
      <p className="mt-5 font-mono text-[11px] tracking-[0.18em] text-ink-700 uppercase">Service</p>
      <p className="font-display text-4xl font-extrabold tracking-[-0.03em] text-brand-500">{details.title}</p>
      <dl className="mt-5 grid grid-cols-2 gap-y-3 font-mono text-[11px] uppercase">
        {details.rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="tracking-[0.14em] text-ink-700">{k}</dt>
            <dd className="text-right font-semibold text-ink-900">{v}</dd>
          </div>
        ))}
      </dl>
      <Barcode value={tab} className="mt-auto h-16 w-full pt-6 text-ink-900" />
      <p className="mt-2 text-center font-mono text-[10px] tracking-[0.3em] text-ink-700">HA-{tab.toUpperCase()}-2026</p>
    </>
  );
}

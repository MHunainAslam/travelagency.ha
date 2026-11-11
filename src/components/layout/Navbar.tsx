"use client";

import { useEffect, useRef, useState } from "react";
import { MOTION_OK, ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";
import { navLinks, siteConfig } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Misc";
import { cn } from "@/lib/utils";
import { useClock } from "@/hooks/useClock";

export function Navbar() {
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuTl = useRef<gsap.core.Timeline | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const clock = useClock();

  useGSAP(() => {
    const header = headerRef.current;
    if (!header) return;

    // Hide on scroll down, reveal on scroll up.
    const showAnim = gsap
      .from(header, { yPercent: -100, paused: true, duration: 0.3, ease: "power2.out" })
      .progress(1);

    ScrollTrigger.create({
      start: 0,
      end: "max",
      onRefresh: (self) => setScrolled(self.scroll() > 24),
      onUpdate: (self) => {
        const y = self.scroll();
        setScrolled(y > 24);
        if (y < 300 || self.direction === -1) showAnim.play();
        else showAnim.reverse();
      },
    });

    // Mobile menu timeline.
    menuTl.current = gsap
      .timeline({ paused: true })
      .to(menuRef.current, { autoAlpha: 1, duration: 0.25, ease: "power1.out" })
      .from("[data-menu-item]", { y: 16, autoAlpha: 0, stagger: 0.04, duration: 0.4 }, "-=0.1");

    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.from("[data-nav-item]", { autoAlpha: 0, duration: 0.6, stagger: 0.05, delay: 0.1 });
    });
    return () => mm.revert();
  });

  useEffect(() => {
    const tl = menuTl.current;
    if (!tl) return;
    if (open) tl.timeScale(1).play();
    else tl.timeScale(1.5).reverse();
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  // Close the mobile menu if the viewport grows to desktop size.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <header ref={headerRef} className="fixed inset-x-0 top-0 z-50">
        <div
          className={cn(
            "border-b py-3.5 transition-[background-color,border-color] duration-300",
            scrolled && !open ? "border-ink-900/10 bg-paper-50/90 backdrop-blur-md" : "border-transparent bg-transparent",
          )}
        >
          <Container className="flex items-center justify-between gap-6">
            <a href="#top" data-nav-item data-anim aria-label={`${siteConfig.name} home`}>
              <Logo tone={open ? "light" : "dark"} />
            </a>

            <nav aria-label="Primary" className="hidden items-center gap-1 rounded-full bg-white/70 p-1 ring-1 ring-ink-900/10 lg:flex">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  data-nav-item
                  data-anim
                  className="rounded-full px-4 py-2 text-sm font-medium text-ink-800 transition-colors hover:bg-ink-900 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="hidden items-center gap-5 lg:flex" data-nav-item data-anim>
              <span className="font-mono text-xs tracking-[0.14em] text-ink-700 uppercase">
                Local <span className="text-ink-900 tabular-nums">{clock}</span>
              </span>
              <Button href="#search" size="sm">
                Plan a trip
              </Button>
            </div>

            <button
              type="button"
              data-nav-item
              data-anim
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className={cn(
                "cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-colors lg:hidden",
                open ? "bg-signal-400 text-ink-950" : "bg-ink-900 text-white",
              )}
            >
              {open ? "Close" : "Menu"}
            </button>
          </Container>
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={menuRef}
        className="invisible fixed inset-0 z-40 flex flex-col bg-ink-950 px-4 pt-24 pb-10 opacity-0 sm:px-6 lg:hidden"
        aria-hidden={!open}
      >
        <nav aria-label="Mobile" className="flex flex-col">
          {navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              data-menu-item
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              className="flex items-baseline gap-4 border-b border-white/10 py-4 font-display text-5xl font-extrabold tracking-[-0.03em] text-white"
            >
              <span className="font-mono text-xs font-normal tracking-normal text-signal-400">A{i + 1}</span>
              {link.label}
            </a>
          ))}
        </nav>
        <div data-menu-item className="mt-auto space-y-1 font-mono text-sm text-white/60">
          <p>{siteConfig.contact.phone}</p>
          <p>{siteConfig.contact.email}</p>
        </div>
      </div>
    </>
  );
}

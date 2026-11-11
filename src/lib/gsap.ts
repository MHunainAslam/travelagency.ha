"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, MotionPathPlugin, SplitText, useGSAP);
  gsap.defaults({ ease: "power3.out", duration: 0.9 });
  // Mobile browsers resize the viewport when the address bar shows/hides;
  // recalculating every trigger then causes visible jumps.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/** Media query used to opt into motion; reduced-motion users get static content. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
/** Devices with a real hover-capable pointer (skip hover effects on touch). */
export const FINE_POINTER = "(hover: hover) and (pointer: fine)";

/** Height reserved for the fixed navbar when scrolling to a section. */
const HEADER_OFFSET = 72;

/**
 * Smoothly scroll to a section (or y position) with GSAP.
 * We avoid CSS `scroll-behavior: smooth` because it fights with ScrollTrigger.
 */
export function scrollToTarget(target: string | number) {
  if (typeof target === "string" && target !== "#top" && !document.querySelector(target)) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  gsap.to(window, {
    scrollTo: target === "#top" ? 0 : { y: target, offsetY: HEADER_OFFSET, autoKill: true },
    duration: reduce ? 0 : 1.1,
    ease: "power3.inOut",
    overwrite: "auto",
  });
}

export { gsap, ScrollTrigger, SplitText, useGSAP };

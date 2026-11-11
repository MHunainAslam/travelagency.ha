"use client";

import type { RefObject } from "react";
import { FINE_POINTER, MOTION_OK, gsap, useGSAP } from "@/lib/gsap";

/**
 * Plays a paused GSAP timeline while the element is hovered (or focused from the
 * keyboard) and reverses it on leave. Skipped on touch devices and for reduced motion.
 *
 * `build` receives the timeline and should add tweens to it; selectors are scoped to `ref`.
 */
export function useHoverTimeline<T extends HTMLElement>(
  ref: RefObject<T | null>,
  build: (tl: gsap.core.Timeline) => void,
) {
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(`${FINE_POINTER} and ${MOTION_OK}`, () => {
        const tl = gsap.timeline({ paused: true, defaults: { duration: 0.45, ease: "power2.out" } });
        build(tl);
        const play = () => tl.play();
        const reverse = () => tl.reverse();
        const onFocusOut = (e: FocusEvent) => {
          if (!el.contains(e.relatedTarget as Node | null)) reverse();
        };
        el.addEventListener("pointerenter", play);
        el.addEventListener("pointerleave", reverse);
        el.addEventListener("focusin", play);
        el.addEventListener("focusout", onFocusOut);
        return () => {
          el.removeEventListener("pointerenter", play);
          el.removeEventListener("pointerleave", reverse);
          el.removeEventListener("focusin", play);
          el.removeEventListener("focusout", onFocusOut);
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
}

"use client";

import { useEffect } from "react";
import { ScrollTrigger, scrollToTarget } from "@/lib/gsap";

/**
 * Global scroll behaviour:
 * - in-page `#anchor` links scroll smoothly via GSAP (no CSS smooth-scroll conflicts);
 * - ScrollTrigger positions are recalculated whenever the page height changes
 *   (e.g. search results expand), so reveals keep firing at the right moment.
 */
export function ScrollManager() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      const hash = link?.getAttribute("href");
      if (!hash || hash === "#") return;
      e.preventDefault();
      scrollToTarget(hash);
      history.replaceState(null, "", hash);
    };
    document.addEventListener("click", onClick);

    let timer: number | undefined;
    let lastHeight = document.body.scrollHeight;
    const observer = new ResizeObserver(() => {
      const height = document.body.scrollHeight;
      if (height === lastHeight) return;
      lastHeight = height;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    });
    observer.observe(document.body);

    return () => {
      document.removeEventListener("click", onClick);
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  return null;
}

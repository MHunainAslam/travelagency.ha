"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

interface SplitFlapProps {
  text: string;
  /** Number of tiles; text is padded / cut to fit. */
  length: number;
  className?: string;
  tileClassName?: string;
  /** Seconds before the first tile starts flipping. */
  delay?: number;
  /** Accessible label (the tiles themselves are hidden from screen readers). */
  label?: string;
}

/**
 * Airport split-flap display. When `text` changes, each tile shuffles through a
 * few random characters (each one a quick flap) before settling on its letter.
 */
export function SplitFlap({ text, length, className, tileClassName, delay = 0, label }: SplitFlapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const target = text.toUpperCase().padEnd(length, " ").slice(0, length);
  // React renders the first value once; after that GSAP owns the glyph text,
  // so React never fights the animation over the same text nodes.
  const [initial] = useState(target);

  useGSAP(
    () => {
      const glyphs = gsap.utils.toArray<HTMLElement>("[data-glyph]");
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      glyphs.forEach((glyph, i) => {
        const finalChar = target[i];
        if (reduce) {
          glyph.textContent = finalChar;
          return;
        }
        gsap.killTweensOf(glyph);
        const steps = finalChar === " " ? 2 : 3 + Math.floor(Math.random() * 5);
        const tl = gsap.timeline({ delay: delay + i * 0.04 });
        for (let s = 0; s < steps; s++) {
          const ch = s === steps - 1 ? finalChar : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          tl.call(() => {
            glyph.textContent = ch;
          }).fromTo(glyph, { rotationX: -88 }, { rotationX: 0, duration: 0.075, ease: "power1.out" });
        }
      });
    },
    { scope: ref, dependencies: [target] },
  );

  return (
    <div ref={ref} className={cn("flex", className)} role="img" aria-label={label ?? text}>
      {Array.from(initial).map((ch, i) => (
        <span key={i} className={cn("flap", tileClassName)} aria-hidden>
          <span data-glyph>{ch === " " ? " " : ch}</span>
        </span>
      ))}
    </div>
  );
}

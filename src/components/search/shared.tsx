"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowUpDown, ChevronDown, CircleCheck, LoaderCircle, Search, SearchX, TriangleAlert } from "lucide-react";
import { MOTION_OK, gsap, useGSAP } from "@/lib/gsap";
import type { SearchStatus } from "@/hooks/useAsyncSearch";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function SubmitButton({ loading, label = "Search" }: { loading: boolean; label?: string }) {
  return (
    <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto sm:min-w-44">
      {loading ? <LoaderCircle className="size-5 animate-spin" aria-hidden /> : <Search className="size-5" aria-hidden />}
      {loading ? "Searching…" : label}
    </Button>
  );
}

/** Reserve / book button with a local "requested" state (no real payment flow). */
export function BookButton({
  label = "Select",
  doneLabel = "Requested",
  variant = "dark",
  className,
}: {
  label?: string;
  doneLabel?: string;
  variant?: "dark" | "accent";
  className?: string;
}) {
  const [done, setDone] = useState(false);
  return (
    <Button
      type="button"
      size="sm"
      variant={done ? "outline" : variant}
      onClick={() => setDone(true)}
      aria-live="polite"
      className={cn("min-w-28", done && "border-emerald-700/40 bg-white text-emerald-800 hover:border-emerald-700/40 hover:bg-white hover:text-emerald-800", className)}
    >
      {done && <CircleCheck className="size-4" aria-hidden />}
      {done ? doneLabel : label}
    </Button>
  );
}

export interface SortOption<T> {
  id: string;
  label: string;
  compare: (a: T, b: T) => number;
}

/**
 * Sorting + "show more" paging for a result list. The page size resets whenever
 * a new result set arrives (tracked by identity, so no effect is needed).
 * `options` should be a stable (module-level) array.
 */
export function useResultsView<T>(data: T[] | null, options: SortOption<T>[], pageSize = 6) {
  const [sortId, setSortId] = useState(options[0].id);
  const [paging, setPaging] = useState<{ source: T[] | null; limit: number }>({ source: data, limit: pageSize });
  const limit = paging.source === data ? paging.limit : pageSize;

  const sorted = useMemo(() => {
    const option = options.find((o) => o.id === sortId) ?? options[0];
    return data ? [...data].sort(option.compare) : [];
  }, [data, options, sortId]);

  return {
    items: sorted.slice(0, limit),
    total: sorted.length,
    remaining: Math.max(0, sorted.length - limit),
    sort: {
      value: sortId,
      options,
      onChange: (id: string) => {
        setSortId(id);
        setPaging({ source: data, limit: pageSize });
      },
    },
    showMore: () => setPaging({ source: data, limit: limit + pageSize }),
  };
}

/** Small pill-shaped sort dropdown shown above results. */
export function SortSelect<T>({ value, options, onChange }: { value: string; options: SortOption<T>[]; onChange: (id: string) => void }) {
  return (
    <label className="relative inline-flex items-center gap-2 rounded-full bg-paper-100 py-1.5 pr-8 pl-3 text-sm font-medium text-ink-900">
      <ArrowUpDown className="size-3.5 text-ink-700" aria-hidden />
      <span className="sr-only">Sort results by</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer appearance-none bg-transparent focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 size-4 text-ink-700" aria-hidden />
    </label>
  );
}

/** "Show more" button under a result list. */
export function ShowMoreButton({ remaining, onClick, noun = "results" }: { remaining: number; onClick: () => void; noun?: string }) {
  if (remaining <= 0) return null;
  return (
    <div className="mt-6 flex justify-center">
      <Button type="button" variant="outline" onClick={onClick}>
        Show more {noun} <span className="font-mono text-xs text-current/70">({remaining} left)</span>
      </Button>
    </div>
  );
}

interface ResultsShellProps {
  status: SearchStatus;
  count: number;
  summary: ReactNode;
  emptyText: string;
  children: ReactNode;
  className?: string;
  skeleton?: "list" | "grid";
  /** Rendered beside the result count (e.g. a sort dropdown). */
  toolbar?: ReactNode;
  /** Rendered under the list (e.g. a "show more" button). */
  footer?: ReactNode;
}

/** Handles loading / empty / error states and animates results in. */
export function ResultsShell({ status, count, summary, emptyText, children, className, skeleton = "list", toolbar, footer }: ResultsShellProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (status !== "success") return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-result]", { y: 32, autoAlpha: 0, duration: 0.6, stagger: 0.08, clearProps: "transform" });
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [status] },
  );

  if (status === "idle") return null;

  return (
    <div ref={ref} className="mt-8 border-t border-ink-900/8 pt-8" aria-live="polite" aria-busy={status === "loading"}>
      {status === "loading" && (
        <div className={cn("grid gap-4", skeleton === "grid" && "sm:grid-cols-2 lg:grid-cols-3")}>
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className={cn("skeleton rounded-lg", skeleton === "grid" ? "h-72" : "h-28")} />
          ))}
        </div>
      )}

      {status === "error" && (
        <StateMessage icon={<TriangleAlert className="size-6 text-rose-500" />} text="Something went wrong. Please try again." />
      )}

      {status === "success" && count === 0 && (
        <StateMessage icon={<SearchX className="size-6 text-ink-700/60" />} text={emptyText} />
      )}

      {status === "success" && count > 0 && (
        <>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-ink-700/80">
              <span className="font-semibold text-ink-900">{count} result{count === 1 ? "" : "s"}</span> · {summary}
            </p>
            {toolbar}
          </div>
          <div className={className}>{children}</div>
          {footer}
        </>
      )}
    </div>
  );
}

function StateMessage({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-md bg-paper-50 px-6 py-10 text-center">
      {icon}
      <p className="max-w-sm text-sm text-ink-700">{text}</p>
    </div>
  );
}

/** Pill-style radio group (e.g. trip type). */
export function PillToggle<T extends string>({
  name,
  value,
  options,
  onChange,
}: {
  name: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={name} className="inline-flex rounded-full bg-paper-100 p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition",
            value === opt.value ? "bg-ink-900 text-paper-50" : "text-ink-700 hover:text-ink-900",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

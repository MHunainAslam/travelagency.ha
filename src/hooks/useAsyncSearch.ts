"use client";

import { useCallback, useRef, useState } from "react";

export type SearchStatus = "idle" | "loading" | "success" | "error";

/**
 * Wraps an async search function with loading / error state.
 * Stale responses (from an earlier submit) are ignored.
 */
export function useAsyncSearch<Q, R>(searchFn: (query: Q) => Promise<R>) {
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [data, setData] = useState<R | null>(null);
  const requestId = useRef(0);

  const run = useCallback(
    async (query: Q) => {
      const id = ++requestId.current;
      setStatus("loading");
      try {
        const result = await searchFn(query);
        if (id !== requestId.current) return;
        setData(result);
        setStatus("success");
      } catch {
        if (id !== requestId.current) return;
        setStatus("error");
      }
    },
    [searchFn],
  );

  return { status, data, run };
}

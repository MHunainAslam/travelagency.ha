"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { SearchPreset, ServiceId } from "@/types";
import { scrollToTarget } from "@/lib/gsap";

export type { SearchPreset };

interface SearchContextValue {
  activeTab: ServiceId;
  setActiveTab: (tab: ServiceId) => void;
  preset: SearchPreset;
  /** Increments whenever a preset is applied so forms can re-initialise. */
  presetVersion: number;
  /** Switch tab, optionally prefill a form, and scroll the search panel into view. */
  openSearch: (tab: ServiceId, preset?: SearchPreset) => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<ServiceId>("flights");
  const [preset, setPreset] = useState<SearchPreset>({});
  const [presetVersion, setPresetVersion] = useState(0);

  const openSearch = useCallback((tab: ServiceId, nextPreset?: SearchPreset) => {
    setActiveTab(tab);
    if (nextPreset) {
      setPreset(nextPreset);
      setPresetVersion((v) => v + 1);
    }
    scrollToTarget("#search");
  }, []);

  const value = useMemo(
    () => ({ activeTab, setActiveTab, preset, presetVersion, openSearch }),
    [activeTab, preset, presetVersion, openSearch],
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch(): SearchContextValue {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used inside <SearchProvider>");
  return ctx;
}

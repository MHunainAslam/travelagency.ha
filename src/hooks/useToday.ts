"use client";

import { useSyncExternalStore } from "react";
import { toISODate } from "@/lib/utils";

const subscribe = () => () => {};

/**
 * Today's date as YYYY-MM-DD. Returns "" during server rendering so the
 * markup never depends on the server clock (avoids hydration mismatches).
 */
export function useToday(): string {
  return useSyncExternalStore(subscribe, () => toISODate(new Date()), () => "");
}

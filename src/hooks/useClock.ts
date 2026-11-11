"use client";

import { useSyncExternalStore } from "react";

const format = () =>
  new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });

const subscribe = (onChange: () => void) => {
  const id = window.setInterval(onChange, 10_000);
  return () => window.clearInterval(id);
};

/** Local time as "HH:MM", ticking on the client. Renders "--:--" on the server. */
export function useClock(): string {
  return useSyncExternalStore(subscribe, format, () => "--:--");
}

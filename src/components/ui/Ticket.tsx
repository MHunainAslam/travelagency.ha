import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TicketProps {
  children: ReactNode;
  /** Tear-off stub shown on the right on desktop (below on mobile). */
  stub?: ReactNode;
  /** Stub width on desktop, any CSS length. */
  stubWidth?: string;
  className?: string;
  bodyClassName?: string;
  stubClassName?: string;
}

/**
 * A boarding-pass shaped card: perforated divider with semicircle notches
 * (see the `ticket-v` utility in globals.css) and an optional stub.
 */
export function Ticket({ children, stub, stubWidth = "15rem", className, bodyClassName, stubClassName }: TicketProps) {
  const style = { "--stub": stubWidth, "--cut": `calc(100% - ${stubWidth})` } as CSSProperties;

  return (
    // drop-shadow (not box-shadow) so the shadow follows the notched mask.
    <div className={cn("drop-shadow-[0_24px_40px_rgb(17_20_27/0.14)]", className)}>
      <div
        style={style}
        className={cn("grid overflow-hidden rounded-3xl bg-white", stub ? "lg:ticket-v lg:grid-cols-[1fr_var(--stub)]" : undefined)}
      >
        <div className={cn("min-w-0 p-5 sm:p-8", bodyClassName)}>{children}</div>
        {stub && (
          <div
            className={cn(
              "border-t-2 border-dashed border-ink-900/15 p-5 sm:p-8 lg:border-t-0 lg:border-l-2",
              stubClassName,
            )}
          >
            {stub}
          </div>
        )}
      </div>
    </div>
  );
}

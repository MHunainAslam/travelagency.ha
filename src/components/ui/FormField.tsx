import type { ComponentPropsWithoutRef, ComponentType, ReactNode } from "react";
import { ChevronDown, type LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";

type IconType = ComponentType<LucideProps>;

interface FieldProps {
  label: string;
  htmlFor: string;
  icon?: IconType;
  error?: string;
  className?: string;
  children: ReactNode;
}

/** Label + icon + control wrapper shared by every form in the site. */
export function Field({ label, htmlFor, icon: Icon, error, className, children }: FieldProps) {
  return (
    <div className={cn("group relative", className)}>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block font-mono text-[11px] tracking-[0.14em] text-ink-700 uppercase"
      >
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 sm:left-3.5 sm:size-4.5 text-ink-700/50 transition-colors group-focus-within:text-brand-600"
          />
        )}
        {children}
      </div>
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}

const controlBase =
  "h-12 w-full min-w-0 rounded-xl border border-ink-900/15 bg-white text-[13px] font-medium sm:text-sm text-ink-900 " +
  "transition placeholder:text-ink-700/40 hover:border-ink-900/25 " +
  "focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 focus:outline-none " +
  "aria-[invalid=true]:border-rose-400";

type InputProps = ComponentPropsWithoutRef<"input"> & { hasIcon?: boolean };

export function Input({ className, hasIcon = true, ...props }: InputProps) {
  return <input className={cn(controlBase, hasIcon ? "pr-2 pl-9 sm:pr-3 sm:pl-10" : "px-4", className)} {...props} />;
}

type SelectProps = ComponentPropsWithoutRef<"select"> & { hasIcon?: boolean };

export function Select({ className, hasIcon = true, children, ...props }: SelectProps) {
  return (
    <>
      <select
        className={cn(controlBase, "cursor-pointer appearance-none truncate pr-8 sm:pr-9", hasIcon ? "pl-9 sm:pl-10" : "pl-4", className)}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-ink-700/60"
      />
    </>
  );
}

export function Textarea({ className, ...props }: ComponentPropsWithoutRef<"textarea">) {
  return <textarea className={cn(controlBase, "h-auto min-h-32 resize-y px-4 py-3", className)} {...props} />;
}

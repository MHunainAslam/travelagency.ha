import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "accent" | "dark" | "outline" | "light";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  /** Cobalt: the main call to action. */
  primary:
    "bg-brand-500 text-white shadow-[0_8px_24px_-8px_rgb(47_75_255/0.7)] hover:bg-brand-600 hover:shadow-[0_10px_28px_-8px_rgb(47_75_255/0.85)]",
  /** Airport-sign yellow. */
  accent: "bg-signal-400 text-ink-950 hover:bg-signal-300",
  dark: "bg-ink-900 text-white hover:bg-ink-800",
  outline: "border-2 border-ink-900 text-ink-900 hover:bg-ink-900 hover:text-white",
  light: "border-2 border-white/40 text-white hover:border-white hover:bg-white hover:text-ink-900",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-[15px]",
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type ButtonProps = BaseProps & ComponentPropsWithoutRef<"button"> & { href?: undefined };
type LinkProps = BaseProps & ComponentPropsWithoutRef<"a"> & { href: string };

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap",
    "transition-[background-color,color,box-shadow,transform] duration-200 active:scale-[0.97]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500",
    "disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant],
    sizes[size],
    className,
  );
}

export function Button(props: ButtonProps | LinkProps) {
  const { variant = "primary", size = "md", className, children, ...rest } = props;
  const classes = buttonClasses(variant, size, className);

  if (typeof rest.href === "string") {
    return (
      <a className={classes} {...(rest as ComponentPropsWithoutRef<"a">)}>
        {children}
      </a>
    );
  }
  return (
    <button className={classes} {...(rest as ComponentPropsWithoutRef<"button">)}>
      {children}
    </button>
  );
}

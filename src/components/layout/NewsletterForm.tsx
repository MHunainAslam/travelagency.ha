"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setState(EMAIL_RE.test(email) ? "done" : "error");
  };

  if (state === "done") {
    return (
      <p className="border-b-2 border-white/20 pb-3 text-[15px] text-white/85" role="status">
        Thanks. The next one goes out on the first of the month.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <label htmlFor="newsletter-email" className="text-sm text-white/60">
        Your email
      </label>
      <div className="mt-2 flex items-end gap-3 border-b-2 border-white/20 pb-2 focus-within:border-signal-400">
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setState("idle");
          }}
          placeholder="you@example.com"
          aria-invalid={state === "error"}
          aria-describedby={state === "error" ? "newsletter-error" : undefined}
          className="min-w-0 flex-1 bg-transparent py-1 text-[17px] text-white placeholder:text-white/30 focus:outline-none"
        />
        <Button type="submit" size="sm" variant="accent" className="shrink-0">
          Subscribe
        </Button>
      </div>
      {state === "error" && (
        <p id="newsletter-error" role="alert" className="mt-2 text-sm text-signal-300">
          That email doesn&apos;t look right.
        </p>
      )}
    </form>
  );
}

"use client";

import { useState, type FormEvent } from "react";
import { BadgeCheck, Briefcase, CircleCheck, Clock, Flag, Globe, Hourglass, Wallet } from "lucide-react";
import type { VisaQuery, VisaResult, VisaStatus } from "@/types";
import { nationalities, visaDestinations } from "@/data/mock";
import { searchVisa } from "@/lib/mock-api";
import { useAsyncSearch } from "@/hooks/useAsyncSearch";
import { cn, formatPrice } from "@/lib/utils";
import { Field, Select } from "@/components/ui/FormField";
import { BookButton, ResultsShell, SubmitButton } from "./shared";

const PURPOSES: VisaQuery["purpose"][] = ["Tourism", "Business", "Study"];

const STATUS_META: Record<VisaStatus, { label: string; className: string }> = {
  "visa-free": { label: "Visa not required", className: "bg-emerald-50 text-emerald-700 ring-emerald-600/20" },
  "on-arrival": { label: "Visa on arrival", className: "bg-sky-50 text-sky-700 ring-sky-600/20" },
  "e-visa": { label: "e-Visa available", className: "bg-amber-50 text-amber-700 ring-amber-600/20" },
  embassy: { label: "Embassy application", className: "bg-rose-50 text-rose-700 ring-rose-600/20" },
};

export function VisaSearch({ initialDestination }: { initialDestination?: string }) {
  const [nationality, setNationality] = useState("United Kingdom");
  const [destination, setDestination] = useState(initialDestination ?? visaDestinations[0]);
  const [purpose, setPurpose] = useState<VisaQuery["purpose"]>("Tourism");
  const { status, data, run } = useAsyncSearch(searchVisa);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    run({ nationality, destination, purpose });
  };

  return (
    <div>
      <form onSubmit={onSubmit} noValidate>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Your passport" htmlFor="visa-nat" icon={Flag}>
            <Select id="visa-nat" value={nationality} onChange={(e) => setNationality(e.target.value)}>
              {nationalities.map((n) => (
                <option key={n}>{n}</option>
              ))}
            </Select>
          </Field>
          <Field label="Travelling to" htmlFor="visa-dest" icon={Globe}>
            <Select id="visa-dest" value={destination} onChange={(e) => setDestination(e.target.value)}>
              {visaDestinations.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </Select>
          </Field>
          <Field label="Purpose of travel" htmlFor="visa-purpose" icon={Briefcase}>
            <Select
              id="visa-purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value as VisaQuery["purpose"])}
            >
              {PURPOSES.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </Select>
          </Field>
        </div>
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink-700/60">Indicative requirements from demo data — always confirm with the embassy.</p>
          <SubmitButton loading={status === "loading"} label="Check requirements" />
        </div>
      </form>

      <ResultsShell
        status={status}
        count={data ? 1 : 0}
        summary={data && `${data.nationality} passport → ${data.destination} (${data.purpose})`}
        emptyText="We don't have visa data for this destination yet. Contact us and an advisor will help."
      >
        {data && <VisaCard result={data} />}
      </ResultsShell>
    </div>
  );
}

function VisaCard({ result }: { result: VisaResult }) {
  const meta = STATUS_META[result.status];
  const facts = [
    { icon: BadgeCheck, label: "Visa type", value: result.visaType },
    { icon: Hourglass, label: "Processing", value: result.processing },
    { icon: Clock, label: "Permitted stay", value: result.stay },
    { icon: Wallet, label: "Government fee", value: result.fee ? formatPrice(result.fee) : "Free" },
  ];

  return (
    <article data-result className="grid gap-6 rounded-lg border border-ink-900/8 bg-white p-5 sm:p-7 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <span className={cn("inline-flex rounded-sm px-2 py-0.5 text-xs font-semibold ring-1", meta.className)}>
          {meta.label}
        </span>
        <h3 className="mt-3 font-display text-2xl font-semibold text-ink-900">{result.destination}</h3>
        <dl className="mt-5 grid grid-cols-2 gap-4">
          {facts.map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-md bg-paper-100 p-3">
              <dt className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-ink-700/70 uppercase">
                <Icon className="size-3.5 text-brand-600" aria-hidden /> {label}
              </dt>
              <dd className="mt-1 text-sm font-semibold text-ink-900">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="flex flex-col">
        <h4 className="text-sm font-semibold text-ink-900">Documents you&apos;ll need</h4>
        <ul className="mt-3 space-y-2.5">
          {result.documents.map((doc) => (
            <li key={doc} className="flex gap-2.5 text-sm text-ink-700">
              <CircleCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden />
              {doc}
            </li>
          ))}
        </ul>
        {result.status !== "visa-free" && (
          <div className="mt-6 flex flex-col gap-3 rounded-md border border-ink-900/15 bg-paper-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-ink-700">
              Our service fee from <span className="font-semibold text-ink-900">{formatPrice(49)}</span> — we handle
              everything.
            </p>
            <BookButton label="Start application" doneLabel="Request sent" variant="accent" />
          </div>
        )}
      </div>
    </article>
  );
}

"use client";

import { useRef, useState, type FormEvent } from "react";
import { ArrowLeftRight, CalendarDays, Crown, PlaneLanding, PlaneTakeoff, Users } from "lucide-react";
import type { CabinClass, Flight, FlightQuery } from "@/types";
import { airports } from "@/data/mock";
import { searchFlights } from "@/lib/mock-api";
import { useAsyncSearch } from "@/hooks/useAsyncSearch";
import { useToday } from "@/hooks/useToday";
import { gsap } from "@/lib/gsap";
import { addDays, formatDate, formatDuration, formatPrice } from "@/lib/utils";
import { Field, Input, Select } from "@/components/ui/FormField";
import {
  BookButton,
  PillToggle,
  ResultsShell,
  SortSelect,
  SubmitButton,
  useResultsView,
  type SortOption,
} from "./shared";

const CABINS: CabinClass[] = ["Economy", "Premium Economy", "Business", "First"];

const FLIGHT_SORTS: SortOption<Flight>[] = [
  { id: "price", label: "Cheapest", compare: (a, b) => a.totalPrice - b.totalPrice },
  { id: "duration", label: "Fastest", compare: (a, b) => a.durationMins - b.durationMins },
  { id: "stops", label: "Fewest stops", compare: (a, b) => a.stops - b.stops || a.totalPrice - b.totalPrice },
  { id: "depart", label: "Earliest departure", compare: (a, b) => a.departTime.localeCompare(b.departTime) },
];
type TripType = "round" | "oneway";

export function FlightSearch() {
  const today = useToday();
  const swapRef = useRef<HTMLButtonElement>(null);
  const [tripType, setTripType] = useState<TripType>("round");
  const [from, setFrom] = useState("LHR");
  const [to, setTo] = useState("DXB");
  // `null` = "use the suggested default" (derived from today once we're on the client).
  const [depart, setDepart] = useState<string | null>(null);
  const [ret, setRet] = useState<string | null>(null);
  const [passengers, setPassengers] = useState(1);
  const [cabin, setCabin] = useState<CabinClass>("Economy");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lastQuery, setLastQuery] = useState<FlightQuery | null>(null);
  const { status, data, run } = useAsyncSearch(searchFlights);
  const view = useResultsView(data, FLIGHT_SORTS, 3);

  const departValue = depart ?? (today ? addDays(today, 7) : "");
  const returnValue = ret ?? (departValue ? addDays(departValue, 7) : "");

  const swap = () => {
    setFrom(to);
    setTo(from);
    gsap.fromTo(swapRef.current, { rotation: 0 }, { rotation: 180, duration: 0.5, ease: "back.out(2)" });
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (from === to) next.to = "Choose a different destination.";
    if (!departValue) next.depart = "Select a departure date.";
    if (tripType === "round" && returnValue < departValue) next.ret = "Return must be after departure.";
    setErrors(next);
    if (Object.keys(next).length) return;

    const query: FlightQuery = {
      from,
      to,
      departDate: departValue,
      returnDate: tripType === "round" ? returnValue : undefined,
      passengers,
      cabin,
    };
    setLastQuery(query);
    run(query);
  };

  return (
    <div>
      <form onSubmit={onSubmit} noValidate>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          <Field label="From" htmlFor="fl-from" icon={PlaneTakeoff} className="col-span-2 sm:col-span-1">
            <AirportSelect id="fl-from" value={from} onChange={setFrom} />
            <button
              ref={swapRef}
              type="button"
              onClick={swap}
              aria-label="Swap origin and destination"
              className="absolute top-1/2 -right-[26px] z-20 hidden size-9 -translate-y-1/2 cursor-pointer place-items-center rounded-md border border-ink-900/15 bg-paper-50 text-ink-800 transition hover:border-brand-500 hover:text-brand-600 sm:grid"
            >
              <ArrowLeftRight className="size-4" aria-hidden />
            </button>
          </Field>
          <Field label="To" htmlFor="fl-to" icon={PlaneLanding} error={errors.to} className="col-span-2 sm:col-span-1">
            <AirportSelect id="fl-to" value={to} onChange={setTo} invalid={!!errors.to} />
          </Field>
          <Field label="Depart" htmlFor="fl-depart" icon={CalendarDays} error={errors.depart}>
            <Input
              id="fl-depart"
              type="date"
              min={today}
              value={departValue}
              onChange={(e) => setDepart(e.target.value)}
              aria-invalid={!!errors.depart}
            />
          </Field>
          <Field label="Return" htmlFor="fl-return" icon={CalendarDays} error={errors.ret}>
            <Input
              id="fl-return"
              type="date"
              min={departValue}
              value={returnValue}
              onChange={(e) => setRet(e.target.value)}
              aria-invalid={!!errors.ret}
            />
          </Field>
          <Field label="Travellers" htmlFor="fl-pax" icon={Users}>
            <Select id="fl-pax" value={passengers} onChange={(e) => setPassengers(Number(e.target.value))}>
              {Array.from({ length: 9 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} {i === 0 ? "adult" : "adults"}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Cabin" htmlFor="fl-cabin" icon={Crown}>
            <Select id="fl-cabin" value={cabin} onChange={(e) => setCabin(e.target.value as CabinClass)}>
              {CABINS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <PillToggle<TripType>
            name="Trip type"
            value={tripType}
            onChange={setTripType}
            options={[
              { value: "round", label: "Round trip" },
              { value: "oneway", label: "One way" },
            ]}
          />
          <SubmitButton loading={status === "loading"} label="Search flights" />
        </div>
      </form>

      <ResultsShell
        status={status}
        count={view.total}
        toolbar={<SortSelect {...view.sort} />}
        summary={
          lastQuery && (
            <>
              {lastQuery.from} → {lastQuery.to} · {formatDate(lastQuery.departDate)}
              {lastQuery.returnDate && ` – ${formatDate(lastQuery.returnDate)}`} · {lastQuery.passengers} traveller
              {lastQuery.passengers > 1 && "s"}
            </>
          )
        }
        emptyText="No flights found for this route. Try a different airport or date."
        className="space-y-3"
      >
        {view.items.map((flight) => <FlightCard key={flight.id} flight={flight} />)}
      </ResultsShell>
    </div>
  );
}

function AirportSelect({
  id,
  value,
  onChange,
  invalid,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
}) {
  return (
    <Select id={id} value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={invalid}>
      {airports.map((a) => (
        <option key={a.code} value={a.code}>
          {a.city} ({a.code})
        </option>
      ))}
    </Select>
  );
}

function FlightCard({ flight }: { flight: Flight }) {
  const initials = flight.airline
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <article
      data-result
      className="grid items-center gap-4 rounded-lg border border-ink-900/8 bg-white p-4 transition hover:border-brand-500/50 hover:shadow-soft sm:p-5 md:grid-cols-[1.2fr_2fr_auto]"
    >
      <div className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-md bg-ink-900 text-sm font-bold text-brand-400">
          {initials}
        </span>
        <div>
          <p className="font-semibold text-ink-900">{flight.airline}</p>
          <p className="text-xs text-ink-700/70">
            {flight.flightNo} · {flight.cabin}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-ink-900">{flight.departTime}</p>
          <p className="text-xs text-ink-700/70">{flight.from}</p>
        </div>
        <div className="flex flex-1 flex-col items-center gap-1">
          <p className="text-xs text-ink-700/70">{formatDuration(flight.durationMins)}</p>
          <div className="relative h-px w-full bg-ink-900/15">
            {Array.from({ length: flight.stops }, (_, i) => (
              <span
                key={i}
                className="absolute top-1/2 size-2 -translate-y-1/2 rounded-full border-2 border-white bg-brand-500"
                style={{ left: `${((i + 1) / (flight.stops + 1)) * 100}%` }}
              />
            ))}
          </div>
          <p className={flight.stops === 0 ? "text-xs font-medium text-emerald-700" : "text-xs text-ink-700/70"}>
            {flight.stops === 0 ? "Non-stop" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
          </p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-ink-900">{flight.arriveTime}</p>
          <p className="text-xs text-ink-700/70">{flight.to}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-ink-900/8 pt-4 md:flex-col md:items-end md:border-0 md:pt-0">
        <div className="md:text-right">
          <p className="text-xl font-bold text-ink-900">{formatPrice(flight.totalPrice)}</p>
          <p className="text-xs text-ink-700/70">{formatPrice(flight.pricePerPerson)} / person</p>
        </div>
        <BookButton />
      </div>
    </article>
  );
}

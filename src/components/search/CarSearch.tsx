"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { Briefcase, CalendarDays, CarFront, Fuel, MapPin, Settings2, Users } from "lucide-react";
import type { CarCategory, CarQuery, CarResult } from "@/types";
import { carLocations } from "@/data/mock";
import { searchCars } from "@/lib/mock-api";
import { useAsyncSearch } from "@/hooks/useAsyncSearch";
import { useToday } from "@/hooks/useToday";
import { addDays, daysBetween, formatDate, formatPrice } from "@/lib/utils";
import { Field, Input, Select } from "@/components/ui/FormField";
import { BookButton, ResultsShell, SortSelect, SubmitButton, useResultsView, type SortOption } from "./shared";

const CATEGORIES: CarQuery["category"][] = ["Any", "Economy", "SUV", "Luxury", "Sports", "Camper"];

const CAR_SORTS: SortOption<CarResult>[] = [
  { id: "price-low", label: "Price: low to high", compare: (a, b) => a.totalPrice - b.totalPrice },
  { id: "price-high", label: "Price: high to low", compare: (a, b) => b.totalPrice - a.totalPrice },
  { id: "seats", label: "Most seats", compare: (a, b) => b.seats - a.seats || a.totalPrice - b.totalPrice },
];

export function CarSearch() {
  const today = useToday();
  const [location, setLocation] = useState(carLocations[0]);
  const [pickUp, setPickUp] = useState<string | null>(null);
  const [dropOff, setDropOff] = useState<string | null>(null);
  const [category, setCategory] = useState<CarQuery["category"]>("Any");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lastQuery, setLastQuery] = useState<CarQuery | null>(null);
  const { status, data, run } = useAsyncSearch(searchCars);
  const view = useResultsView(data, CAR_SORTS, 3);

  const pickUpValue = pickUp ?? (today ? addDays(today, 7) : "");
  const dropOffValue = dropOff ?? (pickUpValue ? addDays(pickUpValue, 4) : "");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!pickUpValue) next.pickUp = "Select a pick-up date.";
    if (dropOffValue <= pickUpValue) next.dropOff = "Drop-off must be after pick-up.";
    setErrors(next);
    if (Object.keys(next).length) return;

    const query: CarQuery = { location, pickUpDate: pickUpValue, dropOffDate: dropOffValue, category };
    setLastQuery(query);
    run(query);
  };

  return (
    <div>
      <form onSubmit={onSubmit} noValidate>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <Field label="Pick-up location" htmlFor="car-loc" icon={MapPin} className="col-span-2 lg:col-span-1">
            <Select id="car-loc" value={location} onChange={(e) => setLocation(e.target.value)}>
              {carLocations.map((loc) => (
                <option key={loc}>{loc}</option>
              ))}
            </Select>
          </Field>
          <Field label="Pick-up date" htmlFor="car-pick" icon={CalendarDays} error={errors.pickUp}>
            <Input
              id="car-pick"
              type="date"
              min={today}
              value={pickUpValue}
              onChange={(e) => setPickUp(e.target.value)}
              aria-invalid={!!errors.pickUp}
            />
          </Field>
          <Field label="Drop-off date" htmlFor="car-drop" icon={CalendarDays} error={errors.dropOff}>
            <Input
              id="car-drop"
              type="date"
              min={pickUpValue}
              value={dropOffValue}
              onChange={(e) => setDropOff(e.target.value)}
              aria-invalid={!!errors.dropOff}
            />
          </Field>
          <Field label="Car type" htmlFor="car-type" icon={CarFront} className="col-span-2 lg:col-span-1">
            <Select id="car-type" value={category} onChange={(e) => setCategory(e.target.value as CarCategory | "Any")}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c === "Any" ? "Any type" : c}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <div className="mt-6 flex justify-end">
          <SubmitButton loading={status === "loading"} label="Find cars" />
        </div>
      </form>

      <ResultsShell
        status={status}
        count={view.total}
        toolbar={<SortSelect {...view.sort} />}
        skeleton="grid"
        summary={
          lastQuery && (
            <>
              {lastQuery.location} · {formatDate(lastQuery.pickUpDate)} – {formatDate(lastQuery.dropOffDate)} ·{" "}
              {daysBetween(lastQuery.pickUpDate, lastQuery.dropOffDate)} days
            </>
          )
        }
        emptyText="No cars available for this type. Try “Any type”."
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {view.items.map((car) => <CarCard key={car.id} car={car} />)}
      </ResultsShell>
    </div>
  );
}

function CarCard({ car }: { car: CarResult }) {
  const specs = [
    { icon: Users, label: `${car.seats} seats` },
    { icon: Briefcase, label: `${car.bags} bags` },
    { icon: Settings2, label: car.transmission },
    { icon: Fuel, label: car.fuel },
  ];

  return (
    <article
      data-result
      className="group flex flex-col overflow-hidden rounded-lg border border-ink-900/8 bg-white transition hover:-translate-y-1 hover:border-brand-500/50 hover:shadow-soft"
    >
      <div className="relative h-44 overflow-hidden">
        <Image
          src={car.image}
          alt={car.model}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-700 group-hover:scale-110"
        />
        <span className="absolute top-3 left-3 rounded-sm bg-paper-50 px-2 py-0.5 text-xs font-medium text-ink-900">
          {car.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="font-semibold text-ink-900">{car.model}</h3>
          <p className="text-xs text-ink-700/70">or similar · by {car.supplier}</p>
        </div>
        <ul className="grid grid-cols-2 gap-2 text-xs text-ink-700">
          {specs.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-1.5">
              <Icon className="size-3.5 text-brand-600" aria-hidden /> {label}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-ink-900/8 pt-4">
          <div>
            <p className="text-lg font-bold text-ink-900">{formatPrice(car.totalPrice)}</p>
            <p className="text-xs text-ink-700/70">
              {formatPrice(car.pricePerDay)} / day · {car.days} days
            </p>
          </div>
          <BookButton label="Book" doneLabel="Booked" />
        </div>
      </div>
    </article>
  );
}

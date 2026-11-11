"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { BedDouble, CalendarDays, DoorOpen, MapPin, Star, Users } from "lucide-react";
import type { HotelQuery, HotelResult } from "@/types";
import { hotelCities } from "@/data/mock";
import { searchHotels } from "@/lib/mock-api";
import { useAsyncSearch } from "@/hooks/useAsyncSearch";
import { useToday } from "@/hooks/useToday";
import { addDays, daysBetween, formatDate, formatPrice } from "@/lib/utils";
import { Field, Input, Select } from "@/components/ui/FormField";
import { BookButton, ResultsShell, SortSelect, SubmitButton, useResultsView, type SortOption } from "./shared";

const HOTEL_SORTS: SortOption<HotelResult>[] = [
  { id: "rating", label: "Top rated", compare: (a, b) => b.rating - a.rating },
  { id: "price-low", label: "Price: low to high", compare: (a, b) => a.totalPrice - b.totalPrice },
  { id: "price-high", label: "Price: high to low", compare: (a, b) => b.totalPrice - a.totalPrice },
  { id: "stars", label: "Most stars", compare: (a, b) => b.stars - a.stars || b.rating - a.rating },
];

export function HotelSearch({ initialCity }: { initialCity?: string }) {
  const today = useToday();
  const [city, setCity] = useState(initialCity ?? "");
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lastQuery, setLastQuery] = useState<HotelQuery | null>(null);
  const { status, data, run } = useAsyncSearch(searchHotels);
  const view = useResultsView(data, HOTEL_SORTS, 3);

  const checkInValue = checkIn ?? (today ? addDays(today, 14) : "");
  const checkOutValue = checkOut ?? (checkInValue ? addDays(checkInValue, 5) : "");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!checkInValue) next.checkIn = "Select a check-in date.";
    if (checkOutValue <= checkInValue) next.checkOut = "Check-out must be after check-in.";
    if (guests > rooms * 4) next.guests = "Max 4 guests per room — add a room.";
    setErrors(next);
    if (Object.keys(next).length) return;

    const query = { city, checkIn: checkInValue, checkOut: checkOutValue, guests, rooms };
    setLastQuery(query);
    run(query);
  };

  return (
    <div>
      <form onSubmit={onSubmit} noValidate>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          <Field label="Destination" htmlFor="ht-city" icon={MapPin} className="col-span-2 lg:col-span-1">
            <Select id="ht-city" value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">All destinations</option>
              {hotelCities.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Select>
          </Field>
          <Field label="Check-in" htmlFor="ht-in" icon={CalendarDays} error={errors.checkIn}>
            <Input
              id="ht-in"
              type="date"
              min={today}
              value={checkInValue}
              onChange={(e) => setCheckIn(e.target.value)}
              aria-invalid={!!errors.checkIn}
            />
          </Field>
          <Field label="Check-out" htmlFor="ht-out" icon={CalendarDays} error={errors.checkOut}>
            <Input
              id="ht-out"
              type="date"
              min={checkInValue}
              value={checkOutValue}
              onChange={(e) => setCheckOut(e.target.value)}
              aria-invalid={!!errors.checkOut}
            />
          </Field>
          <Field label="Guests" htmlFor="ht-guests" icon={Users} error={errors.guests}>
            <Select id="ht-guests" value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
              {Array.from({ length: 8 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} guest{i ? "s" : ""}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Rooms" htmlFor="ht-rooms" icon={DoorOpen}>
            <Select id="ht-rooms" value={rooms} onChange={(e) => setRooms(Number(e.target.value))}>
              {Array.from({ length: 4 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} room{i ? "s" : ""}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <div className="mt-6 flex justify-end">
          <SubmitButton loading={status === "loading"} label="Search hotels" />
        </div>
      </form>

      <ResultsShell
        status={status}
        count={view.total}
        toolbar={<SortSelect {...view.sort} />}
        summary={
          lastQuery && (
            <>
              {lastQuery.city || "All destinations"} · {formatDate(lastQuery.checkIn)} – {formatDate(lastQuery.checkOut)} ·{" "}
              {daysBetween(lastQuery.checkIn, lastQuery.checkOut)} nights
            </>
          )
        }
        emptyText="No hotels match your search. Try another destination."
        className="grid gap-4 lg:grid-cols-2"
      >
        {view.items.map((hotel) => <HotelCard key={hotel.id} hotel={hotel} />)}
      </ResultsShell>
    </div>
  );
}

function HotelCard({ hotel }: { hotel: HotelResult }) {
  return (
    <article
      data-result
      className="group flex flex-col overflow-hidden rounded-lg border border-ink-900/8 bg-white transition hover:border-brand-500/50 hover:shadow-soft sm:flex-row"
    >
      <div className="relative h-48 shrink-0 overflow-hidden sm:h-auto sm:w-44">
        <Image
          src={hotel.image}
          alt={hotel.name}
          fill
          sizes="(min-width: 640px) 176px, 100vw"
          className="object-cover transition duration-700 group-hover:scale-110"
        />
        <span className="absolute top-3 left-3 rounded-sm bg-paper-50 px-1.5 py-0.5 text-xs font-semibold text-ink-900">
          {hotel.rating.toFixed(1)}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div>
          <div className="flex items-center gap-0.5" aria-label={`${hotel.stars}-star hotel`}>
            {Array.from({ length: hotel.stars }, (_, i) => (
              <Star key={i} className="size-3.5 fill-brand-500 text-brand-500" aria-hidden />
            ))}
          </div>
          <h3 className="mt-1 font-semibold text-ink-900">{hotel.name}</h3>
          <p className="flex items-center gap-1 text-xs text-ink-700/70">
            <MapPin className="size-3.5" aria-hidden /> {hotel.city}, {hotel.country} · {hotel.reviews.toLocaleString()} reviews
          </p>
        </div>
        <ul className="flex flex-wrap gap-1.5">
          {hotel.amenities.map((a) => (
            <li key={a} className="rounded-sm bg-paper-100 px-2.5 py-1 text-[11px] font-medium text-ink-700">
              {a}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-ink-700/70">
              <BedDouble className="mr-1 inline size-3.5" aria-hidden />
              {formatPrice(hotel.pricePerNight)} / night
            </p>
            <p className="text-lg font-bold text-ink-900">
              {formatPrice(hotel.totalPrice)}
              <span className="ml-1 text-xs font-normal whitespace-nowrap text-ink-700/70">for {hotel.nights} nights</span>
            </p>
          </div>
          <BookButton label="Reserve" />
        </div>
      </div>
    </article>
  );
}

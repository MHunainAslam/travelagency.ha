/**
 * Fake async "API" that powers the search forms. Each function simulates
 * network latency and returns deterministic results for a given query.
 */
import type {
  CarQuery,
  CarResult,
  Flight,
  FlightQuery,
  HotelQuery,
  HotelResult,
  VisaQuery,
  VisaResult,
  VisaStatus,
} from "@/types";
import { airlines, airports, cars, hotels, visaRules } from "@/data/mock";
import { daysBetween, hashString, seededRandom } from "./utils";

const LATENCY_MS = 900;
const wait = (ms = LATENCY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

const CABIN_MULTIPLIER: Record<FlightQuery["cabin"], number> = {
  Economy: 1,
  "Premium Economy": 1.6,
  Business: 3.2,
  First: 5.5,
};

const toClock = (mins: number) => {
  const m = ((mins % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};

export async function searchFlights(query: FlightQuery): Promise<Flight[]> {
  await wait();
  const from = airports.find((a) => a.code === query.from);
  const to = airports.find((a) => a.code === query.to);
  if (!from || !to || from.code === to.code) return [];

  const routeSeed = hashString(`${from.code}-${to.code}`);
  const random = seededRandom(hashString(`${from.code}-${to.code}-${query.departDate}`));
  // Base duration is stable per route so all options feel consistent.
  const baseDuration = 120 + (routeSeed % 600);

  const results: Flight[] = Array.from({ length: 6 }, (_, i) => {
    const airline = airlines[Math.floor(random() * airlines.length)];
    const stops = random() < 0.45 ? 0 : random() < 0.8 ? 1 : 2;
    const durationMins = Math.round(baseDuration + stops * (70 + random() * 110));
    const departMins = Math.round((300 + random() * 1020) / 5) * 5;
    const base = 90 + baseDuration * 0.55 + random() * 160 - stops * 40;
    const pricePerPerson = Math.round(base * CABIN_MULTIPLIER[query.cabin] * (query.returnDate ? 1.85 : 1));

    return {
      id: `${airline.code}-${i}`,
      airline: airline.name,
      flightNo: `${airline.code} ${100 + Math.floor(random() * 899)}`,
      from: from.code,
      to: to.code,
      departTime: toClock(departMins),
      arriveTime: toClock(departMins + durationMins),
      durationMins,
      stops,
      cabin: query.cabin,
      pricePerPerson,
      totalPrice: pricePerPerson * query.passengers,
    };
  });

  return results.sort((a, b) => a.totalPrice - b.totalPrice).slice(0, 3);
}

export async function searchHotels(query: HotelQuery): Promise<HotelResult[]> {
  await wait();
  const nights = daysBetween(query.checkIn, query.checkOut);
  const city = query.city.trim().toLowerCase();

  return hotels
    .filter((hotel) => !city || hotel.city.toLowerCase().includes(city))
    .map((hotel) => ({
      ...hotel,
      nights,
      totalPrice: hotel.pricePerNight * nights * query.rooms,
    }))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);
}

export async function searchCars(query: CarQuery): Promise<CarResult[]> {
  await wait();
  const days = daysBetween(query.pickUpDate, query.dropOffDate);
  // Small location-based price adjustment so different cities feel different.
  const locationFactor = 0.9 + (hashString(query.location) % 30) / 100;

  return cars
    .filter((car) => query.category === "Any" || car.category === query.category)
    .map((car) => {
      const pricePerDay = Math.round(car.pricePerDay * locationFactor);
      return { ...car, pricePerDay, days, location: query.location, totalPrice: pricePerDay * days };
    })
    .sort((a, b) => a.totalPrice - b.totalPrice)
    .slice(0, 3);
}

const VISA_DOCUMENTS: Record<VisaStatus, string[]> = {
  "visa-free": ["Passport valid for 6+ months", "Return or onward ticket", "Proof of accommodation"],
  "on-arrival": [
    "Passport valid for 6+ months",
    "Return ticket",
    "Hotel booking confirmation",
    "Proof of sufficient funds",
  ],
  "e-visa": [
    "Scanned passport bio page",
    "Recent passport-size photo",
    "Confirmed hotel booking",
    "Flight itinerary",
    "Bank statement (last 3 months)",
  ],
  embassy: [
    "Passport valid for 6+ months with 2 blank pages",
    "Completed application form",
    "Two biometric photos",
    "Travel insurance (min. €30,000 cover)",
    "Bank statements (last 6 months)",
    "Employment letter or business registration",
    "Flight and hotel reservations",
  ],
};

export async function searchVisa(query: VisaQuery): Promise<VisaResult | null> {
  await wait();
  const rule = visaRules[query.destination];
  if (!rule) return null;

  // Study visas always require a full application.
  const status: VisaStatus =
    query.purpose === "Study" ? "embassy" : (rule.exceptions?.[query.nationality] ?? rule.status);

  const documents = [...VISA_DOCUMENTS[status]];
  if (query.purpose === "Business") documents.push("Invitation letter from host company");
  if (query.purpose === "Study") documents.push("Letter of acceptance from institution");

  return {
    nationality: query.nationality,
    destination: query.destination,
    purpose: query.purpose,
    status,
    visaType: status === "visa-free" ? "No visa required" : rule.visaType,
    processing: status === "visa-free" ? "—" : rule.processing,
    stay: rule.stay,
    fee: status === "visa-free" ? 0 : rule.fee,
    documents,
  };
}

export interface ContactMessage {
  name: string;
  email: string;
  phone?: string;
  service: string;
  message: string;
}

/** Simulates posting the contact form to a CRM. */
export async function sendContactMessage(message: ContactMessage): Promise<{ ok: true; ticket: string }> {
  await wait(1100);
  return { ok: true, ticket: `VY-${(hashString(message.email + message.message) % 90000) + 10000}` };
}

export type ServiceId = "visa" | "flights" | "hotels" | "cars";

export interface Service {
  id: ServiceId;
  title: string;
  description: string;
  features: string[];
  highlight: string;
  cta: string;
  image: string;
}

/** Values a section can pass to prefill one of the search forms. */
export interface SearchPreset {
  hotelCity?: string;
  visaDestination?: string;
}

/** One row on the hero departures board. */
export interface Departure {
  id: string;
  /** Shown on the split-flap board (max 10 characters). */
  city: string;
  country: string;
  code: string;
  time: string;
  flight: string;
  gate: string;
  status: "Boarding" | "On time" | "Gate open" | "Final call";
  fare: number;
  image: string;
  alt: string;
  action: { tab: ServiceId; preset?: SearchPreset };
}

export interface Destination {
  id: string;
  city: string;
  country: string;
  image: string;
  priceFrom: number;
  rating: number;
  nights: number;
  tag?: string;
  /** Airport code printed on the postcard. */
  code: string;
  /** Country used to prefill the visa search. */
  visaCountry: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  /** What we arranged for them, e.g. "Schengen visa and a week in Santorini". */
  trip: string;
  quote: string;
  rating: number;
  service: ServiceId;
}

export interface Stat {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  label: string;
}

/* ---------- Search domain ---------- */

export interface Airport {
  code: string;
  city: string;
  country: string;
}

export type CabinClass = "Economy" | "Premium Economy" | "Business" | "First";

export interface FlightQuery {
  from: string;
  to: string;
  departDate: string;
  returnDate?: string;
  passengers: number;
  cabin: CabinClass;
}

export interface Flight {
  id: string;
  airline: string;
  flightNo: string;
  from: string;
  to: string;
  departTime: string;
  arriveTime: string;
  durationMins: number;
  stops: number;
  cabin: CabinClass;
  pricePerPerson: number;
  totalPrice: number;
}

export interface HotelQuery {
  city: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  country: string;
  image: string;
  stars: number;
  rating: number;
  reviews: number;
  pricePerNight: number;
  amenities: string[];
}

export interface HotelResult extends Hotel {
  nights: number;
  totalPrice: number;
}

export type CarCategory = "Economy" | "SUV" | "Luxury" | "Sports" | "Camper";

export interface CarQuery {
  location: string;
  pickUpDate: string;
  dropOffDate: string;
  category: CarCategory | "Any";
}

export interface Car {
  id: string;
  model: string;
  category: CarCategory;
  image: string;
  seats: number;
  bags: number;
  transmission: "Automatic" | "Manual";
  fuel: "Petrol" | "Diesel" | "Hybrid" | "Electric";
  pricePerDay: number;
  supplier: string;
}

export interface CarResult extends Car {
  days: number;
  totalPrice: number;
  location: string;
}

export type VisaStatus = "visa-free" | "on-arrival" | "e-visa" | "embassy";

export interface VisaQuery {
  nationality: string;
  destination: string;
  purpose: "Tourism" | "Business" | "Study";
}

export interface VisaResult {
  nationality: string;
  destination: string;
  purpose: VisaQuery["purpose"];
  status: VisaStatus;
  visaType: string;
  processing: string;
  stay: string;
  fee: number;
  documents: string[];
}

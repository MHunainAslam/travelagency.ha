/**
 * Mock inventory used by the search forms. In production this would be
 * replaced with real supplier APIs (GDS, hotel bed banks, car brokers, etc.).
 */
import type { Airport, Car, CarCategory, Hotel, VisaStatus } from "@/types";
import { unsplash } from "@/lib/utils";

export const airports: Airport[] = [
  { code: "LHR", city: "London", country: "United Kingdom" },
  { code: "CDG", city: "Paris", country: "France" },
  { code: "JFK", city: "New York", country: "United States" },
  { code: "DXB", city: "Dubai", country: "United Arab Emirates" },
  { code: "DOH", city: "Doha", country: "Qatar" },
  { code: "IST", city: "Istanbul", country: "Türkiye" },
  { code: "SIN", city: "Singapore", country: "Singapore" },
  { code: "HND", city: "Tokyo", country: "Japan" },
  { code: "DPS", city: "Bali", country: "Indonesia" },
  { code: "MLE", city: "Malé", country: "Maldives" },
  { code: "JTR", city: "Santorini", country: "Greece" },
  { code: "ZRH", city: "Zurich", country: "Switzerland" },
  { code: "SYD", city: "Sydney", country: "Australia" },
  { code: "KHI", city: "Karachi", country: "Pakistan" },
  { code: "BOM", city: "Mumbai", country: "India" },
  { code: "JED", city: "Jeddah", country: "Saudi Arabia" },
  { code: "YYZ", city: "Toronto", country: "Canada" },
];

export const airlines = [
  { name: "Emirates", code: "EK" },
  { name: "Qatar Airways", code: "QR" },
  { name: "Turkish Airlines", code: "TK" },
  { name: "Singapore Airlines", code: "SQ" },
  { name: "British Airways", code: "BA" },
  { name: "Lufthansa", code: "LH" },
  { name: "Etihad Airways", code: "EY" },
];

/** Photo pools per city: a city shot plus hotel-style shots (Unsplash ids). */
const HOTEL_PHOTOS: Record<string, string[]> = {
  Santorini: ["1570077188670-e3a8d69ac5ff", "1564501049412-61c2a3083791", "1582719508461-905c673771fd", "1571896349842-33c89424de2d"],
  Maldives: ["1514282401047-d79a71a590e8", "1590523277543-a94d2e4eb00b", "1582719508461-905c673771fd", "1520250497591-112f2f40a3f4"],
  Bali: ["1520250497591-112f2f40a3f4", "1537996194471-e657df975ab4", "1582719508461-905c673771fd", "1566073771259-6a8506099945"],
  Dubai: ["1542314831-068cd1dbfeeb", "1551882547-ff40c63fe5fa", "1512453979798-5ea266f8880c", "1571896349842-33c89424de2d"],
  Paris: ["1571896349842-33c89424de2d", "1502602898657-3e91760cbb34", "1542314831-068cd1dbfeeb", "1564501049412-61c2a3083791"],
  Tokyo: ["1566073771259-6a8506099945", "1540959733332-eab4deabeeaf", "1542314831-068cd1dbfeeb", "1571896349842-33c89424de2d"],
  Istanbul: ["1564501049412-61c2a3083791", "1541432901042-2d8bd64b4a9b", "1524231757912-21f4fe3a7200", "1527838832700-5059252407fa"],
  "Swiss Alps": ["1530122037265-a5f1f91d3b99", "1566073771259-6a8506099945", "1476514525535-07fb3b4ae5f1", "1501785888041-af3ef285b470"],
};

const COUNTRY: Record<string, string> = {
  Santorini: "Greece",
  Maldives: "Maldives",
  Bali: "Indonesia",
  Dubai: "United Arab Emirates",
  Paris: "France",
  Tokyo: "Japan",
  Istanbul: "Türkiye",
  "Swiss Alps": "Switzerland",
};

/** [name, stars, guest rating, reviews, price per night, amenities, photo index] */
type HotelRow = [string, number, number, number, number, string[], number];

const HOTEL_ROWS: Record<string, HotelRow[]> = {
  Santorini: [
    ["Caldera Blue Suites", 5, 9.4, 1284, 420, ["Infinity pool", "Sea view", "Breakfast"], 0],
    ["Oia Whitestone Villas", 4, 9.0, 846, 265, ["Pool", "Free Wi-Fi", "Airport shuttle"], 1],
    ["Aegean Cliff House", 5, 9.2, 612, 515, ["Private plunge pool", "Sunset view", "Spa"], 2],
    ["Fira Lantern Hotel", 3, 8.4, 1930, 129, ["Free Wi-Fi", "Rooftop bar", "Breakfast"], 3],
    ["Imerovigli Cave Rooms", 4, 8.9, 734, 198, ["Cave suite", "Hot tub", "Sea view"], 0],
    ["Kamari Beach Residence", 3, 8.2, 1102, 96, ["Beachfront", "Pool", "Free parking"], 2],
  ],
  Maldives: [
    ["Azure Lagoon Overwater Resort", 5, 9.7, 2210, 890, ["Overwater villa", "Spa", "All-inclusive"], 0],
    ["Coral Atoll Retreat", 5, 9.3, 1102, 610, ["Private beach", "Diving centre", "Breakfast"], 1],
    ["Sandbank Island Lodge", 4, 9.0, 688, 345, ["Snorkelling", "Seaplane transfer", "Breakfast"], 2],
    ["Maafushi Guesthouse", 3, 8.6, 1540, 89, ["Beach access", "Free Wi-Fi", "Excursions"], 3],
    ["Reef Pearl Villas", 5, 9.5, 903, 720, ["Overwater villa", "Butler service", "Spa"], 1],
    ["Hulhumalé Sea Breeze", 3, 8.3, 2011, 112, ["Airport shuttle", "Beach view", "Breakfast"], 2],
  ],
  Bali: [
    ["Ubud Jungle Sanctuary", 5, 9.2, 1930, 240, ["Jungle pool", "Yoga deck", "Spa"], 0],
    ["Seminyak Sunset House", 4, 8.8, 744, 145, ["Beachfront", "Rooftop bar", "Free Wi-Fi"], 2],
    ["Canggu Surf Lodge", 3, 8.7, 1205, 68, ["Surfboard hire", "Pool", "Co-working"], 3],
    ["Uluwatu Cliff Villas", 5, 9.4, 566, 380, ["Private pool", "Ocean view", "Spa"], 2],
    ["Sanur Garden Resort", 4, 8.5, 1388, 110, ["Family pool", "Beach access", "Breakfast"], 0],
    ["Rice Terrace Retreat", 4, 9.1, 812, 175, ["Rice-field view", "Cooking class", "Spa"], 1],
  ],
  Dubai: [
    ["Marina Skyline Hotel", 5, 9.1, 3402, 310, ["Rooftop pool", "Gym", "Breakfast"], 0],
    ["Palm Dunes Resort", 4, 8.7, 1520, 185, ["Pool", "Free parking", "Desert tours"], 1],
    ["Downtown Burj View", 5, 9.3, 2780, 395, ["Burj Khalifa view", "Spa", "Fine dining"], 2],
    ["Deira Creek Inn", 3, 8.1, 2240, 72, ["Free Wi-Fi", "Metro nearby", "Breakfast"], 3],
    ["JBR Beach Suites", 4, 8.9, 1675, 228, ["Beach access", "Kids club", "Pool"], 0],
    ["Al Fahidi Heritage House", 4, 9.0, 604, 140, ["Courtyard", "Old town", "Breakfast"], 1],
  ],
  Paris: [
    ["Maison Lumière", 5, 9.0, 2088, 460, ["Eiffel view", "Michelin dining", "Spa"], 0],
    ["Le Petit Marais", 3, 8.6, 1840, 149, ["Free Wi-Fi", "Central", "Breakfast"], 1],
    ["Hôtel Rive Gauche", 4, 8.9, 1265, 239, ["Seine view", "Bar", "Concierge"], 2],
    ["Montmartre Atelier", 4, 9.1, 932, 205, ["Rooftop terrace", "Art studio", "Breakfast"], 3],
    ["Saint-Germain Residence", 5, 9.3, 744, 520, ["Spa", "Private salon", "Breakfast"], 0],
    ["Gare du Nord Budget Stay", 2, 7.8, 3105, 85, ["Free Wi-Fi", "24h desk", "Metro nearby"], 1],
  ],
  Tokyo: [
    ["Shibuya Garden Hotel", 4, 8.9, 1675, 210, ["Onsen", "City view", "Free Wi-Fi"], 0],
    ["Shinjuku Capsule Plus", 2, 8.3, 4120, 45, ["Capsule pod", "Sauna", "Lockers"], 1],
    ["Ginza Imperial Tower", 5, 9.4, 1388, 480, ["Skyline view", "Spa", "Fine dining"], 2],
    ["Asakusa Ryokan Sakura", 4, 9.2, 906, 190, ["Tatami rooms", "Kaiseki dinner", "Onsen"], 3],
    ["Odaiba Bay Hotel", 4, 8.6, 1452, 165, ["Bay view", "Pool", "Shuttle"], 0],
    ["Ueno Park Inn", 3, 8.4, 2207, 98, ["Free Wi-Fi", "Park view", "Breakfast"], 1],
  ],
  Istanbul: [
    ["Bosphorus Pearl Palace", 5, 9.2, 1388, 230, ["Bosphorus view", "Hammam", "Breakfast"], 0],
    ["Sultanahmet Old Town Inn", 3, 8.7, 2954, 79, ["Blue Mosque view", "Rooftop", "Breakfast"], 1],
    ["Galata Tower Suites", 4, 9.0, 1120, 145, ["City view", "Free Wi-Fi", "Bar"], 2],
    ["Karaköy Design Hotel", 4, 8.8, 876, 160, ["Rooftop bar", "Gym", "Breakfast"], 3],
    ["Bebek Waterfront Residence", 5, 9.4, 512, 340, ["Waterfront", "Spa", "Fine dining"], 0],
    ["Kadıköy Market Rooms", 3, 8.3, 1435, 64, ["Ferry nearby", "Free Wi-Fi", "Café"], 2],
  ],
  "Swiss Alps": [
    ["Lauterbrunnen Alpine Lodge", 4, 9.5, 690, 340, ["Mountain view", "Sauna", "Ski storage"], 0],
    ["Grindelwald Chalet Eiger", 4, 9.2, 1042, 295, ["Eiger view", "Fireplace", "Breakfast"], 1],
    ["Interlaken Lakeside Hotel", 3, 8.6, 1876, 165, ["Lake view", "Free Wi-Fi", "Bike hire"], 2],
    ["Wengen Summit Retreat", 5, 9.6, 433, 520, ["Ski-in/ski-out", "Spa", "Fine dining"], 3],
    ["Mürren Cliffside Inn", 3, 8.9, 618, 185, ["Car-free village", "Terrace", "Breakfast"], 0],
    ["Zermatt Matterhorn Lodge", 5, 9.4, 987, 610, ["Matterhorn view", "Indoor pool", "Spa"], 1],
  ],
};

export const hotels: Hotel[] = Object.entries(HOTEL_ROWS).flatMap(([city, rows], c) =>
  rows.map(([name, stars, rating, reviews, pricePerNight, amenities, photo], i) => ({
    id: `h${c + 1}-${i + 1}`,
    name,
    city,
    country: COUNTRY[city],
    image: unsplash(HOTEL_PHOTOS[city][photo], 600),
    stars,
    rating,
    reviews,
    pricePerNight,
    amenities,
  })),
);

export const hotelCities = Object.keys(HOTEL_ROWS);

const CAR_PHOTOS = {
  economy: "1449965408869-eaa3f722e40d",
  suv: "1519641471654-76ce0107ad1b",
  bigSuv: "1533473359331-0135ef1b58bf",
  luxury: "1503376780353-7e6692767b70",
  muscle: "1494976388531-d1058494cdd8",
  sports: "1552519507-da3b142c6e3d",
  camper: "1469854523086-cc02fe5d8800",
} as const;

/** [model, category, photo, seats, bags, transmission, fuel, price per day, supplier] */
type CarRow = [string, CarCategory, keyof typeof CAR_PHOTOS, number, number, Car["transmission"], Car["fuel"], number, string];

const CAR_ROWS: CarRow[] = [
  ["Toyota Corolla Hybrid", "Economy", "economy", 5, 3, "Automatic", "Hybrid", 38, "Hertz"],
  ["Volkswagen Golf", "Economy", "economy", 5, 3, "Manual", "Petrol", 35, "Europcar"],
  ["Kia Picanto", "Economy", "economy", 4, 1, "Manual", "Petrol", 24, "Budget"],
  ["Hyundai Elantra", "Economy", "economy", 5, 3, "Automatic", "Petrol", 36, "Enterprise"],
  ["Honda CR-V Hybrid", "SUV", "suv", 5, 4, "Automatic", "Hybrid", 64, "Avis"],
  ["Toyota RAV4", "SUV", "suv", 5, 4, "Automatic", "Hybrid", 69, "Sixt"],
  ["Kia Sportage", "SUV", "suv", 5, 3, "Automatic", "Diesel", 58, "Budget"],
  ["Jeep Grand Cherokee", "SUV", "bigSuv", 5, 4, "Automatic", "Petrol", 88, "Alamo"],
  ["Ford Expedition", "SUV", "bigSuv", 7, 5, "Automatic", "Petrol", 92, "Hertz"],
  ["Porsche Panamera", "Luxury", "luxury", 4, 2, "Automatic", "Hybrid", 289, "Sixt"],
  ["Mercedes-Benz E-Class", "Luxury", "luxury", 5, 3, "Automatic", "Hybrid", 165, "Sixt"],
  ["BMW 7 Series", "Luxury", "luxury", 5, 3, "Automatic", "Hybrid", 210, "Avis"],
  ["Tesla Model S", "Luxury", "luxury", 5, 3, "Automatic", "Electric", 175, "Hertz"],
  ["Ford Mustang GT", "Sports", "muscle", 4, 2, "Automatic", "Petrol", 149, "Hertz"],
  ["Chevrolet Camaro", "Sports", "sports", 4, 2, "Manual", "Petrol", 135, "Enterprise"],
  ["BMW M4 Convertible", "Sports", "muscle", 4, 2, "Automatic", "Petrol", 198, "Sixt"],
  ["Porsche 911 Carrera", "Sports", "sports", 4, 1, "Automatic", "Petrol", 325, "Sixt"],
  ["VW California Camper", "Camper", "camper", 4, 4, "Manual", "Diesel", 118, "Roadsurfer"],
  ["Mercedes Marco Polo", "Camper", "camper", 4, 4, "Automatic", "Diesel", 139, "Indie Campers"],
  ["Ford Transit Nugget", "Camper", "camper", 4, 4, "Manual", "Diesel", 109, "McRent"],
];

export const cars: Car[] = CAR_ROWS.map(
  ([model, category, photo, seats, bags, transmission, fuel, pricePerDay, supplier], i) => ({
    id: `c${i + 1}`,
    model,
    category,
    image: unsplash(CAR_PHOTOS[photo], 600),
    seats,
    bags,
    transmission,
    fuel,
    pricePerDay,
    supplier,
  }),
);

export const carLocations = [
  "Dubai International Airport (DXB)",
  "London Heathrow (LHR)",
  "Paris Charles de Gaulle (CDG)",
  "Istanbul Airport (IST)",
  "Zurich Airport (ZRH)",
  "New York JFK (JFK)",
  "Tokyo Haneda (HND)",
  "Bali Ngurah Rai (DPS)",
];

export const nationalities = [
  "Australia",
  "Canada",
  "India",
  "Pakistan",
  "Saudi Arabia",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
];

interface VisaRule {
  /** Default requirement for most passports. */
  status: VisaStatus;
  visaType: string;
  processing: string;
  stay: string;
  fee: number;
  /** Overrides keyed by nationality. */
  exceptions?: Partial<Record<string, VisaStatus>>;
}

export const visaRules: Record<string, VisaRule> = {
  "Schengen Area": {
    status: "embassy",
    visaType: "Schengen Short-stay (Type C)",
    processing: "10–15 working days",
    stay: "Up to 90 days in 180",
    fee: 95,
    exceptions: {
      "United Kingdom": "visa-free",
      "United States": "visa-free",
      Canada: "visa-free",
      Australia: "visa-free",
      "United Arab Emirates": "visa-free",
    },
  },
  "United Arab Emirates": {
    status: "e-visa",
    visaType: "UAE Tourist e-Visa",
    processing: "2–4 working days",
    stay: "30 or 60 days",
    fee: 110,
    exceptions: {
      "United Kingdom": "on-arrival",
      "United States": "on-arrival",
      Canada: "on-arrival",
      Australia: "on-arrival",
      "Saudi Arabia": "visa-free",
      "United Arab Emirates": "visa-free",
    },
  },
  "United Kingdom": {
    status: "embassy",
    visaType: "Standard Visitor Visa",
    processing: "15 working days",
    stay: "Up to 6 months",
    fee: 155,
    exceptions: {
      "United States": "e-visa",
      Canada: "e-visa",
      Australia: "e-visa",
      "United Arab Emirates": "e-visa",
      "Saudi Arabia": "e-visa",
      "United Kingdom": "visa-free",
    },
  },
  "United States": {
    status: "embassy",
    visaType: "B1/B2 Visitor Visa",
    processing: "3–8 weeks (interview required)",
    stay: "Up to 6 months",
    fee: 185,
    exceptions: {
      "United Kingdom": "e-visa",
      Australia: "e-visa",
      Canada: "visa-free",
      "United States": "visa-free",
    },
  },
  Türkiye: {
    status: "e-visa",
    visaType: "Türkiye e-Visa",
    processing: "Within 24 hours",
    stay: "Up to 30 days",
    fee: 60,
    exceptions: {
      "United Kingdom": "visa-free",
      "United States": "visa-free",
      "United Arab Emirates": "visa-free",
      "Saudi Arabia": "visa-free",
    },
  },
  Japan: {
    status: "embassy",
    visaType: "Temporary Visitor Visa",
    processing: "5–7 working days",
    stay: "Up to 15–90 days",
    fee: 30,
    exceptions: {
      "United Kingdom": "visa-free",
      "United States": "visa-free",
      Canada: "visa-free",
      Australia: "visa-free",
      "United Arab Emirates": "visa-free",
      India: "e-visa",
    },
  },
  Indonesia: {
    status: "on-arrival",
    visaType: "Visa on Arrival (B1)",
    processing: "On arrival or 1–2 days online",
    stay: "Up to 30 days",
    fee: 35,
    exceptions: {
      Pakistan: "e-visa",
    },
  },
  Maldives: {
    status: "on-arrival",
    visaType: "Tourist Visa on Arrival",
    processing: "Issued on arrival",
    stay: "Up to 30 days",
    fee: 0,
  },
};

export const visaDestinations = Object.keys(visaRules);

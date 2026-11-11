# HA Travel — Travel Agency Website

A fully responsive travel agency site with a bold "boarding pass" design, built with **Next.js 16 (App Router)**, **Tailwind CSS v4** and **GSAP 3**.
Services: Visa Services, Flight Booking, Hotel Booking and Car Rental.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Features

- **Working search forms (mock data):** flights (round trip/one way, cabin, travellers), hotels, car rental and visa requirements. Each form validates its input, simulates network latency and shows loading, empty and result states.
- **Linked UI:** service cards and destination cards open the matching search tab and prefill it (for example, *Hotels* under Tokyo).
- **Sections:** hero with a split-flap departures board and airplane-window photo, route ticker, ticket-style search, services as boarding passes, passport-stamp "why us" with counters, postcard destinations, flipping postcard reviews, check-in-desk contact form and footer with a newsletter sign-up.
- **GSAP:** split-flap board animation, hero intro (SplitText), window-blind photo swaps, a plane orbiting on a MotionPath, swinging luggage tag, scroll reveals and heading line reveals (ScrollTrigger), passport stamps thumping in, count-up counters, hover timelines on passes and postcards, a sliding tab pill that eases between panel heights, a scroll-reactive route ticker and a postcard flip for reviews.
- **Accessibility:** respects `prefers-reduced-motion`, has keyboard-navigable tabs, labelled form errors and no-JS fallbacks. Hover-only effects are skipped on touch devices.

## Project structure

```
src/
├─ app/                 # layout, page, global styles (Tailwind theme tokens)
├─ components/
│  ├─ layout/           # Navbar, Footer, NewsletterForm
│  ├─ sections/         # Hero, Ticker, SearchPanel, Services, WhyUs, Destinations, Testimonials, Contact
│  ├─ search/           # FlightSearch, HotelSearch, CarSearch, VisaSearch + shared result UI
│  └─ ui/               # Button, SplitFlap, Ticket, Reveal, Counter, SectionHeading, FormField, cards…
├─ context/             # SearchContext (active tab + prefill presets)
├─ data/                # site config, page content, mock inventory
├─ hooks/               # useAsyncSearch, useToday, useClock, useHoverTimeline
├─ lib/                 # gsap setup, mock API, utilities
└─ types/               # shared TypeScript types
```

To connect real suppliers, replace the functions in `src/lib/mock-api.ts`. Their signatures already match what the forms expect.

> Visa information is demo data only and is not official guidance.

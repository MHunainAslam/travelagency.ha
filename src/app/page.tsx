import { SearchProvider } from "@/context/SearchContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollManager } from "@/components/layout/ScrollManager";
import { BackToTop } from "@/components/layout/BackToTop";
import { Hero } from "@/components/sections/Hero";
import { SearchPanel } from "@/components/sections/SearchPanel";
import { Ticker } from "@/components/sections/Ticker";
import { Services } from "@/components/sections/Services";
import { WhyUs } from "@/components/sections/WhyUs";
import { Destinations } from "@/components/sections/Destinations";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <SearchProvider>
      <ScrollManager />
      <Navbar />
      <main>
        <Hero />
        <Ticker />
        <SearchPanel />
        <Services />
        <WhyUs />
        <Destinations />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </SearchProvider>
  );
}

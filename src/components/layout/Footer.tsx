import { ArrowRight } from "lucide-react";
import { footerLinks, siteConfig } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Logo, socialLinks } from "@/components/ui/Misc";
import { Reveal } from "@/components/ui/Reveal";
import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  return (
    <footer className="bg-ink-950 pt-16 text-white sm:pt-20">
      <Container>
        {/* Closing call to action */}
        <Reveal className="relative overflow-hidden rounded-[28px] bg-brand-500 p-8 sm:p-12">
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="font-mono text-[11px] tracking-[0.18em] text-signal-300 uppercase">Final call</p>
              <h2 className="mt-3 font-display text-4xl font-extrabold tracking-[-0.035em] sm:text-5xl">
                Ready for <span className="whitespace-nowrap">take-off?</span>
              </h2>
              <p className="mt-3 max-w-md text-white/80">
                Tell us where you want to go. We&apos;ll reply within two working hours.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
              <Button href="#search" variant="accent" size="lg" className="px-4 sm:px-7">
                Plan a trip <ArrowRight className="size-4.5" aria-hidden />
              </Button>
              <Button href="#contact" variant="light" size="lg" className="px-4 sm:px-7">
                Contact us
              </Button>
            </div>
          </div>
        </Reveal>

        {/* Brand + links */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-16 sm:gap-12 lg:grid-cols-12">
          <div className="col-span-2 lg:col-span-4">
            <Logo tone="light" />
            <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-white/60">{siteConfig.description}</p>
            <ul className="mt-6 flex gap-2">
              {socialLinks.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    className="grid size-10 place-items-center rounded-full bg-white/5 text-white/70 transition-colors hover:bg-signal-400 hover:text-ink-950"
                  >
                    <Icon className="size-4" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading} className="lg:col-span-2">
              <h3 className="font-mono text-[11px] tracking-[0.18em] text-white/40 uppercase">{heading}</h3>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="link-underline text-[15px] text-white/80 hover:text-white">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 sm:col-span-1 lg:col-span-2">
            <h3 className="font-mono text-[11px] tracking-[0.18em] text-white/40 uppercase">Find us</h3>
            <address className="mt-4 space-y-2.5 text-[15px] text-white/80 not-italic">
              <p>{siteConfig.contact.address}</p>
              <p>{siteConfig.contact.phone}</p>
              <p className="break-all">{siteConfig.contact.email}</p>
            </address>
          </div>
        </div>

        {/* Newsletter */}
        <div className="grid gap-6 border-t border-white/10 py-10 lg:grid-cols-2 lg:items-end">
          <div>
            <h3 className="font-display text-2xl font-extrabold tracking-[-0.02em]">Cheap fares, once a month.</h3>
            <p className="mt-1 text-[15px] text-white/60">Deals and visa rule changes. No spam, unsubscribe anytime.</p>
          </div>
          <NewsletterForm />
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 py-6 font-mono text-[11px] tracking-[0.14em] text-white/40 uppercase sm:flex-row sm:justify-between">
          <p>© 2026 {siteConfig.name} Travel Ltd.</p>
          <p>IATA accredited · Secure payments</p>
        </div>
      </Container>
    </footer>
  );
}

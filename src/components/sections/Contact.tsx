"use client";

import { useRef, useState, type FormEvent } from "react";
import { Mail, Phone, RotateCcw, Send, User } from "lucide-react";
import type { ServiceId } from "@/types";
import { siteConfig } from "@/data/site";
import { services } from "@/data/content";
import { sendContactMessage } from "@/lib/mock-api";
import { gsap, useGSAP } from "@/lib/gsap";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Field, Input, Select, Textarea } from "@/components/ui/FormField";
import { Reveal } from "@/components/ui/Reveal";
import { Highlight, SectionHeading } from "@/components/ui/SectionHeading";
import { Barcode } from "@/components/ui/Misc";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormValues {
  name: string;
  email: string;
  phone: string;
  service: ServiceId | "";
  message: string;
}

const EMPTY: FormValues = { name: "", email: "", phone: "", service: "", message: "" };

function validate(v: FormValues): Partial<Record<keyof FormValues, string>> {
  const errors: Partial<Record<keyof FormValues, string>> = {};
  if (v.name.trim().length < 2) errors.name = "Please enter your full name.";
  if (!EMAIL_RE.test(v.email)) errors.email = "Please enter a valid email address.";
  if (v.phone && !/^[+\d\s()-]{7,}$/.test(v.phone)) errors.phone = "Please enter a valid phone number.";
  if (!v.service) errors.service = "Select the service you need.";
  if (v.message.trim().length < 10) errors.message = "Tell us a little more (at least 10 characters).";
  return errors;
}

const CONTACT_ITEMS = [
  { label: "Phone or WhatsApp", value: siteConfig.contact.phone },
  { label: "Email", value: siteConfig.contact.email },
  { label: "Office", value: siteConfig.contact.address },
  { label: "Opening hours", value: siteConfig.contact.hours },
];

export function Contact() {
  const successRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [errors, setErrors] = useState<ReturnType<typeof validate>>({});
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  const update = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const next = validate(values);
    setErrors(next);
    if (Object.keys(next).length) {
      document.getElementById(`contact-${Object.keys(next)[0]}`)?.focus();
      return;
    }
    setState("sending");
    await sendContactMessage(values);
    setState("sent");
  };

  // Success animation: draw the check mark and pop the card.
  useGSAP(
    () => {
      if (state !== "sent") return;
      gsap
        .timeline()
        .from(successRef.current, { scale: 0.92, autoAlpha: 0, duration: 0.6, ease: "back.out(1.6)" })
        .from("[data-check-path]", { strokeDashoffset: 60, duration: 0.6, ease: "power2.out" }, "-=0.2")
        .from("[data-success-line]", { y: 16, autoAlpha: 0, stagger: 0.1, duration: 0.5 }, "-=0.3");
    },
    { scope: successRef, dependencies: [state] },
  );

  const fieldProps = (key: keyof FormValues) => ({
    id: `contact-${key}`,
    name: key,
    value: values[key],
    "aria-invalid": !!errors[key],
    "aria-describedby": errors[key] ? `contact-${key}-error` : undefined,
  });

  return (
    <section id="contact" className="scroll-mt-20 py-24 sm:py-32">
      <Container>
        <SectionHeading
          index="05"
          label="Contact"
          title={
            <>
              Talk to a real <Highlight>human.</Highlight>
            </>
          }
          description="A line or two is plenty. Someone from the team will reply within two working hours, usually with a couple of questions and a rough price."
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <Reveal stagger="[data-contact-item]" className="lg:col-span-4">
            {/* Check-in desk card */}
            <div className="rounded-[26px] bg-ink-900 p-6 text-white shadow-lift sm:p-8">
              <p data-contact-item className="font-mono text-[11px] tracking-[0.18em] text-signal-400 uppercase">
                Check-in desk · Open now
              </p>
              <dl className="mt-4">
                {CONTACT_ITEMS.map(({ label, value }) => (
                  <div data-contact-item key={label} className="border-t border-white/10 py-4">
                    <dt className="font-mono text-[11px] tracking-[0.16em] text-white/50 uppercase">{label}</dt>
                    <dd className="mt-1 text-[15px] break-words">{value}</dd>
                  </div>
                ))}
              </dl>
              <Barcode value="ha-checkin" className="mt-4 h-10 w-full text-white/80" />
            </div>
          </Reveal>

          <Reveal className="lg:col-span-8">
            <div className="rounded-[26px] bg-white p-5 shadow-lift ring-1 ring-ink-900/5 sm:p-8">
              {state === "sent" ? (
                <div ref={successRef} className="flex flex-col items-center py-12 text-center" role="status">
                  <svg viewBox="0 0 52 52" className="size-20" aria-hidden>
                    <circle cx="26" cy="26" r="25" fill="#2f4bff" />
                    <path
                      data-check-path
                      d="M15 27l7 7 15-16"
                      fill="none"
                      stroke="#ffd23f"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="60"
                      strokeDashoffset="0"
                    />
                  </svg>
                  <h3 data-success-line className="mt-6 font-display text-3xl font-extrabold tracking-tight text-ink-900">
                    Thanks, {values.name.split(" ")[0]}.
                  </h3>
                  <p data-success-line className="mt-3 max-w-sm text-ink-700">
                    We&apos;ve got your message and will reply to{" "}
                    <span className="font-medium text-ink-900">{values.email}</span> within two working hours.
                  </p>
                  <div data-success-line className="mt-8">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setValues(EMPTY);
                        setState("idle");
                      }}
                    >
                      <RotateCcw className="size-4" aria-hidden /> Send another message
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full name" htmlFor="contact-name" icon={User} error={errors.name}>
                    <Input
                      {...fieldProps("name")}
                      autoComplete="name"
                      placeholder="Jane Doe"
                      onChange={(e) => update("name", e.target.value)}
                    />
                  </Field>
                  <Field label="Email" htmlFor="contact-email" icon={Mail} error={errors.email}>
                    <Input
                      {...fieldProps("email")}
                      type="email"
                      autoComplete="email"
                      placeholder="jane@example.com"
                      onChange={(e) => update("email", e.target.value)}
                    />
                  </Field>
                  <Field label="Phone (optional)" htmlFor="contact-phone" icon={Phone} error={errors.phone}>
                    <Input
                      {...fieldProps("phone")}
                      type="tel"
                      autoComplete="tel"
                      placeholder="+1 555 000 0000"
                      onChange={(e) => update("phone", e.target.value)}
                    />
                  </Field>
                  <Field label="Service" htmlFor="contact-service" error={errors.service}>
                    <Select
                      {...fieldProps("service")}
                      hasIcon={false}
                      onChange={(e) => update("service", e.target.value as ServiceId)}
                    >
                      <option value="">
                        Choose a service
                      </option>
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Message" htmlFor="contact-message" error={errors.message} className="sm:col-span-2">
                    <Textarea
                      {...fieldProps("message")}
                      rows={5}
                      placeholder="Where would you like to go, when, and with whom?"
                      onChange={(e) => update("message", e.target.value)}
                    />
                  </Field>
                  <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-ink-700">We only use your details to reply to you.</p>
                    <Button type="submit" size="lg">
                      {state === "sending" ? "Sending…" : "Send message"}
                      <Send className="size-4" aria-hidden />
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

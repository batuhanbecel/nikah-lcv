"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MotionSection, motionItemVariants } from "@/components/motion-section";
import { event } from "@/lib/event";

const details = [
  { icon: Calendar, label: "Nikah Tarihi", value: event.dateLabel },
  { icon: Clock, label: "Saat", value: event.timeLabel },
  { icon: MapPin, label: "Konum", value: event.venue }
];

export function EventDetailsSection() {
  return (
    <MotionSection id="details" className="overflow-hidden">
      <div className="section-veil" aria-hidden="true" />
      <div className="absolute inset-x-0 top-12 h-96 bg-[radial-gradient(ellipse_at_50%_42%,rgba(184,140,255,0.11),rgba(184,140,255,0.04)_38%,transparent_72%)] blur-2xl" aria-hidden="true" />
      <div className="section-shell relative">
        <motion.div variants={motionItemVariants} className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-purple">Detaylar</p>
          <h2 className="mt-5 font-serif text-5xl leading-tight text-white md:text-7xl">Bu anı birlikte yaşayalım.</h2>
        </motion.div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {details.map((item) => (
            <motion.div
              key={item.label}
              variants={motionItemVariants}
              className="glass dark-panel flex min-h-44 flex-col items-center justify-center rounded-2xl p-6 text-center text-white shadow-[0_26px_86px_rgba(0,0,0,0.38),0_0_38px_rgba(184,140,255,0.08)] md:p-7"
            >
              <item.icon className="h-6 w-6 text-purple drop-shadow-[0_0_18px_rgba(184,140,255,0.38)]" />
              <p className="mt-5 text-sm text-white/46">{item.label}</p>
              <p className="mt-2 font-serif text-3xl leading-tight">{item.value}</p>
            </motion.div>
          ))}
        </div>

        <motion.div variants={motionItemVariants} className="mt-6 overflow-hidden rounded-3xl border border-white/[0.07] shadow-[0_35px_110px_rgba(0,0,0,0.4),0_0_42px_rgba(184,140,255,0.08)]">
          <iframe
            title="Beykoz Nikah Dairesi harita"
            src={event.mapsEmbed}
            className="h-[420px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
        <motion.div variants={motionItemVariants} className="mt-8 text-center">
          <Button asChild>
            <a href={event.mapsUrl} target="_blank" rel="noreferrer">
              <Navigation className="h-4 w-4" />
              Google Maps ile Aç
            </a>
          </Button>
        </motion.div>
      </div>
    </MotionSection>
  );
}

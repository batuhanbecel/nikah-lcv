"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Calendar, Clock, MapPin, Navigation } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { MotionSection, motionItemVariants } from "@/components/motion-section";
import { event } from "@/lib/event";

const details = [
  { icon: Calendar, label: "Nikah Tarihi", value: event.dateLabel },
  { icon: Clock, label: "Saat", value: event.timeLabel },
  { icon: MapPin, label: "Konum", value: event.venue }
];

export function EventDetailsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  return (
    <MotionSection id="details" className="bg-white">
      <motion.div
        style={{ y }}
        className="absolute inset-x-0 top-20 h-72 bg-[radial-gradient(circle_at_50%_50%,rgba(111,61,197,0.13),transparent_62%)]"
      />
      <div className="section-shell relative" ref={ref}>
        <motion.div variants={motionItemVariants} className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-purple">Detaylar</p>
          <h2 className="mt-5 font-serif text-5xl leading-tight md:text-7xl">Bu anı birlikte yaşayalım.</h2>
        </motion.div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {details.map((item) => (
            <motion.div key={item.label} variants={motionItemVariants} className="glass rounded-2xl p-6 md:p-7">
              <item.icon className="h-6 w-6 text-purple" />
              <p className="mt-6 text-sm text-black/45">{item.label}</p>
              <p className="mt-2 font-serif text-3xl">{item.value}</p>
            </motion.div>
          ))}
        </div>

        <motion.div variants={motionItemVariants} className="mt-6 overflow-hidden rounded-3xl border border-black/10 shadow-[0_35px_100px_rgba(0,0,0,0.13)]">
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

"use client";

import { motion } from "framer-motion";
import { event } from "@/lib/event";

export function Footer() {
  return (
    <footer className="relative overflow-hidden px-5 pb-16 pt-12 text-center text-white sm:px-6 sm:py-20">
      <div
        className="absolute inset-x-0 bottom-0 h-56 bg-[radial-gradient(ellipse_at_50%_100%,rgba(184,140,255,0.12),transparent_66%)]"
        aria-hidden="true"
      />
      <motion.div
        className="relative mx-auto mb-10 hidden h-px max-w-lg bg-gradient-to-r from-transparent via-purple/45 to-transparent shadow-[0_0_22px_rgba(184,140,255,0.22)] sm:block"
        animate={{ opacity: [0.5, 0.9, 0.5], scaleX: [0.92, 1, 0.92] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative">
        <p className="font-serif text-[clamp(3rem,13vw,5rem)] leading-none drop-shadow-[0_0_30px_rgba(255,255,255,0.12)]">
          {event.couple}
        </p>
        <p className="mt-5 text-xs uppercase tracking-[0.28em] text-purple sm:text-sm sm:tracking-[0.34em]">
          {event.dateLabel}
        </p>
      </div>
    </footer>
  );
}

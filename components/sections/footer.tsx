"use client";

import { motion } from "framer-motion";
import { event } from "@/lib/event";

export function Footer() {
  return (
    <footer className="relative overflow-hidden px-4 py-20 text-center text-white">
      <div className="fairy-transition top-0 opacity-80" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-[radial-gradient(ellipse_at_50%_100%,rgba(184,140,255,0.14),transparent_62%)]" aria-hidden="true" />
      <motion.div
        className="relative mx-auto mb-10 h-px max-w-lg bg-gradient-to-r from-transparent via-purple/55 to-transparent shadow-[0_0_22px_rgba(184,140,255,0.28)]"
        animate={{ opacity: [0.5, 0.9, 0.5], scaleX: [0.92, 1, 0.92] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative">
        <p className="font-serif text-5xl leading-none drop-shadow-[0_0_30px_rgba(255,255,255,0.12)]">{event.couple}</p>
        <p className="mt-5 text-sm uppercase tracking-[0.34em] text-purple">{event.dateLabel}</p>
      </div>
    </footer>
  );
}

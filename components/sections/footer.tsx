"use client";

import { motion } from "framer-motion";
import { event } from "@/lib/event";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-black px-4 py-16 text-center text-white">
      <motion.div
        className="mx-auto mb-10 h-px max-w-lg bg-gradient-to-r from-transparent via-purple-soft to-transparent"
        animate={{ opacity: [0.45, 1, 0.45], scaleX: [0.88, 1, 0.88] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <p className="font-serif text-5xl">{event.couple}</p>
      <p className="mt-3 text-sm uppercase tracking-[0.34em] text-white/48">{event.dateLabel}</p>
    </footer>
  );
}

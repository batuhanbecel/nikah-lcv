"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { AmbientBackground } from "@/components/ambient-background";
import { MotionSection, motionItemVariants } from "@/components/motion-section";
import { event } from "@/lib/event";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(): TimeLeft {
  const target = new Date(event.targetDate).getTime();
  const distance = Math.max(target - Date.now(), 0);
  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((distance / (1000 * 60)) % 60),
    seconds: Math.floor((distance / 1000) % 60)
  };
}

export function CountdownSection() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const units = useMemo(
    () => [
      ["Gün", timeLeft?.days],
      ["Saat", timeLeft?.hours],
      ["Dakika", timeLeft?.minutes],
      ["Saniye", timeLeft?.seconds]
    ],
    [timeLeft]
  );

  useEffect(() => {
    const initial = window.setTimeout(() => setTimeLeft(getTimeLeft()), 0);
    const timer = window.setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(timer);
    };
  }, []);

  return (
    <MotionSection className="bg-white">
      <AmbientBackground />
      <div className="section-shell relative">
        <motion.div variants={motionItemVariants} className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-purple">Geri Sayım</p>
          <h2 className="mt-4 font-serif text-5xl leading-tight md:text-7xl">O güne kalan zarif heyecan</h2>
        </motion.div>
        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {units.map(([label, value]) => (
            <motion.div
              variants={motionItemVariants}
              key={label}
              className="glass purple-glow rounded-2xl p-6 text-center md:p-8"
            >
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={value}
                  initial={{ opacity: 0, y: 12, filter: "blur(5px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -12, filter: "blur(5px)" }}
                  transition={{ duration: 0.35 }}
                  className="block font-serif text-5xl font-semibold md:text-7xl"
                >
                  {typeof value === "number" ? String(value).padStart(2, "0") : "--"}
                </motion.span>
              </AnimatePresence>
              <span className="mt-3 block text-xs font-semibold uppercase tracking-[0.28em] text-black/50">{label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </MotionSection>
  );
}

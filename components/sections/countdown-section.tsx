"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
    <MotionSection className="overflow-hidden">
      <div className="section-veil" aria-hidden="true" />
      <div className="section-shell relative">
        <div className="grid items-center gap-10 lg:grid-cols-[0.82fr_1.18fr]">
          <motion.div variants={motionItemVariants}>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.38em] text-purple">
              <Heart className="h-4 w-4 fill-purple/30" />
              Geri Sayım
            </p>
            <h2 className="mt-5 max-w-2xl font-serif text-5xl leading-[0.95] text-white md:text-7xl">
              O güne kalan zarif heyecan
            </h2>
            <p className="mt-6 max-w-md text-base leading-8 text-white/58 md:text-lg">
              Her saniye biraz daha yaklaşan, sakin ama büyülü bir bekleyiş.
            </p>
          </motion.div>

          <motion.div
            variants={motionItemVariants}
            className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.045] p-4 shadow-[0_28px_100px_rgba(0,0,0,0.34)] backdrop-blur-xl md:p-6"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(184,140,255,0.18),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_52%)]" />
            <div className="relative grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {units.map(([label, value], index) => (
                <motion.div
                  variants={motionItemVariants}
                  key={label}
                  className="group rounded-[1.35rem] border border-white/12 bg-[#120b20]/86 p-5 text-center text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] md:p-6"
                >
                  <span className="mx-auto mb-5 block h-px w-10 bg-purple/42 transition group-hover:w-14" />
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={value}
                      initial={{ opacity: 0, y: 12, filter: "blur(5px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -12, filter: "blur(5px)" }}
                      transition={{ duration: 0.35, delay: index * 0.03 }}
                      className="block font-serif text-5xl font-semibold leading-none md:text-7xl"
                    >
                      {typeof value === "number" ? String(value).padStart(2, "0") : "--"}
                    </motion.span>
                  </AnimatePresence>
                  <span className="mt-4 block text-xs font-semibold uppercase tracking-[0.28em] text-white/48">{label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </MotionSection>
  );
}

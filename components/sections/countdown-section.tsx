"use client";

import { motion } from "framer-motion";
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
    <MotionSection className="overflow-hidden py-16 pt-12 md:py-20 md:pt-16 lg:pt-20">
      <div className="section-shell relative">
        <div className="grid items-center gap-10 lg:grid-cols-[0.82fr_1.18fr]">
          <motion.div variants={motionItemVariants} className="text-center lg:text-left">
            <h2 className="inline-flex items-center justify-center gap-3 font-serif text-5xl leading-[0.95] text-white lg:justify-start md:text-7xl">
              <Heart className="h-4 w-4 fill-purple/30" />
              Geri Sayım
            </h2>
          </motion.div>

          <motion.div
            variants={motionItemVariants}
            className="relative overflow-hidden rounded-[2rem] border border-white/[0.09] bg-white/[0.045] p-4 shadow-[0_28px_100px_rgba(0,0,0,0.34),0_0_58px_rgba(184,140,255,0.1)] backdrop-blur-xl md:p-6"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(184,140,255,0.18),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_52%)]" />
            <div className="relative grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {units.map(([label, value], index) => (
                <motion.div
                  variants={motionItemVariants}
                  key={label}
                  className="group rounded-[1.35rem] border border-white/[0.08] bg-[#120b20]/86 p-5 text-center text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_32px_rgba(184,140,255,0.07)] md:p-6"
                >
                  <span className="mx-auto mb-5 block h-1 w-1 rounded-full bg-purple/70 shadow-[0_0_18px_rgba(184,140,255,0.55)] transition group-hover:scale-125" />
                  <motion.span
                    key={label}
                    animate={{ opacity: typeof value === "number" ? 1 : 0.58 }}
                    transition={{ duration: 0.18, delay: index * 0.02 }}
                    className="block font-serif text-5xl font-semibold leading-none md:text-7xl"
                  >
                    {typeof value === "number" ? String(value).padStart(2, "0") : "--"}
                  </motion.span>
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

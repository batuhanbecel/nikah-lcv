"use client";

import Image from "next/image";
import { motion, type MotionValue, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { CalendarDays, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { event, images } from "@/lib/event";
import { ease, fadeUp, stagger } from "@/lib/motion";

const frames = [
  {
    className: "left-[2%] top-[12%] h-[44vh] w-[26vw] min-w-48 rotate-[-8deg]",
    position: "object-[50%_42%]",
    depth: 18
  },
  {
    className: "right-[3%] top-[8%] h-[36vh] w-[25vw] min-w-44 rotate-[7deg]",
    position: "object-[50%_40%]",
    depth: 26
  },
  {
    className: "left-[10%] bottom-[7%] h-[32vh] w-[22vw] min-w-40 rotate-[5deg]",
    position: "object-[50%_36%]",
    depth: 14
  },
  {
    className: "right-[10%] bottom-[9%] h-[31vh] w-[25vw] min-w-48 rotate-[-5deg]",
    position: "object-[50%_44%]",
    depth: 22
  },
  {
    className: "left-[39%] top-[3%] h-[25vh] w-[16vw] min-w-32 rotate-[3deg]",
    position: "object-[50%_34%]",
    depth: 10
  },
  {
    className: "right-[39%] bottom-[3%] h-[23vh] w-[18vw] min-w-36 rotate-[-4deg]",
    position: "object-[50%_45%]",
    depth: 16
  }
];

type HeroFrameProps = {
  image: (typeof images)[number];
  index: number;
  smoothX: MotionValue<number>;
  parallaxX: MotionValue<number>;
  parallaxY: MotionValue<number>;
  reduceMotion: boolean;
};

function HeroFrame({ image, index, smoothX, parallaxX, parallaxY, reduceMotion }: HeroFrameProps) {
  const frameX = useTransform(smoothX, [-0.5, 0.5], [frames[index].depth, -frames[index].depth]);

  return (
    <motion.div
      className={`absolute ${
        frames[index].className
      } ${index > 3 ? "hidden md:block" : ""}`}
      style={{
        x: reduceMotion ? 0 : frameX,
        y: reduceMotion ? 0 : index % 2 ? parallaxY : parallaxX,
        zIndex: 5 + index,
        filter: "drop-shadow(0 30px 70px rgba(0,0,0,0.34))"
      }}
      initial={reduceMotion ? { opacity: 0.78 } : { opacity: 0, scale: 1.08, y: index % 2 ? 28 : -28 }}
      animate={{
        opacity: reduceMotion ? 0.96 : [0.92, 1, 0.92],
        scale: reduceMotion ? 1 : [1, 1.035, 1],
        y: reduceMotion ? 0 : index % 2 ? [0, 18, 0] : [0, -18, 0]
      }}
      transition={{
        opacity: { duration: 2.4, ease },
        scale: { duration: 10 + index, repeat: Infinity, ease: "easeInOut" },
        y: { duration: 8 + index * 0.8, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      <motion.div
        className="absolute -inset-7 rounded-[2.2rem] bg-[radial-gradient(circle,rgba(255,255,255,0.2),rgba(184,140,255,0.22)_36%,transparent_68%)] blur-2xl"
        animate={{ opacity: reduceMotion ? 0.38 : [0.24, 0.48, 0.24], scale: reduceMotion ? 1 : [0.94, 1.06, 0.94] }}
        transition={{ duration: 7 + index, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative h-full w-full overflow-hidden rounded-[1.65rem] border border-white/18 bg-black/20 shadow-[0_34px_110px_rgba(0,0,0,0.42)]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority={index < 3}
          sizes="(max-width: 768px) 50vw, 24vw"
          className={`object-cover contrast-[1.08] saturate-[1.22] ${frames[index].position}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/24 via-transparent to-white/10" />
        <div className="absolute inset-0 ring-1 ring-inset ring-white/20" />
      </div>
    </motion.div>
  );
}

export function HeroSection() {
  const reduceMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 40, stiffness: 90 });
  const smoothY = useSpring(mouseY, { damping: 40, stiffness: 90 });
  const parallaxX = useTransform(smoothX, [-0.5, 0.5], [-24, 24]);
  const parallaxY = useTransform(smoothY, [-0.5, 0.5], [-18, 18]);
  return (
    <section
      className="relative grid min-h-[108svh] place-items-center overflow-hidden bg-[radial-gradient(circle_at_50%_34%,rgba(126,78,226,0.24),transparent_28rem),linear-gradient(180deg,#090511_0%,#120a1f_48%,#07050d_100%)] text-white"
      onMouseMove={(eventMove) => {
        if (reduceMotion) return;
        const rect = eventMove.currentTarget.getBoundingClientRect();
        mouseX.set((eventMove.clientX - rect.left) / rect.width - 0.5);
        mouseY.set((eventMove.clientY - rect.top) / rect.height - 0.5);
      }}
    >
      <div className="absolute inset-0">
        {images.map((image, index) => (
          <HeroFrame
            key={image.src}
            image={image}
            index={index}
            smoothX={smoothX}
            parallaxX={parallaxX}
            parallaxY={parallaxY}
            reduceMotion={Boolean(reduceMotion)}
          />
        ))}
      </div>

      <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_50%_48%,rgba(7,5,13,0.46),rgba(7,5,13,0.22)_32%,transparent_58%),linear-gradient(180deg,rgba(7,5,13,0.2),rgba(7,5,13,0.4))]" />
      <div className="absolute inset-x-0 top-0 z-20 h-44 bg-gradient-to-b from-black/42 to-transparent" />
      <div className="absolute inset-x-0 -bottom-72 z-20 h-[36rem] bg-gradient-to-b from-transparent via-[#07050d]/88 to-[#07050d]" />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="section-shell relative z-30 px-1 text-center"
      >
        <motion.p variants={fadeUp} className="mb-6 text-xs font-semibold uppercase tracking-[0.45em] text-purple">
          17 Ekim 2026
        </motion.p>
        <motion.h1
          variants={fadeUp}
          className="font-serif text-[clamp(3.15rem,13vw,8.4rem)] font-semibold leading-[0.78] tracking-normal text-white drop-shadow-[0_20px_46px_rgba(0,0,0,0.62)] sm:text-[clamp(4rem,10vw,8.8rem)]"
        >
          <span className="block">Beyza</span>
          <span className="my-1 block text-[0.54em] leading-none text-purple drop-shadow-[0_0_28px_rgba(184,140,255,0.34)] sm:my-2">
            &
          </span>
          <span className="block">Batuhan</span>
        </motion.h1>
        <motion.div variants={fadeUp} className="mx-auto mt-8 flex max-w-2xl flex-col items-center justify-center gap-3 text-sm leading-6 text-white/68 md:flex-row">
          <span className="inline-flex items-center justify-center gap-2">
            <CalendarDays className="h-4 w-4 text-purple" />
            {event.dateLabel} — Saat {event.timeLabel}
          </span>
          <span className="hidden h-1 w-1 rounded-full bg-purple/45 md:block" />
          <span className="inline-flex items-center justify-center gap-2">
            <MapPin className="h-4 w-4 text-purple" />
            {event.venue}
          </span>
        </motion.div>
        <motion.div variants={fadeUp} className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <motion.div whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button asChild>
              <a href="#rsvp">Davete Katıl</a>
            </Button>
          </motion.div>
          <motion.div whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button asChild variant="outline">
              <a href="#details">Konumu Gör</a>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 z-30 h-12 w-px -translate-x-1/2 overflow-hidden bg-purple/18"
        aria-hidden="true"
      >
        <motion.div
          className="h-5 w-px bg-purple"
          animate={{ y: [-20, 52] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}

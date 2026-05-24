"use client";

import Image from "next/image";
import { motion, type MotionValue, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { CalendarDays, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { event, images } from "@/lib/event";
import { ease, fadeUp, stagger } from "@/lib/motion";

const frames = [
  {
    className: "left-[3%] top-[13%] h-[42vh] w-[25vw] min-w-48 rotate-[-8deg]",
    position: "object-[50%_42%]",
    depth: 18
  },
  {
    className: "right-[4%] top-[8%] h-[34vh] w-[24vw] min-w-44 rotate-[7deg]",
    position: "object-[50%_40%]",
    depth: 26
  },
  {
    className: "left-[13%] bottom-[8%] h-[31vh] w-[21vw] min-w-40 rotate-[5deg]",
    position: "object-[50%_36%]",
    depth: 14
  },
  {
    className: "right-[13%] bottom-[10%] h-[29vh] w-[25vw] min-w-48 rotate-[-5deg]",
    position: "object-[50%_44%]",
    depth: 22
  },
  {
    className: "left-[39%] top-[4%] h-[24vh] w-[15vw] min-w-32 rotate-[3deg]",
    position: "object-[50%_34%]",
    depth: 10
  },
  {
    className: "right-[39%] bottom-[4%] h-[22vh] w-[18vw] min-w-36 rotate-[-4deg]",
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
      className={`absolute overflow-hidden rounded-[1.65rem] border border-white/75 shadow-[0_28px_90px_rgba(64,39,94,0.22)] ${
        frames[index].className
      } ${index > 3 ? "hidden md:block" : ""}`}
      style={{
        x: reduceMotion ? 0 : frameX,
        y: reduceMotion ? 0 : index % 2 ? parallaxY : parallaxX,
        zIndex: 5 + index
      }}
      initial={reduceMotion ? { opacity: 0.78 } : { opacity: 0, scale: 1.08, y: index % 2 ? 28 : -28 }}
      animate={{
        opacity: reduceMotion ? 0.9 : [0.84, 0.98, 0.84],
        scale: reduceMotion ? 1 : [1, 1.035, 1],
        y: reduceMotion ? 0 : index % 2 ? [0, 18, 0] : [0, -18, 0]
      }}
      transition={{
        opacity: { duration: 2.4, ease },
        scale: { duration: 10 + index, repeat: Infinity, ease: "easeInOut" },
        y: { duration: 8 + index * 0.8, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority={index < 3}
        sizes="(max-width: 768px) 50vw, 24vw"
        className={`object-cover ${frames[index].position}`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-white/16 via-transparent to-white/28" />
      <div className="absolute inset-0 ring-1 ring-inset ring-white/45" />
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
  const backgroundX = useTransform(smoothX, [-0.5, 0.5], [10, -10]);
  const backgroundY = useTransform(smoothY, [-0.5, 0.5], [8, -8]);

  return (
    <section
      className="relative grid min-h-screen place-items-center overflow-hidden bg-[#fbf8ff] text-black"
      onMouseMove={(eventMove) => {
        if (reduceMotion) return;
        const rect = eventMove.currentTarget.getBoundingClientRect();
        mouseX.set((eventMove.clientX - rect.left) / rect.width - 0.5);
        mouseY.set((eventMove.clientY - rect.top) / rect.height - 0.5);
      }}
    >
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 scale-105"
          style={{ x: reduceMotion ? 0 : backgroundX, y: reduceMotion ? 0 : backgroundY }}
          animate={{ scale: reduceMotion ? 1.05 : [1.05, 1.09, 1.05] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src={images[5].src}
            alt={images[5].alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_44%] opacity-70 blur-[1px] saturate-110"
          />
          <div className="absolute inset-0 bg-white/14" />
        </motion.div>

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

      <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.78),rgba(255,255,255,0.42)_36%,transparent_58%),radial-gradient(circle_at_50%_52%,rgba(239,232,255,0.58),transparent_52%),linear-gradient(180deg,rgba(255,255,255,0.62),rgba(251,248,255,0.76))]" />
      <div className="absolute inset-x-0 top-0 z-20 h-44 bg-gradient-to-b from-white/64 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 z-20 h-56 bg-gradient-to-t from-white via-white/62 to-transparent" />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="section-shell relative z-30 px-1 text-center"
      >
        <motion.p variants={fadeUp} className="mb-6 text-xs font-semibold uppercase tracking-[0.45em] text-purple-dark/66">
          17 Ekim 2026
        </motion.p>
        <motion.h1
          variants={fadeUp}
          className="font-serif text-[clamp(3.9rem,18vw,12rem)] font-semibold leading-[0.84] tracking-normal text-black drop-shadow-[0_12px_32px_rgba(255,255,255,0.82)] sm:text-[clamp(4.5rem,14vw,12rem)]"
        >
          {event.couple}
        </motion.h1>
        <motion.p variants={fadeUp} className="mx-auto mt-7 max-w-2xl font-serif text-2xl leading-tight text-black/72 sm:text-3xl md:text-5xl">
          {event.tagline}
        </motion.p>
        <motion.div variants={fadeUp} className="mx-auto mt-8 flex max-w-2xl flex-col items-center justify-center gap-3 text-sm leading-6 text-black/62 md:flex-row">
          <span className="inline-flex items-center justify-center gap-2">
            <CalendarDays className="h-4 w-4 text-purple" />
            {event.dateLabel} — Saat {event.timeLabel}
          </span>
          <span className="hidden h-1 w-1 rounded-full bg-purple/35 md:block" />
          <span className="inline-flex items-center justify-center gap-2">
            <MapPin className="h-4 w-4 text-purple" />
            {event.venue}
          </span>
        </motion.div>
        <motion.div variants={fadeUp} className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <motion.div whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button asChild className="bg-black text-white hover:bg-purple">
              <a href="#rsvp">Davete Katıl</a>
            </Button>
          </motion.div>
          <motion.div whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button asChild variant="outline" className="border-black/18 bg-white/62 text-black shadow-[0_16px_40px_rgba(64,39,94,0.12)] hover:border-purple hover:bg-purple hover:text-white">
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

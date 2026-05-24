"use client";

import Image from "next/image";
import { motion, type MotionValue, useMotionValue, useSpring, useTransform } from "framer-motion";
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
};

function HeroFrame({ image, index, smoothX, parallaxX, parallaxY }: HeroFrameProps) {
  const frameX = useTransform(smoothX, [-0.5, 0.5], [frames[index].depth, -frames[index].depth]);

  return (
    <motion.div
      className={`absolute overflow-hidden rounded-[1.65rem] border border-white/18 shadow-[0_35px_120px_rgba(0,0,0,0.58)] ${
        frames[index].className
      } ${index > 3 ? "hidden md:block" : ""}`}
      style={{
        x: frameX,
        y: index % 2 ? parallaxY : parallaxX,
        zIndex: 5 + index
      }}
      initial={{ opacity: 0, scale: 1.08, y: index % 2 ? 28 : -28 }}
      animate={{
        opacity: [0.7, 0.9, 0.7],
        scale: [1, 1.035, 1],
        y: index % 2 ? [0, 18, 0] : [0, -18, 0]
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/46 via-transparent to-white/12" />
      <div className="absolute inset-0 ring-1 ring-inset ring-white/12" />
    </motion.div>
  );
}

export function HeroSection() {
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
      className="relative grid min-h-screen place-items-center overflow-hidden bg-black text-white"
      onMouseMove={(eventMove) => {
        const rect = eventMove.currentTarget.getBoundingClientRect();
        mouseX.set((eventMove.clientX - rect.left) / rect.width - 0.5);
        mouseY.set((eventMove.clientY - rect.top) / rect.height - 0.5);
      }}
    >
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 scale-105"
          style={{ x: backgroundX, y: backgroundY }}
          animate={{ scale: [1.05, 1.09, 1.05] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src={images[5].src}
            alt={images[5].alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_44%] opacity-72 blur-[1px]"
          />
          <div className="absolute inset-0 bg-black/38" />
        </motion.div>

        {images.map((image, index) => (
          <HeroFrame
            key={image.src}
            image={image}
            index={index}
            smoothX={smoothX}
            parallaxX={parallaxX}
            parallaxY={parallaxY}
          />
        ))}
      </div>

      <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_50%_45%,rgba(111,61,197,0.26),transparent_34%),radial-gradient(circle_at_50%_50%,transparent_0,rgba(0,0,0,0.2)_35%,rgba(0,0,0,0.78)_78%),linear-gradient(180deg,rgba(0,0,0,0.3),rgba(0,0,0,0.82))]" />
      <div className="absolute inset-x-0 top-0 z-20 h-44 bg-gradient-to-b from-black/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 z-20 h-52 bg-gradient-to-t from-black to-transparent" />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="section-shell relative z-30 text-center"
      >
        <motion.p variants={fadeUp} className="mb-6 text-xs font-semibold uppercase tracking-[0.45em] text-white/70">
          17 Ekim 2026
        </motion.p>
        <motion.h1
          variants={fadeUp}
          className="font-serif text-[clamp(4.5rem,14vw,12rem)] font-semibold leading-[0.82] tracking-normal"
        >
          {event.couple}
        </motion.h1>
        <motion.p variants={fadeUp} className="mx-auto mt-7 max-w-2xl font-serif text-3xl leading-tight text-white/88 md:text-5xl">
          {event.tagline}
        </motion.p>
        <motion.div variants={fadeUp} className="mt-8 flex flex-col items-center justify-center gap-3 text-sm text-white/80 md:flex-row">
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-purple-soft" />
            {event.dateLabel} — Saat {event.timeLabel}
          </span>
          <span className="hidden h-1 w-1 rounded-full bg-white/45 md:block" />
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4 text-purple-soft" />
            {event.venue}
          </span>
        </motion.div>
        <motion.div variants={fadeUp} className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <motion.div whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button asChild className="bg-white text-black hover:bg-purple hover:text-white">
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
        className="absolute bottom-8 left-1/2 z-30 h-12 w-px -translate-x-1/2 overflow-hidden bg-white/25"
        aria-hidden="true"
      >
        <motion.div
          className="h-5 w-px bg-purple-soft"
          animate={{ y: [-20, 52] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}

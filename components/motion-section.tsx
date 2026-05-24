"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

type MotionSectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

export function MotionSection({ children, className, id }: MotionSectionProps) {
  return (
    <motion.section
      id={id}
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-120px" }}
      className={cn("relative py-24 md:py-32", className)}
    >
      {children}
    </motion.section>
  );
}

export const MotionItem = motion.create("div");
export const motionItemVariants = fadeUp;

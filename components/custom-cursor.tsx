"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { damping: 28, stiffness: 260, mass: 0.4 });
  const smoothY = useSpring(y, { damping: 28, stiffness: 260, mass: 0.4 });

  useEffect(() => {
    const desktop = window.matchMedia("(pointer: fine) and (min-width: 768px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncEnabled = () => {
      const shouldEnable = desktop.matches && !reducedMotion.matches;
      document.body.classList.toggle("cursor-hidden", shouldEnable);
      setEnabled(shouldEnable);
    };

    window.requestAnimationFrame(syncEnabled);

    const move = (event: PointerEvent) => {
      x.set(event.clientX - 12);
      y.set(event.clientY - 12);
    };

    window.addEventListener("pointermove", move);
    desktop.addEventListener("change", syncEnabled);
    reducedMotion.addEventListener("change", syncEnabled);

    return () => {
      document.body.classList.remove("cursor-hidden");
      window.removeEventListener("pointermove", move);
      desktop.removeEventListener("change", syncEnabled);
      reducedMotion.removeEventListener("change", syncEnabled);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[90] h-6 w-6 rounded-full border border-purple/70 mix-blend-difference"
      style={{ x: smoothX, y: smoothY }}
    />
  );
}

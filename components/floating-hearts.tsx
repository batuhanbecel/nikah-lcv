"use client";

import type { CSSProperties } from "react";

const hearts = [
  { left: "6%", top: "8%", size: 10, delay: "-2s", duration: "18s", drift: "34px", blur: "2px" },
  { left: "17%", top: "24%", size: 7, delay: "-9s", duration: "21s", drift: "-28px", blur: "6px" },
  { left: "29%", top: "41%", size: 5, delay: "-5s", duration: "19s", drift: "22px", blur: "4px" },
  { left: "43%", top: "59%", size: 12, delay: "-12s", duration: "24s", drift: "-42px", blur: "8px" },
  { left: "68%", top: "71%", size: 10, delay: "-3s", duration: "23s", drift: "-30px", blur: "3px" },
  { left: "87%", top: "5%", size: 8, delay: "-6s", duration: "22s", drift: "-24px", blur: "4px" }
];

export function FloatingHearts() {
  return (
    <div className="floating-hearts" aria-hidden="true">
      {hearts.map((heart, index) => (
        <span
          key={`${heart.left}-${heart.top}`}
          className="floating-heart"
          style={{
            "--heart-left": heart.left,
            "--heart-top": heart.top,
            "--heart-size": `${heart.size}px`,
            "--heart-delay": heart.delay,
            "--heart-duration": heart.duration,
            "--heart-drift": heart.drift,
            "--heart-blur": heart.blur
          } as CSSProperties}
        >
          <span style={{ animationDelay: `${index * -0.9}s` }} />
        </span>
      ))}
    </div>
  );
}

'use client'

import { motion } from 'framer-motion'

// Absolute positioning inside <main> — hearts spread across full page height.
// y values (0-95%) map to % of the total page, not just the viewport.
// Opacity is set via CSS (style prop) so hearts are immediately visible on mount.
// Only movement is animated (y, x, rotate, scale) — no opacity flicker.
const HEARTS = [
  // ── Hero zone (y 2–22%) ───────────────────────────────────────────
  { id:  0, x:  4, y:  3, size:  9, opacity: 0.32, blur: 0,   color: '#A78BFA', dur: 13, del: 0.0, dx:  16, dy: -38 },
  { id:  1, x: 87, y:  8, size:  8, opacity: 0.29, blur: 0,   color: '#A78BFA', dur: 12, del: 1.4, dx: -14, dy: -36 },
  { id:  2, x: 52, y: 14, size:  7, opacity: 0.31, blur: 0,   color: '#C4B5FD', dur:  9, del: 0.6, dx:  12, dy: -28 },
  { id:  3, x: 32, y:  5, size: 19, opacity: 0.09, blur: 2.5, color: '#7C3AED', dur: 22, del: 2.6, dx:  26, dy: -55 },
  { id:  4, x: 70, y: 18, size: 14, opacity: 0.17, blur: 1.5, color: '#8B5CF6', dur: 17, del: 1.1, dx:  22, dy: -48 },
  // ── Details zone (y 25–50%) ───────────────────────────────────────
  { id:  5, x: 14, y: 28, size:  7, opacity: 0.27, blur: 0,   color: '#C4B5FD', dur: 10, del: 2.3, dx:  20, dy: -30 },
  { id:  6, x: 94, y: 33, size: 10, opacity: 0.24, blur: 0,   color: '#C4B5FD', dur: 15, del: 3.7, dx: -18, dy: -34 },
  { id:  7, x: 78, y: 40, size:  8, opacity: 0.26, blur: 0,   color: '#A78BFA', dur: 11, del: 2.9, dx: -16, dy: -32 },
  { id:  8, x: 24, y: 45, size: 13, opacity: 0.19, blur: 1,   color: '#A78BFA', dur: 14, del: 4.4, dx: -20, dy: -44 },
  { id:  9, x: 62, y: 38, size:  6, opacity: 0.30, blur: 0,   color: '#A78BFA', dur:  8, del: 1.8, dx: -10, dy: -24 },
  { id: 10, x: 50, y: 30, size: 22, opacity: 0.06, blur: 4,   color: '#7C3AED', dur: 26, del: 1.7, dx:  30, dy: -62 },
  // ── RSVP zone (y 55–80%) ─────────────────────────────────────────
  { id: 11, x: 45, y: 60, size: 15, opacity: 0.15, blur: 1.5, color: '#C4B5FD', dur: 16, del: 0.9, dx:  18, dy: -46 },
  { id: 12, x: 82, y: 58, size: 12, opacity: 0.18, blur: 1,   color: '#8B5CF6', dur: 15, del: 2.5, dx: -16, dy: -40 },
  { id: 13, x:  9, y: 65, size: 13, opacity: 0.16, blur: 1.5, color: '#A78BFA', dur: 18, del: 3.2, dx:  20, dy: -44 },
  { id: 14, x: 60, y: 72, size: 11, opacity: 0.20, blur: 1,   color: '#C4B5FD', dur: 13, del: 1.8, dx: -14, dy: -38 },
  { id: 15, x: 36, y: 68, size:  7, opacity: 0.28, blur: 0,   color: '#C4B5FD', dur: 10, del: 4.1, dx:  14, dy: -26 },
  { id: 16, x: 70, y: 62, size: 18, opacity: 0.10, blur: 2,   color: '#8B5CF6', dur: 20, del: 0.4, dx: -24, dy: -52 },
  // ── Footer zone (y 82–95%) ───────────────────────────────────────
  { id: 17, x: 18, y: 88, size: 17, opacity: 0.09, blur: 2.5, color: '#A78BFA', dur: 21, del: 3.9, dx:  22, dy: -50 },
  { id: 18, x: 80, y: 83, size:  8, opacity: 0.26, blur: 0,   color: '#A78BFA', dur: 11, del: 2.9, dx: -16, dy: -32 },
  { id: 19, x: 56, y: 91, size: 16, opacity: 0.11, blur: 2,   color: '#8B5CF6', dur: 19, del: 5.2, dx: -18, dy: -48 },
  { id: 20, x: 20, y: 85, size: 20, opacity: 0.07, blur: 3.5, color: '#8B5CF6', dur: 24, del: 4.8, dx: -26, dy: -58 },
]

export default function FloatingHearts() {
  return (
    // absolute inset-0 → covers full <main> height (not just viewport).
    // overflow-hidden clips hearts that drift past page edges.
    // z-index 25 → above section content (z-10), below music player (z-50).
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 25 }}
      aria-hidden
    >
      {HEARTS.map(h => (
        <motion.div
          key={h.id}
          className="absolute"
          style={{
            left:    `${h.x}%`,
            top:     `${h.y}%`,
            opacity:  h.opacity,
            filter:   h.blur > 0 ? `blur(${h.blur}px)` : undefined,
          }}
          animate={{
            y:      [0, h.dy,           h.dy * 0.45,  0],
            x:      [0, h.dx,           h.dx * -0.55, 0],
            rotate: [0, 7,              -6,            0],
            scale:  [0.9, 1.1, 0.95, 0.9],
          }}
          transition={{
            duration: h.dur,
            delay:    h.del,
            repeat:   Infinity,
            ease:     'easeInOut',
          }}
        >
          <svg width={h.size} height={h.size} viewBox="0 0 24 24" fill="none">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill={h.color}
            />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}

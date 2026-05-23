'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const PARTICLES = [
  { id: 0,  x: 6,  y: 72, size: 9,  dur: 14, del: 0.0 },
  { id: 1,  x: 17, y: 35, size: 13, dur: 10, del: 2.2 },
  { id: 2,  x: 26, y: 82, size: 7,  dur: 16, del: 0.8 },
  { id: 3,  x: 40, y: 18, size: 11, dur: 11, del: 3.5 },
  { id: 4,  x: 53, y: 70, size: 6,  dur: 17, del: 1.3 },
  { id: 5,  x: 65, y: 25, size: 15, dur: 9,  del: 4.1 },
  { id: 6,  x: 77, y: 58, size: 8,  dur: 13, del: 2.8 },
  { id: 7,  x: 87, y: 22, size: 10, dur: 12, del: 0.5 },
  { id: 8,  x: 92, y: 80, size: 12, dur: 10, del: 3.2 },
  { id: 9,  x: 32, y: 50, size: 5,  dur: 15, del: 1.8 },
  { id: 10, x: 49, y: 90, size: 14, dur: 8,  del: 4.5 },
  { id: 11, x: 71, y: 44, size: 9,  dur: 12, del: 0.3 },
  { id: 12, x: 13, y: 60, size: 7,  dur: 11, del: 5.0 },
  { id: 13, x: 84, y: 86, size: 11, dur: 14, del: 2.0 },
  { id: 14, x: 58, y: 8,  size: 8,  dur: 16, del: 1.5 },
]

function AnimatedName({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <span className="inline-block" style={{ perspective: '800px' }}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 36, rotateX: -70 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.75, delay: delay + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'inline-block', transformOrigin: 'bottom center' }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  )
}

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const contentY  = useTransform(scrollYProgress, [0, 1], ['0%', '28%'])
  const contentOp = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  return (
    <section
      ref={ref}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden"
      aria-label="Hero"
    >
      {/* ── Background photo (place your photo at /public/hero.jpg) ─────── */}
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: "url('/hero.jpg')" }}
      />

      {/* Cream overlay — lightens the photo, keeps the bright/airy feel.
          Also acts as the base if no photo is present. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(255,254,249,0.55) 0%, rgba(245,243,255,0.60) 50%, rgba(255,254,249,0.80) 100%)',
        }}
      />

      {/* ── Animated soft gradient blobs ────────────────────────────────── */}
      <motion.div
        className="absolute -top-40 -left-40 w-[680px] h-[680px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(196,181,253,0.35) 0%, transparent 70%)' }}
        animate={{ x: [0,35,-12,0], y: [0,-25,18,0], scale: [1,1.06,0.95,1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 w-[580px] h-[580px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(221,214,254,0.30) 0%, transparent 70%)' }}
        animate={{ x: [0,-28,14,0], y: [0,22,-18,0], scale: [1,0.94,1.06,1] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/4 right-1/4 w-[380px] h-[380px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(253,232,255,0.28) 0%, transparent 70%)' }}
        animate={{ x: [0,20,-16,0], y: [0,-35,12,0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />

      {/* ── Floating particles ──────────────────────────────────────────── */}
      {PARTICLES.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            background: 'radial-gradient(circle, #A78BFA 0%, #C4B5FD 100%)',
          }}
          animate={{ y: [0,-(p.size*6),0], x: [0,p.size*1.5,-p.size,0], opacity: [0.12,0.45,0.12], scale: [0.7,1.1,0.7] }}
          transition={{ duration: p.dur, delay: p.del, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* ── Decorative double frame ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 3 }}
        className="absolute inset-6 sm:inset-10 border border-plum-200/50 pointer-events-none"
        aria-hidden
      />
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 3.3 }}
        className="absolute inset-9 sm:inset-[52px] border border-plum-100/35 pointer-events-none"
        aria-hidden
      />

      {/* ── Main content ────────────────────────────────────────────────── */}
      <motion.div
        style={{ y: contentY, opacity: contentOp }}
        className="relative z-10 flex flex-col items-center gap-7 px-6 text-center"
      >
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.6em' }}
          animate={{ opacity: 1, letterSpacing: '0.35em' }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-dm text-[10px] uppercase tracking-superwide text-plum-600 drop-shadow-sm"
        >
          Nikah Törenine Davetlisiniz
        </motion.p>

        {/* Names — dark plum so they read clearly over photo OR gradient */}
        <div
          className="flex flex-col items-center leading-none font-cormorant font-light text-plum-900"
          style={{ fontSize: 'clamp(3.8rem, 13vw, 9rem)', textShadow: '0 2px 24px rgba(255,254,249,0.8)' }}
        >
          <AnimatedName text="Beyza" delay={0.4} />
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 1.3, ease: [0.34, 1.56, 0.64, 1] }}
            className="text-gradient italic font-light block"
            style={{ fontSize: '0.38em', lineHeight: '1.6', letterSpacing: '0.18em' }}
          >
            &amp;
          </motion.span>
          <AnimatedName text="Batuhan" delay={1.6} />
        </div>

        {/* Ornamental divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.4, delay: 2.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-5 w-full max-w-xs"
        >
          <span className="flex-1 h-px bg-gradient-to-r from-transparent to-plum-300" />
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <ellipse cx="13" cy="5"  rx="3" ry="5"   fill="#A78BFA" opacity="0.9" />
            <ellipse cx="21" cy="13" rx="5" ry="3"   fill="#A78BFA" opacity="0.9" />
            <ellipse cx="13" cy="21" rx="3" ry="5"   fill="#A78BFA" opacity="0.9" />
            <ellipse cx="5"  cy="13" rx="5" ry="3"   fill="#A78BFA" opacity="0.9" />
            <circle  cx="13" cy="13" r="3.5"          fill="#7C3AED" />
          </svg>
          <span className="flex-1 h-px bg-gradient-to-l from-transparent to-plum-300" />
        </motion.div>

        {/* Date & location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-2"
        >
          <p className="font-cormorant text-2xl sm:text-3xl font-light text-plum-800 tracking-wider"
            style={{ textShadow: '0 1px 12px rgba(255,254,249,0.9)' }}>
            17 Ekim 2026
          </p>
          <p className="font-dm text-[10px] uppercase tracking-superwide text-plum-600">
            Beykoz Belediyesi&nbsp;&nbsp;·&nbsp;&nbsp;İstanbul
          </p>
        </motion.div>
      </motion.div>

      {/* ── Scroll indicator ────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 3.8, duration: 1.2 }}
        className="absolute bottom-9 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
        aria-hidden
      >
        <span className="font-dm text-[8px] uppercase tracking-ultrawide text-plum-500">Keşfet</span>
        <svg width="18" height="28" viewBox="0 0 18 28" fill="none">
          <rect x="1.5" y="1.5" width="15" height="25" rx="7.5" stroke="#A78BFA" strokeWidth="1.5" />
          <motion.rect
            x="7.5" y="6" width="3" height="6" rx="1.5" fill="#7C3AED"
            animate={{ y: [0, 9, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
      </motion.div>

      {/* ── Bottom fade into next section — eliminates hard cut ─────────── */}
      <div className="absolute bottom-0 inset-x-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #FFFEF9)' }} />
    </section>
  )
}

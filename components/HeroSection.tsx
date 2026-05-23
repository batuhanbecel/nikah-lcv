'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'

// 4 asymmetric columns — flex values control proportional heights within each column.
// Portrait (9:16) photos look best in the taller cells of cols 0–2.
const COLS = [
  { width: '23%', tiles: [
    { src: '/1.jpeg', flex: 60, delay: 0.00 },
    { src: '/4.jpeg', flex: 40, delay: 0.12 },
  ]},
  { width: '28%', tiles: [
    { src: '/2.jpeg', flex: 45, delay: 0.06 },
    { src: '/5.jpeg', flex: 55, delay: 0.18 },
  ]},
  { width: '26%', tiles: [
    { src: '/3.jpeg', flex: 65, delay: 0.10 },
    { src: '/6.jpeg', flex: 35, delay: 0.22 },
  ]},
  { width: '23%', tiles: [
    { src: '/7.jpeg', flex: 34, delay: 0.04 },
    { src: '/8.jpeg', flex: 33, delay: 0.16 },
    { src: '/9.jpeg', flex: 33, delay: 0.28 },
  ]},
]

// Floating hearts — precomputed positions to avoid hydration mismatch
const HEARTS = [
  { id: 0,  x: 7,  y: 70, size: 16, dur: 13, del: 0.0 },
  { id: 1,  x: 18, y: 30, size: 11, dur: 10, del: 2.2 },
  { id: 2,  x: 27, y: 83, size: 9,  dur: 15, del: 0.8 },
  { id: 3,  x: 41, y: 15, size: 13, dur: 11, del: 3.5 },
  { id: 4,  x: 54, y: 73, size: 8,  dur: 16, del: 1.3 },
  { id: 5,  x: 67, y: 26, size: 14, dur: 9,  del: 4.1 },
  { id: 6,  x: 77, y: 58, size: 10, dur: 13, del: 2.8 },
  { id: 7,  x: 87, y: 21, size: 12, dur: 12, del: 0.5 },
  { id: 8,  x: 91, y: 79, size: 15, dur: 10, del: 3.2 },
  { id: 9,  x: 33, y: 50, size: 7,  dur: 14, del: 1.8 },
  { id: 10, x: 50, y: 89, size: 11, dur: 8,  del: 4.5 },
  { id: 11, x: 71, y: 43, size: 9,  dur: 11, del: 0.3 },
  { id: 12, x: 14, y: 58, size: 8,  dur: 12, del: 5.0 },
]

function Heart({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="#A78BFA"
        opacity="0.75"
      />
    </svg>
  )
}

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
  const contentY  = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const contentOp = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section
      ref={ref}
      className="relative flex h-screen w-full items-center justify-center"
      style={{ contain: 'paint' }}
      aria-label="Hero"
    >
      {/* ── Photo collage background ─────────────────────────────────── */}
      {/* 4 flex columns — each divided into tall/short cells so portrait
          photos display with faces visible (object-top anchors to head area) */}
      <div
        className="absolute inset-0 flex"
        style={{ gap: '2px' }}
        aria-hidden
      >
        {COLS.map((col, ci) => (
          <div
            key={ci}
            className="flex flex-col h-full"
            style={{ width: col.width, flexShrink: 0, gap: '2px' }}
          >
            {col.tiles.map(tile => (
              <motion.div
                key={tile.src}
                className="relative overflow-hidden"
                style={{ flex: `${tile.flex} 0 0%` }}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: tile.delay, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={tile.src}
                  alt=""
                  fill
                  className="object-cover object-top"
                  sizes={col.width.replace('%', 'vw')}
                  priority={ci < 2}
                  draggable={false}
                />
                {/* Transparent overlay: right-click target is a div, not <img>,
                    so the browser shows "Reload Page" instead of "Copy Image" */}
                <div
                  className="absolute inset-0 z-10"
                  onContextMenu={e => e.preventDefault()}
                />
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      {/* ── Layered overlay ──────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 70% at 50% 45%, rgba(255,254,249,0.72) 0%, rgba(255,254,249,0.45) 60%, rgba(255,254,249,0.20) 100%),
            linear-gradient(to bottom, rgba(255,254,249,0.30) 0%, rgba(255,254,249,0.15) 40%, rgba(255,254,249,0.70) 85%, #FFFEF9 100%)
          `,
        }}
      />

      {/* ── Floating hearts ──────────────────────────────────────────── */}
      {HEARTS.map(h => (
        <motion.div
          key={h.id}
          className="absolute pointer-events-none"
          style={{ left: `${h.x}%`, top: `${h.y}%` }}
          animate={{
            y:      [0, -(h.size * 5), 0],
            x:      [0, h.size * 1.2, -h.size * 0.8, 0],
            rotate: [0, 8, -8, 0],
            opacity:[0.1, 0.55, 0.1],
            scale:  [0.75, 1.1, 0.75],
          }}
          transition={{ duration: h.dur, delay: h.del, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Heart size={h.size} />
        </motion.div>
      ))}

      {/* ── Decorative double frame ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 2.8 }}
        className="absolute inset-6 sm:inset-10 border border-plum-300/40 pointer-events-none"
        aria-hidden
      />
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 3.1 }}
        className="absolute inset-9 sm:inset-[52px] border border-plum-200/25 pointer-events-none"
        aria-hidden
      />

      {/* ── Main content ─────────────────────────────────────────────── */}
      <motion.div
        style={{ y: contentY, opacity: contentOp }}
        className="relative z-10 flex flex-col items-center gap-6 px-6 text-center"
      >
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.6em' }}
          animate={{ opacity: 1, letterSpacing: '0.35em' }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-dm text-[10px] uppercase tracking-superwide text-plum-700"
          style={{ textShadow: '0 1px 8px rgba(255,254,249,0.9)' }}
        >
          Nikah Törenine Davetlisiniz
        </motion.p>

        <div
          className="flex flex-col items-center leading-none font-cormorant font-light text-plum-900"
          style={{
            fontSize: 'clamp(3.8rem, 13vw, 9rem)',
            textShadow: '0 2px 24px rgba(255,254,249,0.95)',
          }}
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
          transition={{ duration: 1.4, delay: 2.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-5 w-full max-w-xs"
        >
          <span className="flex-1 h-px bg-gradient-to-r from-transparent to-plum-300" />
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="#A78BFA"
            />
          </svg>
          <span className="flex-1 h-px bg-gradient-to-l from-transparent to-plum-300" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-2"
        >
          <p
            className="font-cormorant text-2xl sm:text-3xl font-light text-plum-800 tracking-wider"
            style={{ textShadow: '0 1px 16px rgba(255,254,249,0.95)' }}
          >
            17 Ekim 2026
          </p>
          <p className="font-dm text-[10px] uppercase tracking-superwide text-plum-600">
            Beykoz Belediyesi&nbsp;&nbsp;·&nbsp;&nbsp;İstanbul
          </p>
        </motion.div>
      </motion.div>

      {/* ── Scroll indicator ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 3.6, duration: 1.2 }}
        className="absolute bottom-9 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        aria-hidden
      >
        <span className="font-dm text-[8px] uppercase tracking-ultrawide text-plum-500">Keşfet</span>
        <svg width="18" height="28" viewBox="0 0 18 28" fill="none">
          <rect x="1.5" y="1.5" width="15" height="25" rx="7.5" stroke="#A78BFA" strokeWidth="1.5"/>
          <motion.rect
            x="7.5" y="6" width="3" height="6" rx="1.5" fill="#7C3AED"
            animate={{ y: [0, 9, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
      </motion.div>

      {/* ── Bottom cream fade into next section ──────────────────────── */}
      <div
        className="absolute bottom-0 inset-x-0 h-36 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #FFFEF9)' }}
      />
    </section>
  )
}

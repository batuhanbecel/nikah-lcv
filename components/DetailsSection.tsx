'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const WEDDING_DATE = new Date('2026-10-17T14:00:00+03:00')

const MAP_DIRECTIONS =
  'https://www.google.com/maps/dir//Beykoz+Belediyesi+Nikah+Salonu,+Beykoz,+%C4%B0stanbul'
const MAP_VIEW =
  'https://maps.google.com/maps?q=Beykoz+Belediyesi+Nikah+Salonu,+Beykoz,+%C4%B0stanbul'

// ── Countdown ─────────────────────────────────────────────────────────────────
interface TimeLeft { days: number; hours: number; minutes: number; seconds: number }
const ZERO: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 }

function calcTimeLeft(t: Date): TimeLeft {
  const d = Math.max(0, t.getTime() - Date.now())
  return {
    days:    Math.floor(d / 86_400_000),
    hours:   Math.floor((d % 86_400_000) / 3_600_000),
    minutes: Math.floor((d % 3_600_000)  / 60_000),
    seconds: Math.floor((d % 60_000)     / 1_000),
  }
}

function useCountdown(target: Date): TimeLeft {
  const [t, setT] = useState<TimeLeft>(ZERO)
  useEffect(() => {
    setT(calcTimeLeft(target))
    const id = setInterval(() => setT(calcTimeLeft(target)), 1000)
    return () => clearInterval(id)
  }, [target])
  return t
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, '0')
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-[70px] h-[70px] sm:w-24 sm:h-24 glass rounded-2xl
                      flex items-center justify-center overflow-hidden shadow-lg shadow-plum-200/40">
        <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-plum-300 via-plum-500 to-plum-300" />
        <AnimatePresence mode="popLayout">
          <motion.span
            key={display}
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0,   opacity: 1 }}
            exit={{   y:  24, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="font-cormorant text-plum-800 tabular-nums font-normal"
            style={{ fontSize: 'clamp(1.6rem, 4.5vw, 2.6rem)' }}
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="font-dm text-[9px] sm:text-[10px] uppercase tracking-superwide text-plum-500">
        {label}
      </span>
    </div>
  )
}

const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.95, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
}

function FloralDivider() {
  return (
    <div className="flex items-center gap-4 w-full max-w-[220px]">
      <span className="flex-1 h-px bg-gradient-to-r from-transparent to-plum-200" />
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <ellipse cx="11" cy="4.5"  rx="2.5" ry="4.5" fill="#A78BFA" opacity="0.85" />
        <ellipse cx="17.5" cy="11" rx="4.5" ry="2.5" fill="#A78BFA" opacity="0.85" />
        <ellipse cx="11" cy="17.5" rx="2.5" ry="4.5" fill="#A78BFA" opacity="0.85" />
        <ellipse cx="4.5" cy="11"  rx="4.5" ry="2.5" fill="#A78BFA" opacity="0.85" />
        <circle  cx="11" cy="11"   r="3.5"            fill="#7C3AED" />
        <circle  cx="11" cy="11"   r="1.5"            fill="#A78BFA" />
      </svg>
      <span className="flex-1 h-px bg-gradient-to-l from-transparent to-plum-200" />
    </div>
  )
}

export default function DetailsSection() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-70px' })
  const { days, hours, minutes, seconds } = useCountdown(WEDDING_DATE)

  return (
    <section ref={ref} id="details" className="relative py-32 px-6 overflow-hidden">

      {/* Cream edge fades */}
      <div className="absolute top-0 inset-x-0 h-28 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, #FFFEF9, transparent)' }} />
      <div className="absolute bottom-0 inset-x-0 h-28 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #FFFEF9, transparent)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      w-[900px] h-[700px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(237,233,254,0.50) 0%, transparent 65%)' }} />

      <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center gap-14">

        <motion.p custom={0} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="font-dm text-[10px] uppercase tracking-ultrawide text-plum-500">
          Tören Detayları
        </motion.p>

        <motion.div custom={1} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <FloralDivider />
        </motion.div>

        <motion.h2 custom={2} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="font-cormorant font-light text-plum-900 text-center leading-none"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)' }}>
          17 Ekim 2026
        </motion.h2>

        {/* ── Single location + directions card ─────────────────────── */}
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="w-full glass rounded-2xl px-8 py-8 flex flex-col items-center gap-5
                     text-center shadow-xl shadow-plum-200/30">

          {/* Pin icon */}
          <svg width="22" height="26" viewBox="0 0 22 26" fill="none">
            <path d="M11 0C4.925 0 0 4.925 0 11c0 8.25 11 15 11 15s11-6.75 11-15C22 4.925 17.075 0 11 0Z" fill="#EDE9FE"/>
            <path d="M11 1C5.477 1 1 5.477 1 11c0 7.7 10 13.8 10 13.8S21 18.7 21 11C21 5.477 16.523 1 11 1Z" stroke="#A78BFA" strokeWidth="1"/>
            <circle cx="11" cy="11" r="4" fill="#7C3AED"/>
            <circle cx="11" cy="11" r="2" fill="#A78BFA"/>
          </svg>

          <div className="flex flex-col gap-1">
            <p className="font-cormorant text-2xl sm:text-3xl italic font-light text-plum-800">
              Beykoz Belediyesi
            </p>
            <p className="font-cormorant text-xl font-light text-plum-600">Nikah Salonu</p>
          </div>

          <div className="h-px w-20 bg-gradient-to-r from-transparent via-plum-200 to-transparent" />

          <p className="font-dm text-[10px] uppercase tracking-superwide text-plum-500">
            İstanbul, Türkiye
          </p>

          {/* Time badge */}
          <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-plum-50">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke="#A78BFA" strokeWidth="1.2"/>
              <path d="M7 4V7.5L9.5 9" stroke="#7C3AED" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            <span className="font-dm text-[10px] uppercase tracking-superwide text-plum-600">
              Saat 14:00
            </span>
          </div>

          <div className="h-px w-20 bg-gradient-to-r from-transparent via-plum-100 to-transparent" />

          {/* Direction buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
            <a
              href={MAP_DIRECTIONS}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex-1 w-full sm:w-auto flex items-center justify-center gap-2
                         rounded-xl py-3 overflow-hidden font-dm text-[11px] uppercase tracking-superwide
                         text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 50%, #A78BFA 100%)',
                boxShadow: '0 6px 20px rgba(124,58,237,0.28)',
              }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                               -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="relative">
                <path d="M1.5 12.5L12.5 1.5M12.5 1.5H5.5M12.5 1.5V8.5"
                  stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 7L2 12" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
              </svg>
              <span className="relative">Yol Tarifi Al</span>
            </a>

            <a
              href={MAP_VIEW}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl w-full sm:w-auto
                         border border-plum-100 font-dm text-[11px] uppercase tracking-superwide
                         text-plum-500 hover:text-plum-700 hover:border-plum-300
                         transition-all duration-200"
            >
              <span>Haritada Gör</span>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1.5 8.5L8.5 1.5M8.5 1.5H4M8.5 1.5V6"
                  stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </motion.div>

        {/* ── Countdown ──────────────────────────────────────────────── */}
        <motion.div custom={4} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="flex flex-col items-center gap-6 w-full">
          <p className="font-dm text-[10px] uppercase tracking-ultrawide text-plum-500">Geriye Sayım</p>
          <div className="grid grid-cols-4 gap-3 sm:gap-6 w-full max-w-lg">
            <CountdownUnit value={days}    label="Gün"    />
            <CountdownUnit value={hours}   label="Saat"   />
            <CountdownUnit value={minutes} label="Dakika" />
            <CountdownUnit value={seconds} label="Saniye" />
          </div>
        </motion.div>

        <motion.div custom={5} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <FloralDivider />
        </motion.div>

      </div>
    </section>
  )
}

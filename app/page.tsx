'use client'

import { Toaster } from 'react-hot-toast'
import HeroSection    from '@/components/HeroSection'
import DetailsSection from '@/components/DetailsSection'
import RSVPSection    from '@/components/RSVPSection'
import MusicPlayer    from '@/components/MusicPlayer'
import FloatingHearts from '@/components/FloatingHearts'

export default function Home() {
  return (
    /* No overflow-x-hidden here — handled on body in globals.css.
       Having it on a non-root element can break fixed children & iOS scroll height. */
    <main className="relative bg-cream text-plum-900">
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(16px)',
            color: '#1E0E52',
            border: '1px solid #DDD6FE',
            borderRadius: '16px',
            fontFamily: 'var(--font-dm-sans)',
            fontSize: '13px',
            letterSpacing: '0.04em',
            padding: '14px 20px',
            boxShadow: '0 8px 32px rgba(124,58,237,0.12)',
          },
          success: { iconTheme: { primary: '#7C3AED', secondary: '#EDE9FE' }, duration: 5000 },
          error:   { iconTheme: { primary: '#7C3AED', secondary: '#EDE9FE' }, duration: 5000 },
        }}
      />

      <HeroSection />
      <DetailsSection />
      <RSVPSection />

      <footer className="py-16 flex flex-col items-center gap-4 bg-cream">
        <div className="flex items-center gap-4">
          <span className="h-px w-14 bg-gradient-to-r from-transparent to-plum-200" />
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="#C4B5FD"/>
          </svg>
          <span className="h-px w-14 bg-gradient-to-l from-transparent to-plum-200" />
        </div>
        <p className="font-cormorant text-2xl font-light text-plum-400 tracking-widest">B &amp; B</p>
        <p className="font-dm text-[9px] uppercase tracking-ultrawide text-plum-300">17 · 10 · 2026</p>
      </footer>

      <MusicPlayer />
      <FloatingHearts />
    </main>
  )
}

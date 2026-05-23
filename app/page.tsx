'use client'

import { Toaster } from 'react-hot-toast'
import HeroSection    from '@/components/HeroSection'
import DetailsSection from '@/components/DetailsSection'
import RSVPSection    from '@/components/RSVPSection'
import MusicPlayer    from '@/components/MusicPlayer'

export default function Home() {
  return (
    /*
     * Single cream base across the whole page.
     * Sections are transparent — only their blob/orb layers add colour,
     * which fade to transparent and never create a hard seam.
     */
    <main className="relative bg-cream text-plum-900 overflow-x-hidden">
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

      {/* Footer */}
      <footer className="py-20 flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          <span className="h-px w-14 bg-gradient-to-r from-transparent to-plum-200" />
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <ellipse cx="10" cy="4"  rx="2.5" ry="4"   fill="#C4B5FD" opacity="0.8" />
            <ellipse cx="16" cy="10" rx="4"   ry="2.5" fill="#C4B5FD" opacity="0.8" />
            <ellipse cx="10" cy="16" rx="2.5" ry="4"   fill="#C4B5FD" opacity="0.8" />
            <ellipse cx="4"  cy="10" rx="4"   ry="2.5" fill="#C4B5FD" opacity="0.8" />
            <circle  cx="10" cy="10" r="3"              fill="#7C3AED" />
          </svg>
          <span className="h-px w-14 bg-gradient-to-l from-transparent to-plum-200" />
        </div>
        <p className="font-cormorant text-2xl font-light text-plum-400 tracking-widest">B &amp; B</p>
        <p className="font-dm text-[9px] uppercase tracking-ultrawide text-plum-300">17 · 10 · 2026</p>
      </footer>

      <MusicPlayer />
    </main>
  )
}

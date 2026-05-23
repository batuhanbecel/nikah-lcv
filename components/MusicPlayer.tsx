'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const VIDEO_ID = 'aDju79MtUR8'
const VOLUME   = 75

// Minimal inline types — avoids adding @types/youtube dependency
type YTPlayer = {
  playVideo(): void
  pauseVideo(): void
  setVolume(v: number): void
  destroy(): void
}

declare global {
  interface Window {
    YT: {
      Player: new (
        el: HTMLElement,
        opts: {
          videoId: string
          playerVars?: Record<string, string | number>
          events?: {
            onReady?:       (e: { target: YTPlayer }) => void
            onStateChange?: (e: { data: number })     => void
          }
        }
      ) => YTPlayer
      PlayerState: { PLAYING: number }
    }
    onYouTubeIframeAPIReady?: () => void
  }
}

export default function MusicPlayer() {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef    = useRef<YTPlayer | null>(null)
  const [playing,   setPlaying]   = useState(false)
  const [ready,     setReady]     = useState(false)
  const [showLabel, setShowLabel] = useState(true)

  useEffect(() => {
    function initPlayer() {
      if (!containerRef.current || playerRef.current) return

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: VIDEO_ID,
        playerVars: {
          autoplay:       0,
          controls:       0,
          disablekb:      1,
          fs:             0,
          modestbranding: 1,
          playsinline:    1,
          loop:           1,
          playlist:       VIDEO_ID, // required for loop on single video
        },
        events: {
          onReady: (e) => {
            e.target.setVolume(VOLUME)
            setReady(true)
          },
          onStateChange: (e) => {
            setPlaying(e.data === 1) // 1 = YT.PlayerState.PLAYING
          },
        },
      })
    }

    // If API already loaded (e.g. hot reload), init immediately
    if (window.YT?.Player) {
      initPlayer()
      return
    }

    // Inject script once
    if (!document.getElementById('yt-iframe-api')) {
      const s = document.createElement('script')
      s.id  = 'yt-iframe-api'
      s.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(s)
    }

    window.onYouTubeIframeAPIReady = initPlayer

    return () => {
      playerRef.current?.destroy()
      playerRef.current = null
      setReady(false)
      setPlaying(false)
    }
  }, [])

  function toggle() {
    setShowLabel(false)
    if (!ready || !playerRef.current) return
    playing ? playerRef.current.pauseVideo() : playerRef.current.playVideo()
  }

  return (
    <>
      {/* Hidden YT player mount point — off-screen, real DOM node (not iframe directly) */}
      <div
        ref={containerRef}
        className="absolute -left-[9999px] -top-[9999px] w-1 h-1"
        aria-hidden
      />

      {/* Floating button */}
      <div className="fixed bottom-7 right-7 z-50 flex flex-col items-end gap-3">

        {/* Intro tooltip */}
        <AnimatePresence>
          {showLabel && (
            <motion.div
              initial={{ opacity: 0, x: 12, scale: 0.9 }}
              animate={{ opacity: 1, x: 0,  scale: 1   }}
              exit={{    opacity: 0, x: 12, scale: 0.9 }}
              transition={{ duration: 0.4, delay: 4 }}
              className="glass rounded-xl px-4 py-2 shadow-lg shadow-plum-100/50"
            >
              <p className="font-dm text-[10px] text-plum-500 whitespace-nowrap tracking-wide">
                Müziği aç
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={toggle}
          aria-label={playing ? 'Müziği durdur' : 'Müziği çal'}
          className="group relative flex items-center gap-3"
        >
          {/* Sound wave bars */}
          <motion.div
            animate={{ opacity: playing ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-end gap-[3px] h-5"
            aria-hidden
          >
            {(['animate-sound-bar-1','animate-sound-bar-2','animate-sound-bar-3','animate-sound-bar-4','animate-sound-bar-5'] as const).map((cls, i) => (
              <span
                key={i}
                className={`bar block w-[3px] rounded-full ${cls}`}
                style={{ height: '100%', background: 'linear-gradient(to top, #7C3AED, #A78BFA)' }}
              />
            ))}
          </motion.div>

          {/* Button circle */}
          <motion.span
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="relative flex items-center justify-center w-12 h-12 rounded-full shadow-lg"
            style={{
              background: playing ? 'linear-gradient(135deg, #5B21B6, #7C3AED)' : 'rgba(255,255,255,0.88)',
              border:     playing ? '1.5px solid transparent' : '1.5px solid #DDD6FE',
              backdropFilter: 'blur(12px)',
              boxShadow:  playing ? '0 8px 24px rgba(124,58,237,0.35)' : '0 4px 16px rgba(196,181,253,0.25)',
            }}
          >
            {playing && (
              <span className="absolute inset-0 rounded-full border-2 border-plum-400/40 animate-ping-soft" />
            )}

            {playing ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="2" y="2" width="4" height="10" rx="1.5" fill="white"/>
                <rect x="8" y="2" width="4" height="10" rx="1.5" fill="white"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                className="text-plum-500 group-hover:text-plum-600 transition-colors">
                <path d="M6 12V4.5l8-1.8V11" stroke="currentColor" strokeWidth="1.3"
                  strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="4.5" cy="12" r="2" fill="currentColor"/>
                <circle cx="12.5" cy="11" r="2" fill="currentColor"/>
              </svg>
            )}
          </motion.span>
        </button>
      </div>
    </>
  )
}

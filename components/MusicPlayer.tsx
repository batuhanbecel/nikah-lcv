'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const YT_SRC =
  'https://www.youtube.com/embed/videoseries' +
  '?list=PL5AlmGV6XhkhOjrp9KGj3rm8O9ByFp9Kb' +
  '&autoplay=1&loop=1&controls=0&disablekb=1&fs=0&modestbranding=1&playsinline=1'

export default function MusicPlayer() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [playing, setPlaying] = useState(false)
  const [loaded,  setLoaded]  = useState(false)
  const [showLabel, setShowLabel] = useState(true)

  function toggle() {
    // Hide the intro label after first interaction
    setShowLabel(false)

    if (!loaded) {
      if (iframeRef.current) {
        iframeRef.current.src = YT_SRC
        setLoaded(true)
        setPlaying(true)
      }
      return
    }
    if (playing) {
      iframeRef.current!.src = ''
      setLoaded(false)
      setPlaying(false)
    } else {
      iframeRef.current!.src = YT_SRC
      setLoaded(true)
      setPlaying(true)
    }
  }

  return (
    <>
      {/* Hidden YT iframe */}
      <iframe
        ref={iframeRef}
        title="Background Music"
        allow="autoplay; encrypted-media"
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
                🎵 Müzik çal
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={toggle}
          aria-label={playing ? 'Müziği durdur' : 'Müziği çal'}
          className="group relative flex items-center gap-3"
        >
          {/* Sound bars — visible when playing */}
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
                style={{
                  height: '100%',
                  background: 'linear-gradient(to top, #7C3AED, #A78BFA)',
                }}
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
              background: playing
                ? 'linear-gradient(135deg, #5B21B6, #7C3AED)'
                : 'rgba(255,255,255,0.85)',
              border: playing
                ? '1.5px solid transparent'
                : '1.5px solid #DDD6FE',
              backdropFilter: 'blur(12px)',
              boxShadow: playing
                ? '0 8px 24px rgba(124,58,237,0.35)'
                : '0 4px 16px rgba(196,181,253,0.25)',
            }}
          >
            {/* Ping ring when playing */}
            {playing && (
              <span className="absolute inset-0 rounded-full border-2 border-plum-400/40 animate-ping-soft" />
            )}

            {playing ? (
              /* Pause icon */
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="2" y="2" width="4" height="10" rx="1.5" fill="white" />
                <rect x="8" y="2" width="4" height="10" rx="1.5" fill="white" />
              </svg>
            ) : (
              /* Music note icon */
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                className="text-plum-500 group-hover:text-plum-600 transition-colors">
                <path d="M6 12V4.5l8-1.8V11" stroke="currentColor" strokeWidth="1.3"
                  strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="4.5" cy="12" r="2" fill="currentColor" />
                <circle cx="12.5" cy="11" r="2" fill="currentColor" />
              </svg>
            )}
          </motion.span>
        </button>
      </div>
    </>
  )
}

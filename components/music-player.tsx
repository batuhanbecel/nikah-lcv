"use client";

import { motion } from "framer-motion";
import { Music2, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { music } from "@/lib/event";

const musicSrc = process.env.NEXT_PUBLIC_MUSIC_SRC ?? music.src;

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const audio = new Audio(musicSrc);
    audio.loop = true;
    audio.volume = 0;
    audio.preload = "metadata";
    audioRef.current = audio;
    window.requestAnimationFrame(() => setReady(true));
    const handleAudioError = () => setUnavailable(true);
    audio.addEventListener("error", handleAudioError);

    const fade = window.setInterval(() => {
      if (!audio.paused && audio.volume < 0.34) {
        audio.volume = Math.min(0.34, audio.volume + 0.02);
      }
    }, 120);

    audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));

    return () => {
      window.clearInterval(fade);
      audio.removeEventListener("error", handleAudioError);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const toggle = async () => {
    if (unavailable) {
      window.open(music.youtubeUrl, "_blank", "noopener,noreferrer");
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.volume = 0;
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        window.open(music.youtubeUrl, "_blank", "noopener,noreferrer");
      }
      return;
    }

    audio.pause();
    setPlaying(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 20 }}
      className="fixed bottom-5 right-5 z-50"
    >
      <Button
        size="icon"
        aria-label={playing ? "Müziği duraklat" : `${music.artist} - ${music.title}`}
        title={unavailable ? "YouTube'da aç" : `${music.artist} - ${music.title}`}
        onClick={toggle}
        className="h-13 w-13 border border-white/40 bg-black/80 text-white shadow-2xl backdrop-blur-xl hover:bg-purple"
      >
        <motion.span animate={{ rotate: playing ? 360 : 0 }} transition={{ duration: 4, repeat: playing ? Infinity : 0, ease: "linear" }}>
          <Music2 className="h-5 w-5" />
        </motion.span>
        <span className="sr-only">{playing ? <Pause /> : <Play />}</span>
      </Button>
    </motion.div>
  );
}

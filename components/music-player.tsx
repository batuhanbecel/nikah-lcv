"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Music2, Pause, Play } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { music } from "@/lib/event";

export function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const reduceMotion = useReducedMotion();
  const embedUrl = useMemo(() => {
    const params = new URLSearchParams({
      autoplay: "1",
      controls: "0",
      disablekb: "1",
      modestbranding: "1",
      rel: "0",
      playsinline: "1"
    });

    return `https://www.youtube-nocookie.com/embed/${music.youtubeVideoId}?${params.toString()}`;
  }, []);

  useEffect(() => {
    window.requestAnimationFrame(() => setReady(true));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
      animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : reduceMotion ? 0 : 20 }}
      className="fixed bottom-4 right-4 z-50 sm:bottom-5 sm:right-5"
    >
      {playing ? (
        <iframe
          title={`${music.artist} - ${music.title}`}
          src={embedUrl}
          aria-hidden="true"
          tabIndex={-1}
          className="pointer-events-none fixed -left-px -top-px h-px w-px opacity-0"
          allow="autoplay; encrypted-media"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : null}

      <Button
        size="icon"
        aria-label={playing ? "Müziği duraklat" : `${music.artist} - ${music.title} çal`}
        title={playing ? "Müziği duraklat" : `${music.artist} - ${music.title} çal`}
        onClick={() => setPlaying((current) => !current)}
        className="h-13 w-13 border border-white/55 bg-black/78 text-white shadow-2xl backdrop-blur-xl hover:bg-purple"
      >
        <motion.span
          animate={{ rotate: playing && !reduceMotion ? 360 : 0 }}
          transition={{ duration: 4, repeat: playing && !reduceMotion ? Infinity : 0, ease: "linear" }}
        >
          <Music2 className="h-5 w-5" />
        </motion.span>
        <span className="sr-only">{playing ? <Pause /> : <Play />}</span>
      </Button>
    </motion.div>
  );
}

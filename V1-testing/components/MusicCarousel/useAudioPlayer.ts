"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Track } from "./tracks";

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (typeof Audio !== "undefined") {
      audioRef.current = new Audio();
      const el = audioRef.current;
      const onEnded = () => setIsPlaying(false);
      el.addEventListener("ended", onEnded);
      return () => {
        el.removeEventListener("ended", onEnded);
        el.pause();
      };
    }
  }, []);

  const toggle = useCallback(
    (track: Track) => {
      const el = audioRef.current;
      const isSame = currentId === track.id;

      // Placeholder mode: no audioSrc yet, only toggle UI state.
      if (!track.audioSrc) {
        if (isSame && isPlaying) {
          setIsPlaying(false);
        } else {
          setCurrentId(track.id);
          setIsPlaying(true);
        }
        // eslint-disable-next-line no-console
        console.log(`[audio placeholder] toggle track #${track.id} – ${track.title}`);
        return;
      }

      if (!el) return;

      if (isSame && isPlaying) {
        el.pause();
        setIsPlaying(false);
        return;
      }

      if (!isSame) {
        el.src = track.audioSrc;
        setCurrentId(track.id);
      }
      void el.play();
      setIsPlaying(true);
    },
    [currentId, isPlaying],
  );

  return { currentId, isPlaying, toggle };
}

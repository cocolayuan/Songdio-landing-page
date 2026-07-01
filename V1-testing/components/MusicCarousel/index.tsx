"use client";

import { useCallback, useEffect, useState } from "react";
import { tracks } from "./tracks";
import { useAudioPlayer } from "./useAudioPlayer";
import Card from "./Card";

const TOTAL = tracks.length;

function circularOffset(index: number, active: number, total: number) {
  let diff = index - active;
  const half = total / 2;
  if (diff > half) diff -= total;
  if (diff < -half) diff += total;
  return diff;
}

export default function MusicCarousel() {
  const [active, setActive] = useState(0);
  const { currentId, isPlaying, toggle } = useAudioPlayer();

  const prev = useCallback(() => {
    setActive((a) => (a - 1 + TOTAL) % TOTAL);
  }, []);

  const next = useCallback(() => {
    setActive((a) => (a + 1) % TOTAL);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === " ") {
        e.preventDefault();
        toggle(tracks[active]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, toggle, active]);

  return (
    <section
      id="p2"
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#0a0a0b]"
    >
      <div
        className="relative h-[520px] w-full max-w-[1920px]"
        style={{ perspective: "1600px" }}
      >
        <div
          className="relative h-full w-full"
          style={{ transformStyle: "preserve-3d" }}
        >
          {tracks.map((track, i) => {
            const offset = circularOffset(i, active, TOTAL);
            return (
              <Card
                key={track.id}
                track={track}
                offset={offset}
                isPlaying={isPlaying && currentId === track.id}
                onSelect={() => {
                  if (offset !== 0) setActive(i);
                }}
                onTogglePlay={(e) => {
                  e.stopPropagation();
                  toggle(track);
                }}
              />
            );
          })}
        </div>

        {/* Arrows */}
        <button
          type="button"
          onClick={prev}
          aria-label="Previous"
          className="absolute left-[26%] top-1/2 z-40 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full text-2xl text-white/70 transition hover:text-white"
        >
          <span aria-hidden>‹</span>
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next"
          className="absolute right-[26%] top-1/2 z-40 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full text-2xl text-white/70 transition hover:text-white"
        >
          <span aria-hidden>›</span>
        </button>
      </div>
    </section>
  );
}

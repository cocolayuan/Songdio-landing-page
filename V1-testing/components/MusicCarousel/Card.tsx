"use client";

import type { CSSProperties } from "react";
import type { Track } from "./tracks";
import PlayButton from "./PlayButton";
import GenreTags from "./GenreTags";

interface CardProps {
  track: Track;
  offset: number; // 0 = center, ±1 neighbors, ±2 depth backboards
  isPlaying: boolean;
  onSelect: () => void;
  onTogglePlay: (e: React.MouseEvent) => void;
}

const CARD = 400;

function getTransform(offset: number): CSSProperties {
  const abs = Math.abs(offset);
  const sign = Math.sign(offset);

  if (offset === 0) {
    return {
      transform: "translateX(0) rotateY(0deg) translateZ(0) scale(1)",
      opacity: 1,
      zIndex: 30,
    };
  }
  if (abs === 1) {
    return {
      transform: `translateX(${sign * 360}px) rotateY(${-sign * 45}deg) translateZ(-120px) scale(0.82)`,
      opacity: 0.95,
      zIndex: 20,
    };
  }
  if (abs === 2) {
    return {
      transform: `translateX(${sign * 620}px) rotateY(${-sign * 55}deg) translateZ(-260px) scale(0.7)`,
      opacity: 0.85,
      zIndex: 10,
    };
  }
  // further away – hidden
  return {
    transform: `translateX(${sign * 760}px) rotateY(${-sign * 60}deg) translateZ(-360px) scale(0.6)`,
    opacity: 0,
    zIndex: 0,
    pointerEvents: "none",
  };
}

export default function Card({
  track,
  offset,
  isPlaying,
  onSelect,
  onTogglePlay,
}: CardProps) {
  const isCenter = offset === 0;
  const isBackboard = Math.abs(offset) >= 2;
  const style = getTransform(offset);

  return (
    <div
      className="absolute left-1/2 top-1/2 transition-all duration-500 ease-[cubic-bezier(.22,.61,.36,1)]"
      style={{
        width: CARD,
        height: CARD,
        marginLeft: -CARD / 2,
        marginTop: -CARD / 2,
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-label={`Select ${track.title}`}
        className="group relative block h-full w-full overflow-hidden rounded-3xl shadow-2xl"
        style={{ cursor: isCenter ? "default" : "pointer" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={track.cover}
          alt={track.title}
          className="h-full w-full object-cover"
          draggable={false}
        />

        {/* Depth backboard darkening: real image + black filter */}
        {isBackboard ? (
          <span className="absolute inset-0 bg-black/65" />
        ) : (
          <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
        )}

        {/* Center card overlays */}
        {isCenter && (
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 p-4">
            <PlayButton isPlaying={isPlaying} onClick={onTogglePlay} />
            <div className="min-w-0 flex-1">
              <GenreTags genres={track.genres} />
            </div>
          </div>
        )}
      </button>
    </div>
  );
}

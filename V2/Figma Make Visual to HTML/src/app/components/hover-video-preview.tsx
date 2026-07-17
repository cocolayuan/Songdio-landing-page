import { useRef, useState } from "react";

export type HoverVideoPreviewProps = {
  /** Poster image shown when not hovering. */
  cover: string;
  /** Video played on hover (muted/loop; reset on leave). */
  src: string;
  /** Positioning + size of the hover hit area (e.g. the whole card). */
  className?: string;
  /** Positioning + size + radius of the visible media box within the hit area. Default fills the area. */
  mediaClassName?: string;
  /** Accessibility label. */
  label?: string;
  /** Mute playback. Default true (needed for guaranteed autoplay). */
  muted?: boolean;
};

/**
 * Inline hover-to-play preview: shows a cover image, plays the video in place
 * on mouse enter, and returns to the cover on leave. Not a modal — stays inside
 * the card. Reusable across feature cards.
 */
export function HoverVideoPreview({
  cover,
  src,
  className = "",
  mediaClassName = "inset-0",
  label,
  muted = true,
}: HoverVideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);

  const handleEnter = () => {
    setActive(true);
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      v.muted = muted;
      void v.play().catch(() => {
        // Sound autoplay blocked (no prior gesture) → fall back to muted.
        if (!muted) {
          v.muted = true;
          void v.play();
        }
      });
    }
  };

  const handleLeave = () => {
    setActive(false);
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };

  return (
    <div
      className={className}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      role="img"
      aria-label={label}
    >
      <div className={`absolute overflow-hidden ${mediaClassName}`}>
        <img
          src={cover}
          alt={label ?? ""}
          className={`absolute inset-0 size-full object-cover transition-opacity duration-200 ${
            active ? "opacity-0" : "opacity-100"
          }`}
        />
        <video
          ref={videoRef}
          src={src}
          muted={muted}
          loop
          playsInline
          preload="metadata"
          className={`absolute inset-0 size-full object-cover transition-opacity duration-200 ${
            active ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </div>
  );
}

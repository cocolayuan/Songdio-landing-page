import { useState } from "react";
import { VideoPlayerModal } from "./video-player-modal";

const VIDEO_SRC = "/features/Text-to-MV-video.mp4";

/**
 * Click-to-play for Text-to-MV (5th module).
 * Hit area covers the whole cover; centered play button hover matches Music-to-MV.
 * Replaces the old Frame47 overlay play button.
 */
export function TextToMvPlayer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Play Text-to-MV video"
        onClick={() => setOpen(true)}
        className="group absolute left-[822px] top-[757px] z-[5] flex h-[153px] w-[278px] cursor-pointer items-center justify-center rounded-[24px] bg-transparent"
      >
        <span className="relative flex size-[44px] items-center justify-center rounded-full transition-transform duration-200 ease-out group-hover:scale-110">
          <svg className="size-[38px]" fill="none" viewBox="0 0 38 38" aria-hidden>
            <circle cx="19" cy="19" r="19" fill="white" fillOpacity={0.5} />
            <path
              d="M25.4 17.7c.85.52.85 1.78 0 2.3l-8.9 5.4c-.9.55-2.1-.1-2.1-1.15V13.45c0-1.05 1.2-1.7 2.1-1.15l8.9 5.4Z"
              fill="white"
            />
          </svg>
        </span>
      </button>
      <VideoPlayerModal
        open={open}
        onClose={() => setOpen(false)}
        src={VIDEO_SRC}
        closeLabel="Close Text-to-MV video"
      />
    </>
  );
}

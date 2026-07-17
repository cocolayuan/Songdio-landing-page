import { useState } from "react";
import { VideoPlayerModal } from "./video-player-modal";

const VIDEO_SRC = "/features/Text-to-MV-video.mp4";

/**
 * Click-to-play overlay for the Text-to-MV feature card (5th module).
 * Opens the shared VideoPlayerModal; trigger sits over image 569 + play button.
 */
export function TextToMvPlayer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Play Text-to-MV video"
        onClick={() => setOpen(true)}
        className="absolute left-[822px] top-[757px] z-[5] h-[153px] w-[278px] cursor-pointer rounded-[24px] bg-transparent"
      />
      <VideoPlayerModal
        open={open}
        onClose={() => setOpen(false)}
        src={VIDEO_SRC}
        closeLabel="Close Text-to-MV video"
      />
    </>
  );
}

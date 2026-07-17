import { useState } from "react";
import { VideoPlayerModal } from "./video-player-modal";

const VIDEO_SRC = "/features/Music-to-MV-video.mp4";

/**
 * Click-to-play for Music-to-MV (4th module).
 * Only owns the hit area + src; modal UX lives in VideoPlayerModal.
 */
export function MusicToMvPlayer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Play Music-to-MV video"
        onClick={() => setOpen(true)}
        className="absolute left-[450px] top-[757px] z-[5] h-[153px] w-[278px] cursor-pointer rounded-[24px] bg-transparent"
      />
      <VideoPlayerModal
        open={open}
        onClose={() => setOpen(false)}
        src={VIDEO_SRC}
        closeLabel="Close Music-to-MV video"
      />
    </>
  );
}

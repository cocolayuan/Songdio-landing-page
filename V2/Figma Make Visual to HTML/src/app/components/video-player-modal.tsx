import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const DEFAULT_VIDEO_CLASS =
  "max-h-[56vh] max-w-[49vw] rounded-[24px] bg-black";
const DEFAULT_CLOSE_OFFSET = "-right-5 -top-5";

export type VideoPlayerModalProps = {
  open: boolean;
  onClose: () => void;
  src: string;
  /** Accessibility label for the close control. */
  closeLabel?: string;
  /** Class for the <video> element (size / radius). */
  videoClassName?: string;
  /** Absolute offset of the close button relative to the video corner. */
  closeOffsetClass?: string;
};

/**
 * Reusable fullscreen video modal: portal to <body>, dimmed overlay,
 * Esc / backdrop / close-button dismiss, pauses on close.
 * Unaffected by the Figma stage `transform: scale(...)`.
 */
export function VideoPlayerModal({
  open,
  onClose,
  src,
  closeLabel = "Close video",
  videoClassName = DEFAULT_VIDEO_CLASS,
  closeOffsetClass = DEFAULT_CLOSE_OFFSET,
}: VideoPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        videoRef.current?.pause();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  const handleClose = () => {
    videoRef.current?.pause();
    onClose();
  };

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-6"
      onClick={handleClose}
    >
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <video
          ref={videoRef}
          src={src}
          className={videoClassName}
          controls
          autoPlay
          playsInline
        />
        <button
          type="button"
          aria-label={closeLabel}
          onClick={handleClose}
          className={`absolute ${closeOffsetClass} flex size-[24px] items-center justify-center rounded-full border border-white/8 bg-[#1a1a1d] transition-colors hover:bg-[#2a2a2d]`}
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M3 3L13 13M13 3L3 13"
              stroke="#9A9AA0"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>,
    document.body,
  );
}

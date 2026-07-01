"use client";

interface PlayButtonProps {
  isPlaying: boolean;
  onClick: (e: React.MouseEvent) => void;
}

export default function PlayButton({ isPlaying, onClick }: PlayButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPlaying ? "Pause" : "Play"}
      className="grid h-12 w-12 place-items-center rounded-full bg-white/90 text-black shadow-lg backdrop-blur transition hover:scale-105 hover:bg-white"
    >
      {isPlaying ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <rect x="3" y="2" width="3.5" height="12" rx="1" />
          <rect x="9.5" y="2" width="3.5" height="12" rx="1" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M4 2.5v11a1 1 0 0 0 1.54.84l8.2-5.5a1 1 0 0 0 0-1.68l-8.2-5.5A1 1 0 0 0 4 2.5Z" />
        </svg>
      )}
    </button>
  );
}

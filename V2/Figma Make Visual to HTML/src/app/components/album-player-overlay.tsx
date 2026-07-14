import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

export type AlbumTrack = {
  id: number;
  cover: string;
  audio: string;
  keywords: string[];
};

/** Covers under /album-covers; tracks under /album-tracks (01.mp3, 02–06.m4a) */
export const ALBUM_TRACKS: AlbumTrack[] = [
  {
    id: 1,
    cover: "/album-covers/01.png",
    audio: "/album-tracks/01.mp3",
    keywords: ["Chill R&B", "Sung-Rap"],
  },
  {
    id: 2,
    cover: "/album-covers/02.png",
    audio: "/album-tracks/02.m4a",
    keywords: ["Dream Pop", "Ambient"],
  },
  {
    id: 3,
    cover: "/album-covers/03.png",
    audio: "/album-tracks/03.m4a",
    keywords: ["Indie", "Melancholic"],
  },
  {
    id: 4,
    cover: "/album-covers/04.png",
    audio: "/album-tracks/04.m4a",
    keywords: ["Electronic", "Pulse"],
  },
  {
    id: 5,
    cover: "/album-covers/05.png",
    audio: "/album-tracks/05.m4a",
    keywords: ["Jazz", "Night"],
  },
  {
    id: 6,
    cover: "/album-covers/06.png",
    audio: "/album-tracks/06.m4a",
    keywords: ["Folk", "Warm"],
  },
];

function PlayIcon() {
  return (
    <svg className="w-1/2 h-1/2" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M5.5 3.2v11.6L15 9 5.5 3.2z" fill="white" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg className="w-1/2 h-1/2" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="3.5" y="3" width="3.2" height="10" rx="1" fill="white" />
      <rect x="9.3" y="3" width="3.2" height="10" rx="1" fill="white" />
    </svg>
  );
}

type AlbumPlayerOverlayProps = {
  /** Normalized 0..5 album index currently in front */
  albumIndex: number;
  /** Interactive (front card settled enough to click) */
  visible: boolean;
  /** Root ref — carousel writes per-frame opacity to follow the damp buffer */
  rootRef?: React.Ref<HTMLDivElement>;
};

/**
 * HTML player overlay on the center album (Figma 1189:346).
 * Play once (no loop); seek via progress drag; resets when albumIndex changes.
 */
export function AlbumPlayerOverlay({ albumIndex, visible, rootRef }: AlbumPlayerOverlayProps) {
  const track = ALBUM_TRACKS[albumIndex] ?? ALBUM_TRACKS[0];
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Swap / reset audio when front album changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.loop = false;
    audio.currentTime = 0;
    audio.src = track.audio;
    audio.load();
    setPlaying(false);
    setProgress(0);
  }, [track.audio, albumIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      if (draggingRef.current) return;
      const d = audio.duration;
      if (!d || !Number.isFinite(d)) return;
      setProgress(audio.currentTime / d);
    };
    const onEnded = () => {
      setPlaying(false);
      setProgress(1);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  const seekFromClientX = useCallback((clientX: number) => {
    const audio = audioRef.current;
    const bar = barRef.current;
    if (!audio || !bar) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const d = audio.duration;
    if (d && Number.isFinite(d)) {
      audio.currentTime = ratio * d;
      setProgress(ratio);
    } else {
      setProgress(ratio);
    }
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      return;
    }

    // Restart if finished
    if (audio.ended || (audio.duration && audio.currentTime >= audio.duration - 0.05)) {
      audio.currentTime = 0;
      setProgress(0);
    }

    try {
      await audio.play();
    } catch (err) {
      console.warn("[AlbumPlayer] play failed", err);
      setPlaying(false);
    }
  };

  const onBarPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    seekFromClientX(e.clientX);
  };

  const onBarPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    e.preventDefault();
    seekFromClientX(e.clientX);
  };

  const onBarPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  };

  const keywords = track.keywords.slice(0, 4);

  return (
    // Square wrapper ≈ front album's on-screen box (tracks canvas height via cqh)
    // Opacity + horizontal slide are driven per-frame by the carousel (follows the damp buffer).
    <div
      ref={rootRef}
      className="absolute left-1/2 top-1/2 w-[85cqh] h-[85cqh] max-w-[92cqw] pointer-events-none"
      style={{ opacity: 0, transform: "translate(-50%, -50%)" }}
      data-name="album-player-overlay"
      aria-hidden={!visible}
    >
      <audio ref={audioRef} preload="metadata" playsInline />

      {/* Figma 1189:346 — bottom strip spanning the cover's lower band */}
      <div
        className={`absolute left-[10%] right-[10%] bottom-[8%] h-[9%] flex items-center ${
          visible ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            void togglePlay();
          }}
          aria-label={playing ? "Pause" : "Play"}
          className="shrink-0 h-full aspect-square rounded-full bg-[rgba(60,55,70,0.42)] backdrop-blur-[14px] flex items-center justify-center hover:bg-[rgba(80,75,95,0.52)] transition-colors cursor-pointer"
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>

        {/* Bar vertically centered with play button; keywords sit just above it */}
        <div className="relative flex-1 min-w-0 h-full" style={{ marginLeft: "4%" }}>
          <div
            className="absolute left-0 right-0 flex items-center font-['Inter',sans-serif] font-medium text-white whitespace-nowrap overflow-hidden"
            style={{ bottom: "calc(50% + 1.2cqh)", gap: "4cqh", fontSize: "2.35cqh", lineHeight: 1.2 }}
          >
            {keywords.map((kw) => (
              <span key={kw} className="shrink-0">
                {kw}
              </span>
            ))}
          </div>

          <div
            ref={barRef}
            role="slider"
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
            tabIndex={0}
            onPointerDown={onBarPointerDown}
            onPointerMove={onBarPointerMove}
            onPointerUp={onBarPointerUp}
            onPointerCancel={onBarPointerUp}
            className="absolute left-0 right-0 top-1/2 -translate-y-1/2 rounded-full cursor-pointer touch-none"
            style={{
              height: "0.85cqh",
              minHeight: 3,
              background: "rgba(217,217,217,0.29)",
              backdropFilter: "blur(5px)",
            }}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full pointer-events-none"
              style={{
                width: `${progress * 100}%`,
                background: "rgba(217,217,217,0.85)",
                backdropFilter: "blur(5px)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

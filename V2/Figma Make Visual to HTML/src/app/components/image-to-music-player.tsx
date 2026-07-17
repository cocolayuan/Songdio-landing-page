import React, { useEffect, useRef, useState, type MouseEvent } from "react";
import imgImage568 from "../../imports/HtmlFe/ef2c5c1194283c05595e341b34e920c62e8bac2e.png";

const AUDIO_SRC = "/features/Image-to-Music-audio.mp3";

const PLAY_PATH =
  "M16.0012 10.8154C16.6637 11.2771 16.6637 12.2574 16.0012 12.7191L10.7798 16.3574C10.0107 16.8933 8.95646 16.343 8.95646 15.4055L8.95646 8.12896C8.95646 7.19155 10.0107 6.64122 10.7798 7.17714L16.0012 10.8154Z";
const PAUSE_PATH = "M8 7h2.5v10H8zm5 0h2.5v10H13z";

/**
 * Interactive Image-to-Music (2nd module) player.
 * Features an elegant 3D Push-Pull Stack transition (similar to iOS multitasking view)
 * strictly bounded to the lower half of the 332x311px card to prevent overflowing.
 *
 * Initial State:
 *   - Pill (Element 2) is at bottom-right foreground (left:84, top:127, zIndex:10).
 *   - Record (Element 1) is at top-left background (left:48, top:8, zIndex:1).
 *
 * Auto-rotates every 5 seconds. Rotation pauses when the card is hovered or
 * while the generated audio is playing. Click-to-play audio plays exactly once (no loop).
 */
export function ImageToMusicPlayer() {
  const [activeElement, setActiveElement] = useState<1 | 2>(2); // 2 = Pill front (initial), 1 = Record front
  const [hasRotated, setHasRotated] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (hovered || playing) return;

    const interval = setInterval(() => {
      setHasRotated(true);
      setActiveElement((prev) => (prev === 1 ? 2 : 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [hovered, playing]);

  const togglePlay = (e: MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      void audio
        .play()
        .then(() => {
          setPlaying(true);
        })
        .catch((err) => {
          console.error("Audio playback prevented:", err);
        });
    }
  };

  return (
    <div
      className="absolute left-[795px] top-[275px] h-[311px] w-[332px] pointer-events-auto"
      data-name="Image-to-Music-Card-Wrapper"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <style>{`
        /* Card Container 3D viewport */
        [data-name="Image-to-Music-Clipping-Box"] {
          perspective: 1000px;
          transform-style: preserve-3d;
        }

        /* 3D Animations: no opacity/blur filters to keep background 100% visible and sharp */
        
        /* Turntable Record: from back-left to front-right */
        @keyframes record-back-to-front {
          0% {
            left: 48px; top: 8px; z-index: 1;
            transform: translate3d(0, 0, -20px) scale(0.9);
          }
          40% {
            left: 36px; top: 24px; z-index: 1;
            transform: translate3d(-10px, 8px, -10px) scale(0.95);
          }
          50% { z-index: 10; }
          100% {
            left: 84px; top: 41px; z-index: 10;
            transform: translate3d(0, 0, 10px) scale(1);
          }
        }
        /* Turntable Record: from front-right to back-left */
        @keyframes record-front-to-back {
          0% {
            left: 84px; top: 41px; z-index: 10;
            transform: translate3d(0, 0, 10px) scale(1);
          }
          40% {
            left: 96px; top: 24px; z-index: 10;
            transform: translate3d(10px, -8px, -10px) scale(0.95);
          }
          50% { z-index: 1; }
          100% {
            left: 48px; top: 8px; z-index: 1;
            transform: translate3d(0, 0, -20px) scale(0.9);
          }
        }

        /* Letter from the Sea Pill: from front-right to back-left */
        @keyframes pill-front-to-back {
          0% {
            left: 84px; top: 127px; z-index: 10;
            transform: translate3d(0, 0, 10px) scale(1);
          }
          40% {
            left: 96px; top: 67px; z-index: 10;
            transform: translate3d(10px, -20px, -10px) scale(0.95);
          }
          50% { z-index: 1; }
          100% {
            left: 48px; top: 8px; z-index: 1;
            transform: translate3d(0, 0, -20px) scale(0.9);
          }
        }
        /* Letter from the Sea Pill: from back-left to front-right */
        @keyframes pill-back-to-front {
          0% {
            left: 48px; top: 8px; z-index: 1;
            transform: translate3d(0, 0, -20px) scale(0.9);
          }
          40% {
            left: 36px; top: 67px; z-index: 1;
            transform: translate3d(-10px, 20px, -10px) scale(0.95);
          }
          50% { z-index: 10; }
          100% {
            left: 84px; top: 127px; z-index: 10;
            transform: translate3d(0, 0, 10px) scale(1);
          }
        }
      `}</style>
      <audio ref={audioRef} src={AUDIO_SRC} onEnded={() => setPlaying(false)} />

      {/* clipping box: isolates 3D transitions strictly within card lower half, rounded base */}
      <div
        className="absolute left-0 top-[110px] h-[201px] w-full overflow-hidden rounded-b-[24px] pointer-events-none"
        data-name="Image-to-Music-Clipping-Box"
      >
        {/* Element 1: Turntable Record image */}
        <div
          className="absolute h-[133px] w-[236px]"
          style={{
            left: activeElement === 1 ? 84 : 48,
            top: activeElement === 1 ? 41 : 8,
            zIndex: activeElement === 1 ? 10 : 1,
            pointerEvents: "none",
            animation: hasRotated
              ? `${activeElement === 1 ? "record-back-to-front" : "record-front-to-back"} 700ms cubic-bezier(0.4, 0, 0.2, 1) forwards`
              : "none",
          }}
        >
          <img
            alt="Turntable record player"
            className="absolute inset-0 size-full object-cover rounded-[24px] pointer-events-none"
            src={imgImage568}
          />
        </div>

        {/* Element 2: Letter from the Sea glass Pill */}
        <div
          className="absolute h-[47px] w-[210px]"
          style={{
            left: activeElement === 2 ? 84 : 48,
            top: activeElement === 2 ? 127 : 8,
            zIndex: activeElement === 2 ? 10 : 1,
            pointerEvents: "auto",
            animation: hasRotated
              ? `${activeElement === 2 ? "pill-back-to-front" : "pill-front-to-back"} 700ms cubic-bezier(0.4, 0, 0.2, 1) forwards`
              : "none",
          }}
        >
          <div
            className="absolute inset-0 rounded-[16px] flex items-center justify-between pl-[16px] pr-[12px] py-[6px] pointer-events-auto"
            style={{
              backgroundImage:
                "linear-gradient(92deg, rgba(146, 194, 79, 0.5) -8.29%, rgba(146, 195, 193, 0.5) 59.68%, rgba(133, 194, 79, 0.5) 104.58%)",
              backdropFilter: "blur(7px)",
              WebkitBackdropFilter: "blur(7px)",
            }}
          >
            <div className="[word-break:break-word] content-stretch flex flex-col items-start leading-[0] not-italic relative shrink-0 w-[122px]">
              <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[18px] justify-center relative shrink-0 text-[12px] text-white w-full">
                <p className="leading-[1.526]">{`Letter from the Sea `}</p>
              </div>
              <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[12px] justify-center relative shrink-0 text-[9px] text-[rgba(255,255,255,0.53)] w-full">
                <p className="leading-[1.63]">{`Ambient Music . Lo-fi Chill. `}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={togglePlay}
              className="relative rounded-[14.824px] shrink-0 size-[25px] flex items-center justify-center cursor-pointer transition-transform active:scale-95 pointer-events-auto"
              aria-label={playing ? "Pause" : "Play"}
            >
              <svg className="absolute inset-0 size-full" fill="none" viewBox="0 0 24 24">
                <rect fill="rgba(255,255,255,0.18)" height="24" rx="12" width="24" />
                <path
                  d={playing ? PAUSE_PATH : PLAY_PATH}
                  fill="white"
                  className="transition-all duration-300"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

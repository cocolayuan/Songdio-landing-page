import React, { useRef, useState, type MouseEvent } from "react";
import imgImage568 from "../../imports/HtmlFe/ef2c5c1194283c05595e341b34e920c62e8bac2e.png";

import { asset } from "../../lib/asset";

const AUDIO_SRC = asset("/features/Image-to-Music-audio.mp3");

const PLAY_PATH =
  "M16.0012 10.8154C16.6637 11.2771 16.6637 12.2574 16.0012 12.7191L10.7798 16.3574C10.0107 16.8933 8.95646 16.343 8.95646 15.4055L8.95646 8.12896C8.95646 7.19155 10.0107 6.64122 10.7798 7.17714L16.0012 10.8154Z";
const PAUSE_PATH = "M8 7h2.5v10H8zm5 0h2.5v10H13z";

/**
 * Image-to-Music (2nd module) static cover + glass pill overlay.
 * Photo is smaller and hugs the top-left; pill hugs the bottom-right,
 * overlapping the photo's bottom-right corner. Click play/pause audio once (no loop).
 */
export function ImageToMusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
      className="absolute left-[795px] top-[275px] h-[311px] w-[332px] pointer-events-none"
      data-name="Image-to-Music-Card-Wrapper"
    >
      <audio ref={audioRef} src={AUDIO_SRC} onEnded={() => setPlaying(false)} />

      {/* Cover photo — small, hugs top-left */}
      <div
        className="absolute left-[16px] top-[128px] h-[143px] w-[259px] rounded-[24px] shadow-[0px_4px_7px_1px_rgba(120,118,118,0.21)] overflow-hidden"
        data-name="image 568"
      >
        <img
          alt="Turntable record player"
          className="absolute inset-0 size-full object-cover pointer-events-none"
          src={imgImage568}
        />
      </div>

      {/* Letter from the Sea glass pill — hugs bottom-right, overlaps photo corner */}
      <div
        className="absolute left-[112px] top-[240px] z-[2] flex h-[47px] w-[210px] items-center justify-between rounded-[16px] pl-[16px] pr-[12px] py-[6px] pointer-events-auto"
        style={{
          backgroundImage:
            "linear-gradient(92deg, rgba(146, 194, 79, 0.5) -8.29%, rgba(146, 195, 193, 0.5) 59.68%, rgba(133, 194, 79, 0.5) 104.58%)",
          backdropFilter: "blur(7px)",
          WebkitBackdropFilter: "blur(7px)",
        }}
        data-name="Frame44"
      >
        <div className="[word-break:break-word] content-stretch flex flex-col items-start leading-[0] not-italic relative shrink-0 w-[122px]">
          <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[18px] justify-center relative shrink-0 text-[12px] text-white w-full">
            <p className="leading-[1.526]">{`Letter from the Sea `}</p>
          </div>
          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[12px] justify-center relative shrink-0 text-[9px] text-[rgba(255,255,255,0.53)] w-full">
            <p className="leading-[1.63]">{`Instrumental . Soundtrack . `}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={togglePlay}
          className="relative rounded-[14.824px] shrink-0 size-[25px] flex items-center justify-center cursor-pointer transition-transform active:scale-95"
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
  );
}

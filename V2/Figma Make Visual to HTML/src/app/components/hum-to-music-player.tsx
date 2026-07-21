import React, { useEffect, useRef, useState, type MouseEvent } from "react";
import imgMiyukiBackground from "../../imports/image-1.png";
import imgMiyukiAvatar from "../../imports/HtmlFe/15989e9c8038f72114ee45814a84f84928f4a686.png";
import imgWaveformBg from "../../imports/image-3.png";

import { asset } from "../../lib/asset";

const AUDIO_SRC = asset("/features/Hum-to-Music -audio.mp3");

const PAUSE_PATH = "M8 7h2.5v10H8zm5 0h2.5v10H13z";

/**
 * Hum-to-Music (3rd module) interactive card.
 * Hover anywhere over the whole feature module to play the audio once (no loop).
 * While playing:
 *   - The waveform bars animate.
 *   - A neon-green playhead follows currentTime and can be dragged to seek.
 *   - A pause button appears over the avatar.
 */
export function HumToMusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const userPausedRef = useRef(false);

  const startPlayback = () => {
    const audio = audioRef.current;
    if (!audio || playing || userPausedRef.current) return;
    void audio.play().then(() => setPlaying(true)).catch(() => {});
  };

  const pausePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setPlaying(false);
    userPausedRef.current = true;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      setPlaying(false);
      setProgress(0);
      userPausedRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnded);
    if (audio.readyState >= 2) onLoaded();

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const tick = () => {
      const audio = audioRef.current;
      if (audio && !seeking) {
        setProgress(duration ? audio.currentTime / duration : 0);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, duration, seeking]);

  const handleSeek = (ratio: number) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const clamped = Math.max(0, Math.min(1, ratio));
    audio.currentTime = clamped * duration;
    setProgress(clamped);
  };

  const seekFromClientX = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    handleSeek((clientX - rect.left) / rect.width);
  };

  const beginSeek = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSeeking(true);
    seekFromClientX(e.clientX);
    const handleMove = (moveEvent: globalThis.MouseEvent) => seekFromClientX(moveEvent.clientX);
    const handleUp = () => {
      setSeeking(false);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  };

  const togglePlay = (e: MouseEvent) => {
    e.stopPropagation();
    if (playing) pausePlayback();
    else startPlayback();
  };

  return (
    <>
      {/* Single hover zone covering the whole Hum-to-Music feature module */}
      <div
        className="absolute left-[1163px] top-[1553px] w-[332px] h-[311px] pointer-events-auto"
        style={{ zIndex: 1 }}
        onMouseEnter={startPlayback}
        onMouseLeave={() => {
          userPausedRef.current = false;
        }}
      >
        <audio ref={audioRef} src={AUDIO_SRC} preload="metadata" />

        {/* Visible interactive card (offset within the hover zone; aligned to standard 278×153 media) */}
        <div className="absolute left-[27px] top-[131px] w-[278px] h-[153px] rounded-[24px] overflow-hidden">

        {/* background bitmap */}
        <img
          src={imgMiyukiBackground}
          alt="Miyuki card gradient background"
          className="absolute inset-0 size-full object-cover pointer-events-none"
        />

        {/* avatar */}
        <div className="absolute left-[12px] top-[12px] size-[61px] rounded-[39px] overflow-hidden bg-white/55">
          <img
            src={imgMiyukiAvatar}
            alt="Miyuki avatar"
            className="absolute h-[189.52%] left-[-15.4%] top-[5.39%] w-[121.15%] max-w-none pointer-events-none"
          />
          {/* pause overlay shown only while playing */}
          {playing && (
            <button
              type="button"
              onClick={togglePlay}
              aria-label="Pause"
              className="absolute inset-0 flex items-center justify-center bg-black/25 transition-opacity cursor-pointer"
            >
              <svg className="size-[24px]" fill="none" viewBox="0 0 24 24">
                <rect fill="rgba(255,255,255,0.35)" height="24" rx="12" width="24" />
                <path d={PAUSE_PATH} fill="white" />
              </svg>
            </button>
          )}
        </div>

        {/* name */}
        <p className="absolute left-[25px] top-[73px] font-['Inter:Medium',sans-serif] font-medium text-[#171717] text-[12px] leading-[1.526] whitespace-nowrap">
          Miyuki{" "}
        </p>

        {/* Recording pill */}
        <div className="absolute left-[172px] top-[45px] flex items-center gap-[4px] w-[94px] rounded-[16px] bg-white pl-[10px] pr-[12px] py-[8px]">
          <svg className="size-[20px] shrink-0" fill="none" viewBox="0 0 20 20" aria-hidden>
            {/* capsule microphone body */}
            <rect x="7" y="2" width="6" height="10" rx="3" stroke="#0A2619" strokeWidth="1.25" />
            <path d="M8.5 5.5h3M8.5 7.5h3M8.5 9.5h3" stroke="#0A2619" strokeWidth="1" />
            {/* U-shaped holder */}
            <path d="M5 8.5a5 5 0 0 0 10 0" stroke="#0A2619" strokeWidth="1.25" strokeLinecap="round" fill="none" />
            {/* stand stem */}
            <path d="M10 13.5v2.5" stroke="#0A2619" strokeWidth="1.25" strokeLinecap="round" />
            {/* base */}
            <path d="M7 17.5h6" stroke="#0A2619" strokeWidth="1.25" strokeLinecap="round" />
          </svg>
          <p className="font-['PingFang_SC:Regular',sans-serif] text-[#04210a] text-[10px] leading-none whitespace-nowrap">
            Recording
          </p>
        </div>

        {/* waveform strip — fully inside the card */}
        <div className="absolute left-[12px] top-[98px] w-[254px] h-[47px] rounded-[12px] overflow-hidden">
          {/* background JPG */}
          <img src={imgWaveformBg} alt="" className="absolute inset-0 size-full object-cover pointer-events-none" />
          <div className="absolute inset-0 rounded-[12px] border-l-[20px] border-solid border-[#b5fee7]" />
          <div className="absolute left-0 top-0 h-[47px] w-[21px] bg-[#b5da9f]" />
          <div className="absolute bg-[#172310] h-[13px] left-[9px] top-[16px] w-px" />
          <div className="absolute bg-[#172310] h-[13px] left-[12px] top-[16px] w-px" />

          {/* seek track — the actual waveform region (playhead ranges over this) */}
          <div
            ref={trackRef}
            className="absolute left-[30px] right-[8px] top-0 h-full cursor-pointer"
            onMouseDown={beginSeek}
          >
            {/* animated waveform bars */}
            <div className="absolute inset-0 flex items-center justify-center gap-[3px] pointer-events-none">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[4px] rounded-full origin-center"
                  style={{
                    background: "#CFFFB9",
                    height: playing ? "60%" : "20%",
                    animation: playing
                      ? `wave-bounce 0.6s ease-in-out ${i * 0.05}s infinite alternate`
                      : "none",
                    opacity: playing ? 1 : 0.6,
                    transition: "opacity 0.3s ease",
                  }}
                />
              ))}
            </div>

            {/* playhead */}
            <div
              className="absolute top-[-2px] h-[50px] w-[4px] pointer-events-none"
              style={{ left: `${progress * 100}%`, transform: "translateX(-50%)" }}
            >
              <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 4 50">
                <circle cx="2" cy="2" fill="#ADFF69" r="2" />
                <circle cx="2" cy="48" fill="#ADFF69" r="2" />
                <rect fill="#ADFF69" height="45" width="2" x="1" y="2" />
              </svg>
            </div>
          </div>
        </div>
        </div>
      </div>

      <style>{`
        @keyframes wave-bounce {
          0% { transform: scaleY(0.25); }
          100% { transform: scaleY(1); }
        }
      `}</style>
    </>
  );
}

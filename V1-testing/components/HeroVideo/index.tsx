"use client";

import { useState } from "react";

// Placeholder video — replace with the final 1920x1080 hero video.
const PLACEHOLDER_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
// Placeholder poster — shown before playback and if the video fails to load.
const PLACEHOLDER_POSTER =
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1920&h=1080&fit=crop&q=80";

export default function HeroVideo() {
  const [videoFailed, setVideoFailed] = useState(false);

  const scrollToP2 = () => {
    document.getElementById("p2")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {videoFailed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={PLACEHOLDER_POSTER}
          alt="Hero"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={PLACEHOLDER_VIDEO}
          poster={PLACEHOLDER_POSTER}
          autoPlay
          muted
          playsInline
          onEnded={scrollToP2}
          onError={() => setVideoFailed(true)}
        />
      )}

      <div className="absolute inset-0 bg-black/30" />

      {/* Scroll indicator */}
      <button
        type="button"
        onClick={scrollToP2}
        aria-label="Scroll down"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce text-white/80 transition hover:text-white"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </section>
  );
}

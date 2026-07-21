import { useEffect, useRef, useState } from "react";

type TrackId = "vocals" | "drums" | "guitar" | "bass";

type TrackDef = {
  id: TrackId;
  src: string;
  rowTop: number;
  /** Waveform pill (page coords) — covered while playing to hide the static SVG. */
  cover: { x: number; y: number; w: number; h: number; bg: string };
  /** Inner bar-drawing area (page coords). */
  bars: { x: number; y: number; w: number; h: number };
};

const TRACKS: TrackDef[] = [
  {
    id: "vocals",
    src: "/features/audio-separation/vocals.mp3",
    rowTop: 1109,
    cover: { x: 1308, y: 1109, w: 135, h: 31, bg: "#222222" },
    bars: { x: 1317, y: 1113, w: 118, h: 23 },
  },
  {
    id: "drums",
    src: "/features/audio-separation/drums.mp3",
    rowTop: 1148,
    cover: { x: 1323, y: 1148, w: 120, h: 31, bg: "#434343" },
    bars: { x: 1331, y: 1152, w: 96, h: 23 },
  },
  {
    id: "guitar",
    src: "/features/audio-separation/guitar.mp3",
    rowTop: 1187,
    cover: { x: 1292, y: 1187, w: 140, h: 31, bg: "#222222" },
    bars: { x: 1300, y: 1191, w: 124, h: 23 },
  },
  {
    id: "bass",
    src: "/features/audio-separation/bass.mp3",
    rowTop: 1226,
    cover: { x: 1296, y: 1226, w: 147, h: 31, bg: "#3b3a3a" },
    bars: { x: 1299, y: 1230, w: 141, h: 23 },
  },
];

/** Card bounds of "Audio Separation" (row 3, col 3 of the feature grid). */
const CARD = { left: 1167, top: 977, width: 332, height: 311 };
/** Stem rows are 276px wide starting at x=1195; buttons sit 8px from the right edge. */
const BUTTON_LEFT = 1195 + 276 - 8 - 16;
const LEAVE_DELAY_MS = 150;
const SOUND_ON_COLOR = "#B4D384";
/** Shared gradient for the animated bars: #CFF8E4 → #B7FCB5 (52.44%) → #F8E5BB. */
const BAR_GRADIENT: [number, string][] = [
  [0, "#CFF8E4"],
  [0.5244, "#B7FCB5"],
  [1, "#F8E5BB"],
];

const BAR_WIDTH = 3.5;
const BAR_GAP = 2.5;
const MIN_BAR = 2;

/** Deterministic pseudo-random idle waveform (stable across renders). */
const idleHeights = (barCount: number, seed: number): number[] => {
  const heights = new Array<number>(barCount);
  for (let i = 0; i < barCount; i++) {
    const n = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
    heights[i] = 0.15 + 0.55 * (n - Math.floor(n));
  }
  return heights;
};

function SpeakerIcon({ muted }: { muted: boolean }) {
  const color = muted ? "white" : SOUND_ON_COLOR;
  return (
    <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
      <path
        d="M2.5 6.25H4.6L8 3.4v9.2L4.6 9.75H2.5a.5.5 0 0 1-.5-.5v-2.5a.5.5 0 0 1 .5-.5Z"
        fill={color}
      />
      {muted ? (
        <path
          d="M10.4 6.2 13.6 9.8M13.6 6.2 10.4 9.8"
          stroke={color}
          strokeLinecap="round"
          strokeWidth="1.3"
        />
      ) : (
        <>
          <path d="M10.2 5.9a3 3 0 0 1 0 4.2" stroke={color} strokeLinecap="round" strokeWidth="1.2" />
          <path d="M12 4.4a5.2 5.2 0 0 1 0 7.2" stroke={color} strokeLinecap="round" strokeWidth="1.2" />
        </>
      )}
    </svg>
  );
}

/**
 * Hover hot-zone, per-stem mute buttons, and live waveform bars for the
 * "Audio Separation" card.
 *
 * All four stems are decoded into a single AudioContext and started on the
 * same clock so they stay sample-accurate in sync. Muting a stem only zeroes
 * its GainNode — its timeline keeps running, so unmuting rejoins in sync.
 * While playing, animated bars (driven per-track by an AnalyserNode) fade in
 * over the static SVG waveforms; a muted track's bars freeze in place.
 * Hover plays once from the start (no loop); leaving stops and resets.
 */
export function AudioSeparationPlayer() {
  const [muted, setMuted] = useState<Record<TrackId, boolean>>({
    vocals: false,
    drums: false,
    guitar: false,
    bass: false,
  });

  const ctxRef = useRef<AudioContext | null>(null);
  const buffersRef = useRef<Partial<Record<TrackId, AudioBuffer>>>({});
  const loadPromiseRef = useRef<Promise<void> | null>(null);
  const sourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const gainsRef = useRef<Partial<Record<TrackId, GainNode>>>({});
  const analysersRef = useRef<Partial<Record<TrackId, AnalyserNode>>>({});
  const canvasesRef = useRef<Partial<Record<TrackId, HTMLCanvasElement | null>>>({});
  const heightsRef = useRef<Partial<Record<TrackId, number[]>>>({});
  const rafRef = useRef<number | null>(null);
  const mutedRef = useRef(muted);
  const playingRef = useRef(false);
  const leaveTimerRef = useRef<number | null>(null);

  mutedRef.current = muted;

  const ensureContext = () => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    return ctxRef.current;
  };

  const loadBuffers = () => {
    if (!loadPromiseRef.current) {
      const ctx = ensureContext();
      loadPromiseRef.current = Promise.all(
        TRACKS.map(async ({ id, src }) => {
          const res = await fetch(src);
          const data = await res.arrayBuffer();
          buffersRef.current[id] = await ctx.decodeAudioData(data);
        }),
      ).then(() => undefined);
    }
    return loadPromiseRef.current;
  };

  const drawTrack = (track: TrackDef, heights: number[]) => {
    const canvas = canvasesRef.current[track.id];
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const { w, h } = track.bars;
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }
    const g = canvas.getContext("2d");
    if (!g) return;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    const gradient = g.createLinearGradient(0, 0, w, 0);
    for (const [stop, color] of BAR_GRADIENT) {
      gradient.addColorStop(stop, color);
    }
    g.fillStyle = gradient;
    for (let i = 0; i < heights.length; i++) {
      const barH = Math.max(MIN_BAR, heights[i] * h);
      const x = i * (BAR_WIDTH + BAR_GAP);
      const y = (h - barH) / 2;
      g.beginPath();
      g.roundRect(x, y, BAR_WIDTH, barH, BAR_WIDTH / 2);
      g.fill();
    }
  };

  const animate = () => {
    for (const track of TRACKS) {
      const analyser = analysersRef.current[track.id];
      if (!analyser) continue;
      const barCount = Math.floor(track.bars.w / (BAR_WIDTH + BAR_GAP));
      let heights = heightsRef.current[track.id];
      if (!heights || heights.length !== barCount) {
        heights = new Array(barCount).fill(0.12);
        heightsRef.current[track.id] = heights;
      }
      // Frozen while muted: skip updating, redraw last frame as-is.
      if (!mutedRef.current[track.id]) {
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        const usable = Math.floor(data.length * 0.7);
        for (let i = 0; i < barCount; i++) {
          const t = i / barCount;
          const bin = Math.min(usable - 1, Math.floor(Math.pow(t, 1.4) * usable));
          const windowSize = Math.max(1, Math.floor(usable / barCount));
          let sum = 0;
          for (let k = 0; k < windowSize; k++) {
            sum += data[Math.min(usable - 1, bin + k)];
          }
          heights[i] = Math.min(1, (sum / windowSize / 255) * 1.15);
        }
      }
      drawTrack(track, heights);
    }
    rafRef.current = requestAnimationFrame(animate);
  };

  const drawIdleAll = () => {
    TRACKS.forEach((track, i) => {
      const barCount = Math.floor(track.bars.w / (BAR_WIDTH + BAR_GAP));
      drawTrack(track, idleHeights(barCount, i + 1));
    });
  };

  const stopAll = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    for (const source of sourcesRef.current) {
      source.onended = null;
      try {
        source.stop();
      } catch {
        // already stopped
      }
    }
    sourcesRef.current = [];
    gainsRef.current = {};
    analysersRef.current = {};
    heightsRef.current = {};
    playingRef.current = false;
    drawIdleAll();
  };

  const startPlayback = async () => {
    const ctx = ensureContext();
    await loadBuffers();
    if (ctx.state === "suspended") {
      await ctx.resume().catch(() => {});
    }
    // Hover may have ended while buffers were loading.
    if (playingRef.current || ctx.state !== "running") return;

    playingRef.current = true;
    const startAt = ctx.currentTime + 0.05;
    for (const { id } of TRACKS) {
      const buffer = buffersRef.current[id];
      if (!buffer) continue;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.75;
      const gain = ctx.createGain();
      gain.gain.value = mutedRef.current[id] ? 0 : 1;
      source.connect(analyser).connect(gain).connect(ctx.destination);
      source.start(startAt);
      sourcesRef.current.push(source);
      gainsRef.current[id] = gain;
      analysersRef.current[id] = analyser;
    }
    const first = sourcesRef.current[0];
    if (first) {
      first.onended = () => {
        // Natural end of the one-shot playback: release nodes, no loop.
        stopAll();
      };
    }
    rafRef.current = requestAnimationFrame(animate);
  };

  const handleEnter = () => {
    if (leaveTimerRef.current !== null) {
      window.clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
      return; // quick re-entry: keep current playback going
    }
    if (!playingRef.current) {
      void startPlayback();
    }
  };

  const handleLeave = () => {
    if (leaveTimerRef.current !== null) window.clearTimeout(leaveTimerRef.current);
    leaveTimerRef.current = window.setTimeout(() => {
      leaveTimerRef.current = null;
      stopAll();
    }, LEAVE_DELAY_MS);
  };

  const toggleMute = (id: TrackId) => {
    setMuted((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      const ctx = ctxRef.current;
      const gain = gainsRef.current[id];
      if (ctx && gain) {
        // Short ramp avoids clicks; timeline keeps running while muted.
        gain.gain.setTargetAtTime(next[id] ? 0 : 1, ctx.currentTime, 0.02);
      }
      return next;
    });
  };

  useEffect(() => {
    // Initial idle waveform (replaces the old static Figma SVG preview).
    drawIdleAll();
    return () => {
      if (leaveTimerRef.current !== null) window.clearTimeout(leaveTimerRef.current);
      stopAll();
      ctxRef.current?.close().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="absolute"
      style={{ left: CARD.left, top: CARD.top, width: CARD.width, height: CARD.height }}
      data-name="audio-separation-hotzone"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* waveform bars: idle fake waveform by default, live analyser bars while playing */}
      {TRACKS.map((track) => (
        <div
          key={`wave-${track.id}`}
          className="absolute pointer-events-none rounded-[12px]"
          style={{
            left: track.cover.x - CARD.left,
            top: track.cover.y - CARD.top,
            width: track.cover.w,
            height: track.cover.h,
            backgroundColor: track.cover.bg,
          }}
        >
          <canvas
            ref={(el) => {
              canvasesRef.current[track.id] = el;
            }}
            style={{
              position: "absolute",
              left: track.bars.x - track.cover.x,
              top: track.bars.y - track.cover.y,
              width: track.bars.w,
              height: track.bars.h,
            }}
          />
        </div>
      ))}

      {TRACKS.map(({ id, rowTop }) => (
        <button
          key={id}
          aria-label={muted[id] ? `Unmute ${id}` : `Mute ${id}`}
          className="absolute flex items-center justify-center cursor-pointer transition-opacity duration-150 hover:!opacity-100"
          style={{
            left: BUTTON_LEFT - CARD.left,
            top: rowTop + 8 - CARD.top,
            width: 16,
            height: 16,
            opacity: muted[id] ? 0.4 : 1,
            background: "none",
            border: "none",
            padding: 0,
          }}
          onClick={() => toggleMute(id)}
        >
          <SpeakerIcon muted={muted[id]} />
        </button>
      ))}
    </div>
  );
}

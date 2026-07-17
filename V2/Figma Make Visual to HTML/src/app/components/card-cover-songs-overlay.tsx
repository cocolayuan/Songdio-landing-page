import { useMemo, useState, useRef } from "react";
import imgCardBg from "../../imports/CardCoverSongs/226049655f3871f3dac264b316138eae1882ff2f.png";
import imgAvatar from "../../imports/CardCoverSongs/18588dce218efa9b3a760cf06ce5211568b15630.png";

// Waveform SVG geometry (matches the Figma "music radio" Union):
//   viewBox 375.235 × 60, placed at left:-54 top:21 inside the 278×102 card.
const WAVE_W = 375.235;
const WAVE_H = 60;
const CENTER_Y = WAVE_H / 2;

// Avatar occupies card x 90–180 → SVG x 144–234 (offset +54). Leave a gap there.
const GAP_START = 138;
const GAP_END = 240;

const BAR_STEP = 3.87; // spacing between bars
const BAR_W = 1.68;

// Deterministic "waveform" envelope so bars look musical but stable across renders.
function barHeight(x: number): number {
  const env =
    0.55 +
    0.45 * Math.sin(x * 0.19 + 0.6) * Math.sin(x * 0.052 + 1.1);
  const detail = 0.5 + 0.5 * Math.sin(x * 0.83);
  const h = 6 + Math.abs(env) * detail * 52;
  return Math.max(5, Math.min(58, h));
}

export function CardCoverSongsOverlay() {
  const [hovered, setHovered] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const spinTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const bars = useMemo(() => {
    const out: { x: number; h: number }[] = [];
    for (let x = 1.5; x <= WAVE_W - 1.5; x += BAR_STEP) {
      if (x > GAP_START && x < GAP_END) continue;
      out.push({ x, h: barHeight(x) });
    }
    return out;
  }, []);

  return (
    <>
      <style>{`
        @keyframes cardBarPulse {
          0%,100% { transform: scaleY(0.72); }
          50%     { transform: scaleY(1); }
        }
      `}</style>

      <div
        className="absolute rounded-[54px] overflow-hidden pointer-events-auto"
        style={{
          left: 1194,
          top: 2051,
          width: 278,
          height: 102,
          transition: "transform 1.5s ease-in-out",
          transform: spinning ? "rotate(360deg)" : "rotate(0deg)",
        }}
        onMouseEnter={() => {
          setHovered(true);
          setSpinning(true);
          if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
          spinTimeoutRef.current = setTimeout(() => setSpinning(false), 1500);
        }}
        onMouseLeave={() => {
          setHovered(false);
          setSpinning(false);
          if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
        }}
      >
        {/* ── Layer 1: orange background gradients ── */}
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 rounded-[54px]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 278 102' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='0.800000011920929'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(3.0856e-14 8.3425 -9.4662 -9.0337e-14 139 -6.5)'><stop stop-color='rgba(255,37,37,1)' offset='0'/><stop stop-color='rgba(196,56,44,0)' offset='1'/></radialGradient></defs></svg>\"), linear-gradient(90deg, rgb(255, 174, 131) 0%, rgb(255, 174, 131) 100%)",
            }}
          />
          <div
            className="absolute inset-0 mix-blend-plus-lighter rounded-[54px]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 278 102' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='0.30000001192092896'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-6.4375e-15 5.6232 -17.011 3.1046e-8 138.42 99.086)'><stop stop-color='rgba(255,255,255,1)' offset='0'/><stop stop-color='rgba(255,255,255,0)' offset='1'/></radialGradient></defs></svg>\")",
            }}
          />
          <div
            className="absolute inset-0 mix-blend-plus-lighter rounded-[54px]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 278 102' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='0.30000001192092896'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(0.99232 3.1479 -6.6402 1.5124 128.5 87.096)'><stop stop-color='rgba(255,255,255,1)' offset='0'/><stop stop-color='rgba(255,255,255,0)' offset='1'/></radialGradient></defs></svg>\")",
            }}
          />
          <div
            className="absolute inset-0 mix-blend-plus-lighter rounded-[54px]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 278 102' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='0.30000001192092896'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-2.4291e-14 2.6825 -15.341 -1.0124e-13 140.15 98.357)'><stop stop-color='rgba(255,255,255,1)' offset='0'/><stop stop-color='rgba(255,255,255,0)' offset='1'/></radialGradient></defs></svg>\")",
            }}
          />
          <div
            className="absolute inset-0 mix-blend-plus-lighter opacity-30 rounded-[54px]"
            style={{
              backgroundImage: `url("${imgCardBg}")`,
              backgroundSize: "153.6px 153.6px",
              backgroundPosition: "top left",
            }}
          />
        </div>

        {/* ── Layer 2: waveform bars (full-width, no gaps) ── */}
        <svg
          aria-hidden
          className="absolute pointer-events-none"
          style={{ left: -54, top: 21, width: WAVE_W, height: WAVE_H }}
          viewBox={`0 0 ${WAVE_W} ${WAVE_H}`}
          fill="none"
        >
          {bars.map((bar, i) => {
            // Gentle, position-based stagger so the pulse ripples across.
            const delay = (bar.x / WAVE_W) * 0.9;
            return (
              <rect
                key={i}
                x={bar.x - BAR_W / 2}
                y={CENTER_Y - bar.h / 2}
                width={BAR_W}
                height={bar.h}
                rx={BAR_W / 2}
                fill="white"
                style={
                  {
                    transformBox: "fill-box",
                    transformOrigin: "50% 50%",
                    animation: hovered
                      ? `cardBarPulse 1.4s ${delay.toFixed(2)}s ease-in-out infinite`
                      : "none",
                  } as React.CSSProperties
                }
              />
            );
          })}
        </svg>

        {/* ── Layer 3: avatar PNG ── */}
        <div className="absolute left-[90px] top-[6px] size-[90px] overflow-hidden rounded-full">
          <img
            src={imgAvatar}
            alt="Artist avatar"
            className="size-full object-cover object-top"
          />
        </div>

        {/* inner glow border */}
        <div className="absolute inset-0 pointer-events-none rounded-[54px] shadow-[inset_0px_0px_5.45px_1px_rgba(248,111,110,0.9)]" />
      </div>
    </>
  );
}

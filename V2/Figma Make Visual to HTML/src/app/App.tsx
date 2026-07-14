import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import HtmlFe from "../imports/HtmlFe";
import P2New from "../imports/P2-1";
import { CardEffects } from "./components/card-effects";
import { CardCoverSongsOverlay } from "./components/card-cover-songs-overlay";
import HeroVideo from "./components/hero-video";

const P2_ID = "p2-screen";

export default function App() {
  const p2FloorRef = useRef<number | null>(null);
  const p2LockedRef = useRef(false);

  const updateP2Floor = useCallback(() => {
    const target = document.getElementById(P2_ID);
    if (!target) return;
    p2FloorRef.current = target.offsetTop;
  }, []);

  const handleReachedP2 = useCallback(() => {
    updateP2Floor();
    p2LockedRef.current = true;
  }, [updateP2Floor]);

  useLayoutEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    p2LockedRef.current = false;
    p2FloorRef.current = null;
    window.scrollTo({ top: 0, behavior: "auto" });
    updateP2Floor();
  }, [updateP2Floor]);

  useEffect(() => {
    const clampScrollAboveP2 = () => {
      if (!p2LockedRef.current || p2FloorRef.current === null) return;
      if (window.scrollY < p2FloorRef.current) {
        window.scrollTo({ top: p2FloorRef.current, behavior: "auto" });
      }
    };

    window.addEventListener("scroll", clampScrollAboveP2, { passive: true });
    window.addEventListener("resize", updateP2Floor);

    return () => {
      window.removeEventListener("scroll", clampScrollAboveP2);
      window.removeEventListener("resize", updateP2Floor);
    };
  }, [updateP2Floor]);

  return (
    <div className="bg-black w-full overflow-x-auto">
      {/* Screen 1: opening hero video (V2/app). On end it scrolls to P2 and locks. */}
      <HeroVideo scrollTargetId={P2_ID} onReachedP2={handleReachedP2} />

      {/* Screen 2 onward: the Figma Make canvas. P2 "Your Song, Any Style" is at its top. */}
      <section id={P2_ID}>
        {/*
         * Canvas is 1920px wide × 4400px tall.
         * The original HtmlFe content extends to ~3815px; the bottom
         * "Loved by creators" + footer section (P2) starts at top-[2515px]
         * and reaches ~4364px — so 4400px shows everything.
         */}
        <div className="relative mx-auto" style={{ width: 1920, height: 4400 }}>
          <HtmlFe />

          {/* Replace original P2 (bottom reviews + footer) with updated design */}
          <div className="absolute left-0 top-[2515px] w-[1920px] h-[1849px]">
            <P2New />
          </div>

          <CardEffects />
          <CardCoverSongsOverlay />
        </div>
      </section>
    </div>
  );
}

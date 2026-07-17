import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import HtmlFe from "../imports/HtmlFe";
import P2New from "../imports/P2-1";
import { CardEffects } from "./components/card-effects";
import { CardCoverSongsOverlay } from "./components/card-cover-songs-overlay";
import HeroVideo from "./components/hero-video";

const P2_ID = "p2-screen";

/** Figma design canvas — everything below the hero is authored at this size. */
const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 4490;
/** Height of the P2 first screen ("Your Song, Any Style" + composer/tags). */
const DESIGN_P2_HEIGHT = 1135;

export default function App() {
  const p2FloorRef = useRef<number | null>(null);
  const p2LockedRef = useRef(false);
  // Plan B: scale down to fit narrower screens, cap at 1 (never upscale past 1920).
  // Also fit the P2 first screen to viewport height so the bottom composer/tags
  // stay fully visible on wide-but-short (very large) screens.
  const [stageScale, setStageScale] = useState(1);

  const updateStageScale = useCallback(() => {
    setStageScale(
      Math.min(
        1,
        window.innerWidth / DESIGN_WIDTH,
        window.innerHeight / DESIGN_P2_HEIGHT,
      ),
    );
  }, []);

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
    updateStageScale();
    updateP2Floor();
  }, [updateP2Floor, updateStageScale]);

  useEffect(() => {
    const clampScrollAboveP2 = () => {
      if (!p2LockedRef.current || p2FloorRef.current === null) return;
      if (window.scrollY < p2FloorRef.current) {
        window.scrollTo({ top: p2FloorRef.current, behavior: "auto" });
      }
    };

    const handleResize = () => {
      updateStageScale();
      updateP2Floor();
    };

    window.addEventListener("scroll", clampScrollAboveP2, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", clampScrollAboveP2);
      window.removeEventListener("resize", handleResize);
    };
  }, [updateP2Floor, updateStageScale]);

  return (
    <div className="bg-black w-full overflow-x-hidden">
      {/* Screen 1: opening hero video (V2/app). On end it scrolls to P2 and locks. */}
      <HeroVideo scrollTargetId={P2_ID} onReachedP2={handleReachedP2} />

      {/* Screen 2 onward: the Figma Make canvas. P2 "Your Song, Any Style" is at its top. */}
      <section id={P2_ID}>
        {/*
         * Canvas is authored at 1920×4400px. On narrower screens we scale the
         * whole stage down uniformly (Plan B: cap at 1, so ≥1920 stays 1:1 and
         * centers with black side gutters). The viewport box takes the *scaled*
         * size so page height/scroll stay correct; the inner stage keeps its
         * native 1920×4400 and is shrunk via transform.
         */}
        <div
          className="relative mx-auto overflow-hidden"
          style={{ width: DESIGN_WIDTH * stageScale, height: DESIGN_HEIGHT * stageScale }}
        >
          <div
            className="relative"
            style={{
              width: DESIGN_WIDTH,
              height: DESIGN_HEIGHT,
              transform: `scale(${stageScale})`,
              transformOrigin: "top left",
            }}
          >
            <HtmlFe />

            {/* Replace original P2 (bottom reviews + footer) with updated design */}
            <div className="absolute left-0 top-[2635px] w-[1920px] h-[1849px]">
              <P2New />
            </div>

            <CardEffects />
            <CardCoverSongsOverlay />
          </div>
        </div>
      </section>
    </div>
  );
}

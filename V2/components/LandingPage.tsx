"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import HeroVideo from "@/components/HeroVideo";
import AlbumCarousel from "@/components/AlbumCarousel";

const P2_ID = "album-carousel";

export default function LandingPage() {
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
    <main>
      <HeroVideo scrollTargetId={P2_ID} onReachedP2={handleReachedP2} />
      <section id={P2_ID}>
        <AlbumCarousel />
      </section>
    </main>
  );
}

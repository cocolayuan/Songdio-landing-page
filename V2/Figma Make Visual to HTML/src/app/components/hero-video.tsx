import { useCallback, useEffect, useRef } from "react";
import { scrollToElement } from "../../lib/scrollToElement";

const VIDEO_SRC = "/Songdio开头视频.mp4";

type HeroVideoProps = {
  scrollTargetId: string;
  onReachedP2?: () => void;
};

export default function HeroVideo({ scrollTargetId, onReachedP2 }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasTransitionedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    void video.play();
  }, []);

  const scrollToP2 = useCallback(async () => {
    if (hasTransitionedRef.current) return;

    const target = document.getElementById(scrollTargetId);
    if (!target) {
      console.warn(`[HeroVideo] Scroll target #${scrollTargetId} not found`);
      return;
    }

    hasTransitionedRef.current = true;
    await scrollToElement(target, { duration: 300, easing: "easeInOut" });
    onReachedP2?.();
  }, [scrollTargetId, onReachedP2]);

  const handleVideoError = () => {
    console.warn("[HeroVideo] Failed to load video:", VIDEO_SRC);
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={VIDEO_SRC}
        autoPlay
        muted
        playsInline
        onEnded={scrollToP2}
        onError={handleVideoError}
      />
    </section>
  );
}

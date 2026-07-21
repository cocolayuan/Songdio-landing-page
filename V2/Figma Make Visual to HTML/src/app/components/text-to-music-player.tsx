import { HoverVideoPreview } from "./hover-video-preview";

import { asset } from "../../lib/asset";

const COVER_SRC = asset("/features/Text-to-Music-cover.jpg");
const VIDEO_SRC = asset("/features/Text-to-Music-video.mp4");

/**
 * Text-to-Music (1st module) cover with hover-to-play preview.
 * Hover area = the whole card (332x311 @ 423,275); the video only shows in the
 * cover box (278x153, 27px insets — matches Music-to-MV).
 */
export function TextToMusicPlayer() {
  return (
    <HoverVideoPreview
      cover={COVER_SRC}
      src={VIDEO_SRC}
      muted={false}
      label="Text-to-Music preview"
      className="absolute left-[423px] top-[275px] z-[5] h-[311px] w-[332px]"
      mediaClassName="left-[27px] top-[131px] h-[153px] w-[278px] rounded-[24px]"
    />
  );
}

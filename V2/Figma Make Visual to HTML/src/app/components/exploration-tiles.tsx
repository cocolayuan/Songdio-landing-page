import { asset } from "../../lib/asset";

const TILE1_BG = asset("/features/exploration/tile1-bg.png");
const TILE2_BG = asset("/features/exploration/tile2-bg.png");
const TILE2_FRONT = asset("/features/exploration/tile2-front.png");
const TILE3_BG = asset("/features/exploration/tile3-bg.png");
const TILE3_FRONT = asset("/features/exploration/tile3-front.png");
const TILE4_BG = asset("/features/exploration/tile4-bg.png");

const DOT_FONT = "font-['Dotrice',sans-serif] not-italic text-[16px] text-white leading-[0]";

type LayerProps = {
  /** Positioning classes for this layer within the 126x76 group. */
  frame: string;
  /** Crop classes applied to the img (Figma-style percentage crop). */
  crop: string;
  src: string;
  /** Overlay: solid dim or CSS gradient. */
  dim?: string;
  gradient?: string;
};

function Layer({ frame, crop, src, dim, gradient }: LayerProps) {
  return (
    <div className={`absolute rounded-[20px] ${frame}`}>
      <div aria-hidden className="absolute inset-0 pointer-events-none rounded-[20px]">
        <div className="absolute inset-0 overflow-hidden rounded-[20px]">
          <img alt="" className={`absolute max-w-none ${crop}`} src={src} />
        </div>
        {dim && <div className="absolute inset-0 rounded-[20px]" style={{ backgroundColor: dim }} />}
        {gradient && <div className="absolute inset-0 rounded-[20px]" style={{ backgroundImage: gradient }} />}
      </div>
    </div>
  );
}

const BACK_FRAME = "h-[67px] left-[8px] top-px w-[110px]";
const MEDIUM_FRAME = "border-[#202020] border-solid border-t-[0.8px] h-[67px] left-[3px] top-[3px] w-[120px]";
const FRONT_FRAME = "border-[#202020] border-solid border-t-[0.8px] h-[70px] left-0 top-[6px] w-[126px]";

const WIDE_BACK_CROP = "h-[172.23%] left-[-53.62%] top-[-0.59%] w-[210.5%]";
const WIDE_MEDIUM_CROP = "h-[156.19%] left-[-35.49%] top-[-2.76%] w-[174.99%]";
const WIDE_FRONT_CROP = "h-[104.69%] left-[-3.24%] top-[-4.16%] w-[116.32%]";

/**
 * Static genre tiles for the "AI Music Exploration" card, implemented from
 * Figma node 1282:1033 (three stacked layers + gradient tint + Dotrice label).
 * Each tile group is 126x76: the stack peeks 6px above the 126x70 front card.
 */
export function ExplorationTiles() {
  return (
    <>
      {/* 1 — Soft Chill (top-left) */}
      <div className="absolute h-[76px] left-[814px] top-[1092px] w-[126px] origin-top-left scale-110" data-name="exploration-tile-1">
        <Layer frame={BACK_FRAME} crop={WIDE_BACK_CROP} src={TILE1_BG} dim="rgba(0,0,0,0.6)" />
        <Layer frame={MEDIUM_FRAME} crop={WIDE_MEDIUM_CROP} src={TILE1_BG} dim="rgba(0,0,0,0.2)" />
        <Layer
          frame={FRONT_FRAME}
          crop={WIDE_FRONT_CROP}
          src={TILE1_BG}
          gradient="linear-gradient(62.3deg, rgba(137,170,41,0.6) 16.551%, rgba(255,255,255,0) 63.579%)"
        />
        <div className={`-translate-x-1/2 -translate-y-1/2 absolute flex flex-col justify-center left-[calc(50%-19px)] text-center top-[46px] tracking-[-0.64px] whitespace-nowrap ${DOT_FONT}`}>
          <p className="leading-[normal] mb-0 whitespace-pre">{`Soft `}</p>
          <p className="leading-[normal] whitespace-pre">Chill</p>
        </div>
      </div>

      {/* 2 — Fresh Ambient (top-right) */}
      <div className="absolute h-[76px] left-[969px] top-[1092px] w-[126px] origin-top-left scale-110" data-name="exploration-tile-2">
        <Layer frame={BACK_FRAME} crop="h-[124.01%] left-[-22.42%] top-[-2.29%] w-[151.57%]" src={TILE2_BG} dim="rgba(0,0,0,0.6)" />
        <div className={`absolute rounded-[20px] ${MEDIUM_FRAME}`}>
          <div className="absolute inset-0 opacity-20 overflow-hidden pointer-events-none rounded-[20px]">
            <img alt="" className="absolute h-[124.65%] left-[-30.29%] max-w-none top-[-6.15%] w-[139.65%]" src={TILE2_BG} />
          </div>
        </div>
        <div className="absolute border-[#202020] border-[0.8px] border-solid h-[70px] left-0 rounded-[20px] top-[6px] w-[126px]">
          <div aria-hidden className="absolute inset-0 pointer-events-none rounded-[20px]">
            <img alt="" className="absolute max-w-none object-cover rounded-[20px] size-full" src={TILE2_FRONT} />
            <div
              className="absolute inset-0 rounded-[20px]"
              style={{ backgroundImage: "linear-gradient(51.298deg, rgba(75,13,125,0.6) 10.331%, rgba(255,255,255,0) 85.175%)" }}
            />
          </div>
        </div>
        <div className={`-translate-y-full absolute flex flex-col justify-end left-[16px] top-[62px] tracking-[-0.64px] w-[80px] ${DOT_FONT}`}>
          <p className="leading-[normal] mb-0">Fresh</p>
          <p className="leading-[normal]">Ambient</p>
        </div>
      </div>

      {/* 3 — Dream Pop (bottom-left) */}
      <div className="absolute h-[76px] left-[814px] top-[1183px] w-[126px] origin-top-left scale-110" data-name="exploration-tile-3">
        <Layer frame={BACK_FRAME} crop="h-[114.24%] left-[-23.36%] top-[-2.44%] w-[139.62%]" src={TILE3_BG} dim="rgba(0,0,0,0.6)" />
        <Layer frame={MEDIUM_FRAME} crop="h-[119.09%] left-[-22.32%] top-[-3.89%] w-[133.43%]" src={TILE3_BG} dim="rgba(0,0,0,0.2)" />
        <div className="absolute border-[0.8px] border-black border-solid h-[70px] left-0 rounded-[20px] top-[6px] w-[126px]">
          <div aria-hidden className="absolute inset-0 pointer-events-none rounded-[20px]">
            <div className="absolute inset-0 overflow-hidden rounded-[20px]">
              <img alt="" className="absolute h-[120.57%] left-[-20.61%] max-w-none top-[0.02%] w-[133.97%]" src={TILE3_FRONT} />
            </div>
            <div
              className="absolute inset-0 rounded-[20px]"
              style={{ backgroundImage: "linear-gradient(241.496deg, rgba(255,255,255,0) 33.475%, rgba(249,216,58,0.6) 93.083%)" }}
            />
          </div>
        </div>
        <div className={`-translate-y-1/2 absolute flex flex-col h-[32px] justify-center left-[16px] top-[46px] tracking-[-0.64px] w-[70px] ${DOT_FONT}`}>
          <p className="leading-[normal]">Dream Pop</p>
        </div>
      </div>

      {/* 4 — More (bottom-right) */}
      <div className="absolute h-[76px] left-[969px] top-[1183px] w-[126px] origin-top-left scale-110" data-name="exploration-tile-4">
        <Layer frame={BACK_FRAME} crop={WIDE_BACK_CROP} src={TILE4_BG} dim="rgba(0,0,0,0.6)" />
        <Layer frame={MEDIUM_FRAME} crop={WIDE_MEDIUM_CROP} src={TILE4_BG} dim="rgba(0,0,0,0.2)" />
        <Layer
          frame={FRONT_FRAME}
          crop={WIDE_FRONT_CROP}
          src={TILE4_BG}
          gradient="linear-gradient(58.65deg, rgba(25,50,38,0.8) 5.9297%, rgba(255,255,255,0) 76.663%)"
        />
        <div className={`-translate-y-1/2 absolute flex flex-col h-[32px] justify-center left-[18px] top-[46px] tracking-[-1.28px] w-[70px] ${DOT_FONT}`}>
          <p className="leading-[normal] mb-0">More</p>
          <p className="leading-[normal]">....</p>
        </div>
      </div>
    </>
  );
}

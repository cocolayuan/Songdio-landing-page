import imgMiyukiBackground from "../../imports/image-1.png";
import imgMiyukiAvatar from "../../imports/HtmlFe/15989e9c8038f72114ee45814a84f84928f4a686.png";
import imgUnion from "../../imports/HtmlFe/b05a09a965d7367e1be353ee2e0127c6c9eab153.png";
import imgWaveformBg from "../../imports/image-3.png";

/**
 * Visual corrections layered above the read-only Figma import.
 *
 * Letter from the Sea (Frame44, within Component at top-[1135px]):
 *   - Pill at left=890 top=1635 w=210 h=47 in canvas coords.
 *   - The blur overlay softens the photo behind the pill edge.
 *   - Text ("Letter from the Sea", "Ambient Music . Lo-fi Chill.") and
 *     the play button are rendered in a separate layer ABOVE the blur so
 *     they remain sharp.
 *
 * Miyuki card (Frame76 replacement, left=1172 top=1669 w=278 h=168):
 *   - Covered with image-1.png as the card background fill.
 *   - Rounded-[24px] to match the design spec.
 *   - Card contents (avatar, label, Recording pill, waveform strip)
 *     re-staged above the image.
 */
export function CardEffects() {
  return (
    <>
      {/* ── Miyuki card ──────────────────────────────────────────────── */}
      <div
        className="absolute left-[1194px] top-[1669px] w-[278px] h-[168px] rounded-[24px] overflow-hidden pointer-events-none"
        style={{ zIndex: 1 }}
      >
        {/* background bitmap */}
        <img
          src={imgMiyukiBackground}
          alt="Miyuki card gradient background"
          className="absolute inset-0 size-full object-cover"
        />

        {/* avatar */}
        <div className="absolute left-[12px] top-[12px] size-[61px] rounded-[39px] overflow-hidden bg-white/55">
          <img
            src={imgMiyukiAvatar}
            alt="Miyuki avatar"
            className="absolute h-[189.52%] left-[-15.4%] top-[5.39%] w-[121.15%] max-w-none"
          />
        </div>

        {/* name */}
        <p className="absolute left-[25px] top-[73px] font-['Inter:Medium',sans-serif] font-medium text-[#171717] text-[12px] leading-[1.526] whitespace-nowrap">
          Miyuki{" "}
        </p>

        {/* Recording pill */}
        <div className="absolute left-[172px] top-[45px] flex items-center gap-[4px] w-[94px] rounded-[16px] bg-white pl-[10px] pr-[12px] py-[8px]">
          <svg className="size-[20px] shrink-0" fill="none" viewBox="0 0 20 20" aria-hidden>
            <path
              d="M10 2.5a2.5 2.5 0 0 0-2.5 2.5v4.167a2.5 2.5 0 0 0 5 0V5A2.5 2.5 0 0 0 10 2.5Z"
              stroke="#04210A"
              strokeLinecap="round"
              strokeWidth="1.25"
            />
            <path
              d="M5.833 8.333v.834a4.167 4.167 0 0 0 8.334 0v-.834M10 13.333v4.167M6.667 17.5h6.666"
              stroke="#04210A"
              strokeLinecap="round"
              strokeWidth="1.25"
            />
          </svg>
          <p className="font-['PingFang_SC:Regular',sans-serif] text-[#04210a] text-[10px] leading-none whitespace-nowrap">
            Recording
          </p>
        </div>

        {/* waveform strip */}
        <div className="absolute left-[12px] top-[107px] w-[254px] h-[47px] rounded-[12px] overflow-hidden">
          {/* background JPG — bottom-most layer */}
          <img src={imgWaveformBg} alt="" className="absolute inset-0 size-full object-cover pointer-events-none" />
          <div className="absolute inset-0 rounded-[12px] border-l-[20px] border-solid border-[#b5fee7]" />
          <div className="absolute left-0 top-0 h-[47px] w-[21px] bg-[#b5da9f]" />
          <div className="absolute h-[23px] left-[30px] top-[12px] w-[209.351px]">
            <div className="absolute inset-[-47.83%_-17.67%_-826.09%_-34.87%]">
              <img alt="" className="block max-w-none size-full" height="224" src={imgUnion} width="319.351" />
            </div>
          </div>
          <div className="absolute bg-[#172310] h-[13px] left-[9px] top-[16px] w-px" />
          <div className="absolute bg-[#172310] h-[13px] left-[12px] top-[16px] w-px" />
          {/* playhead */}
          <div className="absolute h-[50px] left-[123px] top-[-2px] w-[4px]">
            <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 4 50">
              <circle cx="2" cy="2" fill="#ADFF69" r="2" />
              <circle cx="2" cy="48" fill="#ADFF69" r="2" />
              <rect fill="#ADFF69" height="45" width="2" x="1" y="2" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}

import svgPaths from "./svg-2lrp6cvp4k";
type FrameProps = {
  className?: string;
  color?: "white" | "green";
};

function Frame({ className, color = "white" }: FrameProps) {
  return (
    <div className={className || `content-stretch flex flex-col h-[46px] items-start pl-[24px] pr-[25px] py-[15px] relative rounded-[16px] w-[124px] ${color === "green" ? "bg-gradient-to-r from-[#a6f392] to-[#6fd96a]" : "bg-white"}`}>
      <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
        <div className="relative shrink-0 size-[16px]">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
            <g id="Frame 32">
              <g id="Group">
                <path d={svgPaths.p33e9b300} id="Vector" stroke="var(--stroke-0, #04210A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </g>
              <circle cx="12" cy="11" fill="var(--fill-0, #04210A)" id="Ellipse 78" r="2" />
              <ellipse cx="4" cy="12.5" fill="var(--fill-0, #04210A)" id="Ellipse 79" rx="2" ry="2.5" />
            </g>
          </svg>
        </div>
        <p className="[word-break:break-word] font-['Questrial:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#04210a] text-[16px] whitespace-nowrap">Create</p>
      </div>
    </div>
  );
}

export default function Component({ className }: { className?: string }) {
  return (
    <div className={className || "bg-black h-[151px] relative w-[880px]"} data-name="点击设置纯音乐/歌词">
      <div className="absolute h-[151px] left-0 overflow-clip top-0 w-[880px]" data-name="composer-bar 1">
        <div className="absolute inset-[6.62%_1.14%_49.67%_1.14%]" data-name="Vector">
          <div className="absolute inset-[-0.76%_0]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 861 67">
              <path d={svgPaths.p20706f00} fill="var(--fill-0, #1C1C1F)" id="Vector" stroke="var(--stroke-0, white)" strokeOpacity="0.08" />
            </svg>
          </div>
        </div>
        <Frame className="absolute bg-white content-stretch flex flex-col h-[46px] items-start left-[734px] pl-[24px] pr-[25px] py-[15px] rounded-[16px] top-[20px] w-[124px]" />
        <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal inset-[19.87%_74.55%_64.9%_3.86%] leading-[normal] not-italic text-[#66666d] text-[19px] whitespace-nowrap">Describe your song...</p>
        <div className="absolute bg-black h-[46px] left-[68px] top-[93px] w-[802px]">
          <div className="absolute contents left-0 top-0" data-name="Group">
            <div className="absolute bg-[#1a1a1d] content-stretch flex gap-[8px] h-[46px] items-center justify-center left-0 pb-[9px] pl-[18px] pr-[16px] pt-[10px] rounded-[24px] top-0">
              <div className="relative shrink-0 size-[16px]">
                <div className="absolute inset-[7.81%_12.5%]" data-name="Group">
                  <div className="absolute inset-[-5.56%_-6.25%]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 15">
                      <g id="Group">
                        <path d={svgPaths.p5205700} id="Vector" stroke="var(--stroke-0, #9A9AA0)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
              <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#9a9aa0] text-[16px] whitespace-nowrap">Instrumental</p>
              <div className="relative shrink-0 size-[28px]" data-name="Frame">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
                  <g id="Frame">
                    <path d={svgPaths.p11f9ce00} fill="var(--fill-0, #3F3F3F)" id="Vector" />
                    <circle cx="7.42844" cy="13.4056" fill="var(--fill-0, white)" id="Ellipse 80" r="6.02672" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bg-[#404040] content-stretch flex items-center justify-center left-[10px] rounded-[30px] size-[46px] top-[93px]" data-name="icon">
        <div className="relative shrink-0 size-[16px]" data-name="Frame">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
            <g clipPath="url(#clip0_1_3260)" id="Frame">
              <path d={svgPaths.p31b1ef00} fill="var(--fill-0, white)" id="Vector" />
            </g>
            <defs>
              <clipPath id="clip0_1_3260">
                <rect fill="white" height="16" width="16" />
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}
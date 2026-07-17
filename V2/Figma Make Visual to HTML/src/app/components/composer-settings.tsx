import { useEffect, useRef, useState } from "react";
import svgPaths from "../../imports/点击设置纯音乐歌词/svg-5xr26uf8g9";

const TAGS = [
  "pop",
  "nostalgic",
  "serene",
  "melancholic",
  "jazz",
  "hopeful",
  "rock",
  "electronic",
  "hip-hop",
  "r&b",
  "indie",
  "folk",
  "lo-fi",
  "cinematic",
] as const;

const VERSIONS = [
  { label: "v4.5", pro: false },
  { label: "v5", pro: true },
  { label: "v5.5", pro: true },
];

function MusicNoteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M8 15.5V5.2l8-1.7v10.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6.2" cy="15.6" r="2.2" fill="currentColor" />
      <circle cx="14.2" cy="13.9" r="2.2" fill="currentColor" />
    </svg>
  );
}

function ModeBarsIcon() {
  return (
    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" aria-hidden>
      <path d="M2 13V9" stroke="#A6F392" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M8 13V5" stroke="#DEF283" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M14 13V3" stroke="#C4FF97" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

/** Unified interactive composer for P2 — one coordinate system, no dual-track overlay. */
export function ComposerPanel() {
  const [prompt, setPrompt] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [instrumental, setInstrumental] = useState(false);
  const [modeOpen, setModeOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState("v4.5");
  const [modeChosen, setModeChosen] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [panelKey, setPanelKey] = useState(0);
  const modeRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const spinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const canCreate = prompt.trim().length > 0;
  const modeLabel = modeChosen ? `Mode ${selectedVersion}` : "Mode";

  useEffect(() => {
    if (!modeOpen) return;
    const handler = (e: MouseEvent) => {
      if (modeRef.current && !modeRef.current.contains(e.target as Node)) {
        setModeOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [modeOpen]);

  const appendTag = (tag: string) => {
    setPrompt((prev) => {
      const t = prev.trim();
      if (!t) return tag;
      if (t.split(/\s+/).includes(tag)) return prev;
      return `${t} ${tag}`;
    });
  };

  const scrollTags = (dir: 1 | -1) => {
    tagsRef.current?.scrollBy({ left: dir * 200, behavior: "smooth" });
  };

  const toggleSettings = () => {
    setSettingsOpen((v) => !v);
    setModeOpen(false);
    setPanelKey((k) => k + 1);
  };

  return (
    <div
      className="pointer-events-auto w-full max-w-[1069px] mx-auto"
      data-name="composer-panel"
    >
      {/* Input row */}
      <div className="relative h-[74px] rounded-[24px] border border-white/8 bg-[#1C1C1F] flex items-center pl-[20px] pr-[12px] gap-[12px]">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your song..."
          className="flex-1 min-w-0 bg-transparent outline-none border-0 text-[#eee] placeholder:text-[#66666d] text-[16px] leading-none"
        />
        <button
          type="button"
          disabled={!canCreate}
          onClick={() => {
            if (!canCreate) return;
            console.info("[Composer] Create", { prompt, selectedVersion, instrumental });
          }}
          className={`shrink-0 h-[52px] px-[26px] rounded-[16px] flex items-center gap-[10px] transition-all duration-200 ${
            canCreate
              ? "bg-gradient-to-r from-[#a6f392] to-[#6fd96a] text-[#04210a] cursor-pointer"
              : "bg-white text-[#04210a] opacity-90 cursor-not-allowed"
          }`}
          aria-label="Create song"
        >
          <MusicNoteIcon className="size-[22px]" />
          <span className="font-['Questrial',sans-serif] font-bold text-[16px] whitespace-nowrap tracking-[0.02em]">
            Create
          </span>
        </button>
      </div>

      {/* Controls row */}
      <div className="mt-[14px] flex items-center gap-[8px] min-h-[46px]">
        {/* Settings gear — hover spins exactly once (~0.2s) */}
        <button
          type="button"
          onClick={toggleSettings}
          aria-expanded={settingsOpen}
          aria-label="Song settings"
          onMouseEnter={() => {
            setSpinning(false);
            requestAnimationFrame(() => {
              setSpinning(true);
              if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
              spinTimeoutRef.current = setTimeout(() => setSpinning(false), 200);
            });
          }}
          className={`relative shrink-0 size-[46px] rounded-full flex items-center justify-center border border-white/16 transition-colors duration-200 hover:bg-[#404040] ${
            settingsOpen ? "bg-[#404040]" : "bg-transparent"
          }`}
        >
          <div
            className={`size-[18px] ${spinning ? "composer-gear-spin" : ""}`}
            style={{ color: settingsOpen ? "#fff" : "#9a9aa0" }}
            onAnimationEnd={() => setSpinning(false)}
          >
            <svg className="block size-full" fill="none" viewBox="0 0 16 16">
              <path d={svgPaths.p31b1ef00} fill="currentColor" />
            </svg>
          </div>
        </button>

        {/* Sliding panel: no overflow clip here — Mode dropdown must escape upward */}
        <div className="relative flex-1 min-w-0">
          {settingsOpen ? (
            <div key={`settings-${panelKey}`} className="composer-slide-in flex items-center overflow-hidden">
              <div className="flex items-center gap-[10px] h-[46px] pl-[18px] pr-[14px] rounded-[24px] bg-[#1a1a1d] border border-white/8">
                <svg width="16" height="17" viewBox="0 0 14 15" fill="none" aria-hidden>
                  <path
                    d={svgPaths.p5205700}
                    stroke="#9A9AA0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </svg>
                <span className="text-[#9a9aa0] text-[14px] leading-none">Instrumental</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={instrumental}
                  onClick={() => setInstrumental((v) => !v)}
                  className={`relative shrink-0 w-[32px] h-[18px] rounded-full transition-colors duration-200 ${
                    instrumental ? "bg-[#6fd96a]" : "bg-[#3f3f3f]"
                  }`}
                >
                  {/* Track 18px / thumb 14px → top 2px for optical vertical center */}
                  <span
                    className={`absolute top-[2px] size-[14px] rounded-full bg-white transition-[left] duration-200 ${
                      instrumental ? "left-[15px]" : "left-[2px]"
                    }`}
                  />
                </button>
              </div>
            </div>
          ) : (
            <div
              key={`mode-tags-${panelKey}`}
              className="composer-slide-in flex items-center gap-[8px] min-w-0"
            >
              {/* Mode — default "Mode" (Figma 811:300); after pick "Mode v4.5" */}
              <div ref={modeRef} className="relative shrink-0 z-20">
                <button
                  type="button"
                  onClick={() => setModeOpen((v) => !v)}
                  aria-haspopup="listbox"
                  aria-expanded={modeOpen}
                  className="h-[46px] px-[18px] rounded-full border border-white/16 bg-black flex items-center gap-[10px] cursor-pointer"
                >
                  <ModeBarsIcon />
                  <span className="font-['Inter',sans-serif] font-bold text-white text-[14px] whitespace-nowrap">
                    {modeLabel}
                  </span>
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden>
                    <path
                      d="M1 1.5L6 6.5L11 1.5"
                      stroke="#9A9AA0"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {modeOpen && (
                  <div
                    role="listbox"
                    className="absolute bottom-[calc(100%+6px)] left-0 z-50 overflow-hidden min-w-full"
                    style={{
                      background: "#1C1C1F",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "20px",
                      width: "max(100%, 160px)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
                    }}
                  >
                    {VERSIONS.map((v, i) => (
                      <div key={v.label}>
                        {i > 0 && (
                          <div
                            className="mx-[12px]"
                            style={{ height: 1, background: "rgba(255,255,255,0.05)" }}
                          />
                        )}
                        <button
                          role="option"
                          aria-selected={modeChosen && selectedVersion === v.label}
                          type="button"
                          onClick={() => {
                            setSelectedVersion(v.label);
                            setModeChosen(true);
                            setModeOpen(false);
                          }}
                          className="w-full flex items-center justify-between gap-[10px] px-[16px] h-[46px] cursor-pointer hover:bg-white/[0.06]"
                        >
                          <span
                            className="font-['Inter',sans-serif] font-bold text-[14px] whitespace-nowrap"
                            style={{
                              color:
                                modeChosen && selectedVersion === v.label ? "#fff" : "#9A9AA0",
                            }}
                          >
                            {v.label}
                          </span>
                          {v.pro && (
                            <span
                              className="text-[10px] font-medium px-[7px] py-[2px] rounded-full whitespace-nowrap"
                              style={{ border: "1px solid #A6F392", color: "#A6F392" }}
                            >
                              Pro
                            </span>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tags + arrow as split columns — tags never clip under overlay */}
              <div className="flex flex-1 min-w-0 h-[46px] items-center">
                <div
                  ref={tagsRef}
                  className="flex flex-1 min-w-0 items-center gap-[8px] h-full overflow-x-auto scrollbar-none scroll-smooth"
                  style={{ scrollbarWidth: "none" }}
                >
                  {TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => appendTag(tag)}
                      className="shrink-0 h-[46px] px-[18px] rounded-full bg-[#1a1a1d] border border-white/8 text-[#9a9aa0] text-[14px] hover:bg-[#2a2a2d] hover:text-white transition-colors whitespace-nowrap"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
                {/* 16px black | 44px arrow | 12px black — arrow right aligns with Create */}
                <div className="relative shrink-0 w-[72px] h-full bg-black flex items-center pl-[16px] pr-[12px]">
                  <button
                    type="button"
                    onClick={() => scrollTags(1)}
                    aria-label="Scroll tags"
                    className="size-[44px] rounded-full bg-[#1a1a1d] border border-white/8 flex items-center justify-center hover:bg-[#2a2a2d]"
                  >
                    <svg width="10" height="16" viewBox="0 0 10 16" fill="none" aria-hidden>
                      <path
                        d="M2 2L8 8L2 14"
                        stroke="#9A9AA0"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** @deprecated Prefer ComposerPanel — kept for any residual imports */
export function ComposerSettings() {
  return null;
}

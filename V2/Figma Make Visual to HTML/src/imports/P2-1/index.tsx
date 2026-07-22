import { useRef } from "react";
import svgPaths from "./svg-guobackfvs";
import imgBg from "./bf755f6453a48072057b8953a4f8d8d3c7fc6a12.png";
import imgRectangle60 from "./997480ac9f15d34c3046b7cc5cf5d4d59dec7b45.png";
import imgRectangle61 from "./594a98b5b7f4130a8f31a38c127a36e7ef1f7e4e.png";
import imgRectangle62 from "./4f6a0834bb2598acb162415f5576c4bcdbe80ac3.png";
import { asset } from "../../lib/asset";

function Frame6() {
  return (
    <div className="-translate-x-1/2 [word-break:break-word] absolute content-stretch flex flex-col font-['Questrial:Regular',sans-serif] items-start leading-[0] left-[calc(50%-13px)] not-italic text-white top-0 whitespace-nowrap">
      <div className="flex flex-col justify-center relative shrink-0 text-[56px] tracking-[5.6px]">
        <p className="leading-[60px]">Loved by creators, everywhere.</p>
      </div>
      <div className="flex flex-col justify-center opacity-70 relative shrink-0 text-[28px] tracking-[2.24px]">
        <p className="leading-[50px]">{`Thousands of tracks made, worldwide — here's what people are saying`}</p>
      </div>
    </div>
  );
}

const CARD_WIDTH = 427;
const CARD_GAP = 40;
const CARD_STEP = CARD_WIDTH + CARD_GAP;

interface Review {
  avatar: string;
  name: string;
  body: string;
  location: string;
  rating: string;
}

const REVIEWS: Review[] = [
  {
    avatar: imgRectangle60,
    name: "John Hanbert",
    body: "Absolutely amazing! The AI-generated music is of super high quality with diverse styles, easy to use even for beginners.",
    location: "Englend",
    rating: "4.8",
  },
  {
    avatar: imgRectangle61,
    name: "George",
    body: "A hidden gem AI music app! Create music from text, images or humming—melodies are beautiful and perfect for my needs.",
    location: "Japan",
    rating: "4.9",
  },
  {
    avatar: imgRectangle62,
    name: "Blank",
    body: "Incredible sound quality! AI music is as good as professional compositions, with customizable styles and rich features.",
    location: "Japan",
    rating: "4.7",
  },
  {
    avatar: asset("/creators-avatar/avatar-kora.jpg"),
    name: "Kora",
    body: "Songdio is a total game-changer for creating music without any steep learning curve. The audio quality and vocal realism are genuinely mind-blowing!",
    location: "Russia",
    rating: "4.9",
  },
  {
    avatar: asset("/creators-avatar/avatar-rayna.jpg"),
    name: "Rayna",
    body: "Songdio has completely transformed how I create music.",
    location: "Germany",
    rating: "4.8",
  },
];

function LocationPin() {
  return (
    <div className="absolute left-[28px] opacity-30 size-[24px] top-[206px]" data-name="location-pin">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g>
          <path d={svgPaths.p2ba9a940} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ReviewCard({ review, left }: { review: Review; left: number }) {
  return (
    <div className="absolute bg-[#171717] h-[247px] rounded-[24px] top-0 w-[427px]" style={{ left }}>
      <div className="absolute left-[28px] rounded-[10px] size-[63px] top-[16px]">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[10px] size-full" src={review.avatar} />
      </div>
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[117px] not-italic text-[20px] text-white top-[35px] whitespace-nowrap">{review.name}</p>
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[19px] left-[28px] not-italic opacity-80 text-[#eee] text-[14px] text-left top-[95px] w-[379px]">{review.body}</p>
      <LocationPin />
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal leading-[1.431] left-[60px] not-italic opacity-30 text-[16px] text-white top-[205px] whitespace-nowrap">{review.location}</p>
      <p className="[word-break:break-word] absolute font-['Dotrice',sans-serif] font-normal leading-[normal] not-italic right-[20px] text-[38px] text-right text-white top-[194px] w-[100px]">{review.rating}</p>
    </div>
  );
}

function ReviewsCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    scrollerRef.current?.scrollBy({ left: CARD_STEP, behavior: "smooth" });
  };

  return (
    <>
      <div ref={scrollerRef} className="absolute h-[249px] left-0 overflow-x-auto overflow-y-clip top-[177px] w-[1145px] scrollbar-hidden">
        {REVIEWS.map((review, i) => (
          <ReviewCard key={review.name} review={review} left={i * CARD_STEP} />
        ))}
      </div>
      {/* right-scroll hint button (same style as the footer CTA arrow) */}
      <button
        aria-label="Scroll reviews right"
        className="absolute bg-white border-none cursor-pointer left-[1085px] p-0 rounded-[57.895px] size-[44px] top-[280px] transition-transform duration-150 hover:scale-110"
        onClick={scrollRight}
      >
        <Frame8 />
      </button>
    </>
  );
}

function LovedByCreatorsEverywhere() {
  return (
    <div className="absolute h-[426px] left-[401px] top-[160px] w-[1145px]" data-name="Loved by creators, everywhere.">
      <Frame6 />
      <ReviewsCarousel />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 text-[14px] tracking-[0.56px] w-full">
      <p className="min-w-full relative shrink-0 w-[min-content]">About</p>
      <p className="relative shrink-0 whitespace-nowrap">Work at Songdio</p>
      <p className="min-w-full relative shrink-0 w-[min-content]">Blog</p>
      <p className="min-w-full relative shrink-0 w-[min-content]">Pricing</p>
    </div>
  );
}

function Brand() {
  return (
    <div className="[word-break:break-word] absolute content-stretch flex flex-col font-['Questrial:Regular',sans-serif] gap-[16px] items-start leading-[1.431] left-[190px] not-italic text-black top-[1503px] w-[112px]" data-name="Brand">
      <p className="relative shrink-0 text-[36px] tracking-[1.44px] whitespace-nowrap">Brand</p>
      <Frame10 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 text-[14px] tracking-[0.56px] w-full">
      <p className="relative shrink-0 whitespace-nowrap">{`Join Community `}</p>
      <p className="min-w-full relative shrink-0 w-[min-content]">Terms of Service</p>
      <p className="min-w-full relative shrink-0 w-[min-content]">Privacy</p>
    </div>
  );
}

function Support() {
  return (
    <div className="[word-break:break-word] absolute content-stretch flex flex-col font-['Questrial:Regular',sans-serif] gap-[16px] items-start leading-[1.431] left-[402px] not-italic text-black top-[1503px]" data-name="Support">
      <p className="relative shrink-0 text-[36px] tracking-[1.44px] whitespace-nowrap">Support</p>
      <Frame11 />
    </div>
  );
}

function Frame() {
  return (
    <div className="relative shrink-0 size-[44px]" data-name="Frame">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 44">
        <g id="Frame">
          <path d={svgPaths.pab3fe80} fill="var(--fill-0, black)" id="Vector" />
          <path d={svgPaths.p6c39a00} fill="var(--fill-0, black)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame1() {
  return (
    <div className="relative shrink-0 size-[44px]" data-name="Frame">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 44">
        <g id="Frame">
          <path d={svgPaths.p3fc10340} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="relative shrink-0 size-[44px]" data-name="Frame">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 44">
        <g id="Frame">
          <path d={svgPaths.p8f8fd00} fill="var(--fill-0, #111111)" id="Vector" />
          <path d={svgPaths.p1cf47ec0} fill="var(--fill-0, #FF4040)" id="Vector_2" />
          <path d={svgPaths.p7b6d000} fill="var(--fill-0, #00F5FF)" id="Vector_3" />
          <path d={svgPaths.pef28400} fill="var(--fill-0, white)" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Frame3() {
  return (
    <div className="relative shrink-0 size-[44px]" data-name="Frame">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 44">
        <g id="Frame">
          <path d={svgPaths.p1c0ea8f0} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex gap-[13px] items-center relative shrink-0 w-full">
      <Frame />
      <Frame1 />
      <Frame2 />
      <Frame3 />
    </div>
  );
}

function Songdio() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[25px] items-start left-[1495px] top-[1503px] w-[215px]" data-name="Songdio">
      <p className="[word-break:break-word] font-['Questrial:Regular',sans-serif] leading-[1.431] not-italic relative shrink-0 text-[36px] text-black tracking-[1.44px] w-full">Songdio</p>
      <Frame12 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="[word-break:break-word] font-['Questrial:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[28px] text-white whitespace-pre">{`Download  APP`}</p>
    </div>
  );
}

function Frame8() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.33px)] size-[20.842px] top-1/2">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.8421 20.8421">
        <g id="Frame 70">
          <path d={svgPaths.p3fc7100} id="Line 58" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeWidth="2.31579" />
          <path d={svgPaths.p1bd3d880} id="Polygon 5" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeWidth="2.31579" />
        </g>
      </svg>
    </div>
  );
}

function Frame9() {
  return (
    <div className="bg-white relative rounded-[57.895px] shrink-0 size-[44px]">
      <Frame8 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="-translate-x-1/2 absolute bg-[#0f0f0f] content-stretch flex gap-[12.143px] items-center left-[calc(50%-0.43px)] pl-[32px] pr-[24px] py-[24px] rounded-[50px] top-[306px]">
      <Frame5 />
      <Frame9 />
    </div>
  );
}

function SoWhatAreWeBuilding() {
  return (
    <div className="-translate-x-1/2 absolute bg-[#f5f5f5] h-[500px] left-[958px] overflow-clip rounded-[60px] top-[856px] w-[600px]" data-name="So, what are we building?">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Questrial:Regular',sans-serif] justify-center leading-[0] left-[calc(50%-200px)] not-italic text-[#0f0f0f] text-[56px] top-[203px] tracking-[5.6px] w-[401px]">
        <p className="leading-[60px]">So, what are we building?</p>
      </div>
      <Frame7 />
    </div>
  );
}

export default function P() {
  return (
    <div className="relative size-full bg-[#121111]" data-name="P2">
      <div
        className="absolute h-[1849px] top-[123px] left-1/2 -translate-x-1/2"
        style={{ width: "calc(100vw / var(--stage-scale, 1))" }}
        data-name="BG"
      >
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgBg} />
      </div>
      <LovedByCreatorsEverywhere />
      <Brand />
      <Support />
      <Songdio />
      <SoWhatAreWeBuilding />
    </div>
  );
}

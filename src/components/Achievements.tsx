import type { CSSProperties } from "react";
import { site } from "../data/resume";
import { VerticalPin } from "./VerticalPin";
import { Marquee } from "./ui";

type Achievement = (typeof site.achievements.items)[number];

/* award seal — rotating dashed ring around a stamped medallion in high-contrast ink */
function Seal() {
  return (
    <svg viewBox="0 0 96 96" fill="none" className="h-28 w-28 text-void" aria-hidden="true">
      <g
        className="spin-slow"
        style={{ transformOrigin: "48px 48px", transformBox: "view-box", animationDuration: "18s" } as CSSProperties}
      >
        <circle cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="1.4" strokeDasharray="4 6" opacity="0.9" />
      </g>
      <circle cx="48" cy="48" r="33" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
      <circle cx="48" cy="48" r="25" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <path
        d="M48 24l5 10.5 11.5 1.7-8.3 8.3 2 11.8L48 50.8l-10.2 5.5 2-11.8-8.3-8.3 11.5-1.7z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.12"
      />
    </svg>
  );
}

function AwardPanel({ a, index }: { a: Achievement; index: number }) {
  const isFirst = a.result.includes("1st");
  return (
    <div className="w-full max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-void/20 pb-5">
        <div className="flex items-center gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-void font-mono text-[11px] font-bold text-volt">
            {index + 1}
          </span>
          <span className="font-mono text-[11px] tracking-[0.28em] font-bold uppercase text-void/80">
            {a.meta}
          </span>
        </div>
        <span className="rounded border border-void/30 bg-void/10 px-3 py-1 font-mono text-[10px] tracking-[0.2em] font-bold text-void">
          VERIFIED RECORD
        </span>
      </div>

      <div className="mt-8 grid items-start justify-between gap-8 lg:grid-cols-12">
        <div className="lg:col-span-9">
          <p className="font-display text-[clamp(3.4rem,9.5vw,8rem)] italic leading-[0.84] tracking-tight text-void">
            {a.result}
            {isFirst && <span className="ml-3 text-3xl not-italic">🏆</span>}
          </p>

          <h3 className="mt-6 font-display text-[clamp(1.9rem,4.4vw,3.6rem)] leading-[0.96] tracking-tight text-void/95">
            {a.title}
          </h3>

          <p className="mt-3 font-mono text-sm tracking-[0.14em] font-medium text-void/80">
            {a.org}
          </p>

          {a.note && (
            <div className="mt-7 max-w-2xl rounded border border-void/20 bg-void/10 p-5 backdrop-blur-xs">
              <p className="text-sm leading-relaxed text-void/90 font-medium md:text-[15px]">
                {a.note}
              </p>
            </div>
          )}
        </div>

        <div className="hidden lg:col-span-3 lg:flex lg:justify-end">
          <div className="rounded-full border border-void/30 bg-void/10 p-4">
            <Seal />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Achievements() {
  return (
    <>
      {/* High-Voltage Inverted Ticker leading into the Podium Room */}
      <div className="border-y border-void/30 bg-volt py-6 text-void">
        <Marquee
          speed={40}
          items={site.divider}
          separator={<span className="px-8 text-3xl text-void font-bold">✳</span>}
          renderItem={(t) => (
            <span className="px-4 font-display text-5xl font-black italic tracking-tight text-void md:text-7xl">
              {t}
            </span>
          )}
        />
      </div>

      <VerticalPin
        id="recognition"
        index="05"
        title="Recognition"
        kicker={site.achievements.kicker}
        labels={site.achievements.items.map((a) => a.short)}
        variant="inverted"
      >
        {site.achievements.items.map((a, i) => (
          <AwardPanel key={a.title} a={a} index={i} />
        ))}
      </VerticalPin>
    </>
  );
}

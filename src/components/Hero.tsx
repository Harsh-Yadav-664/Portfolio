import { useEffect, useState } from "react";
import { site } from "../data/resume";
import { usePrefersReducedMotion } from "../lib/motion";
import { Scene, SceneHero } from "./three/scenes";
import { ArrowDown, ArrowUpRight, Marquee, Magnetic, ScrambleText, Underline } from "./ui";

type HeroStat = (typeof site.hero.stats)[number];

function StatCell({ stat }: { stat: HeroStat }) {
  const isOneThree = stat.value === "1 / 3";
  return (
    <div className="flex flex-col">
      <div className="font-display text-[clamp(1.9rem,4.4vw,3.6rem)] leading-none tracking-tight">
        {isOneThree ? (
          <>
            1 <span className="text-volt">/</span> 3
          </>
        ) : (
          stat.value
        )}
      </div>
      <div className="mt-3 font-mono text-[11px] tracking-[0.2em] text-ink uppercase">
        {stat.label}
      </div>
      {"sub" in stat && stat.sub && (
        <div className="mt-1 font-mono text-[10px] tracking-[0.16em] text-mute">
          {stat.sub}
        </div>
      )}
    </div>
  );
}

export function Hero() {
  const reduced = usePrefersReducedMotion();
  const [loaded, setLoaded] = useState(false);
  const p = site.personal;

  useEffect(() => {
    const t = window.setTimeout(() => setLoaded(true), 200);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <section id="top" className="relative flex min-h-screen flex-col overflow-hidden">
      {/* 3D artifact — object 1 of 3 */}
      <div
        className="absolute inset-y-0 right-0 w-full opacity-40 md:w-[62%] md:opacity-100"
        style={{
          maskImage: "linear-gradient(90deg, transparent 0, black 30%)",
          WebkitMaskImage: "linear-gradient(90deg, transparent 0, black 30%)",
        }}
      >
        <Scene className="h-full w-full" paused={reduced}>
          <SceneHero paused={reduced} />
        </Scene>
      </div>
      {/* soft volt glow */}
      <div
        aria-hidden
        className="absolute top-1/3 right-[8%] h-[420px] w-[420px] rounded-full opacity-[0.07] blur-[120px]"
        style={{ background: "radial-gradient(circle, var(--glow-soft) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-5 pt-24 md:px-10 md:pt-28">
        {/* telemetry strip */}
        <div
          className={`rv flex flex-wrap items-center gap-x-8 gap-y-2 font-mono text-[10px] tracking-[0.22em] text-mute md:text-[11px] ${
            loaded ? "is-in" : ""
          }`}
        >
          <span>{site.hero.kicker}</span>
          <span className="ml-auto hidden text-volt md:inline">{site.hero.status}</span>
        </div>

        {/* the name + looping edge animations */}
        <div className={`rv mt-10 md:mt-14 ${loaded ? "is-in" : ""}`}>
          <div className="edge-box relative inline-block max-w-full pr-6 md:pr-12">
            {/* animated corner markers that pulse */}
            <span
              aria-hidden
              className="pointer-events-none absolute -top-3 -left-3 h-3 w-3 border-t-2 border-l-2 border-volt"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-3 -right-3 h-3 w-3 border-b-2 border-r-2 border-volt"
            />

            {/* vertical looping edge-rails on both sides */}
            <span aria-hidden className="name-rail name-rail--left -left-5 md:-left-8" />
            <span aria-hidden className="name-rail name-rail--right -right-1 md:-right-4" />

            <h1 className="font-display text-[clamp(4rem,15vw,13rem)] leading-[0.86] tracking-[-0.02em]">
              <span className="rv-line">
                <span className="font-light" style={{ transitionDelay: "150ms" }}>
                  {p.firstName}
                </span>
              </span>
              <span className="rv-line">
                <span className="font-medium italic" style={{ transitionDelay: "300ms" }}>
                  {p.lastName}
                  <span className="not-italic text-volt">.</span>
                </span>
              </span>
            </h1>
          </div>

          <div className="mt-8 flex items-center gap-4 md:mt-10">
            <span className="h-px w-10 shrink-0 bg-volt md:w-20" />
            <ScrambleText
              text={p.role}
              start={loaded}
              delay={500}
              className="font-mono text-[10px] tracking-[0.18em] text-ink/85 md:text-sm md:tracking-[0.28em]"
            />
          </div>

          <p className="mt-8 max-w-xl text-base leading-relaxed text-mute md:text-lg">
            I build <Underline>LLM-powered systems</Underline>, autonomous agents, and the
            infrastructure that carries them — from first prototype to production deployment.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Magnetic>
              <a
                href={site.hero.ctaPrimary.href}
                data-cursor
                className="group inline-flex items-center gap-3 bg-volt px-7 py-4 font-mono text-[11px] tracking-[0.25em] text-void transition-colors duration-300 hover:bg-ink"
              >
                {site.hero.ctaPrimary.label}
                <ArrowDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href={site.hero.ctaSecondary.href}
                data-cursor
                className="inline-flex items-center gap-3 border border-line px-7 py-4 font-mono text-[11px] tracking-[0.25em] text-mute transition-colors duration-300 hover:border-volt hover:text-volt"
              >
                {site.hero.ctaSecondary.label}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </Magnetic>
          </div>
        </div>

        {/* bottom stats — clean, confident, exactly 3 */}
        <div
          className={`rv edge-box-rev mt-auto grid max-w-4xl grid-cols-1 gap-8 border-t border-line py-8 sm:grid-cols-3 ${
            loaded ? "is-in" : ""
          }`}
          style={{ transitionDelay: "450ms" }}
        >
          {site.hero.stats.map((s) => (
            <StatCell key={s.label} stat={s} />
          ))}
        </div>
      </div>

      {/* vertical scroll cue */}
      <div className="absolute right-6 bottom-40 z-10 hidden flex-col items-center gap-3 md:flex lg:right-10">
        <span className="font-mono text-[10px] tracking-[0.35em] text-mute [writing-mode:vertical-rl]">
          SCROLL
        </span>
        <span className="scroll-cue block h-14 w-px bg-line" />
      </div>

      {/* skill ticker */}
      <div className="relative z-10 border-y border-line bg-void/60 py-3 backdrop-blur-sm">
        <Marquee
          speed={30}
          items={site.heroMarquee}
          separator={<span className="px-6 text-sm text-volt">✳</span>}
          renderItem={(item, i) =>
            i % 2 === 0 ? (
              <span className="px-6 font-display text-xl italic md:text-2xl">{item}</span>
            ) : (
              <span className="px-6 font-mono text-[11px] tracking-[0.3em] text-mute">{item}</span>
            )
          }
        />
      </div>
    </section>
  );
}

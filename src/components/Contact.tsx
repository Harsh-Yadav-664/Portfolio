import { useState } from "react";
import { site } from "../data/resume";
import { useClock, usePrefersReducedMotion, useReveal } from "../lib/motion";
import { Scene, SceneOrbit } from "./three/scenes";
import { ArrowUp, ArrowUpRight, ChapterHead, Magnetic, ScrambleText } from "./ui";

function DetailRow({ k, v, volt = false }: { k: string; v: string; volt?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 px-5 py-4">
      <span className="font-mono text-[10px] tracking-[0.2em] text-mute">{k}</span>
      <span className={`text-right font-mono text-xs md:text-sm ${volt ? "text-volt" : "text-ink"}`}>
        {v}
      </span>
    </div>
  );
}

export function Contact() {
  const reduced = usePrefersReducedMotion();
  const time = useClock();
  const [copied, setCopied] = useState(false);
  const leftRef = useReveal<HTMLDivElement>();
  const rightRef = useReveal<HTMLDivElement>();
  const p = site.personal;

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(p.email);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = p.email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="relative scroll-mt-16 overflow-hidden border-t border-line">
      {/* 3D gyro orbit — object 3 of 3 */}
      <div
        className="absolute top-24 right-0 hidden h-[520px] w-[42%] max-w-[600px] opacity-80 md:block"
        style={{
          maskImage: "linear-gradient(90deg, transparent 0, black 35%)",
          WebkitMaskImage: "linear-gradient(90deg, transparent 0, black 35%)",
        }}
      >
        <Scene className="h-full w-full" paused={reduced} camera={[0, 0, 5.6]}>
          <SceneOrbit paused={reduced} />
        </Scene>
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-32">
        <ChapterHead
          index="07"
          title="Transmission"
          kicker={site.contact.kicker}
          note={site.contact.note}
        />

        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-7">
            <div ref={leftRef} className="rv">
              <h3 className="font-display text-[clamp(3rem,8vw,7rem)] leading-[0.92] tracking-tight">
                <span className="rv-line">
                  <span>{site.contact.titleA}</span>
                </span>
                <span className="rv-line">
                  <span className="text-volt italic" style={{ transitionDelay: "140ms" }}>
                    {site.contact.titleB}
                  </span>
                </span>
              </h3>

              <p className="mt-8 max-w-md leading-relaxed text-mute">{site.contact.sub}</p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Magnetic>
                  <a
                    href={`mailto:${p.email}`}
                    data-cursor
                    className="group inline-flex items-center gap-3 bg-volt px-8 py-5 font-mono text-xs tracking-[0.15em] text-void transition-colors duration-300 hover:bg-ink md:text-sm"
                  >
                    {p.email.toUpperCase()}
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </Magnetic>
                <button
                  onClick={copyEmail}
                  data-cursor
                  className="inline-flex items-center gap-3 border border-line px-6 py-5 font-mono text-[11px] tracking-[0.2em] text-mute transition-colors duration-300 hover:border-volt hover:text-volt"
                >
                  {copied ? (
                    <span className="text-volt">COPIED ✓</span>
                  ) : (
                    <>
                      COPY EMAIL <span className="text-volt">⧉</span>
                    </>
                  )}
                </button>
              </div>

              <ul className="mt-16 border-t border-line">
                {site.socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target={s.href.startsWith("http") ? "_blank" : undefined}
                      rel={s.href.startsWith("http") ? "noreferrer" : undefined}
                      data-cursor
                      className="group flex items-center justify-between border-b border-line py-5"
                    >
                      <span className="font-mono text-[11px] tracking-[0.25em] text-mute transition-colors duration-300 group-hover:text-ink">
                        {s.label}
                      </span>
                      <span className="flex items-center gap-3 font-display text-2xl italic transition-all duration-300 ease-out-expo group-hover:translate-x-2 group-hover:text-volt md:text-3xl">
                        {s.handle}
                        <ArrowUpRight className="h-5 w-5 shrink-0" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* signal card */}
          <div className="md:col-span-5">
            <div ref={rightRef} className="rv md:sticky md:top-28" style={{ transitionDelay: "120ms" }}>
              <div className="border border-line bg-panel/50 backdrop-blur-sm">
                <div className="flex items-center justify-between border-b border-line px-5 py-3">
                  <span className="font-mono text-[10px] tracking-[0.25em] text-mute">
                    SIGNAL.STATUS
                  </span>
                  <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-volt">
                    <span className="dot-pulse h-1.5 w-1.5 rounded-full bg-volt" />
                    OPEN
                  </span>
                </div>
                <div className="divide-y divide-line">
                  <DetailRow k="LOCAL TIME" v={`${time} IST`} />
                  <DetailRow k="BASE" v={p.location} />
                  <DetailRow k="STATUS" v="OPERATIONAL" volt />
                </div>
              </div>
              <p className="mt-6 font-mono text-[10px] leading-loose tracking-[0.2em] text-mute/70">
                <ScrambleText
                  text="DIRECT CONTACT — NO INTERMEDIARIES."
                  delay={400}
                />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* full-bleed call band */}
      <div className="relative z-10 mt-24 border-y border-line bg-panel/30 py-10">
        <div className="marquee marquee-reverse" style={{ overflow: "hidden" }}>
          <div className="marquee-track" style={{ animationDuration: "34s" }}>
            {[0, 1].map((dup) => (
              <a
                key={dup}
                href={`mailto:${p.email}`}
                data-cursor
                aria-hidden={dup === 1 || undefined}
                tabIndex={dup === 1 ? -1 : 0}
                className="flex shrink-0 items-center"
              >
                {[0, 1, 2].map((k) => (
                  <span key={k} className="flex items-center">
                    <span className="px-6 font-display text-[clamp(2.4rem,7vw,5.5rem)] italic leading-none tracking-tight transition-colors duration-300 hover:text-volt">
                      Let's build something
                    </span>
                    <span className="px-2 text-[clamp(1.5rem,3vw,2.6rem)] text-volt">✳</span>
                  </span>
                ))}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* footer bar */}
      <footer className="relative z-10 border-t border-line">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-5 py-6 font-mono text-[10px] tracking-[0.2em] text-mute md:px-10">
          <span>{site.footer.left}</span>
          <span className="hidden md:inline">{site.footer.mid}</span>
          <button
            onClick={() => window.scrollTo({ top: 0 })}
            data-cursor
            className="flex items-center gap-2 transition-colors hover:text-volt"
          >
            BACK TO TOP <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </footer>
    </section>
  );
}

import { site } from "../data/resume";
import { useReveal } from "../lib/motion";
import { ChapterHead, GhostNum, Reveal } from "./ui";

export function About() {
  const cardRef = useReveal<HTMLDivElement>();

  return (
    <section id="profile" className="relative scroll-mt-16">
      <GhostNum n="01" />
      <div className="relative mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-32">
        <ChapterHead index="01" title="Profile" kicker={site.about.kicker} note={site.about.note} />

        <div className="grid gap-14 md:grid-cols-12">
          {/* identity summary card */}
          <div className="md:col-span-5">
            <div className="md:sticky md:top-28">
              <div ref={cardRef} className="edge-box rv border border-line bg-panel/40">
                <div className="flex items-center justify-between border-b border-line px-5 py-3">
                  <span className="font-mono text-[10px] tracking-[0.25em] text-mute">
                    PROFILE SUMMARY
                  </span>
                  <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-volt">
                    <span className="dot-pulse h-1.5 w-1.5 rounded-full bg-volt" />
                    AVAILABLE
                  </span>
                </div>
                <dl className="divide-y divide-line">
                  {site.about.facts.map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between gap-4 px-5 py-4">
                      <dt className="font-mono text-[10px] tracking-[0.2em] text-mute">{k}</dt>
                      <dd className="text-right text-sm text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="flex items-center gap-3 border-t border-line px-5 py-4">
                  <span className="dot-pulse h-2 w-2 bg-volt" />
                  <span className="font-mono text-[10px] tracking-[0.2em] text-volt">
                    {site.personal.availability}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* narrative + operating method + dispatch table */}
          <div className="md:col-span-7">
            <div className="space-y-8">
              {site.about.paragraphs.map((para, i) => (
                <Reveal key={i} delay={i * 110}>
                  <p className="text-lg leading-relaxed text-mute md:text-[21px]">
                    {i === 0 ? (
                      <>
                        <span className="font-display text-2xl italic text-ink md:text-3xl">
                          {para.split(" ")[0]}{" "}
                        </span>
                        {para.split(" ").slice(1).join(" ")}
                      </>
                    ) : (
                      para
                    )}
                  </p>
                </Reveal>
              ))}
            </div>

            {/* operating method strip (Prototype · Experiment · Validate · Ship) */}
            <div className="mt-14 grid grid-cols-2 gap-px border border-line bg-line lg:grid-cols-4">
              {site.about.method.map((m, i) => (
                <div
                  key={m.phase}
                  className="edge-box-rev group relative bg-void p-6 transition-colors duration-500 hover:bg-panel"
                >
                  <span className="font-mono text-[10px] tracking-[0.25em] text-volt">{m.phase}</span>
                  <h4 className="mt-4 font-display text-xl italic tracking-tight transition-transform duration-500 group-hover:translate-x-1">
                    {m.title}
                  </h4>
                  <p className="mt-3 text-[12px] leading-relaxed text-mute">{m.note}</p>
                  <span
                    className="absolute top-0 left-0 h-[2px] w-0 bg-volt transition-all duration-700 group-hover:w-full"
                    style={{ transitionDelay: `${i * 60}ms` }}
                  />
                </div>
              ))}
            </div>

            {/* WORKING ON / EXPLORING dispatch table (below method, 2 columns) */}
            <div className="edge-box mt-6 border border-line bg-panel/30 p-6 md:p-8">
              <div className="grid gap-8 md:grid-cols-2 md:gap-10">
                {site.about.dispatch.map((col) => (
                  <div key={col.tag}>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 bg-volt" />
                      <span className="font-mono text-[11px] tracking-[0.25em] text-volt">
                        {col.tag}
                      </span>
                    </div>
                    <ul className="mt-5 space-y-3.5">
                      {col.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-sm leading-relaxed text-mute"
                        >
                          <span className="mt-1 shrink-0 font-mono text-[10px] text-volt">▸</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <Reveal delay={150} className="mt-8">
              <p className="font-mono text-[11px] leading-loose tracking-[0.15em] text-mute">
                <span className="text-volt">▸ </span>
                {site.about.interests}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

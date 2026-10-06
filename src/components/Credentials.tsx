import { site } from "../data/resume";
import { useReveal } from "../lib/motion";
import { ChapterHead, GhostNum } from "./ui";

function PanelHeading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="flex items-center gap-4 border-b border-line pb-5">
      <span className="font-mono text-[10px] tracking-[0.3em] text-volt">{kicker}</span>
      <h3 className="font-display text-3xl italic tracking-tight md:text-4xl">{title}</h3>
    </div>
  );
}

export function Credentials() {
  const eduRef = useReveal<HTMLDivElement>();
  const certRef = useReveal<HTMLDivElement>();

  return (
    <section id="credentials" className="relative scroll-mt-16 border-t border-line">
      <GhostNum n="06" />
      <div className="relative mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-32">
        <ChapterHead
          index="06"
          title="Credentials"
          kicker="EDUCATION · CERTIFICATIONS"
          note="Academic background and verified certifications"
        />

        <div className="grid gap-10 md:grid-cols-12">
          {/* ── Education ── */}
          <div className="md:col-span-5">
            <div ref={eduRef} className="rv h-full border border-line bg-panel/30 p-7 md:p-9">
              <PanelHeading kicker="PART 01" title="Education" />

              <p className="mt-7 font-mono text-[10px] tracking-[0.25em] text-mute">
                {site.education.period} · {site.education.location}
              </p>
              <h4 className="mt-4 font-display text-2xl tracking-tight md:text-[1.75rem]">
                {site.education.school}
              </h4>
              <p className="mt-3 text-sm leading-relaxed text-mute">{site.education.degree}</p>

              <div className="mt-8 flex items-end gap-4 border-t border-line pt-7">
                <span className="font-display text-6xl leading-none tracking-tight text-volt md:text-7xl">
                  {site.education.cgpa}
                </span>
                <span className="pb-1.5 font-mono text-[10px] tracking-[0.2em] text-mute">
                  CGPA / 10
                </span>
              </div>

              <div className="mt-9">
                <p className="font-mono text-[10px] tracking-[0.25em] text-mute">
                  RELEVANT COURSEWORK
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {site.education.coursework.map((c) => (
                    <span
                      key={c}
                      className="cursor-default border border-line px-3 py-1.5 font-mono text-[10px] text-mute transition-all duration-300 hover:border-volt hover:bg-volt hover:text-void"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-9 border-t border-line pt-7">
                <p className="font-mono text-[10px] tracking-[0.25em] text-mute">
                  SCHOOL RECORD · BLUE BELLS PUBLIC SCHOOL
                </p>
                <ul className="mt-4 space-y-3">
                  {site.education.schoolRecord.map((s) => (
                    <li
                      key={s.level}
                      className="flex items-baseline justify-between gap-4 border-b border-line/60 pb-3"
                    >
                      <span className="text-sm text-mute">{s.level}</span>
                      <span className="font-display text-2xl italic text-volt">{s.grade}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ── Certifications ── */}
          <div className="md:col-span-7">
            <div ref={certRef} className="rv h-full border border-line bg-panel/10 p-7 md:p-9">
              <PanelHeading kicker="PART 02" title="Certifications" />

              <ul className="mt-2">
                {site.certifications.map((c, i) => (
                  <li
                    key={c.name}
                    className="group flex items-center justify-between gap-6 border-b border-line py-5 transition-colors duration-300 last:border-b-0 hover:bg-panel/40 md:-mx-4 md:px-4"
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-[10px] text-volt">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <p className="text-sm font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-2 md:text-base">
                          {c.name}
                        </p>
                        <p className="mt-1 font-mono text-[11px] text-mute">{c.issuer}</p>
                      </div>
                    </div>
                    <span className="shrink-0 font-mono text-[11px] text-mute">{c.year}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

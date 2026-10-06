import { useState } from "react";
import { site } from "../data/resume";
import { usePrefersReducedMotion } from "../lib/motion";
import { VerticalPin } from "./VerticalPin";
import { Scene, SceneCore } from "./three/scenes";

type Entry = (typeof site.experience.entries)[number];

function RolePanel({ entry }: { entry: Entry }) {
  const [selectedArtifact, setSelectedArtifact] = useState<number>(0);
  const isTinyCrows = entry.short === "TinyCrows";

  return (
    <div className="w-full">
      {/* ── Mission Console Telemetry Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <div className="flex items-center gap-2.5">
          <span className="dot-pulse h-2 w-2 rounded-full bg-volt" />
          <span className="font-mono text-[10px] tracking-[0.25em] text-volt uppercase">
            {entry.type} DOSSIER · {entry.short}
          </span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[10px] text-mute">
          <span className="hidden sm:inline">BASE: {entry.location.toUpperCase()}</span>
          <span className="rounded border border-line bg-panel px-2.5 py-0.5 text-ink">
            {entry.period}
          </span>
        </div>
      </div>

      {/* ── Role Title & Org ── */}
      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-4 md:mt-7">
        <div>
          <span className="font-mono text-[11px] tracking-[0.2em] text-mute uppercase">
            {entry.role}
          </span>
          <h3 className="mt-1.5 font-display text-[clamp(2.2rem,5.4vw,4.5rem)] italic leading-[0.92] tracking-tight">
            {entry.org}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-volt/40 bg-volt/10 px-3 py-1 font-mono text-[9px] tracking-[0.2em] text-volt">
            {isTinyCrows ? "KALI LINUX · GO CLI · AZURE" : "AZURE APP SERVICES · REST"}
          </span>
        </div>
      </div>

      {/* ── Linux Command Line Preview Simulation ── */}
      <div className="mt-6 overflow-x-auto rounded border border-line/80 bg-panel/50 px-4 py-2.5 font-mono text-[11px] text-mute shadow-inner">
        <span className="text-volt">root@{isTinyCrows ? "tinycrows" : "azure-trainee"}:~$</span>{" "}
        <span className="text-ink">
          {isTinyCrows
            ? "./vapt-agent --mode=multi-agent --orchestrate=llm-pipeline --target=containerized-ci"
            : "python3 weather_pipeline.py --ingest --transform --deploy=azure-app-services"}
        </span>
      </div>

      {/* ── Main Dual-Deck Content ── */}
      <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-10">
        {/* Left Column: Responsibilities & Impact Log */}
        <div className="lg:col-span-7">
          <div className="mb-4 flex items-center justify-between border-b border-line/60 pb-2">
            <span className="font-mono text-[10px] tracking-[0.28em] text-volt">
              OPERATIONAL BRIEF & EXECUTION
            </span>
            <span className="font-mono text-[9px] text-mute">
              {entry.points.length} KEY OBJECTIVES
            </span>
          </div>

          <ul className="space-y-3.5">
            {entry.points.map((pt, i) => (
              <li
                key={pt}
                className="group/pt flex items-start gap-3 rounded p-2 transition-colors hover:bg-panel/30"
              >
                <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-volt/40 bg-volt/10 font-mono text-[9px] text-volt">
                  {i + 1}
                </span>
                <span className="text-[13px] leading-relaxed text-mute transition-colors group-hover/pt:text-ink md:text-sm">
                  {pt}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column: Deployed Artifacts Showcase */}
        <div className="lg:col-span-5">
          <div className="mb-4 flex items-center justify-between border-b border-line/60 pb-2">
            <span className="font-mono text-[10px] tracking-[0.28em] text-volt">
              DELIVERED ARTIFACTS
            </span>
            <span className="font-mono text-[9px] text-mute">
              {entry.deliverables.length} PRODUCTION BUILDS
            </span>
          </div>

          <div className="space-y-3">
            {entry.deliverables.map((d, idx) => {
              const isSelected = selectedArtifact === idx;
              return (
                <div
                  key={d.name}
                  onClick={() => setSelectedArtifact(idx)}
                  className={`cursor-pointer rounded border p-4 transition-all duration-300 ${
                    isSelected
                      ? "border-volt bg-panel shadow-[0_0_16px_var(--glow-soft)]"
                      : "border-line bg-panel/30 hover:border-volt/50 hover:bg-panel/60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full transition-colors ${
                          isSelected ? "bg-volt shadow-[0_0_8px_var(--glow)]" : "bg-mute"
                        }`}
                      />
                      <h4 className="text-sm font-semibold tracking-tight text-ink">
                        {d.name}
                      </h4>
                    </div>
                    <span className="font-mono text-[9px] tracking-[0.2em] text-volt">
                      {isSelected ? "[ACTIVE VIEW]" : "INSPECT"}
                    </span>
                  </div>

                  <p className="mt-2.5 text-xs leading-relaxed text-mute">
                    {d.blurb}
                  </p>

                  <div className="mt-3.5 flex flex-wrap gap-1.5 border-t border-line/50 pt-3">
                    {d.stack.map((t) => (
                      <span
                        key={t}
                        className="rounded border border-line bg-void/60 px-2 py-0.5 font-mono text-[9px] tracking-wider text-mute transition-colors hover:border-volt hover:text-ink"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Experience() {
  const reduced = usePrefersReducedMotion();
  return (
    <VerticalPin
      id="experience"
      index="03"
      title="Experience"
      kicker={site.experience.kicker}
      labels={site.experience.entries.map((e) => e.short)}
      scene={
        <Scene className="h-full w-full opacity-35" paused={reduced} camera={[0, 0, 7.2]}>
          <SceneCore paused={reduced} />
        </Scene>
      }
    >
      {site.experience.entries.map((e) => (
        <RolePanel key={e.org} entry={e} />
      ))}
    </VerticalPin>
  );
}

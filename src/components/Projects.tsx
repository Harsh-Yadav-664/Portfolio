import { useState, useRef } from "react";
import { site } from "../data/resume";
import { VerticalPin } from "./VerticalPin";
import { SchematicFallback } from "./Schematic";
import { ArrowUpRight } from "./ui";

type Project = (typeof site.projects.items)[number];

type WorkbenchMode = "schematic" | "architecture" | "telemetry";

/* Project-specific technical metadata for the interactive workbench */
const PROJECT_METRICS: Record<
  string,
  {
    architectureLayers: { name: string; role: string; tech: string }[];
    telemetry: { label: string; value: string }[];
  }
> = {
  IntentDraw: {
    architectureLayers: [
      { name: "Layer 01: Spatial Vision Parser", role: "Hand-drawn sketch geometry parsing", tech: "Computer Vision / Edge Detect" },
      { name: "Layer 02: Model-Agnostic LLM Interface", role: "Provider interchange & intent mapping", tech: "Claude 3.5 Sonnet / OpenAI" },
      { name: "Layer 03: Component Tree Synthesizer", role: "Recursive typed UI structure generator", tech: "TypeScript AST / React TSX" },
      { name: "Layer 04: Validation & Benchmark Engine", role: "Syntax validation & reproducibility checks", tech: "Python / PyTest" },
    ],
    telemetry: [
      { label: "MODEL INTERCHANGE", value: "Claude 3.5 Sonnet · GPT-4o" },
      { label: "PARSER LATENCY", value: "< 2.4s end-to-end" },
      { label: "OUTPUT FORMAT", value: "Typed TSX Component Tree" },
      { label: "INTENT ACCURACY", value: "Iterative Benchmark Loop" },
    ],
  },
  "Vendor Security Assessment Platform": {
    architectureLayers: [
      { name: "Layer 01: Vendor Onboarding Pipeline", role: "Automated evidence & data ingestion", tech: "N8N Webhooks / APIs" },
      { name: "Layer 02: Cyber Due Diligence Scanner", role: "SSL/TLS, SPF, DKIM, DMARC, open ports", tech: "Threat Intel APIs / Python" },
      { name: "Layer 03: AI Questionnaire Validator", role: "Cross-checks vendor answers vs docs", tech: "LangChain / LLM Agents" },
      { name: "Layer 04: Continuous Risk Engine", role: "LOW / MED / HIGH / CRITICAL scoring", tech: "Pandas / Automated Reports" },
    ],
    telemetry: [
      { label: "TPRM WORKFLOWS", value: "100% Automated Due Diligence" },
      { label: "SECURITY CONTROLS", value: "SSL, DNS, DMARC, Open Ports" },
      { label: "FRAMEWORK COMPLIANCE", value: "SEBI CSCRF / TPRM Baselines" },
      { label: "AUTOMATION ENGINE", value: "N8N Self-Hosted Workflows" },
    ],
  },
  "Smart Chess Instructor": {
    architectureLayers: [
      { name: "Layer 01: Board State & Move Ingestion", role: "PGN real-time stream parsing", tech: "Python-Chess / Stockfish 16" },
      { name: "Layer 02: Positional & Centipawn Evaluator", role: "Engine evaluation & mistake delta", tech: "NumPy / Pandas Engine" },
      { name: "Layer 03: Tactical Pattern Detector", role: "Forks, pins, skewers & discovered attacks", tech: "Custom Agent Matcher" },
      { name: "Layer 04: Agent Coaching Persona", role: "Cross-game personalized training tips", tech: "AI Agent Workflows" },
    ],
    telemetry: [
      { label: "ENGINE DEPTH", value: "Stockfish 16 · Depth 22" },
      { label: "ANALYSIS PIPELINE", value: "Cross-game mistake clustering" },
      { label: "TACTICAL DETECTOR", value: "Real-time forks, pins, attacks" },
      { label: "COACHING SYSTEM", value: "Personalized player profiling" },
    ],
  },
};

function Status({ label }: { label: string }) {
  const live = /DEVELOPMENT|ONGOING/.test(label);
  return (
    <span
      className={`flex items-center gap-2 rounded-full border px-3 py-0.5 font-mono text-[10px] tracking-[0.2em] ${
        live
          ? "border-volt/50 bg-volt/10 text-volt"
          : "border-line bg-panel text-mute"
      }`}
    >
      {live && <span className="dot-pulse h-1.5 w-1.5 rounded-full bg-volt" />}
      {label}
    </span>
  );
}

function ProjectPanel({ project, index }: { project: Project; index: number }) {
  const [mode, setMode] = useState<WorkbenchMode>("schematic");
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const meta = PROJECT_METRICS[project.name] || {
    architectureLayers: [],
    telemetry: [],
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    setCoords({
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top),
    });
  };

  return (
    <div className="w-full">
      {/* ── Project Header Strip ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] font-bold tracking-[0.25em] text-volt">
            P—{String(index + 1).padStart(2, "0")}
          </span>
          <span className="h-px w-6 bg-volt" />
          <span className="font-mono text-[10px] tracking-[0.2em] text-mute uppercase">
            AUTONOMOUS ENGINEERING LAB
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden font-mono text-[10px] tracking-[0.2em] text-mute sm:inline">
            {project.period}
          </span>
          <Status label={project.status} />
        </div>
      </div>

      {/* ── Main Workbench Grid ── */}
      <div className="mt-6 grid items-start gap-8 lg:mt-8 lg:grid-cols-12 lg:gap-10">
        {/* Left Column: Project Dossier */}
        <div className="lg:col-span-6">
          <h3 className="font-display text-[clamp(2.3rem,5.2vw,4.4rem)] leading-[0.92] tracking-[-0.02em]">
            {project.name}
          </h3>

          <p className="mt-5 text-sm leading-relaxed text-mute md:text-base">
            {project.blurb}
          </p>

          <div className="mt-6 space-y-2.5">
            <span className="font-mono text-[10px] tracking-[0.25em] text-volt uppercase">
              ENGINEERED HIGHLIGHTS
            </span>
            <ul className="space-y-2">
              {project.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-xs leading-relaxed text-ink/90 md:text-sm">
                  <span className="mt-0.5 shrink-0 font-mono text-volt">▸</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.stack.map((t) => (
              <span
                key={t}
                className="cursor-default rounded border border-line bg-panel/50 px-3 py-1 font-mono text-[10px] text-mute transition-all duration-300 hover:border-volt hover:bg-volt hover:text-void hover:font-bold"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            {project.repo ? (
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                data-cursor
                className="group/btn inline-flex items-center gap-3 rounded bg-volt px-6 py-3.5 font-mono text-[11px] font-bold tracking-[0.22em] text-void transition-all duration-300 hover:bg-ink hover:text-void shadow-[0_0_16px_var(--glow-soft)]"
              >
                VIEW REPOSITORY
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </a>
            ) : (
              <span className="inline-flex items-center gap-2 rounded border border-line bg-panel/60 px-5 py-3 font-mono text-[10px] tracking-[0.2em] text-mute">
                <span className="h-1.5 w-1.5 rounded-full bg-volt" />
                HACKATHON PROJECT · ECLIPSE 6.0 WINNER (TIET)
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Lab Workbench */}
        <div className="lg:col-span-6">
          <div className="edge-box rounded border border-line bg-panel/40 p-4 md:p-5">
            {/* Workbench Mode Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
              <span className="font-mono text-[9px] tracking-[0.25em] text-volt uppercase">
                {project.schematicLabel}
              </span>
              <div className="flex items-center gap-1.5">
                {(["schematic", "architecture", "telemetry"] as WorkbenchMode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    data-cursor
                    className={`rounded px-2.5 py-1 font-mono text-[9px] tracking-[0.16em] uppercase transition-all ${
                      mode === m
                        ? "bg-volt text-void font-bold shadow-[0_0_8px_var(--glow)]"
                        : "border border-line/60 text-mute hover:border-volt/50 hover:text-ink"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Workbench Body */}
            <div className="mt-4">
              {mode === "schematic" && (
                <div
                  ref={frameRef}
                  onMouseMove={onMouseMove}
                  className="schematic-frame group relative aspect-[4/3] overflow-hidden rounded"
                >
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={`${project.name} architecture schematic`}
                      loading="lazy"
                      decoding="async"
                      className="schematic-img h-full w-full object-cover"
                    />
                  ) : (
                    <SchematicFallback index={index} />
                  )}
                  <div className="schematic-scan" />

                  {/* Interactive Crosshair Coordinates HUD */}
                  <div className="pointer-events-none absolute bottom-3 left-3 z-10 flex items-center gap-2 rounded border border-line/80 bg-void/80 px-2.5 py-1 font-mono text-[9px] text-volt backdrop-blur-xs">
                    <span>GRID RETICLE</span>
                    <span>X: {coords.x}</span>
                    <span>Y: {coords.y}</span>
                  </div>

                  {/* Blueprint Hotspots */}
                  <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5">
                    {["INPUT SPEC", "AI ENGINE", "OUTPUT TREE"].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setActiveHotspot(activeHotspot === tag ? null : tag)}
                        className={`rounded border px-2 py-0.5 text-left font-mono text-[8px] tracking-wider transition-colors ${
                          activeHotspot === tag
                            ? "border-volt bg-volt text-void font-bold"
                            : "border-line bg-void/80 text-mute hover:text-volt"
                        }`}
                      >
                        ● {tag}
                      </button>
                    ))}
                  </div>

                  {/* Active Hotspot Info Overlay */}
                  {activeHotspot && (
                    <div className="absolute inset-x-4 bottom-12 z-20 rounded border border-volt bg-void/95 p-3 text-xs backdrop-blur-md">
                      <div className="flex items-center justify-between font-mono text-[9px] text-volt">
                        <span>HOTSPOT INSPECTION: {activeHotspot}</span>
                        <button
                          type="button"
                          onClick={() => setActiveHotspot(null)}
                          className="text-mute hover:text-ink"
                        >
                          ✕
                        </button>
                      </div>
                      <p className="mt-1 text-ink text-[11px]">
                        Active architectural node in the {project.name} execution stack.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {mode === "architecture" && (
                <div className="aspect-[4/3] overflow-y-auto rounded border border-line bg-void/80 p-5 font-mono">
                  <div className="mb-4 flex items-center justify-between border-b border-line pb-2">
                    <span className="text-[10px] text-volt uppercase">
                      PIPELINE LAYERS · RECURSIVE ARCHITECTURE
                    </span>
                    <span className="text-[9px] text-mute">{meta.architectureLayers.length} NODES</span>
                  </div>
                  <div className="space-y-3">
                    {meta.architectureLayers.map((layer) => (
                      <div key={layer.name} className="rounded border border-line/70 bg-panel/30 p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-ink">{layer.name}</span>
                          <span className="text-[9px] text-volt">{layer.tech}</span>
                        </div>
                        <p className="mt-1 text-[11px] text-mute">{layer.role}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {mode === "telemetry" && (
                <div className="aspect-[4/3] overflow-y-auto rounded border border-line bg-void/80 p-5 font-mono">
                  <div className="mb-4 flex items-center justify-between border-b border-line pb-2">
                    <span className="text-[10px] text-volt uppercase">
                      SYSTEM TELEMETRY & RUNTIME BENCHMARKS
                    </span>
                    <span className="text-[9px] text-volt">ONLINE</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {meta.telemetry.map((t) => (
                      <div key={t.label} className="rounded border border-line/60 bg-panel/30 p-3">
                        <span className="text-[9px] text-mute uppercase">{t.label}</span>
                        <p className="mt-1.5 text-xs font-semibold text-ink">{t.value}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-6 border-t border-line/60 pt-3 text-[10px] text-mute">
                    Validated against reproducible benchmarks in containerized test harnesses.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Projects() {
  return (
    <VerticalPin
      id="work"
      index="04"
      title="Personal Work"
      kicker={site.projects.kicker}
      labels={site.projects.items.map((p) => p.short)}
    >
      {site.projects.items.map((p, i) => (
        <ProjectPanel key={p.name} project={p} index={i} />
      ))}
    </VerticalPin>
  );
}

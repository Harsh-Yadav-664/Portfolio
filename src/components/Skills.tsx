import { useEffect, useMemo, useState } from "react";
import { site } from "../data/resume";
import { useScramble } from "../lib/motion";
import { ChapterHead, GhostNum, NetworkGlyph } from "./ui";

/* ═════════════════════════════════════════════════════════════
   TELEMETRY STACK RACK
   ─────────────────────────────────────────────────────────────
   - Every technology name is 100% visible while scrolling.
   - Organized into 5 illuminated hardware racks with live meters.
   - Interactive inspection HUD decodes real-time project links.
   - Auto-sweep or hover drives deep telemetry without hiding
     skills from casual scrollers.
═════════════════════════════════════════════════════════════ */

type Channel = {
  id: number;
  name: string;
  group: string;
  usedIn: string[];
};

function buildChannels(): Channel[] {
  const sources: { label: string; stack: readonly string[] }[] = [
    ...site.projects.items.map((p) => ({ label: p.name, stack: p.stack })),
    ...site.experience.entries.flatMap((e) =>
      e.deliverables.map((d) => ({ label: d.name, stack: d.stack })),
    ),
  ];

  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const out: Channel[] = [];
  let id = 0;
  site.skills.groups.forEach((g) => {
    g.items.forEach((item) => {
      const key = norm(item);
      const used = sources
        .filter((src) =>
          src.stack.some((t) => {
            const k = norm(t);
            return k === key || k.includes(key) || key.includes(k);
          }),
        )
        .map((s) => s.label);
      out.push({ id: id++, name: item, group: g.name, usedIn: Array.from(new Set(used)) });
    });
  });
  return out;
}

/* animated audio/signal meter — staggers bars based on seed */
function SignalBars({ seed, active }: { seed: number; active: boolean }) {
  const bars = 18;
  return (
    <div className="flex h-8 items-end gap-[2px]" aria-hidden="true">
      {Array.from({ length: bars }).map((_, i) => {
        const heightPct = ((Math.sin(seed * 1.5 + i * 0.8) + 1) / 2) * 75 + 15;
        return (
          <span
            key={i}
            className="w-[2px] bg-volt transition-[height,opacity] duration-500 ease-out"
            style={{
              height: `${active ? heightPct : heightPct * 0.3}%`,
              opacity: active ? 0.3 + (i % 3) * 0.3 : 0.15,
              transitionDelay: `${i * 18}ms`,
            }}
          />
        );
      })}
    </div>
  );
}

function HudReadout({ channel }: { channel: Channel }) {
  const decoded = useScramble(channel.name, true, 40);
  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <span className="dot-pulse h-1.5 w-1.5 rounded-full bg-volt" />
            <span className="font-mono text-[9px] tracking-[0.25em] text-volt">LIVE TELEMETRY</span>
          </div>
          <span className="font-mono text-[9px] tracking-[0.2em] text-mute">
            CH {String(channel.id + 1).padStart(2, "0")} / 35
          </span>
        </div>

        <div className="mt-5">
          <span className="inline-block border border-volt/30 bg-volt/10 px-2 py-0.5 font-mono text-[9px] tracking-[0.2em] text-volt">
            {channel.group.toUpperCase()}
          </span>
          <h3 className="mt-3 min-h-[1.9em] font-display text-[clamp(1.75rem,3.6vw,2.8rem)] italic leading-[1.05] tracking-tight">
            {decoded}
          </h3>
        </div>
      </div>

      <div className="my-6">
        <div className="mb-2 flex items-center justify-between font-mono text-[9px] text-mute">
          <span>SIGNAL FREQUENCY</span>
          <span className="text-volt">OPTIMAL</span>
        </div>
        <SignalBars seed={channel.id + 7} active />
      </div>

      <div className="border-t border-line pt-4">
        <p className="font-mono text-[9px] tracking-[0.25em] text-mute uppercase">
          VERIFIED DEPLOYMENTS
        </p>
        {channel.usedIn.length > 0 ? (
          <ul className="mt-3 space-y-1.5">
            {channel.usedIn.map((u) => (
              <li key={u} className="flex items-start gap-2 text-xs leading-relaxed text-ink">
                <span className="mt-0.5 font-mono text-[9px] text-volt">▸</span>
                <span>{u}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-xs leading-relaxed text-mute italic">
            Cross-cutting capability deployed across automation, CLI tooling & research.
          </p>
        )}
      </div>
    </div>
  );
}

export function Skills() {
  const channels = useMemo(buildChannels, []);
  const [active, setActive] = useState(0);
  const [filter, setFilter] = useState<string>("ALL");
  const [auto, setAuto] = useState(true);

  // spectrum analyser auto-cycle when not hovered
  useEffect(() => {
    if (!auto) return;
    const id = window.setInterval(() => {
      setActive((a) => (a + 1) % channels.length);
    }, 2800);
    return () => window.clearInterval(id);
  }, [auto, channels.length]);

  const current = channels[active] ?? channels[0];

  const groupNames = useMemo(
    () => ["ALL", ...site.skills.groups.map((g) => g.name)],
    [],
  );

  const displayedGroups = useMemo(() => {
    if (filter === "ALL") return site.skills.groups;
    return site.skills.groups.filter((g) => g.name === filter);
  }, [filter]);

  return (
    <section id="stack" className="relative scroll-mt-16 border-t border-line">
      <GhostNum n="02" />
      <div className="relative mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-32">
        <ChapterHead
          index="02"
          title="Stack"
          kicker={site.skills.kicker}
          note="Modular architecture across AI, systems, and cloud infrastructure"
        />

        {/* ── Quick Domain Filter Tabs ── */}
        <div className="mb-8 flex flex-wrap items-center gap-2 border-b border-line pb-5">
          <span className="mr-3 font-mono text-[10px] tracking-[0.25em] text-mute">
            RACK FILTER:
          </span>
          {groupNames.map((gn) => {
            const on = filter === gn;
            return (
              <button
                key={gn}
                type="button"
                onClick={() => setFilter(gn)}
                data-cursor
                className={`rounded px-3 py-1 font-mono text-[10px] tracking-[0.16em] transition-all duration-300 ${
                  on
                    ? "bg-volt text-void font-bold shadow-[0_0_12px_var(--glow)]"
                    : "border border-line text-mute hover:border-volt/50 hover:text-ink"
                }`}
              >
                {gn.toUpperCase()}
              </button>
            );
          })}
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* ── All Skill Channels: Clearly Readable Hardware Racks ── */}
          <div
            className="edge-box border border-line bg-panel/30 p-5 md:p-8 lg:col-span-8"
            onMouseEnter={() => setAuto(false)}
            onMouseLeave={() => setAuto(true)}
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-volt dot-pulse" />
                <span className="font-mono text-[10px] tracking-[0.25em] text-mute">
                  ILLUMINATED MODULE RACKS · {channels.length} MODULES ONLINE
                </span>
              </div>
              <span className="font-mono text-[9px] tracking-[0.2em] text-volt">
                {auto ? "AUTO-SWEEPER ENGAGED" : "MANUAL INSPECTOR"}
              </span>
            </div>

            <div className="mt-7 space-y-8">
              {displayedGroups.map((group) => {
                const groupItems = channels.filter((c) => c.group === group.name);
                return (
                  <div key={group.name} className="relative">
                    <div className="mb-3.5 flex items-baseline justify-between border-b border-line/50 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="h-1 w-3 bg-volt" />
                        <h4 className="font-mono text-[11px] font-bold tracking-[0.22em] text-volt">
                          {group.name.toUpperCase()}
                        </h4>
                      </div>
                      <span className="font-mono text-[9px] tracking-[0.2em] text-mute">
                        {groupItems.length} UNITS
                      </span>
                    </div>

                    {/* Skill Pills: Full name clearly readable while scrolling! */}
                    <div className="flex flex-wrap gap-2.5">
                      {groupItems.map((c) => {
                        const isSelected = c.id === current.id;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onMouseEnter={() => setActive(c.id)}
                            onFocus={() => setActive(c.id)}
                            onClick={() => setActive(c.id)}
                            data-cursor={c.name}
                            className={`group relative flex items-center gap-2.5 rounded border px-3.5 py-2 transition-all duration-300 ${
                              isSelected
                                ? "border-volt bg-volt text-void font-bold shadow-[0_0_16px_var(--glow)] scale-[1.02]"
                                : "border-line bg-void/60 text-ink hover:border-volt/60 hover:bg-panel"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                                isSelected ? "bg-void" : "bg-volt/60 group-hover:bg-volt"
                              }`}
                            />
                            <span className="font-mono text-[11px] tracking-[0.06em]">
                              {c.name}
                            </span>
                            {c.usedIn.length > 0 && (
                              <span
                                className={`rounded px-1.5 py-0.2 font-mono text-[8px] uppercase tracking-wider ${
                                  isSelected
                                    ? "bg-void/20 text-void"
                                    : "border border-line bg-panel text-mute group-hover:text-volt"
                                }`}
                              >
                                {c.usedIn.length} {c.usedIn.length === 1 ? "build" : "builds"}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mt-8 border-t border-line pt-4 font-mono text-[10px] tracking-[0.2em] text-mute">
              HOVER OR CLICK ANY MODULE TO INSPECT DEPLOYMENT TRACE
            </p>
          </div>

          {/* ── Sticky Telemetry HUD Readout ── */}
          <div className="lg:col-span-4">
            <div className="edge-box-rev sticky top-24 border border-line bg-panel/40 p-6 md:p-7 backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[0.25em] text-mute">
                  DECODER HUD
                </span>
                <NetworkGlyph className="h-12 w-12 text-volt opacity-80" />
              </div>
              <HudReadout channel={current} />
            </div>
          </div>
        </div>

        {/* Focus telemetry footer */}
        <div className="mt-12 flex flex-wrap items-center gap-4 rounded border border-line bg-panel/20 p-4 font-mono text-[11px]">
          <span className="border border-volt/40 bg-volt/10 px-2 py-0.5 text-[9px] tracking-[0.2em] text-volt">
            CURRENT LAB FOCUS
          </span>
          <span className="text-mute">{site.skills.currently}</span>
        </div>
      </div>

      {/* Marquee ticker of skills continuously looping */}
      <div className="marquee border-y border-line bg-panel/30 py-5">
        <div className="marquee-track" style={{ animationDuration: "50s" }}>
          {[0, 1].map((dup) => (
            <div
              key={dup}
              className="flex shrink-0 items-center"
              aria-hidden={dup === 1 || undefined}
            >
              {channels.map((c) => (
                <span key={c.id} className="flex items-center">
                  <span
                    className={`px-5 font-display text-2xl italic transition-colors duration-300 md:text-4xl ${
                      c.id === current.id ? "text-volt font-bold" : "ghost"
                    }`}
                  >
                    {c.name}
                  </span>
                  <span className="text-sm text-volt opacity-50">✳</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { prefersReducedMotion, useInViewOnce, useReveal, useScramble } from "../lib/motion";

/* ═════════════════════════════════════════════════════════════
   SHARED UI PRIMITIVES — marquee, scramble text, section heads,
   cursor, scroll progress, magnetic wrapper, icons.
═════════════════════════════════════════════════════════════ */

/* ── infinite marquee (pauses on hover) ── */
export function Marquee({
  items,
  speed = 30,
  reverse = false,
  separator,
  renderItem,
  className = "",
}: {
  items: readonly string[];
  speed?: number;
  reverse?: boolean;
  separator?: ReactNode;
  renderItem?: (item: string, i: number) => ReactNode;
  className?: string;
}) {
  const Row = ({ hidden }: { hidden?: boolean }) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((it, i) => (
        <span key={i} className="flex items-center">
          {renderItem ? (
            renderItem(it, i)
          ) : (
            <span className="px-6 font-mono text-xs tracking-[0.3em] text-mute">{it}</span>
          )}
          {separator}
        </span>
      ))}
    </div>
  );
  return (
    <div className={`marquee ${reverse ? "marquee-reverse" : ""} ${className}`}>
      <div className="marquee-track" style={{ animationDuration: `${speed}s` }}>
        <Row />
        <Row hidden />
      </div>
    </div>
  );
}

/* ── scramble-decode monospace text ── */
export function ScrambleText({
  text,
  className = "",
  start = true,
  delay = 0,
}: {
  text: string;
  className?: string;
  start?: boolean;
  delay?: number;
}) {
  const { ref, inView } = useInViewOnce<HTMLSpanElement>(0.6);
  const out = useScramble(text, start && inView, delay);
  return (
    <span ref={ref} aria-label={text} className={className}>
      {out}
    </span>
  );
}

/* ── volt underline that draws itself ── */
export function Underline({ children }: { children: ReactNode }) {
  return (
    <span className="draw-underline text-ink">
      {children}
      <svg viewBox="0 0 300 10" preserveAspectRatio="none" aria-hidden="true">
        <path pathLength={320} d="M2 7 C 60 2, 150 9, 298 4" />
      </svg>
    </span>
  );
}

/* ── giant outlined ghost section numeral ── */
export function GhostNum({ n }: { n: string }) {
  return (
    <span
      aria-hidden
      className="ghost pointer-events-none absolute right-2 top-8 select-none font-display leading-none text-[24vw] md:text-[13vw]"
    >
      {n}
    </span>
  );
}

/* ── chapter header: unmissable section identity ── */
export function ChapterHead({
  index,
  title,
  kicker,
  note,
}: {
  index: string;
  title: string;
  kicker?: string;
  note?: string;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="rv mb-14 border-b border-line pb-8 md:mb-20 md:pb-10">
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs tracking-[0.25em] text-volt">({index})</span>
        <span className="h-px w-10 bg-volt md:w-14" />
        {kicker && (
          <span className="font-mono text-[10px] tracking-[0.28em] text-mute">{kicker}</span>
        )}
      </div>
      <h2 className="mt-5 font-display text-[clamp(2.8rem,8vw,6.5rem)] italic leading-[0.88] tracking-tight">
        {title}
      </h2>
      {note && (
        <p className="mt-4 max-w-md font-mono text-[11px] leading-relaxed tracking-[0.18em] text-mute uppercase">
          {note}
        </p>
      )}
    </div>
  );
}

/** @deprecated use ChapterHead — kept so older sections keep compiling */
export function SectionHead({ index, title, note }: { index: string; title: string; note?: string }) {
  return <ChapterHead index={index} title={title} note={note} />;
}

/* ── custom cursor: volt dot + trailing ring ── */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    document.documentElement.classList.add("has-cursor");
    let x = -100;
    let y = -100;
    let rx = -100;
    let ry = -100;
    let raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const hit = (e.target as HTMLElement | null)?.closest?.(
        "a, button, [data-cursor]"
      );
      ring.classList.toggle("is-hover", Boolean(hit));
    };
    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      dot.style.transform = `translate3d(${x - 3}px, ${y - 3}px, 0)`;
      const half = ring.classList.contains("is-hover") ? 29 : 17;
      ring.style.transform = `translate3d(${rx - half}px, ${ry - half}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}

/* ── volt scroll-progress hairline ── */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        if (bar.current)
          bar.current.style.transform = `scaleX(${max ? h.scrollTop / max : 0})`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div
      ref={bar}
      aria-hidden
      className="fixed inset-x-0 top-0 z-[80] h-0.5 origin-left bg-volt"
      style={{ transform: "scaleX(0)" }}
    />
  );
}

/* ── magnetic wrapper (leans toward the cursor) ── */
export function Magnetic({
  children,
  className = "",
  strength = 0.28,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) return;
    const el = ref.current;
    if (!el) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = Math.max(-14, Math.min(14, (e.clientX - (r.left + r.width / 2)) * strength));
      const dy = Math.max(-12, Math.min(12, (e.clientY - (r.top + r.height / 2)) * strength));
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    };
    const leave = () => {
      el.style.transform = "translate(0px, 0px)";
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [strength]);
  return (
    <div
      ref={ref}
      className={`inline-block transition-transform duration-300 ease-out will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}

/* ── inline icons (hand-tuned strokes, no icon library) ── */
export function ArrowUpRight({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function ArrowDown({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 4v16m0 0l-6-6m6 6l6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function ArrowUp({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 20V4m0 0l-6 6m6-6l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
/* agent-network glyph — satellites around a core node, counter-rotating rings */
export function NetworkGlyph({ className = "h-24 w-24" }: { className?: string }) {
  const sats = [0, 60, 120, 180, 240, 300];
  return (
    <svg viewBox="0 0 96 96" fill="none" className={className} aria-hidden="true">
      <g
        className="spin-slow"
        style={{ transformOrigin: "48px 48px", transformBox: "view-box" } as CSSProperties}
      >
        <circle cx="48" cy="48" r="38" stroke="currentColor" strokeWidth="0.7" strokeDasharray="2 6" opacity="0.55" />
      </g>
      <g
        className="spin-slow"
        style={
          {
            transformOrigin: "48px 48px",
            transformBox: "view-box",
            animationDirection: "reverse",
            animationDuration: "22s",
          } as CSSProperties
        }
      >
        <circle cx="48" cy="48" r="26" stroke="currentColor" strokeWidth="0.7" opacity="0.3" />
        {sats.map((a, i) => {
          const r = (a * Math.PI) / 180;
          const x = 48 + Math.cos(r) * 38;
          const y = 48 + Math.sin(r) * 38;
          return (
            <g key={a}>
              <line x1="48" y1="48" x2={x} y2={y} stroke="currentColor" strokeWidth="0.6" opacity={i % 2 ? 0.25 : 0.5} />
              <rect
                x={x - 3}
                y={y - 3}
                width="6"
                height="6"
                transform={`rotate(45 ${x} ${y})`}
                stroke="currentColor"
                strokeWidth="1.1"
                fill="var(--color-void)"
                opacity={i % 2 ? 0.55 : 0.95}
              />
            </g>
          );
        })}
      </g>
      <circle cx="48" cy="48" r="5" fill="currentColor" />
      <circle cx="48" cy="48" r="9" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
    </svg>
  );
}

export function Asterisk({ className = "h-16 w-16" }: { className?: string }) {
  return <NetworkGlyph className={className} />;
}

/* ── small shared helpers ── */
export function Reveal({
  children,
  className = "",
  delay = 0,
  style,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  style?: CSSProperties;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`rv ${className}`} style={{ ...style, transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

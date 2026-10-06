import { Children, useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { prefersReducedMotion, usePrefersReducedMotion } from "../lib/motion";

/* ═════════════════════════════════════════════════════════════
   VERTICAL PIN
   ─────────────────────────────────────────────────────────────
   While the section is pinned, scrolling steps through slides
   IN PLACE, vertically. There are no inner scrollbars: a slide
   taller than the viewport simply buys extra scroll distance,
   and its content pans gently before the next slide arrives.

   Wheel/touch always drives the PAGE (no trapped scrolling) —
   the stage itself never scrolls internally.

   Add as many children as you like; the pin measures and grows.
   Reduced-motion users get a plain stacked layout.
═════════════════════════════════════════════════════════════ */

type Geom = {
  vh: number;
  viewH: number;
  adv: number;
  pans: number[];
  starts: number[];
  total: number;
};

export function VerticalPin({
  id,
  index,
  title,
  kicker,
  labels,
  children,
  scene,
  variant = "default",
}: {
  id: string;
  index: string;
  title: string;
  kicker?: string;
  labels: readonly string[];
  children: ReactNode;
  scene?: ReactNode;
  variant?: "default" | "inverted";
}) {
  const isInverted = variant === "inverted";
  const panels = Children.toArray(children);
  const count = panels.length;
  const reduced = usePrefersReducedMotion();

  const outerRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const footRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const slideEls = useRef<Array<HTMLDivElement | null>>([]);
  const innerEls = useRef<Array<HTMLDivElement | null>>([]);
  const geomRef = useRef<Geom>({ vh: 0, viewH: 0, adv: 0, pans: [], starts: [], total: 0 });
  const [active, setActive] = useState(0);
  const [sectionH, setSectionH] = useState<number | undefined>(undefined);

  const measure = useCallback(() => {
    const outer = outerRef.current;
    if (!outer) return;
    const vh = window.innerHeight;
    const headH = headRef.current?.offsetHeight ?? 0;
    const footH = footRef.current?.offsetHeight ?? 0;
    const viewH = Math.max(120, vh - headH - footH);
    // size every slide to the exact inner viewport so steps align pixel-perfectly
    slideEls.current.forEach((el) => {
      if (el) el.style.height = `${viewH}px`;
    });
    const pans = innerEls.current.map((el) => {
      if (!el) return 0;
      el.style.transform = "translate3d(0,0,0)";
      const overflow = el.scrollHeight - viewH;
      return overflow > 4 ? overflow + 12 : 0;
    });
    const adv = vh * 0.8;
    const starts: number[] = [];
    let total = 0;
    for (let i = 0; i < count; i++) {
      starts.push(total);
      total += pans[i];
      if (i < count - 1) total += adv;
    }
    geomRef.current = { vh, viewH, adv, pans, starts, total };
    innerEls.current.forEach((el, i) => {
      if (el) el.style.justifyContent = pans[i] > 0 ? "flex-start" : "center";
    });
    setSectionH(vh + total);
    // re-apply for the current scroll position next frame
    requestAnimationFrame(() => apply());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const apply = useCallback(() => {
    const outer = outerRef.current;
    const track = trackRef.current;
    const g = geomRef.current;
    if (!outer || !track || !g.total) return;
    const consumed = Math.min(g.total, Math.max(0, -outer.getBoundingClientRect().top));

    let rem = consumed;
    let idx = 0;
    let trackY = 0;
    const offsets = new Array<number>(count).fill(0);
    let settled = false;

    for (let i = 0; i < count && !settled; i++) {
      const pan = g.pans[i];
      if (rem <= pan) {
        idx = i;
        offsets[i] = rem;
        trackY = -i * g.viewH;
        settled = true;
        break;
      }
      rem -= pan;
      offsets[i] = pan;
      if (i === count - 1) {
        idx = i;
        trackY = -i * g.viewH;
        settled = true;
        break;
      }
      if (rem <= g.adv) {
        const t = rem / g.adv;
        idx = t < 0.5 ? i : i + 1;
        trackY = -(i * g.viewH + t * g.viewH);
        settled = true;
        break;
      }
      rem -= g.adv;
    }

    track.style.transform = `translate3d(0, ${trackY}px, 0)`;
    innerEls.current.forEach((el, i) => {
      if (!el) return;
      el.style.transform = `translate3d(0, ${-offsets[i]}px, 0)`;
      el.style.opacity = i === idx ? "1" : "0.28";
    });
    slideEls.current.forEach((el, i) => {
      if (el) el.setAttribute("aria-hidden", String(i !== idx));
    });
    if (barRef.current) barRef.current.style.transform = `scaleX(${consumed / g.total})`;
    setActive((a) => (a === idx ? a : idx));
  }, [count]);

  useEffect(() => {
    if (reduced || count <= 1) return;
    measure();

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(apply);
    };
    const onResize = () => {
      measure();
      raf = requestAnimationFrame(apply);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    const ro = new ResizeObserver(() => measure());
    innerEls.current.forEach((el) => el && ro.observe(el));
    if (document.fonts?.ready) document.fonts.ready.then(() => measure()).catch(() => {});
    const imgs = outerRef.current?.querySelectorAll("img") ?? [];
    imgs.forEach((img) => img.addEventListener("load", measure, { once: true }));

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      imgs.forEach((img) => img.removeEventListener("load", measure));
    };
  }, [reduced, count, measure, apply]);

  const jump = useCallback((i: number) => {
    const outer = outerRef.current;
    if (!outer) return;
    const g = geomRef.current;
    const top = outer.getBoundingClientRect().top + window.scrollY + (g.starts[i] ?? 0);
    window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, []);

  /* ── shared chrome ── */
  const header = (
    <div
      ref={headRef}
      className={`relative z-20 flex shrink-0 items-end justify-between gap-6 px-5 pb-4 pt-[4.5rem] md:px-10 md:pb-5 md:pt-24 ${
        isInverted ? "border-b border-void/20" : "border-b border-line"
      }`}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <span className={`font-mono text-[11px] tracking-[0.25em] ${isInverted ? "text-void font-bold" : "text-volt"}`}>
            ({index})
          </span>
          <span className={`h-px w-8 md:w-12 ${isInverted ? "bg-void" : "bg-volt"}`} />
          {kicker && (
            <span className={`hidden truncate font-mono text-[10px] tracking-[0.22em] sm:inline ${
              isInverted ? "text-void/70" : "text-mute"
            }`}>
              {kicker}
            </span>
          )}
        </div>
        <h2 className={`mt-2 font-display text-[clamp(2.1rem,5.2vw,4.2rem)] italic leading-[0.9] tracking-tight ${
          isInverted ? "text-void" : "text-ink"
        }`}>
          {title}
        </h2>
      </div>
      <div className={`hidden shrink-0 items-center gap-3 font-mono text-[11px] tracking-[0.22em] sm:flex ${
        isInverted ? "text-void/70" : "text-mute"
      }`}>
        <span className={`tabular-nums ${isInverted ? "text-void font-bold" : "text-volt"}`}>
          {String(active + 1).padStart(2, "0")}
        </span>
        <span>/</span>
        <span className="tabular-nums">{String(count).padStart(2, "0")}</span>
      </div>
    </div>
  );

  const footer = (
    <div
      ref={footRef}
      className={`relative z-20 flex shrink-0 items-center justify-between gap-4 px-5 py-3 md:px-10 ${
        isInverted ? "border-t border-void/20" : "border-t border-line"
      }`}
    >
      <span className={`hidden font-mono text-[10px] tracking-[0.22em] lg:inline ${
        isInverted ? "text-void/70" : "text-mute"
      }`}>
        CONTINUE SCROLLING TO ADVANCE
      </span>
      <span className={`font-mono text-[10px] tracking-[0.22em] lg:hidden ${
        isInverted ? "text-void/70" : "text-mute"
      }`}>
        {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
      </span>

      {/* clickable chapter index */}
      <div className="flex items-center justify-center gap-1.5 overflow-x-auto lg:gap-3">
        {labels.map((label, i) => (
          <button
            key={label + i}
            type="button"
            aria-label={`Go to ${label}`}
            aria-current={i === active}
            onClick={() => jump(i)}
            data-cursor
            className="group flex shrink-0 items-center gap-2"
          >
            <span
              className={`font-mono text-[9px] tracking-[0.18em] transition-colors duration-300 md:text-[10px] ${
                isInverted
                  ? i === active
                    ? "text-void font-bold underline underline-offset-4"
                    : "text-void/60 hover:text-void"
                  : i === active
                    ? "text-volt"
                    : "text-mute group-hover:text-ink"
              }`}
            >
              <span className="mr-1 opacity-70">{String(i + 1).padStart(2, "0")}</span>
              <span className="hidden md:inline">{label.toUpperCase()}</span>
            </span>
            {i < labels.length - 1 && (
              <span className={`hidden h-px w-3 md:inline ${isInverted ? "bg-void/20" : "bg-line"}`} />
            )}
          </button>
        ))}
      </div>

      <span className={`hidden w-[150px] text-right font-mono text-[10px] tracking-[0.22em] lg:inline ${
        isInverted ? "text-void/70" : "text-mute"
      }`}>
        <span className={`tabular-nums ${isInverted ? "text-void font-bold" : "text-volt"}`}>
          {String(active + 1).padStart(2, "0")}
        </span>
        {" / "}
        <span className="tabular-nums">{String(count).padStart(2, "0")}</span>
      </span>
    </div>
  );

  /* ── reduced motion / single slide: simple stacked document ── */
  if (reduced || count <= 1) {
    return (
      <section
        id={id}
        className={`relative scroll-mt-16 ${
          isInverted ? "bg-volt text-void border-t border-void/20" : "border-t border-line"
        }`}
      >
        {header}
        <div className={`divide-y ${isInverted ? "divide-void/20" : "divide-line"}`}>
          {panels.map((panel, i) => (
            <div key={labels[i] ?? i} className="py-16">
              {panel}
            </div>
          ))}
        </div>
        {footer}
      </section>
    );
  }

  return (
    <section
      id={id}
      ref={outerRef}
      className={`relative ${
        isInverted ? "border-t border-void/20" : "border-t border-line"
      }`}
      style={{ height: sectionH ? `${sectionH}px` : `${count * 100}vh` }}
      aria-label={title}
    >
      <div className={`pin-stage flex flex-col ${isInverted ? "bg-volt text-void" : "bg-void text-ink"}`}>
        {/* left spine — track + progress fill */}
        <div
          aria-hidden
          className={`pointer-events-none absolute top-0 left-0 z-30 h-full w-[2px] ${
            isInverted ? "bg-void/20" : "bg-line"
          }`}
        />

        {scene && (
          <div
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              maskImage: "radial-gradient(ellipse 70% 70% at 75% 50%, black 30%, transparent 75%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 70% 70% at 75% 50%, black 30%, transparent 75%)",
            }}
          >
            {scene}
          </div>
        )}

        {header}

        <div className="relative z-10 min-h-0 flex-1 overflow-hidden">
          <div ref={trackRef} className="absolute inset-x-0 top-0 will-change-transform">
            {panels.map((panel, i) => (
              <div
                key={labels[i] ?? i}
                ref={(el) => {
                  slideEls.current[i] = el;
                }}
                className="pin-slide"
                role="group"
                aria-label={labels[i]}
                aria-hidden={i !== 0}
              >
                <div
                  ref={(el) => {
                    innerEls.current[i] = el;
                  }}
                  className="pin-slide-inner"
                >
                  {panel}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* progress hairline along the left spine */}
        <div
          className={`absolute top-0 left-[2px] z-30 h-full w-px ${
            isInverted ? "bg-void/10" : "bg-line/40"
          }`}
          aria-hidden
        />
        <div
          ref={barRef}
          className={`absolute top-0 left-[2px] z-30 w-px origin-top ${
            isInverted ? "bg-void" : "bg-volt"
          }`}
          style={{ height: "100%", transform: "scaleY(0)" }}
          aria-hidden
        />

        {footer}
      </div>
    </section>
  );
}

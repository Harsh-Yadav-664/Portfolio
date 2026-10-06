import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

/* ═════════════════════════════════════════════════════════════
   MOTION LIBRARY — reveal, scramble, count-up, clock, progress.
   All hooks respect `prefers-reduced-motion`.
═════════════════════════════════════════════════════════════ */

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(prefersReducedMotion);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fn = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return reduced;
}

/** Attach to any element with class `rv` — adds `is-in` when scrolled into view. */
export function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.15): RefObject<T | null> {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("is-in");
            io.disconnect();
          }
        });
      },
      { threshold, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return ref;
}

/** Boolean in-view flag (one-shot) — drives count-ups and scramble triggers. */
export function useInViewOnce<T extends HTMLElement = HTMLDivElement>(threshold = 0.4): {
  ref: RefObject<T | null>;
  inView: boolean;
} {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        });
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const SCRAMBLE_POOL = "!<>-_\\/[]{}=+*^?#░▒▓·";

/**
 * Scramble-decode text effect. Before activation it renders the text as
 * spaces (identical width in monospace fonts), then decodes left → right.
 */
export function useScramble(text: string, active: boolean, delay = 0): string {
  const blank = text.replace(/\S/g, " ");
  const [out, setOut] = useState(blank);
  useEffect(() => {
    if (!active) return;
    if (prefersReducedMotion()) {
      setOut(text);
      return;
    }
    let raf = 0;
    let frame = 0;
    const totalFrames = Math.max(18, Math.round(text.length * 1.35));
    const tick = () => {
      frame += 1;
      const p = frame / totalFrames;
      const resolved = Math.floor(p * text.length);
      let s = text.slice(0, resolved);
      for (let i = resolved; i < text.length; i++) {
        const c = text[i];
        s += c === " " ? " " : SCRAMBLE_POOL[(Math.random() * SCRAMBLE_POOL.length) | 0];
      }
      setOut(s);
      if (frame < totalFrames) raf = requestAnimationFrame(tick);
      else setOut(text);
    };
    const t = window.setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      window.clearTimeout(t);
      cancelAnimationFrame(raf);
    };
  }, [active, text, delay]);
  return active ? out : blank;
}

/** Eased count-up from 0 → target once `active` is true. */
export function useCountUp(target: number, active: boolean, duration = 1600): number {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (prefersReducedMotion()) {
      setV(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setV(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return v;
}

/** Live clock string (24h) for a given IANA timezone. */
export function useClock(timeZone = "Asia/Kolkata"): string {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return now.toLocaleTimeString("en-GB", { timeZone, hour12: false });
}

/** 0 → 1 scroll progress through an element's viewport height. */
export function useScrollProgress(ref: RefObject<HTMLElement | null>): number {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const passed = Math.min(Math.max(vh * 0.75 - r.top, 0), r.height);
        setP(r.height ? passed / r.height : 0);
      });
    };
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(raf);
    };
  }, [ref]);
  return p;
}

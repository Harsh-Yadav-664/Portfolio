/* ═════════════════════════════════════════════════════════════
   THEME — two art-directed palettes, one toggle.
   ─────────────────────────────────────────────────────────────
   "dark"  → console obsidian + volt lime   (default)
   "light" → cream paper + roasted espresso

   The palette lives as CSS custom properties (see src/index.css),
   so every Tailwind utility, the WebGL scenes and the SVG diagrams
   all repaint from a single source. Components subscribe with
   `useTheme()`; 3D materials subscribe with `usePalette()`.
═════════════════════════════════════════════════════════════ */

import { useEffect, useState } from "react";

export type ThemeName = "dark" | "light";

const STORAGE_KEY = "hy-color-scheme";
const EVENT = "hy-theme-change";

export function readCssVar(name: string, fallback = "#ffffff"): string {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

export function getTheme(): ThemeName {
  if (typeof document === "undefined") return "dark";
  return (document.documentElement.dataset.theme as ThemeName) || "dark";
}

export function applyTheme(theme: ThemeName) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* private mode */
  }
  document.dispatchEvent(new CustomEvent(EVENT, { detail: theme }));
}

export function initTheme() {
  let saved: ThemeName | null = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY) as ThemeName | null;
  } catch {
    saved = null;
  }
  const prefersLight =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: light)").matches;
  applyTheme(saved ?? (prefersLight ? "light" : "dark"));
}

/** Reactive theme state for React components. */
export function useTheme(): [ThemeName, (t: ThemeName) => void] {
  const [theme, setTheme] = useState<ThemeName>(() => getTheme());

  useEffect(() => {
    const onChange = (e: Event) => setTheme((e as CustomEvent).detail as ThemeName);
    document.addEventListener(EVENT, onChange);
    return () => document.removeEventListener(EVENT, onChange);
  }, []);

  return [theme, applyTheme];
}

/** Reactive palette for WebGL / SVG materials. */
export type ScenePalette = {
  volt: string;
  core: string;
  key: string;
  rim: string;
  schematic: string;
};

function paletteNow(): ScenePalette {
  return {
    volt: readCssVar("--color-volt", "#c9f542"),
    core: readCssVar("--scene-core", "#14171f"),
    key: readCssVar("--scene-key", "#d9ff62"),
    rim: readCssVar("--scene-rim", "#93a0b8"),
    schematic: readCssVar("--scene-schematic", "#0d0f14"),
  };
}

export function usePalette(): ScenePalette {
  const [palette, setPalette] = useState<ScenePalette>(() => paletteNow());
  useEffect(() => {
    const onChange = () => setPalette(paletteNow());
    document.addEventListener(EVENT, onChange);
    return () => document.removeEventListener(EVENT, onChange);
  }, []);
  return palette;
}

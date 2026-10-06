import { useEffect, useState } from "react";
import { useTheme } from "../lib/theme";

const LINKS = [
  { n: "01", label: "Profile", href: "#profile" },
  { n: "02", label: "Stack", href: "#stack" },
  { n: "03", label: "Experience", href: "#experience" },
  { n: "04", label: "Work", href: "#work" },
  { n: "05", label: "Recognition", href: "#recognition" },
  { n: "06", label: "Credentials", href: "#credentials" },
  { n: "07", label: "Contact", href: "#contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [theme, setTheme] = useTheme();

  useEffect(() => {
    const ids = LINKS.map((l) => l.href.slice(1));
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      let current = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled ? "border-b border-line bg-void/85 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 md:px-10">
        <a href="#top" className="group flex items-center gap-3" aria-label="Back to top">
          <span className="relative flex h-2.5 w-2.5">
            <span className="dot-pulse absolute inline-flex h-full w-full bg-volt" />
            <span className="relative inline-flex h-2.5 w-2.5 bg-volt" />
          </span>
          <span className="text-sm font-semibold tracking-[0.32em] text-ink transition-colors group-hover:text-volt">
            PORTFOLIO
          </span>
        </a>

        <nav className="hidden items-center gap-6 xl:flex" aria-label="Sections">
          {LINKS.map((l) => {
            const on = active === l.href.slice(1);
            return (
              <a
                key={l.href}
                href={l.href}
                className={`font-mono text-[11px] tracking-[0.16em] transition-colors ${
                  on ? "text-ink" : "text-mute hover:text-ink"
                }`}
              >
                <span className="mr-1 text-volt">{l.n}</span>
                {l.label.toUpperCase()}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            data-cursor
            className="group flex items-center gap-2 border border-line px-3 py-1.5 font-mono text-[10px] tracking-[0.18em] text-mute transition-colors hover:border-volt hover:text-volt"
          >
            {/* sun / moon glyph that rotates between states */}
            <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 transition-transform duration-700 group-hover:rotate-45">
              {theme === "dark" ? (
                <>
                  <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.4" />
                  <path
                    d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4L17 7M7 17l-1.6 1.6"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </>
              ) : (
                <path
                  d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
              )}
            </svg>
            <span className="hidden sm:inline">{theme === "dark" ? "NIGHT" : "DAY"}</span>
          </button>

          <a
            href="#contact"
            data-cursor
            className="flex items-center gap-2 border border-line px-3 py-1.5 font-mono text-[10px] tracking-[0.18em] text-volt transition-colors hover:border-volt"
          >
            <span className="dot-pulse h-1.5 w-1.5 rounded-full bg-volt" />
            <span className="hidden md:inline">OPEN TO WORK</span>
            <span className="md:hidden">OPEN</span>
          </a>
        </div>
      </div>
    </header>
  );
}

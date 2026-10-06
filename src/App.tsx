import { useEffect } from "react";
import { initMouse } from "./lib/mouse";
import { Cursor, ScrollProgress } from "./components/ui";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Skills } from "./components/Skills";
import { Experience } from "./components/Experience";
import { Projects } from "./components/Projects";
import { Achievements } from "./components/Achievements";
import { Credentials } from "./components/Credentials";
import { Contact } from "./components/Contact";

export default function App() {
  useEffect(() => initMouse(), []);

  return (
    <div className="relative min-h-screen bg-void font-sans text-ink">
      {/* ambient layers */}
      <div className="bg-grid-layer" aria-hidden="true" />
      <div className="noise-layer" aria-hidden="true" />

      <ScrollProgress />
      <Cursor />
      <Nav />

      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Achievements />
        <Credentials />
        <Contact />
      </main>
    </div>
  );
}

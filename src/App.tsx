import { lazy, Suspense, useState, useEffect } from "react";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Experience } from "./components/Experience";
import { Projects } from "./components/Projects";
import { Contact } from "./components/Contact";
import { ScrollToTop } from "./components/ui/ScrollToTop";
import { ChatAssistant } from "./components/ui/ChatAssistant";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";

// Import new premium views and backgrounds
import { ComingSoon } from "./components/ui/ComingSoon";
import { NotFound } from "./components/ui/NotFound";
import { ProjectDetail } from "./components/ui/ProjectDetail";
import { ParallaxStars } from "./components/ui/ParallaxStars";
import { FluidAura } from "./components/ui/FluidAura";
import { VisualSwitcher } from "./components/ui/VisualSwitcher";
import { BackgroundLoader } from "./components/ui/BackgroundLoader";

// Lazy-load the heavy 3D background scene (Three.js/Fiber/Drei)
const BackgroundScene = lazy(() =>
  import("./components/3d/BackgroundScene").then((m) => ({ default: m.BackgroundScene }))
);

export default function App() {
  // Hash Routing State
  const [currentHash, setCurrentHash] = useState(() => window.location.hash || "#/");

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || "#/");
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Background visual mode state: "3d" | "stars" | "aura"
  const [bgMode, setBgMode] = useState<"3d" | "stars" | "aura">(() => {
    return (localStorage.getItem("portfolio-bg-mode") as any) || "3d";
  });

  const handleBgModeChange = (mode: "3d" | "stars" | "aura") => {
    setBgMode(mode);
    localStorage.setItem("portfolio-bg-mode", mode);
  };

  // Helper to determine if a hash path is a section on the main home page
  const isHomePath = (path: string) => {
    const clean = path.split("?")[0]; // ignore query params
    return (
      clean === "#/" ||
      clean === "" ||
      clean === "#" ||
      clean === "#home" ||
      clean === "#about" ||
      clean === "#experience" ||
      clean === "#projects" ||
      clean === "#contact"
    );
  };

  // Smooth scroll to sections if routed from external pages
  useEffect(() => {
    if (isHomePath(currentHash)) {
      const sectionId = currentHash.replace("#", "").replace("/", "");
      if (sectionId && sectionId !== "home") {
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }, 150);
      }
    }
  }, [currentHash]);

  // Router switch logic
  const renderContent = () => {
    const cleanHash = currentHash.split("?")[0];

    // Coming soon splash page route
    if (cleanHash === "#/coming-soon") {
      return <ComingSoon />;
    }

    // Single Project detail route (e.g. #/project/campushub-ghana)
    if (cleanHash.startsWith("#/project/")) {
      const projectId = cleanHash.replace("#/project/", "");
      return <ProjectDetail projectId={projectId} />;
    }

    // Default Home sections
    if (isHomePath(cleanHash)) {
      return (
        <>
          <Hero />
          <About />
          <Experience />
          <Projects />
          <Contact />
        </>
      );
    }

    // If route isn't recognized, trigger 404
    return <NotFound />;
  };

  return (
    <>
      {/* Background Switcher renderer */}
      <ErrorBoundary>
        <Suspense fallback={bgMode === "3d" ? <BackgroundLoader /> : null}>
          {bgMode === "3d" && <BackgroundScene />}
          {bgMode === "stars" && <ParallaxStars />}
          {bgMode === "aura" && <FluidAura />}
        </Suspense>
      </ErrorBoundary>

      <div className="relative z-10 antialiased selection:bg-brand-500/30 selection:text-white">
        {/* Only render Nav header on home sections or detail sub-pages, keep coming soon standalone */}
        {currentHash !== "#/coming-soon" && <Navigation />}

        <main>{renderContent()}</main>

        <footer className="py-8 text-center text-sm font-light text-gray-500 border-t border-white/10 backdrop-blur-md bg-[#050505]/50">
          <p>© {new Date().getFullYear()} Richard Masika. All rights reserved.</p>
        </footer>
      </div>

      <ScrollToTop />
      <ChatAssistant />
      
      {/* Visual background switcher settings panel (rendered globally except on coming soon) */}
      {currentHash !== "#/coming-soon" && (
        <VisualSwitcher currentMode={bgMode} onChangeMode={handleBgModeChange} />
      )}
    </>
  );
}

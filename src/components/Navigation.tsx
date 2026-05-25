import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { Github, Linkedin, Mail, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "../lib/utils";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

// Hosted in /public — replace richard-masika-resume.pdf with the actual PDF file
const RESUME_URL = "/richard-masika-resume.pdf";

function useActiveSection() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const sectionIds = ["home", "about", "experience", "projects", "contact"];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { threshold: 0.4 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  return activeSection;
}

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const activeSection = useActiveSection();
  const [showResumeModal, setShowResumeModal] = useState(false);

  // Lock body scroll when mobile nav or resume modal is open
  useEffect(() => {
    if (isOpen || showResumeModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, showResumeModal]);

  const { scrollY, scrollYProgress } = useScroll();
  const background = useTransform(
    scrollY,
    [0, 50],
    ["rgba(5, 5, 5, 0)", "rgba(5, 5, 5, 0.7)"]
  );
  const backdropFilter = useTransform(
    scrollY,
    [0, 50],
    ["blur(0px)", "blur(12px)"]
  );
  const borderBottomColor = useTransform(
    scrollY,
    [0, 50],
    ["rgba(255,255,255,0)", "rgba(255,255,255,0.05)"]
  );

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <motion.header
        style={{ background, backdropFilter, borderBottomColor }}
        className="fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300"
      >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <a href="#" className="font-display font-bold text-xl tracking-tighter text-white">
          PORT<span className="text-brand-500">FOLIO</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const sectionId = link.href.replace("#", "");
            const isActive = activeSection === sectionId;
            return (
              <a
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors relative py-1",
                  isActive
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                )}
              >
                {link.name}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-brand-500"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </a>
            );
          })}

          {/* Social Icons */}
          <div className="flex items-center gap-3 border-l border-white/10 pl-6">
            <a
              href="https://github.com/Maskarano111"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Github size={18} />
            </a>
            <a
              href="https://linkedin.com/in/richard-abiola-masika-9b21b622a"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="mailto:richardabiolamasika@gmail.com"
              aria-label="Send email"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Mail size={18} />
            </a>
          </div>

          <button
            onClick={() => setShowResumeModal(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors border border-white/10 cursor-pointer"
          >
            Resume
          </button>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-gray-400 hover:text-white transition-colors min-h-12 min-w-12 flex items-center justify-center"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-nav"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav — wrapped in AnimatePresence so the exit animation fires */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav"
            key="mobile-nav"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden absolute top-20 left-0 right-0 bg-[#050505]/95 backdrop-blur-xl border-b border-white/5 py-6 px-4 sm:px-6 flex flex-col gap-2"
          >
            {navLinks.map((link) => {
              const sectionId = link.href.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-base font-medium transition-colors py-3 px-3 rounded-lg hover:bg-white/5",
                    isActive ? "text-white" : "text-gray-400 hover:text-white"
                  )}
                >
                  {link.name}
                </a>
              );
            })}
            <button
              onClick={() => {
                setIsOpen(false);
                setShowResumeModal(true);
              }}
              className="w-full py-3 sm:py-2.5 text-center text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors border border-white/10 cursor-pointer min-h-12 sm:min-h-auto"
            >
              Resume
            </button>
            <div className="flex items-center gap-4 pt-4 border-t border-white/10 mt-4">
              <a
                href="https://github.com/Maskarano111"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors min-h-10 min-w-10 flex items-center justify-center"
              >
                <Github size={20} />
              </a>
              <a
                href="https://linkedin.com/in/richard-abiola-masika-9b21b622a"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors min-h-10 min-w-10 flex items-center justify-center"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="mailto:richardabiolamasika@gmail.com"
                aria-label="Send email"
                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors min-h-10 min-w-10 flex items-center justify-center"
              >
                <Mail size={20} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Scroll Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-500 via-indigo-500 to-brand-500 origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />
    </motion.header>

    {/* Resume PDF Modal */}
    <AnimatePresence>
      {showResumeModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Resume Preview"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowResumeModal(false);
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-4xl h-[85vh] rounded-2xl border border-white/10 bg-[#09090b]/95 p-5 md:p-6 shadow-[0_24px_64px_rgba(0,0,0,0.8)] flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-4 shrink-0">
              <h3 className="font-display text-xl font-bold text-white">
                Resume Preview
              </h3>
              <div className="flex items-center gap-3">
                <a
                  href={RESUME_URL}
                  download="Richard-Masika-Resume.pdf"
                  className="px-4 py-1.5 bg-brand-500 hover:bg-brand-500/90 text-white text-xs font-medium rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  Download
                </a>
                <button
                  onClick={() => setShowResumeModal(false)}
                  className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* PDF Preview Frame */}
            <div className="flex-1 w-full bg-white/5 rounded-xl overflow-hidden relative">
              <iframe
                src={`${RESUME_URL}#toolbar=0`}
                title="Richard Masika Resume"
                className="w-full h-full border-none"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
}

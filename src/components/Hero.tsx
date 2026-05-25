import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowDown, ArrowRight } from "lucide-react";

export function Hero() {
  const subjects = [
    "Python Programming",
    "Web Development",
    "Database Systems",
    "Network Architecture",
    "System Design",
    "Cloud Computing"
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % subjects.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen sm:h-screen flex flex-col justify-center items-center text-center px-4 sm:px-6 pointer-events-none overflow-hidden py-20 sm:py-0"
    >
      {/* Animated gradient blob — purely CSS, no JS overhead */}
      <div
        aria-hidden="true"
        className="animate-blob-drift absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(59,130,246,0.12) 0%, rgba(99,102,241,0.06) 50%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="z-10 flex flex-col items-center pointer-events-auto">
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-brand-500 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
          Lead Software Engineer &amp; Tech Educator
        </motion.div>

        {/* Name heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white max-w-4xl leading-tight"
        >
          Richard <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-indigo-400 to-brand-500 animate-shimmer">
            Masika
          </span>
        </motion.h1>

        {/* Tech Education Badge Cycler */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-400 min-h-[32px]"
        >
          <span className="font-mono text-xs uppercase tracking-wider text-brand-400">Teaching:</span>
          <div className="relative inline-flex items-center min-w-[160px] justify-start h-8 pl-1">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentIndex}
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.3 }}
                className="text-xs font-semibold text-white bg-white/5 border border-white/10 px-2.5 py-1 rounded-full whitespace-nowrap shadow-sm hover:border-brand-500/30 transition-colors"
              >
                {subjects[currentIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Sub-heading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-6 text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed"
        >
          Results-driven Lead Software Engineer &amp; Tech Educator with 4+ years of experience.
          Specializing in full-stack development, technical leadership, and mentoring students
          across diverse IT disciplines to bridge the gap between academia and industry.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-6 sm:px-0"
        >
          {/* Primary — glowing brand button */}
          <a
            href="#projects"
            className="group relative w-full sm:w-auto px-8 py-4 bg-brand-500 text-white font-medium rounded-full transition-all duration-300 hover:bg-brand-500/90 hover:shadow-[0_0_32px_rgba(59,130,246,0.5)] flex items-center justify-center gap-2"
          >
            View Work
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </a>

          {/* Secondary — ghost */}
          <a
            href="#contact"
            className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-medium rounded-full hover:bg-white/10 hover:border-white/20 transition-colors backdrop-blur-md text-center justify-center flex"
          >
            Contact Me
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-auto"
      >
        <span className="text-xs text-gray-500 uppercase tracking-widest font-medium">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={16} className="text-gray-500" />
        </motion.div>
      </motion.div>
    </section>
  );
}

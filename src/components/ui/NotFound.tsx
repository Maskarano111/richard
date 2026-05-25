import { ArrowLeft, Compass } from "lucide-react";
import { motion } from "motion/react";

export function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 py-12 relative z-10 select-none">
      <div className="w-full max-w-md text-center flex flex-col items-center">
        {/* Animated Compass Icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-brand-400 mb-8 shadow-xl"
        >
          <Compass size={28} />
        </motion.div>

        {/* 404 Big Text */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="font-display text-8xl md:text-9xl font-bold tracking-tight text-white/10 relative"
        >
          404
          {/* Overlay text */}
          <div className="absolute inset-0 flex items-center justify-center text-white text-5xl md:text-6xl font-extrabold tracking-tighter">
            Lost
          </div>
        </motion.h1>

        {/* Description */}
        <h2 className="text-xl font-bold text-white mt-8 mb-3">Drifted Into Deep Space</h2>
        <p className="text-gray-400 text-xs md:text-sm font-light leading-relaxed mb-8 max-w-sm">
          The link you followed might be broken, or the page was relocated during our latest portfolio refactoring.
        </p>

        {/* CTA Button */}
        <motion.a
          href="#/"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-500 hover:bg-brand-500/95 text-white text-xs font-semibold rounded-full shadow-lg hover:shadow-[0_0_24px_rgba(59,130,246,0.5)] transition-all cursor-pointer"
        >
          <ArrowLeft size={14} />
          Navigate Back Home
        </motion.a>
      </div>
    </div>
  );
}

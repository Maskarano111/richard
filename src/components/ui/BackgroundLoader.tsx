import { motion } from "motion/react";

/**
 * Loading skeleton for the 3D background scene
 * Displays while Three.js is initializing to prevent flash of unstyled content
 */
export function BackgroundLoader() {
  return (
    <div className="fixed inset-0 z-0 w-full h-full pointer-events-none overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-[#050505] to-indigo-950/20"
      />

      {/* Animated loading pulses */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl"
        />
      </div>

      {/* Centered loading indicator */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          {/* Animated dots */}
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-2 h-2 rounded-full bg-brand-500"
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 font-mono tracking-wider">
            Initializing scene...
          </p>
        </motion.div>
      </div>
    </div>
  );
}

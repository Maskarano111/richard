import { motion, AnimatePresence } from "motion/react";
import { Check, X } from "lucide-react";
import { useEffect } from "react";

interface ToastProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
  type?: "success" | "error";
}

export function Toast({ message, isOpen, onClose, type = "success" }: ToastProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed top-24 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl border backdrop-blur-md shadow-2xl min-w-[300px] max-w-md pointer-events-auto"
          style={{
            backgroundColor: type === "success" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
            borderColor: type === "success" ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
            color: type === "success" ? "#10b981" : "#ef4444",
          }}
        >
          <div className="p-1 rounded-full bg-white/10 flex items-center justify-center shrink-0">
            {type === "success" ? <Check size={16} className="text-green-400" /> : <X size={16} className="text-red-400" />}
          </div>
          <div className="flex-1 text-sm font-medium text-white">{message}</div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

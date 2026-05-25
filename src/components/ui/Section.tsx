import { ReactNode, forwardRef } from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

interface SectionProps {
  id: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ id, title, subtitle, children, className }, ref) => {
    return (
      <section
        id={id}
        ref={ref}
        className={cn("py-16 sm:py-24 md:py-32 relative z-10 px-4 sm:px-6", className)}
      >
        <div className="max-w-7xl mx-auto">
          {(title || subtitle) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="mb-12 sm:mb-16 md:mb-24"
            >
              {subtitle && (
                <h3 className="text-brand-500 font-medium tracking-wider uppercase text-sm mb-2">
                  {subtitle}
                </h3>
              )}
              {title && (
                <h2 className="font-display tracking-tight text-2xl sm:text-3xl md:text-5xl font-bold text-white">
                  {title}
                </h2>
              )}
            </motion.div>
          )}
          {children}
        </div>
      </section>
    );
  }
);
Section.displayName = "Section";

import { Section } from "./ui/Section";
import { motion, AnimatePresence } from "motion/react";
import { ExternalLink, Github, Star, X, Info, Layers, Cpu } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export const projects = [
  {
    id: "campushub-ghana",
    title: "CampusHub Ghana",
    description:
      "A full-stack student e-commerce ecosystem reaching 90% production readiness. Features secure payment flows, product listings, and a React-based UX optimized for Ghanaian university campuses.",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
    tech: ["React", "Full-Stack", "Payments", "Supabase"],
    category: "React",
    github: "https://github.com/Maskarano111",
    live: "#",
    featured: true,
    details: {
      status: "90% Production Ready (Staging)",
      architecture: "React frontend communicating with a Serverless Supabase backend. Implements PostgreSQL triggers for transaction safety.",
      features: [
        "Secure payments integration tailored for Ghanaian university campuses (Mobile Money and Card flows).",
        "Optimized client-side image compression for fast loading in low-bandwidth campus environments.",
        "Real-time product category filtering and keyword search with index matching."
      ]
    }
  },
  {
    id: "attendance-mgmt",
    title: "Attendance Management System",
    description:
      "Real-time student attendance tracking system with automated reporting and analytics. Built with modern backend services and cloud hosting for university-scale deployment.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
    tech: ["Supabase", "Netlify", "Real-Time DB", "React"],
    category: "React",
    github: "https://github.com/Maskarano111",
    live: "#",
    featured: false,
    details: {
      status: "Prototype Deployed",
      architecture: "React client deployed on Netlify, leveraging Supabase Realtime Channels to synchronize classroom attendance immediately.",
      features: [
        "Instant student check-in validation via localized geofencing metrics.",
        "Automated PDF report generation and exports for university professors.",
        "Responsive administration dashboard loaded with visual charts and analytics."
      ]
    }
  },
  {
    id: "academic-dashboard",
    title: "Academic Project Dashboard",
    description:
      "A Flask-based project management dashboard built to automate academic tracking at Koforidua Technical University, improving administrative efficiency for 100+ students.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    tech: ["Python", "Flask", "MySQL", "Jinja2"],
    category: "Python",
    github: "https://github.com/Maskarano111",
    live: "#",
    featured: false,
    details: {
      status: "KTU Local Deployment",
      architecture: "Python/Flask server rendering pages dynamically via Jinja2, utilizing an optimized relational MySQL database schema.",
      features: [
        "Automated grading calculations and progress milestones for academic projects.",
        "Secure instructor and student role-based portal access controls.",
        "Batch import/export functionality for spreadsheet integration."
      ]
    }
  },
];

const projectCategories = ["All", "React", "Python"];

export function Projects() {
  const [activeProject, setActiveProject] = useState<typeof projects[0] | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = activeCategory === "All"
    ? projects
    : projects.filter(p => p.category === activeCategory);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap: keep keyboard focus inside the modal while open
  useEffect(() => {
    if (!activeProject) return;
    // Auto-focus the close button when modal opens
    setTimeout(() => closeButtonRef.current?.focus(), 50);

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') { setActiveProject(null); return; }
      if (e.key !== 'Tab' || !modalRef.current) return;
      const focusable = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute('disabled'));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeProject]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (activeProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [activeProject]);

  return (
    <Section id="projects" title="Featured Work" subtitle="Projects">
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-12 select-none">
        {projectCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 sm:px-5 py-2.5 sm:py-2 rounded-full text-xs font-semibold border transition-all duration-300 cursor-pointer min-h-10 ${
              activeCategory === cat
                ? "bg-brand-500 border-brand-500 text-white shadow-md shadow-brand-500/20"
                : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[300px]">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 flex flex-col hover:bg-white/[0.08] hover:border-brand-500/25 hover:shadow-[0_16px_48px_rgba(59,130,246,0.1)] transition-all duration-300"
          >
            {/* Featured badge */}
            {project.featured && (
              <div className="absolute top-3 left-3 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-500/90 backdrop-blur-sm text-white text-xs font-semibold shadow-lg">
                <Star size={10} className="fill-white" />
                Featured
              </div>
            )}

            {/* Image */}
            <div className="relative h-48 overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500 z-10" />
              <img
                src={project.image}
                alt={project.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>

            <div className="p-6 flex-1 flex flex-col backdrop-blur-md">
              <h3 className="text-xl font-bold text-white mb-2">
                <a href={`#/project/${project.id}`} className="hover:text-brand-400 transition-colors">
                  {project.title}
                </a>
              </h3>
              <p className="text-sm text-gray-400 font-light mb-6 flex-1">
                {project.description}
              </p>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-medium text-brand-500/80 bg-brand-500/10 px-2 py-1 rounded border border-brand-500/20"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 text-gray-300 shrink-0 ml-3">
                  <a
                    href={`#/project/${project.id}`}
                    aria-label={`View ${project.title} details`}
                    className="hover:text-brand-500 transition-colors"
                    title="Detailed Page"
                  >
                    <Info size={18} />
                  </a>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${project.title} on GitHub`}
                    className="hover:text-brand-500 transition-colors"
                  >
                    <Github size={18} />
                  </a>
                  <a
                    href={project.live}
                    onClick={(e) => {
                      if (project.live === "#") {
                        e.preventDefault();
                        setActiveProject(project);
                      }
                    }}
                    target={project.live === "#" ? undefined : "_blank"}
                    rel={project.live === "#" ? undefined : "noopener noreferrer"}
                    aria-label={`View ${project.title} live demo`}
                    className="hover:text-brand-500 transition-colors cursor-pointer"
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>
              </div>
            </div>

            {/* Hover border glow */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-brand-500/30 rounded-2xl transition-colors duration-500 pointer-events-none" />
          </motion.div>
        ))}
        </AnimatePresence>
      </motion.div>

      {/* Info Modal for Staging Projects */}
      <AnimatePresence>
        {activeProject && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-label={activeProject?.title}
            onClick={(e) => { if (e.target === e.currentTarget) setActiveProject(null); }}
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-2xl border border-white/15 bg-[#09090b]/95 p-6 md:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              {/* Subtle background glow */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

              <button
                ref={closeButtonRef}
                onClick={() => setActiveProject(null)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 text-brand-500 mb-4">
                <Info size={20} />
                <span className="text-xs font-semibold uppercase tracking-wider">Project Staging Status</span>
              </div>

              <h3 className="font-display text-2xl font-bold text-white mb-2">
                {activeProject.title}
              </h3>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/25 text-xs text-brand-400 font-medium mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
                {activeProject.details.status}
              </div>

              <div className="space-y-5 text-gray-300 text-sm leading-relaxed mb-8">
                <div>
                  <div className="flex items-center gap-2 text-white font-medium mb-1.5">
                    <Layers size={14} className="text-gray-400" />
                    Architecture Setup
                  </div>
                  <p className="font-light text-gray-400">{activeProject.details.architecture}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-white font-medium mb-1.5">
                    <Cpu size={14} className="text-gray-400" />
                    Key Details &amp; Implementations
                  </div>
                  <ul className="space-y-2">
                    {activeProject.details.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex gap-2 font-light text-gray-400">
                        <span className="text-brand-500 shrink-0 select-none">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <a
                  href={activeProject.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-full border border-white/10 transition-colors flex items-center gap-2"
                >
                  <Github size={16} />
                  GitHub Source
                </a>
                <button
                  onClick={() => setActiveProject(null)}
                  className="px-5 py-2.5 bg-brand-500 hover:bg-brand-500/90 text-white text-sm font-medium rounded-full transition-colors cursor-pointer"
                >
                  Close Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Section>
  );
}

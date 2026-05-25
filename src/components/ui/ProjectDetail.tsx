import { useState, useEffect } from "react";
import { ArrowLeft, Github, ExternalLink, Calendar, ShieldCheck, Settings, Cpu, BadgeCheck } from "lucide-react";
import { projects } from "../Projects";

interface ProjectDetailProps {
  projectId: string;
}

export function ProjectDetail({ projectId }: ProjectDetailProps) {
  const project = projects.find((p) => p.id === projectId);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [projectId]);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-6 py-12 relative z-10 select-none">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Project Not Found</h2>
          <p className="text-gray-400 mb-8 text-sm">
            The project "{projectId}" does not exist in our systems.
          </p>
          <a
            href="#/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-500/90 text-white text-xs font-semibold rounded-full shadow-lg transition-all"
          >
            <ArrowLeft size={14} />
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-24 md:py-32 relative z-10 max-w-6xl mx-auto">
      {/* Back navigation */}
      <a
        href="#/"
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-white transition-colors bg-white/5 border border-white/10 hover:border-white/20 px-4 py-2 rounded-full backdrop-blur-md mb-12 shadow-sm"
      >
        <ArrowLeft size={14} />
        Back to Home
      </a>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Left Column (Main Info, Image, Description) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4">
              {project.title}
            </h1>
            <p className="text-lg text-gray-400 font-light leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Large Hero Image Container */}
          <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            {/* Soft overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Technical Implementation details */}
          <div className="space-y-6 bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-xl">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <Cpu size={20} className="text-brand-500" />
              Technical Architecture
            </h2>
            <p className="text-gray-300 font-light text-sm md:text-base leading-relaxed">
              {project.details.architecture}
            </p>

            <div className="border-t border-white/10 pt-6">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Key Features &amp; Implementations
              </h3>
              <ul className="space-y-3.5">
                {project.details.features.map((feature, idx) => (
                  <li key={idx} className="flex gap-3 text-gray-300 text-sm md:text-base font-light">
                    <BadgeCheck size={18} className="text-brand-400 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column (Metadata Sidebar) */}
        <div className="space-y-8 lg:sticky lg:top-24">
          <div className="bg-[#09090b]/80 border border-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest border-b border-white/5 pb-3">
              Project Parameters
            </h3>

            {/* Status */}
            <div>
              <div className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-2">
                Release Status
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/25 text-xs text-brand-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
                {project.details.status}
              </div>
            </div>

            {/* Tech Stack List */}
            <div>
              <div className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-2">
                Technology Stack
              </div>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="text-xs font-medium text-white bg-white/5 px-2.5 py-1 rounded-lg border border-white/10"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Details Table */}
            <div className="space-y-3.5 pt-2 border-t border-white/5 text-xs">
              <div className="flex items-center justify-between text-gray-400">
                <span className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-gray-500" />
                  Role
                </span>
                <span className="text-white font-medium">Lead Developer</span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span className="flex items-center gap-2">
                  <Calendar size={14} className="text-gray-500" />
                  Released
                </span>
                <span className="text-white font-medium">2024</span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span className="flex items-center gap-2">
                  <Settings size={14} className="text-gray-500" />
                  Category
                </span>
                <span className="text-white font-medium">{project.category}</span>
              </div>
            </div>

            {/* Links CTA */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs rounded-xl border border-white/10 transition-colors flex items-center justify-center gap-2"
              >
                <Github size={14} />
                GitHub Repository
              </a>

              {project.live !== "#" ? (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-brand-500 hover:bg-brand-500/90 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] cursor-pointer"
                >
                  <ExternalLink size={14} />
                  Visit Live Project
                </a>
              ) : (
                <button
                  disabled
                  className="w-full py-3 bg-white/5 text-gray-500 font-semibold text-xs rounded-xl border border-dashed border-white/5 flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  Staging Sandbox Mode
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

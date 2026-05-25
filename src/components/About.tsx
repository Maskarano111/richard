import { Section } from "./ui/Section";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

const skillsData = [
  { name: "Python", category: "Backend" },
  { name: "Flask", category: "Backend" },
  { name: "React", category: "Frontend" },
  { name: "JavaScript", category: "Frontend" },
  { name: "AWS (EC2, S3)", category: "Cloud" },
  { name: "MySQL", category: "Backend" },
  { name: "Supabase", category: "Cloud" },
  { name: "Git & GitHub", category: "Tools" },
  { name: "Netlify", category: "Tools" },
  { name: "Vercel", category: "Tools" },
  { name: "Firebase", category: "Cloud" },
  { name: "Agile & SDLC", category: "Tools" }
];

const categories = ["All", "Frontend", "Backend", "Cloud", "Tools"];

const stats = [
  { value: "4+", label: "Years Experience" },
  { value: "100+", label: "Students Mentored" },
  { value: "99.9%", label: "System Uptime" },
];

export function About() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredSkills = activeCategory === "All"
    ? skillsData
    : skillsData.filter(s => s.category === activeCategory);
  return (
    <Section id="about" title="About Me" subtitle="Who I Am">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.03 }}
            className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm cursor-default group animate-pulse-ring-hover"
          >
            <div className="font-display text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-indigo-400 mb-1 group-hover:from-brand-500 group-hover:to-purple-400 transition-all duration-500">
              {stat.value}
            </div>
            <div className="text-sm text-gray-400 font-light">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="space-y-6 text-gray-300 md:text-lg font-light leading-relaxed"
        >
          <p>
            I am a results-driven Software Engineer with over 4 years of
            experience specializing in full-stack development and technical
            leadership. My expertise lies in building production-ready platforms
            and mentoring the next generation of engineers.
          </p>
          <p>
            I'm deeply passionate about bridging industry gaps through scalable
            code and innovative tech education. Whether it's architecting cloud
            solutions or instructing over 100+ students, I thrive at the
            intersection of technology and mentorship.
          </p>

          <div className="pt-6">
            <h4 className="text-white font-medium mb-4">Core Expertise &amp; Tools</h4>
            
            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 select-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2.5 sm:py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 cursor-pointer min-h-10 sm:min-h-auto ${
                    activeCategory === cat
                      ? "bg-brand-500 border-brand-500 text-white shadow-md shadow-brand-500/20"
                      : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Skills chips with layout animations */}
            <motion.div layout className="flex flex-wrap gap-2 min-h-[100px] items-start">
              <AnimatePresence mode="popLayout">
                {filteredSkills.map((skill) => (
                  <motion.span
                    key={skill.name}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.06, borderColor: "rgba(59,130,246,0.6)" }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-medium text-gray-200 cursor-default hover:bg-brand-500/10 hover:text-white transition-all duration-200"
                  >
                    {skill.name}
                  </motion.span>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative h-[380px] sm:h-[480px] lg:h-[580px] w-full rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 to-transparent opacity-50" />

          {/* Profile Picture — replace src with your actual photo */}
          <img
            src="/richard-profile.jpg"
            alt="Richard Masika — Lead Software Engineer"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-center grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-out"
          />

          {/* Subtle overlay accent */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-brand-500/30 rounded-2xl transition-colors duration-500 pointer-events-none" />

          {/* Gradient fade at the bottom for blended integration */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />
        </motion.div>
      </div>
    </Section>
  );
}

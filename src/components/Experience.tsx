import { Section } from "./ui/Section";
import { motion } from "motion/react";

const experienceData = [
  {
    id: "zyratech-lead",
    company: "ZyraTech | Koforidua, Ghana",
    role: "Lead Software Engineer",
    duration: "2025 - Present",
    description:
      "Direct the technical roadmap for full-stack web applications, ensuring 99.9% system reliability. Led a two-month intensive training program for learners in Python and Network architecture.",
    tech: ["Python", "AWS", "Full-Stack Architecture"],
  },
  {
    id: "ktu-ta",
    company: "Koforidua Technical University",
    role: "Teaching Assistant",
    duration: "2023 - Present",
    description:
      "Mentor and instruct 100+ students across most IT areas (including Python, Web Dev, and Database Management). Developed a Flask-based project management dashboard to automate academic tracking.",
    tech: ["IT Education", "Python", "Flask", "Databases"],
  },
  {
    id: "web-based-consult",
    company: "Web-Based Consult",
    role: "Project Manager",
    duration: "2023 - 2024",
    description:
      "Led cross-functional teams to deliver diverse web projects using Agile methodologies. Managed SDLC from concept to deployment.",
    tech: ["Agile", "SDLC", "Trello"],
  },
  {
    id: "ktu-btech",
    company: "Koforidua Technical University",
    role: "B.Tech in Computer Science",
    duration: "2023 - 2025",
    description:
      "Higher National Diploma in CS (2020-2023). Certifications: AWS re/Start (Cloud Computing) & AI Career Essentials (ALX).",
    tech: ["Computer Science", "AWS Certified", "AI Essentials"],
  },
];

export function Experience() {
  return (
    <Section id="experience" title="Experience" subtitle="My Journey">
      <div>
        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/20 before:to-transparent">
          {experienceData.map((item, index) => (
            <div
              key={item.id}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            >
              {/* Timeline dot with animated pulse */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-[#050505] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-dot-pulse" />
              </div>

              {/* Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/[0.08] hover:border-brand-500/20 hover:shadow-[0_8px_32px_rgba(59,130,246,0.08)] transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                  <h3 className="font-bold text-white text-lg">{item.role}</h3>
                  <span className="text-xs font-medium text-brand-500 bg-brand-500/10 px-3 py-1 rounded-full whitespace-nowrap">
                    {item.duration}
                  </span>
                </div>
                <div className="text-sm text-gray-400 mb-4">{item.company}</div>
                <p className="text-sm text-gray-300 font-light leading-relaxed mb-4">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.tech.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-medium text-gray-400 bg-black/40 px-2 py-1 rounded border border-white/5"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

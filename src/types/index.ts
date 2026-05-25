export interface ProjectDetails {
  status: string;
  architecture: string;
  features: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tech: string[];
  category: string;
  github: string;
  live: string;
  featured: boolean;
  details: ProjectDetails;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
  tech: string[];
}

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ContactEntry {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
}

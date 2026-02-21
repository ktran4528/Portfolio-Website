
export interface Experience {
  company: string;
  role: string;
  location: string;
  period: string;
  highlights: string[];
}

export interface Project {
  title: string;
  subtitle: string;
  period: string;
  highlights: string[];
}

export interface SkillGroup {
  category: string;
  skills: string[];
}

export interface ResumeData {
  name: string;
  resumeUrl: string;
  contact: {
    location: string;
    phone: string;
    email: string;
    linkedin: string;
  };
  summary: string;
  education: {
    institution: string;
    location: string;
    degree: string;
    gpa: string;
  };
  skills: SkillGroup[];
  experience: Experience[];
  projects: Project[];
  certifications: string[];
}

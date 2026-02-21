
import { ResumeData } from './types';

export const RESUME_DATA: ResumeData = {
  name: "Kevin Tran",
  resumeUrl: "/KevinTranResume.pdf",
  contact: {
    location: "Brampton, ON",
    phone: "647-965-6129",
    email: "kevin45283@gmail.com",
    linkedin: "https://www.linkedin.com/in/kevin-tran-23a51124a/"
  },
  summary: "Cybersecurity professional with hands-on experience in penetration testing, network security, and software development. Completed post-graduate cybersecurity training with practical expertise in SIEM tools, firewall configuration, and vulnerability assessment. Strong programming foundation with proven ability to develop secure applications and automate security processes.",
  education: {
    institution: "Georgian College",
    location: "Barrie, ON",
    degree: "Post-Graduate Certificate in Cybersecurity",
    gpa: "3.4/4.0"
  },
  skills: [
    {
      category: "Security & Infrastructure",
      skills: ["Network Security", "Penetration Testing", "Vulnerability Assessment", "Incident Response", "Digital Forensics", "Palo Alto", "pfSense", "Splunk", "IDS/IPS", "Cloud Security (AWS)", "IAM"]
    },
    {
      category: "Programming & Scripting",
      skills: ["Python", "Bash", "PowerShell", "SQL", "C#", "Java", "JavaScript", "TypeScript", "HTML/CSS"]
    },
    {
      category: "Platforms & Tools",
      skills: ["Linux (Ubuntu, Kali)", "Windows Server", "Metasploit", "Nmap", "VMWare", "Oracle VM", "Git", "GitHub"]
    }
  ],
  experience: [
    {
      company: "Zebra Robotics",
      role: "Coding Coach",
      location: "Brampton, ON",
      period: "August 2022 - Present",
      highlights: [
        "Instructed 50+ students in programming (Java, Python, JS) and robotics platforms (Vex, Arduino)",
        "Partnered with Autism Ontario and local high schools for hands-on robotics workshops",
        "Communicated student progress to parents by translating technical concepts into accessible reports"
      ]
    },
    {
      company: "Expresume",
      role: "Software Developer Intern",
      location: "Remote",
      period: "September 2023 - November 2023",
      highlights: [
        "Developed responsive frontend components using TypeScript, React, and Tailwind CSS",
        "Participated in daily standups and sprint planning to prioritize features",
        "Maintained code quality through peer reviews and Git version control",
        "Integrated backend APIs using Next.js 13 for dynamic data rendering"
      ]
    }
  ],
  projects: [
    {
      title: "Cybersecurity Analysis",
      subtitle: "Coursework | Barrie, ON",
      period: "September 2023 - November 2023",
      highlights: [
        "Conducted penetration testing on simulated networks using Kali Linux, Metasploit, and Nmap",
        "Configured Palo Alto and pfSense firewalls by implementing security policies",
        "Monitored security events using Splunk SIEM by creating custom dashboards and correlation rules"
      ]
    }
  ],
  certifications: [
    "Google Cybersecurity Certificate (October 2025)",
    "CompTIA Security+ (In-Progress, Expected 2025)"
  ]
};

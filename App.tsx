
import React, { useState } from 'react';
import { RESUME_DATA } from './constants';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Section from './components/Section';
import ExperienceItem from './components/ExperienceItem';
import SkillCard from './components/SkillCard';
import LandingPage from './components/LandingPage';
import { ThemeProvider } from './context/ThemeContext';
import ContactForm from './components/ContactForm';

const AppContent: React.FC = () => {
  const [showPortfolio, setShowPortfolio] = useState(false);

  const enterPortfolio = () => {
    setShowPortfolio(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      {!showPortfolio ? (
        <LandingPage onEnter={enterPortfolio} />
      ) : (
        <div className="transition-opacity duration-1000 opacity-100">
          <Navigation />
          
          <main className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Hero />

            {/* Summary Section */}
            <Section id="about" title="About Me" subtitle="Cybersecurity Professional">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="text-lg text-[var(--text-secondary)] leading-relaxed">
                  <p className="mb-6">{RESUME_DATA.summary}</p>
                  <div className="p-6 bg-[var(--bg-secondary)]/30 border-l-4 border-[var(--accent)] rounded-r-2xl italic">
                    "Hands-on experience in penetration testing, network security, and software development."
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <div className="w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-xl bg-[var(--accent-secondary)]/30 flex items-center justify-center p-4">
                     <img src="/linkedin-photo.jpg" className="rounded-2xl object-cover w-full h-full shadow-sm" alt="Kevin Tran" />
                  </div>
                </div>
              </div>
            </Section>

            {/* Experience Section */}
            <Section id="experience" title="Work History" subtitle="Professional Journey" className="bg-[var(--bg-secondary)]">
              <div className="max-w-3xl mx-auto">
                {RESUME_DATA.experience.map((exp, i) => (
                  <ExperienceItem key={i} data={exp} />
                ))}
              </div>
            </Section>

            {/* Skills Section */}
            <Section id="skills" title="Technical Arsenal" subtitle="Skills & Specializations">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {RESUME_DATA.skills.map((skillGroup, i) => (
                  <SkillCard key={i} data={skillGroup} />
                ))}
              </div>
            </Section>

            {/* Projects Section */}
            <Section id="projects" title="Featured Work" subtitle="Hands-on Analysis" className="bg-[var(--bg-secondary)]">
              <div className="grid md:grid-cols-1 gap-8">
                {RESUME_DATA.projects.map((proj, i) => (
                  <div key={i} className="group bg-[var(--bg-primary)] p-8 rounded-[2rem] border border-[var(--border-color)] shadow-sm hover:shadow-xl transition-all">
                    <div className="flex flex-col md:flex-row md:justify-between items-start mb-6">
                      <div>
                        <h4 className="text-2xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">{proj.title}</h4>
                        <p className="text-[var(--text-secondary)]">{proj.subtitle}</p>
                      </div>
                      <span className="text-sm font-bold text-[var(--accent-secondary)] mt-2 md:mt-0">{proj.period}</span>
                    </div>
                    <ul className="space-y-3 text-[var(--text-secondary)]">
                      {proj.highlights.map((h, j) => (
                        <li key={j} className="flex items-start">
                          <span className="text-[var(--accent-secondary)] mr-2">✦</span>
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Section>

            {/* Certifications Section */}
            <Section id="certs" title="Certifications" subtitle="Constant Learning">
               <div className="flex flex-wrap gap-4">
                  {RESUME_DATA.certifications.map((cert, i) => (
                    <div key={i} className="bg-[var(--bg-primary)] border-2 border-[var(--accent-secondary)] px-6 py-4 rounded-2xl flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-[var(--accent-secondary)]/20 flex items-center justify-center text-[var(--accent-secondary)] font-bold">✓</div>
                       <span className="font-bold text-[var(--text-primary)]">{cert}</span>
                    </div>
                  ))}
               </div>
            </Section>

            {/* Contact Section */}
            <Section id="contact" title="Get in Touch" subtitle="Let's Start a Conversation" className="bg-[#4A4A4A] text-white rounded-t-[4rem]">
              <div className="max-w-6xl mx-auto">
                <p className="text-xl text-[#BDBDBD] mb-12 leading-relaxed max-w-2xl mx-auto text-center">
                  Interested in discussing security frameworks or development projects? Please feel free to reach out via email or connect with me on LinkedIn.
                </p>
                
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  {/* Left Column: Contact Icons */}
                  <div className="flex flex-col gap-8 items-center md:items-start">
                    <div className="flex items-center gap-6 group w-full p-4 rounded-2xl hover:bg-white/5 transition-all">
                      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-2xl group-hover:bg-white/20 transition-colors shrink-0">📧</div>
                      <div className="text-left">
                        <h4 className="text-[#BDBDBD] text-sm font-bold uppercase tracking-wider mb-1">Email</h4>
                        <a href={`mailto:${RESUME_DATA.contact.email}`} className="text-[#FFADAD] text-lg font-medium hover:underline break-all">{RESUME_DATA.contact.email}</a>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 group w-full p-4 rounded-2xl hover:bg-white/5 transition-all">
                      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-2xl group-hover:bg-white/20 transition-colors shrink-0">📍</div>
                      <div className="text-left">
                        <h4 className="text-[#BDBDBD] text-sm font-bold uppercase tracking-wider mb-1">Location</h4>
                        <span className="text-white text-lg">{RESUME_DATA.contact.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 group w-full p-4 rounded-2xl hover:bg-white/5 transition-all">
                      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-2xl group-hover:bg-white/20 transition-colors shrink-0">🔗</div>
                      <div className="text-left">
                        <h4 className="text-[#BDBDBD] text-sm font-bold uppercase tracking-wider mb-1">Social</h4>
                        <a href={RESUME_DATA.contact.linkedin} target="_blank" rel="noreferrer" className="text-[#FFADAD] text-lg font-medium hover:underline">LinkedIn Profile</a>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Contact Form */}
                  <div className="w-full">
                    <ContactForm />
                  </div>
                </div>
              </div>
              <div className="mt-20 pt-8 border-t border-white/10 text-center text-sm text-[#7A7A7A]">
                <p>© {new Date().getFullYear()} {RESUME_DATA.name}. Professional Portfolio.</p>
              </div>
            </Section>
          </main>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;

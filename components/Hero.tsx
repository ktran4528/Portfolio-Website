
import React from 'react';
import { RESUME_DATA } from '../constants';

const Hero: React.FC = () => {
  return (
    <section 
      id="hero" 
      className="relative py-20 md:py-32 flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-[var(--bg-secondary)] to-[var(--bg-primary)]"
    >
      <div className="z-10 max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-black text-[var(--text-primary)] mb-6 leading-tight">
          Exploring the Intersection of <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-secondary)] to-[var(--accent)]">Security & Innovation</span>
        </h1>
        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
          Welcome to the professional portfolio of {RESUME_DATA.name}. 
          Focused on protecting digital assets through penetration testing and secure software architecture.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <a 
            href={RESUME_DATA.resumeUrl}
            download="Kevin_Tran_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-[var(--bg-primary)] border-2 border-[var(--border-color)] text-[var(--accent)] rounded-full font-bold hover:bg-[var(--bg-secondary)] transition-all transform hover:-translate-y-1 inline-block"
          >
            Resume PDF
          </a>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/asfalt-light.png')` }}></div>
    </section>
  );
};

export default Hero;

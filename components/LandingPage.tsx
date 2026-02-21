
import React, { useState, useCallback } from 'react';
import { RESUME_DATA } from '../constants';
import FireworkEffect from './FireworkEffect';
import DecryptedText from './DecryptedText';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const [fireworkPos, setFireworkPos] = useState<{ x: number, y: number } | null>(null);

  const handleFirework = useCallback((e: React.MouseEvent) => {
    setFireworkPos({ x: e.clientX, y: e.clientY });
    setTimeout(() => setFireworkPos(null), 100);
  }, []);

  return (
    <div 
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--bg-primary)] overflow-hidden cursor-pointer select-none px-6 transition-colors duration-300"
      onClick={handleFirework}
    >
      <FireworkEffect trigger={fireworkPos} />

      {/* Decorative Lanterns */}
      <div className="absolute top-10 left-10 md:left-20 floating">
        <svg width="60" height="80" viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 0V10M10 20C10 14.4772 18.9543 10 30 10C41.0457 10 50 14.4772 50 20M10 20V60C10 65.5228 18.9543 70 30 70C41.0457 70 50 65.5228 50 60V20M10 20C10 25.5228 18.9543 30 30 30C41.0457 30 50 25.5228 50 20M30 70V80" stroke="var(--accent-secondary)" strokeWidth="2"/>
          <ellipse cx="30" cy="40" rx="20" ry="30" fill="var(--bg-secondary)" fillOpacity="0.5" stroke="var(--accent-secondary)" strokeWidth="2"/>
        </svg>
      </div>
      <div className="absolute top-20 right-10 md:right-20 floating" style={{ animationDelay: '1.2s' }}>
        <svg width="40" height="60" viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 0V10M10 20C10 14.4772 18.9543 10 30 10C41.0457 10 50 14.4772 50 20M10 20V60C10 65.5228 18.9543 70 30 70C41.0457 70 50 65.5228 50 60V20M10 20C10 25.5228 18.9543 30 30 30C41.0457 30 50 25.5228 50 20M30 70V80" stroke="var(--accent)" strokeWidth="2"/>
          <ellipse cx="30" cy="40" rx="20" ry="30" fill="var(--bg-secondary)" fillOpacity="0.5" stroke="var(--accent)" strokeWidth="2"/>
        </svg>
      </div>

      <div className="z-10 text-center max-w-4xl">
        <span className="asian-font text-[var(--accent)] text-lg font-bold tracking-widest block mb-4">WELCOME</span>
        <h1 className="text-6xl md:text-8xl font-black text-[var(--text-primary)] mb-8 leading-tight">
          I'm <DecryptedText 
            text={RESUME_DATA.name}
            animateOn="view"
            revealDirection="center"
            speed={100}
            maxIterations={20}
            characters="ABCD1234!?"
            parentClassName="all-letters inline-block"
            className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-secondary)] to-[var(--accent)]"
            encryptedClassName="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-secondary)] to-[var(--accent)]"
          />
        </h1>
        <p className="text-lg md:text-2xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-12 leading-relaxed">
          Cybersecurity Professional & Software Developer building secure, resilient digital experiences.
        </p>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onEnter();
          }}
          className="group relative px-10 py-5 bg-[var(--accent-secondary)] text-[var(--bg-primary)] rounded-full font-bold shadow-xl shadow-pink-100 hover:bg-[var(--accent)] transition-all transform hover:scale-105 active:scale-95 overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            Enter Portfolio
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </button>

        <p className="mt-12 text-sm text-[var(--text-secondary)] font-medium tracking-wide">
          CLICK ANYWHERE FOR FIREWORKS 🎇
        </p>
      </div>

      {/* Decorative Circles */}
      <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-[var(--accent-secondary)]/20 blur-3xl -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[var(--accent)]/20 blur-3xl -z-10" />
    </div>
  );
};

export default LandingPage;

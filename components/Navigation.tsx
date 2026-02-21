
import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Navigation: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else setTheme('light');
  };

  const toggleHighContrast = () => {
    if (theme === 'high-contrast') setTheme('light');
    else setTheme('high-contrast');
  };

  return (
    <nav className="sticky top-0 z-50 bg-[var(--bg-primary)] border-b border-[var(--border-color)] px-6 py-4 transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-gap-2">
          <span className="asian-font text-2xl font-bold text-[var(--accent)]">KT</span>
          <div className="h-6 w-[1px] bg-[var(--border-color)] mx-4" />
          <span className="hidden sm:inline font-semibold text-[var(--text-primary)]">Kevin Tran</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-6 text-sm font-medium text-[var(--text-secondary)]">
            <a href="#about" onClick={(e) => handleScroll(e, 'about')} className="hover:text-[var(--accent)] transition-colors">About</a>
            <a href="#experience" onClick={(e) => handleScroll(e, 'experience')} className="hover:text-[var(--accent)] transition-colors">Experience</a>
            <a href="#skills" onClick={(e) => handleScroll(e, 'skills')} className="hover:text-[var(--accent)] transition-colors">Skills</a>
            <a href="#projects" onClick={(e) => handleScroll(e, 'projects')} className="hover:text-[var(--accent)] transition-colors">Projects</a>
            <a href="#contact" onClick={(e) => handleScroll(e, 'contact')} className="hover:text-[var(--accent)] transition-colors">Contact</a>
          </div>
          
          <div className="flex items-center gap-2 pl-4 border-l border-[var(--border-color)]">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] transition-colors"
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>
            <button 
              onClick={toggleHighContrast}
              className={`p-2 rounded-full hover:bg-[var(--bg-secondary)] transition-colors ${theme === 'high-contrast' ? 'text-[var(--accent)] bg-[var(--bg-secondary)]' : 'text-[var(--text-primary)]'}`}
              title="Toggle High Contrast"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

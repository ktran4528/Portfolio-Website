
import React from 'react';

interface SectionProps {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ id, title, subtitle, children, className = "" }) => {
  return (
    <section id={id} className={`py-20 px-6 scroll-mt-24 ${className}`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h3 className="asian-font text-[var(--accent)] font-bold text-sm tracking-widest uppercase mb-2">/ {title}</h3>
          {subtitle && <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]">{subtitle}</h2>}
        </div>
        {children}
      </div>
    </section>
  );
};

export default Section;

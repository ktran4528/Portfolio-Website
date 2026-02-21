
import React from 'react';
import { Experience } from '../types';

const ExperienceItem: React.FC<{ data: Experience }> = ({ data }) => {
  return (
    <div className="relative pl-8 pb-12 last:pb-0 border-l border-[var(--border-color)]">
      <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-[var(--accent-secondary)] border-4 border-[var(--bg-primary)] shadow-sm" />
      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
        <div>
          <h4 className="text-xl font-bold text-[var(--text-primary)]">{data.role}</h4>
          <p className="text-[var(--accent)] font-semibold">{data.company} • <span className="text-[var(--text-secondary)] font-normal">{data.location}</span></p>
        </div>
        <span className="text-sm font-medium bg-[var(--accent)]/10 text-[var(--accent)] px-3 py-1 rounded-full self-start mt-2 md:mt-0">
          {data.period}
        </span>
      </div>
      <ul className="space-y-3">
        {data.highlights.map((h, i) => (
          <li key={i} className="flex items-start text-[var(--text-secondary)] leading-relaxed">
            <span className="text-[var(--accent-secondary)] mr-2">•</span>
            {h}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExperienceItem;

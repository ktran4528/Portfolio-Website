
import React from 'react';
import { SkillGroup } from '../types';

const SkillCard: React.FC<{ data: SkillGroup }> = ({ data }) => {
  const getColors = (category: string) => {
    if (category.includes("Security")) return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300";
    if (category.includes("Programming")) return "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-300";
    return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300";
  };

  return (
    <div className="bg-[var(--bg-primary)] p-6 rounded-3xl border border-[var(--border-color)] shadow-sm hover:shadow-md transition-shadow">
      <h4 className="text-lg font-bold text-[var(--text-primary)] mb-4">{data.category}</h4>
      <div className="flex flex-wrap gap-2">
        {data.skills.map((skill, i) => (
          <span 
            key={i} 
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider ${getColors(data.category)}`}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SkillCard;

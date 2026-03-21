import React from 'react';
import { motion } from 'framer-motion';

interface ExpertiseMatrixProps {
  skills: string;
}

export const ExpertiseMatrix: React.FC<ExpertiseMatrixProps> = ({ skills }) => {
  const skillList = skills ? skills.split(',').map(s => s.trim()).filter(s => s) : [];

  return (
    <section className="bg-[#EFEEE9] rounded-[2rem] p-8 lg:p-10 shadow-inner relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-32 h-32 bg-[#FACD15] opacity-[0.05] rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <h3 className="text-xl font-black text-[#1F3F34]">Expertise Matrix</h3>
        <span className="text-[10px] font-black text-[#FACD15] bg-[#1F3F34] px-3 py-1 rounded-full">{skillList.length} Active Modules</span>
      </div>

      <div className="flex flex-wrap gap-2.5 relative z-10">
        {skillList.length > 0 ? (
          skillList.map((skill, i) => (
            <motion.span 
              key={skill}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="px-5 py-2.5 bg-white text-[#1F3F34] rounded-xl text-xs font-black border border-[#1F3F34]/5 shadow-sm hover:border-[#FACD15] transition-all hover:shadow-md cursor-default flex items-center gap-2"
            >
              <div className="w-1.5 h-1.5 bg-[#FACD15] rounded-full" />
              {skill}
            </motion.span>
          ))
        ) : (
          <p className="text-sm font-bold text-[#1F3F34]/40 italic py-4">No skills registered in dossier.</p>
        )}
      </div>
    </section>
  );
};

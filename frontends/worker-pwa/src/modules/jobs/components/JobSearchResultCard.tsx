import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, CheckCircle, Loader2, ChevronRight } from 'lucide-react';
import type { JobSearch } from '../../../services/search.service';
import type { Job } from '../../../services/job.service';

interface JobSearchResultCardProps {
  job: JobSearch | Job;
  index: number;
  applied: boolean;
  onApply: () => void;
  isApplying: boolean;
}

export const JobSearchResultCard: React.FC<JobSearchResultCardProps> = ({
  job,
  index,
  applied,
  onApply,
  isApplying,
}) => {
  const budget = job.budget;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-[2rem] p-5 md:p-8 shadow-sm hover:shadow-[0_20px_40px_-10px_rgba(31,63,52,0.08)] transition-all flex flex-col group border border-[#1F3F34]/5 hover:border-[#FACD15]/30 relative overflow-hidden active:scale-[0.98]"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FACD15] opacity-[0.02] rounded-bl-full group-hover:opacity-[0.08] transition-opacity pointer-events-none" />
      
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 md:mb-8">
        <div className="flex items-center gap-4 md:gap-5">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-[1.5rem] bg-[#F5F4EF] flex items-center justify-center relative overflow-hidden border border-[#1F3F34]/5 p-2 md:p-3 shrink-0">
             <Briefcase className="w-6 h-6 md:w-8 md:h-8 text-[#1F3F34]/10" />
          </div>
          <div className="space-y-1 min-w-0">
            <h3 className="font-black text-lg md:text-2xl text-[#1F3F34] leading-[1.1] md:leading-[0.9] tracking-tighter group-hover:text-[#2d2300] transition-colors truncate md:whitespace-normal">{job.title}</h3>
            <p className="font-bold text-[#414845]/60 flex items-center gap-1.5 uppercase tracking-widest text-[9px] md:text-[10px]">
              <span className="material-symbols-outlined text-xs md:text-sm">apartment</span>
              {(job as any).employerName || 'Registered Partner'}
            </p>
          </div>
        </div>
        <div className="text-left sm:text-right shrink-0">
          <span className="block text-xl md:text-2xl font-black text-[#1F3F34] tracking-tighter leading-none">
            ₹{budget?.toLocaleString()}
          </span>
          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#414845]/40 mt-1 block">Allocation</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
        <span className="px-3 py-1.5 md:px-4 md:py-2 bg-[#F5F4EF] text-[#1F3F34] text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2 group-hover:bg-white transition-all border border-transparent group-hover:border-[#1F3F34]/5 shadow-sm">
          <span className="material-symbols-outlined text-[12px] md:text-[14px]">domain</span> {job.industry || 'General'}
        </span>
        <span className="px-3 py-1.5 md:px-4 md:py-2 bg-[#F5F4EF] text-[#1F3F34] text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2 group-hover:bg-white transition-all border border-transparent group-hover:border-[#1F3F34]/5 shadow-sm min-w-0">
          <span className="material-symbols-outlined text-[12px] md:text-[14px] shrink-0">location_on</span> 
          <span className="truncate">{job.city || job.location}</span>
        </span>
      </div>

      <div className="flex gap-2.5 mb-8 flex-wrap">
        <div className="px-4 py-2 bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-black uppercase tracking-[0.15em] rounded-xl flex items-center gap-2 shadow-sm">
          <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span> 
          Immediate
        </div>
        <div className="px-4 py-2 bg-[#c7ebdb] text-[#4a6b5e] text-[10px] font-black uppercase tracking-[0.15em] rounded-xl flex items-center gap-2 shadow-sm">
          <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> 
          Verified
        </div>
      </div>

      <button 
        onClick={(e) => {
          e.stopPropagation();
          onApply();
        }}
        disabled={applied || isApplying}
        className={`mt-auto w-full py-4 md:py-5 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs transition-all flex items-center justify-center relative overflow-hidden ${
          applied 
          ? 'bg-emerald-500 text-white cursor-default shadow-lg shadow-emerald-500/20 gap-3' 
          : 'bg-[#FACD15] text-[#1F3F34] shadow-[0_6px_0_0_#c39f00] hover:shadow-[0_4px_0_0_#c39f00] hover:translate-y-[2px] active:shadow-none active:translate-y-[6px] cursor-pointer'
        }`}
      >
        {applied ? (
          <><CheckCircle className="w-4 h-4 md:w-5 md:h-5" /> Applied</>
        ) : isApplying ? (
          <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
        ) : (
          <div className="flex items-center justify-between w-full">
            <span className="flex items-center gap-2">Initiate Application <ChevronRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" /></span>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-[#1F3F34] rounded-full flex items-center justify-center text-[#FACD15] shrink-0 ml-2 shadow-inner">
               <span className="material-symbols-outlined text-lg md:text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>home_work</span>
            </div>
          </div>
        )}
      </button>
    </motion.div>
  );
};

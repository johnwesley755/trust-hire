import React from 'react';

interface ProfileStatsCardProps {
  level: string;
  experienceYears: number;
}

export const ProfileStatsCard: React.FC<ProfileStatsCardProps> = ({ level, experienceYears }) => {
  return (
    <div className="bg-[#1F3F34] rounded-[2rem] p-8 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group">
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#FACD15] opacity-[0.05] rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FACD15]">Performance</span>
        <span className="material-symbols-outlined text-[#FACD15] animate-pulse">trending_up</span>
      </div>

      <div className="space-y-6 relative z-10">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-1">Reputation</p>
            <p className="text-3xl font-black tracking-tight">4.9<span className="text-sm font-bold opacity-30 ml-1">/5.0</span></p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-1">Status</p>
            <p className="text-3xl font-black text-[#FACD15] tracking-tight">{level || 'Gold Tier'}</p>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10">
          <p className="text-sm font-medium text-white/60 leading-relaxed mb-6">
            Top 2% of specialists in Chennai. Maintain 4.8+ for Elite Tier access.
          </p>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-1">System Tenure</p>
              <p className="text-xl font-black tracking-tight">{experienceYears || 0} YRS ACTIVE</p>
            </div>
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:rotate-12 transition-transform">
               <span className="material-symbols-outlined text-white/30 text-3xl">military_tech</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

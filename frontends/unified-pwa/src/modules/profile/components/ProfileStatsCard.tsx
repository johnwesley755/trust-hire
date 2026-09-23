import React from 'react';
import { Star, ShieldCheck, Award, TrendingUp } from 'lucide-react';

interface ProfileStatsCardProps {
  level: string;
  experienceYears: number;
}

export const ProfileStatsCard: React.FC<ProfileStatsCardProps> = ({ level, experienceYears }) => {
  return (
    <div className="bg-gradient-to-br from-[#0A1931] to-[#0066FF] rounded-3xl p-6 sm:p-8 text-white flex flex-col justify-between shadow-lg shadow-blue-950/20 relative overflow-hidden group border border-blue-500/20">
      <div className="flex items-center justify-between mb-6 relative z-10">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-300" /> Trust & Performance
        </span>
        <span className="flex items-center gap-1 text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
          <TrendingUp className="w-3 h-3 text-emerald-300" /> Active
        </span>
      </div>

      <div className="space-y-5 relative z-10">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] text-blue-200 font-bold uppercase tracking-widest mb-1">Reputation</p>
            <p className="text-3xl font-extrabold tracking-tight flex items-center gap-1">
              4.9 <Star className="w-5 h-5 fill-amber-300 text-amber-300" />
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-blue-200 font-bold uppercase tracking-widest mb-1">Partner Tier</p>
            <p className="text-xl font-extrabold text-amber-300 tracking-tight">{level && !level.startsWith('L') ? level : 'Verified Specialist'}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-white/15">
          <p className="text-xs font-medium text-blue-100/80 leading-relaxed mb-4">
            Top 2% verified workforce specialist. Eligible for direct shift payouts.
          </p>
          <div className="flex justify-between items-center bg-white/10 p-3 rounded-2xl">
            <div>
              <p className="text-[9px] text-blue-200 font-bold uppercase tracking-widest">Industry Experience</p>
              <p className="text-sm font-extrabold text-white">{experienceYears || 2} Years Active</p>
            </div>
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

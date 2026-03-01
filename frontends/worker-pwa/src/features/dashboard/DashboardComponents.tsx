import { Award, TrendingUp, Search, ShieldCheck, Briefcase, User as UserIcon } from 'lucide-react';
import { useUser } from "@clerk/clerk-react";
import { useQuery } from '@tanstack/react-query';
import { levelService } from '../../api/level.service';
import { profileService } from '../../api/profile.service';
import { useNavigate } from 'react-router-dom';

export const ProfileCard = () => {
  const { user } = useUser();
  const { data: profile } = useQuery({
    queryKey: ['workerProfile'],
    queryFn: profileService.getProfile,
  });

  const { data: progress } = useQuery({
    queryKey: ['levelProgress', profile?.clerkId],
    queryFn: () => levelService.getLevelProgress(profile?.clerkId || ''),
    enabled: !!profile?.clerkId
  });

  return (
    <section className="relative p-8 rounded-4xl bg-linear-to-br from-indigo-600 to-indigo-900 overflow-hidden shadow-2xl shadow-indigo-500/20 text-white">
      <div className="relative z-10 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold">{user?.firstName || profile?.fullName.split(' ')[0]}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded-lg bg-white/20 text-[10px] font-black uppercase tracking-widest">
                Level {profile?.level || '1'}
              </span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className={`w-1 h-1 rounded-full ${i <= Number(profile?.level?.replace('L', '') || 1) ? 'bg-white' : 'bg-white/30'}`} />
                ))}
              </div>
            </div>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
            <TrendingUp className="w-8 h-8" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
            <span>Next Level: L{progress?.nextLevel || parseInt(profile?.level?.replace('L', '') || '1') + 1}</span>
            <span>{Math.round(progress?.progress || 0)}%</span>
          </div>
          <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${progress?.progress || 0}%` }} />
          </div>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-16 -mt-16 rounded-full" />
    </section>
  );
};

export const ActionGrid = () => {
  const navigate = useNavigate();
  return (
    <section className="grid grid-cols-2 gap-4">
      {[
        { label: 'Find Jobs', icon: <Search />, color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', path: '/search' },
        { label: 'Skill Tests', icon: <Award />, color: 'bg-amber-500/10 text-amber-500 border-amber-500/20', path: '/tests' },
        { label: 'Verify ID', icon: <ShieldCheck />, color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', path: '/verify' },
        { label: 'Work History', icon: <Briefcase />, color: 'bg-rose-500/10 text-rose-500 border-rose-500/20', path: '/history' },
      ].map((action) => (
        <button 
          key={action.label} 
          onClick={() => navigate(action.path)}
          className={`p-6 rounded-3xl border flex flex-col items-center gap-4 transition-all active:scale-95 cursor-pointer ${action.color}`}
        >
          {action.icon}
          <span className="text-sm font-bold">{action.label}</span>
        </button>
      ))}
    </section>
  );
};

export const BottomNav = () => (
  <nav className="fixed bottom-0 left-0 right-0 p-4 pb-8 bg-[#070b14]/80 backdrop-blur-2xl border-t border-white/5 flex justify-around items-center z-50">
    {[
      { icon: <TrendingUp className="w-5 h-5"/>, active: true },
      { icon: <Search className="w-5 h-5"/> },
      { icon: <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30 -mt-8"><PlusCircleIcon className="w-6 h-6 text-white"/></div>, custom: true },
      { icon: <Award className="w-5 h-5 text-slate-500"/> },
      { icon: <UserIcon className="w-5 h-5 text-slate-500"/> },
    ].map((item, i) => (
      <button key={i} className={`${item.active ? 'text-indigo-400' : 'text-slate-500'} cursor-pointer`}>
        {item.icon}
      </button>
    ))}
  </nav>
);

const PlusCircleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
);

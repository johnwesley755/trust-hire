import { useQuery } from '@tanstack/react-query';
import { levelService } from '../api/level.service';
import { useUser } from '../../../core/providers/AuthContext';
import { Star, ShieldCheck, Briefcase, Award, ArrowUpCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export const LevelDetailsPage = () => {
  const { user } = useUser();
  const { data: details, isLoading } = useQuery({
    queryKey: ['levelDetails', user?.id],
    queryFn: () => levelService.getLevelDetails(user?.id || ''),
    enabled: !!user?.id
  });

  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <div className="w-16 h-16 border-4 border-brand-primary border-t-brand-secondary rounded-full animate-spin" />
            <p className="text-brand-muted font-semibold tracking-widest text-[10px] animate-pulse">Syncing Level Matrix...</p>
        </div>
    );
  }

  return (
    <>
      <div className="absolute inset-0 cloud-grid opacity-[0.05] pointer-events-none" />
      
      <header className="p-8 lg:p-12 border-b border-brand-border bg-brand-bg/80 backdrop-blur-3xl sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex justify-between items-end">
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-brand-secondary/40 font-semibold tracking-widest text-[10px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-primary" /> Professional Standing
                </div>
                <h1 className="text-5xl font-bold tracking-tighter text-brand-secondary leading-[0.9]">Level {details?.currentLevel} operative</h1>
                <p className="text-brand-muted font-medium text-lg opacity-60">Your authenticated rank in the Trust Hire ecosystem.</p>
            </div>
            <div className="bg-brand-secondary border border-brand-secondary px-6 py-3 rounded-2xl text-brand-primary font-bold shadow-xl shadow-brand-secondary/10 tracking-widest text-xs">
                {details?.levelScore} PTS
            </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-8 lg:p-12 w-full space-y-12 relative z-10 pb-32">
        {/* Component Breakdown */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
            { label: 'Skills Verified', score: details?.components.skillScore, icon: <Award className="w-6 h-6" />, color: 'bg-brand-primary/10 text-brand-primary' },
            { label: 'Work Experience', score: details?.components.experienceScore, icon: <Briefcase className="w-6 h-6" />, color: 'bg-emerald-500/10 text-emerald-500' },
            { label: 'Employer Ratings', score: details?.components.performanceScore, icon: <Star className="w-6 h-6" />, color: 'bg-brand-secondary/10 text-brand-secondary' },
            { label: 'Reliability Index', score: details?.components.reliabilityScore, icon: <ShieldCheck className="w-6 h-6" />, color: 'bg-rose-500/10 text-rose-500' },
            ].map((comp, i) => (
            <div key={i} className="p-8 rounded-[2.5rem] bg-white border border-brand-border space-y-6 shadow-sm hover:shadow-2xl transition-all group">
                <div className="flex justify-between items-center">
                    <div className={`w-14 h-14 rounded-2xl ${comp.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        {comp.icon}
                    </div>
                    <span className="text-3xl font-bold text-brand-secondary tracking-tighter">{comp.score}</span>
                </div>
                <div>
                    <h3 className="text-[10px] font-bold text-brand-muted/40 tracking-widest uppercase mb-1">{comp.label}</h3>
                    <div className="h-1.5 w-full bg-brand-bg rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(comp.score || 0) / 10}%` }}
                            className="h-full bg-brand-primary shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                        />
                    </div>
                </div>
            </div>
            ))}
        </section>

        {/* Career Path */}
        <section className="bg-white border border-brand-border rounded-[3rem] p-10 lg:p-12 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-primary opacity-[0.03] rounded-bl-full pointer-events-none" />
            
            <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-brand-secondary rounded-xl flex items-center justify-center shadow-lg transform -rotate-3">
                    <ArrowUpCircle className="text-brand-primary h-7 w-7" />
                </div>
                <h2 className="text-3xl font-bold text-brand-secondary tracking-tight">The road to L{details?.nextLevel} Integration</h2>
            </div>
            
            <div className="space-y-8">
                <div className="p-8 bg-brand-bg rounded-[2rem] border border-brand-border flex items-start gap-6 shadow-inner">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                        <Info className="h-6 w-6 text-brand-primary" />
                    </div>
                    <div>
                        <h4 className="font-bold text-brand-secondary text-xl">Earnings potential expansion</h4>
                        <p className="text-brand-muted font-medium mt-2 leading-relaxed opacity-60">
                            Reaching Level {details?.nextLevel} typically unlocks premium contracts with pay ranges of <span className="text-brand-secondary font-bold">{details?.salaryRange}</span>.
                        </p>
                    </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                    {details?.achievements.map((ach, i) => (
                    <span key={i} className="px-6 py-3 bg-brand-secondary text-brand-primary rounded-xl text-[10px] font-bold tracking-widest uppercase shadow-xl shadow-brand-secondary/5">
                        {ach}
                    </span>
                    ))}
                </div>
            </div>
        </section>
      </main>
    </>
  );
};

import { useAppDispatch, useAppSelector } from '../../store';
import { fetchLevelDetails } from '../../store/slices/profileSlice';
import { Star, ShieldCheck, Briefcase, Award, ArrowUpCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

export const LevelDetailsPage = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { levelDetails: details, loading: isLoading } = useAppSelector((state) => state.profile);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchLevelDetails(user.id));
    }
  }, [dispatch, user?.id]);

  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <div className="w-16 h-16 border-4 border-[#FACD15] border-t-[#1F3F34] rounded-full animate-spin" />
            <p className="text-[#1F3F34]/40 font-black tracking-widest text-[10px] animate-pulse uppercase">Syncing Level Matrix...</p>
        </div>
    );
  }

  return (
    <div className="relative min-h-screen selection:bg-[#FACD15] selection:text-[#1F3F34]">
      <div className="absolute inset-0 cloud-grid opacity-[0.05] pointer-events-none" />
      
      <header className="p-8 lg:p-12 border-b border-[#1F3F34]/5 bg-[#F5F4EF]/80 backdrop-blur-3xl sticky top-0 z-40">
        <div className="flex justify-between items-end w-full">
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#1F3F34]/40 font-black tracking-widest text-[10px] uppercase">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#FACD15]" /> Professional Standing
                </div>
                <h1 className="text-5xl font-black tracking-tighter text-[#1F3F34] leading-[0.9] bricolage">Level {details?.currentLevel || user?.level || 1} operative</h1>
                <p className="text-[#1F3F34]/60 font-medium text-lg">Your authenticated rank in the TrustHire ecosystem.</p>
            </div>
            <div className="bg-[#1F3F34] border border-[#1F3F34] px-6 py-3 rounded-2xl text-[#FACD15] font-black shadow-xl tracking-widest text-xs">
                {details?.levelScore || 0} PTS
            </div>
        </div>
      </header>

      <main className="p-8 lg:p-12 pr-8 lg:pr-16 w-full space-y-12 relative z-10 pb-32">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
            { label: 'Skills Verified', score: details?.components?.skillScore || 0, icon: <Award className="w-6 h-6" />, color: 'bg-[#FACD15]/10 text-[#FACD15]' },
            { label: 'Work Experience', score: details?.components?.experienceScore || 0, icon: <Briefcase className="w-6 h-6" />, color: 'bg-emerald-500/10 text-emerald-500' },
            { label: 'Employer Ratings', score: details?.components?.performanceScore || 0, icon: <Star className="w-6 h-6" />, color: 'bg-[#1F3F34]/10 text-[#1F3F34]' },
            { label: 'Reliability Index', score: details?.components?.reliabilityScore || 0, icon: <ShieldCheck className="w-6 h-6" />, color: 'bg-rose-500/10 text-rose-500' },
            ].map((comp, i) => (
            <div key={i} className="p-8 rounded-[2.5rem] bg-white border border-[#1F3F34]/5 space-y-6 shadow-sm hover:shadow-2xl transition-all group">
                <div className="flex justify-between items-center">
                    <div className={`w-14 h-14 rounded-2xl ${comp.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        {comp.icon}
                    </div>
                    <span className="text-3xl font-black text-[#1F3F34] tracking-tighter">{comp.score}</span>
                </div>
                <div>
                    <h3 className="text-[10px] font-black text-[#1F3F34]/40 tracking-widest uppercase mb-1">{comp.label}</h3>
                    <div className="h-1.5 w-full bg-[#F5F4EF] rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(comp.score || 0) / 10}%` }}
                            className="h-full bg-[#FACD15]"
                        />
                    </div>
                </div>
            </div>
            ))}
        </section>

        <section className="bg-white border border-[#1F3F34]/5 rounded-[3rem] p-10 lg:p-12 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#FACD15] opacity-[0.03] rounded-bl-full pointer-events-none" />
            
            <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-[#1F3F34] rounded-xl flex items-center justify-center shadow-lg transform -rotate-3">
                    <ArrowUpCircle className="text-[#FACD15] h-7 w-7" />
                </div>
                <h2 className="text-3xl font-black text-[#1F3F34] tracking-tight bricolage">The road to L{details?.nextLevel || 2} Integration</h2>
            </div>
            
            <div className="space-y-8">
                <div className="p-8 bg-[#F5F4EF] rounded-[2rem] border border-[#1F3F34]/5 flex items-start gap-6">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                        <Info className="h-6 w-6 text-[#FACD15]" />
                    </div>
                    <div>
                        <h4 className="font-black text-[#1F3F34] text-xl">Earnings potential expansion</h4>
                        <p className="text-[#1F3F34]/60 font-medium mt-2 leading-relaxed">
                            Reaching Level {details?.nextLevel || 2} typically unlocks premium contracts with pay ranges of <span className="text-[#1F3F34] font-black">{details?.salaryRange || 'higher brackets'}</span>.
                        </p>
                    </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                    {details?.achievements?.map((ach: string, i: number) => (
                    <span key={i} className="px-6 py-3 bg-[#1F3F34] text-[#FACD15] rounded-xl text-[10px] font-black tracking-widest uppercase shadow-xl">
                        {ach}
                    </span>
                    ))}
                </div>
            </div>
        </section>
      </main>
      <style>{`
        .bricolage { font-family: 'Bricolage Grotesque', sans-serif; }
        .cloud-grid {
          background-image: 
            linear-gradient(rgba(31, 63, 52, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(31, 63, 52, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
};

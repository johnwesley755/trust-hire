import { useQuery } from '@tanstack/react-query';
import { levelService } from '../api/level.service';
import { useUser } from '@clerk/clerk-react';
import { Star, ShieldCheck, Briefcase, Award, ArrowUpCircle, Info } from 'lucide-react';

export const LevelDetailsPage = () => {
  const { user } = useUser();
  const { data: details, isLoading } = useQuery({
    queryKey: ['levelDetails', user?.id],
    queryFn: () => levelService.getLevelDetails(user?.id || ''),
    enabled: !!user?.id
  });

  if (isLoading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div></div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 pb-32">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Level {details?.currentLevel} Professional</h1>
          <p className="text-slate-500 mt-2 text-lg">Your standing in the TrustHire ecosystem.</p>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-2xl text-indigo-600 font-bold shadow-sm">
          {details?.levelScore} PTS
        </div>
      </header>

      {/* Component Breakdown */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {[
          { label: 'Skills Verified', score: details?.components.skillScore, icon: <Award className="text-amber-400" />, color: 'from-amber-500/10 to-transparent' },
          { label: 'Work Experience', score: details?.components.experienceScore, icon: <Briefcase className="text-blue-400" />, color: 'from-blue-500/10 to-transparent' },
          { label: 'Employer Ratings', score: details?.components.performanceScore, icon: <Star className="text-emerald-400" />, color: 'from-emerald-500/10 to-transparent' },
          { label: 'Reliability Index', score: details?.components.reliabilityScore, icon: <ShieldCheck className="text-rose-400" />, color: 'from-rose-500/10 to-transparent' },
        ].map((comp, i) => (
          <div key={i} className={`p-8 rounded-4xl bg-white border border-slate-200 space-y-4 shadow-sm`}>
            <div className="flex justify-between items-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                {comp.icon}
              </div>
              <span className="text-2xl font-black text-slate-900">{comp.score}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-600">{comp.label}</h3>
          </div>
        ))}
      </section>

      {/* Career Path */}
      <section className="bg-white border border-slate-200 rounded-4xl p-8 mb-10 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <ArrowUpCircle className="text-indigo-600 h-6 w-6" />
          <h2 className="text-2xl font-bold">The Road to L{details?.nextLevel}</h2>
        </div>
        <div className="space-y-6">
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-start gap-4">
            <Info className="h-6 w-6 text-indigo-600 mt-1" />
            <div>
              <h4 className="font-bold">Estimated Earnings Increase</h4>
              <p className="text-slate-500 text-sm mt-1">Reaching Level {details?.nextLevel} typically unlocks jobs with pay ranges of {details?.salaryRange}.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {details?.achievements.map((ach, i) => (
              <span key={i} className="px-4 py-2 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl text-xs font-bold uppercase tracking-wider">
                {ach}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

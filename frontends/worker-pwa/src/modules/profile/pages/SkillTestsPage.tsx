import { useQuery } from '@tanstack/react-query';
import { skillTestService } from '../api/skill-test.service';
import type { SkillTest } from '../api/skill-test.service';
import { Clock, Trophy, ChevronRight, Play } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { SkillTestUI } from '../components/SkillTestUI';

export interface TestSubmission {
  testId: string;
  userId: string;
  answers: unknown[];
  maxPoints: number;
}

export const SkillTestsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [activeTest, setActiveTest] = useState<SkillTest | null>(null);

  const { data: tests, isLoading } = useQuery({
    queryKey: ['availableTests', selectedCategory],
    queryFn: () => skillTestService.getAvailableTests(selectedCategory)
  });

  if (activeTest) {
    return (
      <SkillTestUI 
        testId={activeTest.id}
        onClose={() => setActiveTest(null)}
        onComplete={() => {
          // Success logic here (e.g., refetch profile)
        }}
      />
    );
  }

  return (
    <>
      <div className="absolute inset-0 cloud-grid opacity-[0.05] pointer-events-none" />
      
      <header className="p-8 lg:p-12 border-b border-brand-border bg-brand-bg/80 backdrop-blur-3xl sticky top-0 z-40">
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-brand-secondary/40 font-semibold tracking-widest text-[10px]">
                <Trophy className="w-3.5 h-3.5 text-brand-primary" /> Accreditation Matrix
            </div>
            <h1 className="text-5xl font-bold tracking-tighter text-brand-secondary leading-[0.9]">Skill assessments</h1>
            <p className="text-brand-muted font-medium text-lg opacity-60">Verify your expertise to unlock higher levels and premium opportunities.</p>
        </div>
      </header>

      <main className="p-8 lg:p-12 pr-8 lg:pr-16 w-full space-y-10 relative z-10 pb-32">
        {/* Categories */}
        <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
            {['All', 'Electrical', 'Cooking', 'Cleaning', 'Security'].map(cat => (
            <button
                key={cat}
                onClick={() => setSelectedCategory(cat === 'All' ? undefined : cat)}
                className={`px-8 py-3 rounded-full font-semibold whitespace-nowrap border transition-all text-[10px] tracking-widest ${
                (selectedCategory === cat || (cat === 'All' && !selectedCategory))
                    ? 'bg-brand-secondary border-brand-secondary text-brand-primary shadow-xl shadow-brand-secondary/10'
                    : 'bg-white border-brand-border text-brand-muted'
                }`}
            >
                {cat.toUpperCase()}
            </button>
            ))}
        </div>

        {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-6">
                <div className="w-16 h-16 border-4 border-brand-primary border-t-brand-secondary rounded-full animate-spin" />
                <p className="text-brand-muted font-semibold tracking-widest text-[10px] animate-pulse">Syncing Assessments...</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-6">
            {tests?.map(test => (
                <button
                key={test.id}
                onClick={() => setActiveTest(test)}
                className="bg-white border border-brand-border rounded-[2.5rem] p-8 flex items-center justify-between group hover:border-brand-primary transition-all text-left shadow-sm hover:shadow-2xl"
                >
                <div className="flex items-center gap-6">
                    <div className={`p-5 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform ${
                    test.difficulty === 'Advanced' ? 'bg-rose-500/10 text-rose-500' :
                    test.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-500' :
                    'bg-emerald-500/10 text-emerald-500'
                    }`}>
                    <Trophy className="h-8 w-8 text-brand-primary" />
                    </div>
                    <div>
                    <h3 className="text-2xl font-bold text-brand-secondary tracking-tight group-hover:text-brand-primary transition-colors">{test.title}</h3>
                    <div className="flex items-center gap-6 mt-1 text-[10px] font-bold tracking-widest text-brand-muted/40 group-hover:text-brand-muted transition-colors">
                        <span className="flex items-center gap-2 uppercase"><Clock className="h-4 w-4" /> {test.durationMinutes}m</span>
                        <div className="w-1 h-1 bg-brand-border rounded-full" />
                        <span className="flex items-center gap-2 text-brand-secondary uppercase">+{test.points} PTS</span>
                    </div>
                    </div>
                </div>
                <div className="p-3 bg-brand-bg rounded-xl group-hover:bg-brand-secondary group-hover:text-brand-primary transition-all">
                    <ChevronRight className="h-6 w-6" />
                </div>
                </button>
            ))}
            </div>
        )}
      </main>
    </>
  );
};

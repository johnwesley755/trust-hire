import { useQuery } from '@tanstack/react-query';
import { skillTestService } from '../api/skill-test.service';
import type { SkillTest } from '../api/skill-test.service';
import { Clock, Trophy, ChevronRight, Play } from 'lucide-react';
import { useState } from 'react';

export interface TestSubmission {
  testId: string;
  clerkId: string;
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
      <div className="min-h-screen bg-primary-950 p-6 flex items-center justify-center text-white">
        <div className="max-w-xl w-full bg-primary-900/50 backdrop-blur-xl border border-white/10 rounded-4xl p-10 text-center space-y-8">
          <div className="mx-auto w-20 h-20 bg-blue-500/20 rounded-3xl flex items-center justify-center border border-blue-500/30">
            <Play className="h-10 w-10 text-blue-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">{activeTest.title}</h2>
            <p className="text-white/60">{activeTest.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <span className="block text-xs font-bold text-white/40 uppercase tracking-widest">Duration</span>
              <span className="text-xl font-bold">{activeTest.durationMinutes}m</span>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <span className="block text-xs font-bold text-white/40 uppercase tracking-widest">Points</span>
              <span className="text-xl font-bold">+{activeTest.points}</span>
            </div>
          </div>
          <button 
            onClick={() => setActiveTest(null)} // Mocking start
            className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-500/20"
          >
            Start Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-950 text-white p-6 pb-32">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Skill Assessments</h1>
        <p className="text-white/50 mt-2 text-lg">Verify your expertise to unlock higher levels and better jobs.</p>
      </header>

      {/* Categories */}
      <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
        {['All', 'Electrical', 'Cooking', 'Cleaning', 'Security'].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat === 'All' ? undefined : cat)}
            className={`px-6 py-3 rounded-full font-bold whitespace-nowrap border transition-all ${
              (selectedCategory === cat || (cat === 'All' && !selectedCategory))
                ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-500/20'
                : 'bg-white/5 border-white/10 text-white/60'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {tests?.map(test => (
            <button
              key={test.id}
              onClick={() => setActiveTest(test)}
              className="bg-primary-900/40 backdrop-blur-md border border-white/10 rounded-4xl p-8 flex items-center justify-between group hover:border-blue-500/50 transition-all text-left"
            >
              <div className="flex items-center gap-6">
                <div className={`p-4 rounded-3xl ${
                  test.difficulty === 'Advanced' ? 'bg-rose-500/10 text-rose-400' :
                  test.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-emerald-500/10 text-emerald-400'
                }`}>
                  <Trophy className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{test.title}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-white/40">
                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {test.durationMinutes}m</span>
                    <span className="flex items-center gap-1 font-black text-blue-400">+{test.points} PTS</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="h-6 w-6 text-white/20 group-hover:text-white transition-colors" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

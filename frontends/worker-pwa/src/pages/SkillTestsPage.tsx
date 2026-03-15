import { useQuery } from '@tanstack/react-query';
import { skillTestService } from '../api/skill-test.service';
import type { SkillTest } from '../api/skill-test.service';
import { Clock, Trophy, ChevronRight, Play } from 'lucide-react';
import { useState } from 'react';

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
      <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center text-slate-900">
        <div className="max-w-xl w-full bg-white border border-slate-200 rounded-4xl p-10 text-center space-y-8 shadow-lg">
          <div className="mx-auto w-20 h-20 bg-blue-500/20 rounded-3xl flex items-center justify-center border border-blue-500/30">
            <Play className="h-10 w-10 text-blue-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">{activeTest.title}</h2>
            <p className="text-slate-500">{activeTest.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Duration</span>
              <span className="text-xl font-bold text-slate-900">{activeTest.durationMinutes}m</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Points</span>
              <span className="text-xl font-bold text-slate-900">+{activeTest.points}</span>
            </div>
          </div>
          <button 
            onClick={() => setActiveTest(null)} // Mocking start
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-bold transition-all shadow-lg"
          >
            Start Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 pb-32">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Skill Assessments</h1>
        <p className="text-slate-500 mt-2 text-lg">Verify your expertise to unlock higher levels and better jobs.</p>
      </header>

      {/* Categories */}
      <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
        {['All', 'Electrical', 'Cooking', 'Cleaning', 'Security'].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat === 'All' ? undefined : cat)}
            className={`px-6 py-3 rounded-full font-bold whitespace-nowrap border transition-all ${
              (selectedCategory === cat || (cat === 'All' && !selectedCategory))
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg'
                : 'bg-white border-slate-200 text-slate-500'
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
              className="bg-white border border-slate-200 rounded-4xl p-8 flex items-center justify-between group hover:border-indigo-500 transition-all text-left shadow-sm"
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
                  <div className="flex items-center gap-4 mt-1 text-sm text-slate-400">
                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {test.durationMinutes}m</span>
                    <span className="flex items-center gap-1 font-black text-indigo-600">+{test.points} PTS</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="h-6 w-6 text-slate-200 group-hover:text-indigo-600 transition-colors" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

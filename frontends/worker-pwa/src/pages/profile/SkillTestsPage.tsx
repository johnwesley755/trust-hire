import { useAppDispatch, useAppSelector } from '../../store';
import { fetchAvailableTests } from '../../store/slices/skillSlice';
import type { SkillTest } from '../../store/slices/skillSlice';
import { Clock, Trophy, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { SkillTestUI } from '../../components/profile/SkillTestUI';

export const SkillTestsPage = () => {
  const dispatch = useAppDispatch();
  const { availableTests: tests, loading: isLoading } = useAppSelector((state) => state.skill);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [activeTest, setActiveTest] = useState<SkillTest | null>(null);

  useEffect(() => {
    dispatch(fetchAvailableTests(selectedCategory));
  }, [dispatch, selectedCategory]);

  if (activeTest) {
    return (
      <SkillTestUI 
        testId={activeTest.id}
        onClose={() => setActiveTest(null)}
        onComplete={() => {
          dispatch(fetchAvailableTests(selectedCategory));
        }}
      />
    );
  }

  return (
    <div className="relative min-h-screen selection:bg-[#FACD15] selection:text-[#1F3F34]">
      <div className="absolute inset-0 cloud-grid opacity-[0.05] pointer-events-none" />
      
      <header className="p-8 lg:p-12 border-b border-[#1F3F34]/5 bg-[#F5F4EF]/80 backdrop-blur-3xl sticky top-0 z-40">
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#1F3F34]/40 font-black tracking-widest text-[10px] uppercase">
                <Trophy className="w-3.5 h-3.5 text-[#FACD15]" /> Accreditation Matrix
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-[#1F3F34] leading-[0.9] bricolage">Skill assessments</h1>
            <p className="text-[#1F3F34]/60 font-medium text-lg">Verify your expertise to unlock higher levels and premium opportunities.</p>
        </div>
      </header>

      <main className="p-8 lg:p-12 pr-8 lg:pr-16 w-full space-y-10 relative z-10 pb-32">
        <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar">
            {['All', 'Electrical', 'Cooking', 'Cleaning', 'Security'].map(cat => (
            <button
                key={cat}
                onClick={() => setSelectedCategory(cat === 'All' ? undefined : cat)}
                className={`px-8 py-3 rounded-full font-black whitespace-nowrap border transition-all text-[10px] tracking-widest uppercase ${
                (selectedCategory === cat || (cat === 'All' && !selectedCategory))
                    ? 'bg-[#1F3F34] border-[#1F3F34] text-[#FACD15] shadow-xl'
                    : 'bg-white border-[#1F3F34]/10 text-[#1F3F34]/60'
                }`}
            >
                {cat}
            </button>
            ))}
        </div>

        {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-6">
                <div className="w-16 h-16 border-4 border-[#FACD15] border-t-[#1F3F34] rounded-full animate-spin" />
                <p className="text-[#1F3F34]/40 font-black tracking-widest text-[10px] animate-pulse uppercase">Syncing Assessments...</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-6">
            {tests?.map(test => (
                <button
                key={test.id}
                onClick={() => setActiveTest(test)}
                className="bg-white border border-[#1F3F34]/10 rounded-[2.5rem] p-8 flex items-center justify-between group hover:border-[#FACD15] transition-all text-left shadow-sm hover:shadow-2xl"
                >
                <div className="flex items-center gap-6">
                    <div className={`p-5 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform bg-[#F5F4EF] text-[#1F3F34]`}>
                    <Trophy className="h-8 w-8 text-[#FACD15]" />
                    </div>
                    <div>
                    <h3 className="text-2xl font-black text-[#1F3F34] tracking-tight bricolage group-hover:text-[#FACD15] transition-colors">{test.title}</h3>
                    <div className="flex items-center gap-6 mt-1 text-[10px] font-black tracking-widest text-[#1F3F34]/40 uppercase">
                        <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> {test.durationMinutes}m</span>
                        <div className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span className="flex items-center gap-2 text-[#1F3F34]">+{test.points} PTS</span>
                    </div>
                    </div>
                </div>
                <div className="p-3 bg-[#F5F4EF] rounded-xl group-hover:bg-[#1F3F34] group-hover:text-[#FACD15] transition-all">
                    <ChevronRight className="h-6 w-6" />
                </div>
                </button>
            ))}
            </div>
        )}
      </main>
      <style>{`
        .bricolage { font-family: 'Bricolage Grotesque', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
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

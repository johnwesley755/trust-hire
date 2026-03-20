import { useUser } from "../../../core/providers/AuthContext";
import { PlusCircle } from 'lucide-react';
import { StatsGrid, RecentApplicants } from '../features/DashboardComponents';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <>
      <main className="flex-1 p-4 md:p-12 overflow-auto relative">
        <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-linear-to-bl from-brand-primary/5 to-transparent blur-3xl pointer-events-none" />
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 relative z-10">
          <div className="space-y-1">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-900">
              Welcome back, <br />
              <span className="text-brand-primary">{user?.firstName}.</span>
            </h2>
            <p className="text-brand-muted font-medium text-sm md:text-lg">Your business management hub is ready.</p>
          </div>
          <button 
            onClick={() => navigate('/post-job')}
            className="group bg-brand-secondary text-brand-primary px-6 md:px-10 py-4 md:py-5 rounded-4xl font-semibold text-sm md:text-lg hover:bg-neutral-800 transition-all active:scale-95 cursor-pointer flex items-center gap-4 shadow-xl shadow-brand-secondary/10 uppercase tracking-widest relative overflow-hidden w-full md:w-auto justify-center"
          >
            <PlusCircle className="w-6 h-6" />
            Post a Job
          </button>
        </header>

        <div className="relative z-10">
            <StatsGrid />
            <RecentApplicants />
        </div>
      </main>
    </>
  );
}

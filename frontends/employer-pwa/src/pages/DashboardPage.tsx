import { useUser } from "@clerk/clerk-react";
import { PlusCircle } from 'lucide-react';
import { DashboardSidebar, StatsGrid, RecentApplicants } from '../features/dashboard/DashboardComponents';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 flex">
      <DashboardSidebar />

      <main className="flex-1 p-10 overflow-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black tracking-tight">Welcome back, {user?.firstName}</h2>
            <p className="text-slate-500 mt-1">Here's what's happening with your hires today.</p>
          </div>
          <button 
            onClick={() => navigate('/post-job')}
            className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-all active:scale-95 cursor-pointer flex items-center gap-2 shadow-lg"
          >
            <PlusCircle className="w-5 h-5" />
            Post New Job
          </button>
        </header>

        <StatsGrid />
        <RecentApplicants />
      </main>
    </div>
  );
}

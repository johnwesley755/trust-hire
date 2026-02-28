import { useUser } from "@clerk/clerk-react";
import { PlusCircle } from 'lucide-react';
import { DashboardSidebar, StatsGrid, RecentApplicants } from '../features/dashboard/DashboardComponents';

export default function DashboardPage() {
  const { user } = useUser();

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white flex">
      <DashboardSidebar />

      <main className="flex-1 p-10 overflow-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold">Welcome back, {user?.firstName}</h2>
            <p className="text-slate-400 mt-1">Here's what's happening with your hires today.</p>
          </div>
          <button className="bg-white text-black px-6 py-2.5 rounded-full font-semibold hover:bg-slate-100 transition-all active:scale-95 cursor-pointer flex items-center gap-2">
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

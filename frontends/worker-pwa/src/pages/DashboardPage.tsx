import { UserButton } from "@clerk/clerk-react";
import { ProfileCard, ActionGrid, BottomNav } from '../features/dashboard/DashboardComponents';

export default function DashboardPage() {
  return (
    <div className="min-h-screen w-full bg-[#070b14] text-white pb-20">
      <header className="p-6 flex justify-between items-center border-b border-white/5 sticky top-0 bg-[#070b14]/80 backdrop-blur-xl z-50">
        <div className="text-xl font-black italic tracking-tighter uppercase">TrustPro</div>
        <UserButton afterSignOutUrl="/" />
      </header>

      <main className="p-6 max-w-lg mx-auto space-y-8 animate-in slide-in-from-bottom duration-500">
        <ProfileCard />
        <ActionGrid />
        
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <h3 className="text-lg font-bold">Jobs Near You</h3>
            <button className="text-xs text-indigo-400 font-bold uppercase cursor-pointer">View All</button>
          </div>
          <div className="p-6 rounded-3xl bg-white/3 border border-white/6 space-y-4 shadow-xl shadow-black/40">
            <div className="flex justify-between">
              <div>
                <h4 className="font-bold">Senior Cleaning Professional</h4>
                <p className="text-xs text-slate-500">Indiranagar • 2.4km away</p>
              </div>
              <span className="text-emerald-400 font-black">₹22,000</span>
            </div>
            <button className="w-full py-3 bg-white text-black rounded-2xl font-bold active:scale-95 transition-all text-sm cursor-pointer shadow-lg">Quick Apply</button>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}

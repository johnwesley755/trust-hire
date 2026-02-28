import { SignedOut, SignInButton } from "@clerk/clerk-react";
import { Award, TrendingUp, Search, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#070b14] text-white p-6 text-center">
      <div className="max-w-3xl space-y-8 animate-in fade-in duration-700">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold mb-4 uppercase tracking-widest animate-pulse">
          <Award className="w-4 h-4" />
          Build Your Career
        </div>
        <h1 className="text-6xl md:text-7xl font-bold tracking-tighter leading-none mb-6">
          The Pro <span className="text-indigo-500">Way</span> to Work.
        </h1>
        <p className="text-xl text-slate-400 max-w-xl mx-auto font-medium">
          Showcase your skills, get verified, and land premium jobs with the highest ratings.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-500/30 active:scale-95 cursor-pointer">
                Apply Now
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
      
      <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
        {[
          { label: "High Salary", icon: <TrendingUp /> },
          { label: "Verified Stats", icon: <ShieldCheck /> },
          { label: "Level L1-L4", icon: <Award /> },
          { label: "Job Alerts", icon: <Search /> }
        ].map((item, i) => (
          <div key={i} className="p-6 rounded-3xl bg-white/2 border border-white/5 flex flex-col items-center gap-3">
            <div className="text-indigo-400">{item.icon}</div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

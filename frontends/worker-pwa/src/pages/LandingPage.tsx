import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Award, TrendingUp, Search, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 text-slate-900 p-6 text-center">
      <div className="max-w-3xl space-y-8 animate-in fade-in duration-700">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-bold mb-4 uppercase tracking-widest">
          <Award className="w-4 h-4" />
          Build Your Career
        </div>
        <h1 className="text-6xl md:text-7xl font-bold tracking-tighter leading-none mb-6">
          The Pro <span className="text-indigo-500">Way</span> to Work.
        </h1>
        <p className="text-xl text-slate-600 max-w-xl mx-auto font-medium">
          Showcase your skills, get verified, and land premium jobs with the highest ratings.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <SignedOut>
            <Link to="/sign-in" className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-500/30 active:scale-95">
              Apply Now
            </Link>
            <Link to="/sign-up" className="px-10 py-5 bg-white border border-slate-200 hover:bg-slate-50 rounded-2xl font-bold transition-all shadow-sm">
              Sign Up
            </Link>
          </SignedOut>
          <SignedIn>
            <Link to="/dashboard" className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-500/30 active:scale-95">
              Go to Dashboard
            </Link>
          </SignedIn>
        </div>
      </div>
      
      <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
        {[
          { label: "High Salary", icon: <TrendingUp /> },
          { label: "Verified Stats", icon: <ShieldCheck /> },
          { label: "Level L1-L4", icon: <Award /> },
          { label: "Job Alerts", icon: <Search /> }
        ].map((item, i) => (
          <div key={i} className="p-6 rounded-3xl bg-white border border-slate-200 flex flex-col items-center gap-3 shadow-sm">
            <div className="text-indigo-400">{item.icon}</div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

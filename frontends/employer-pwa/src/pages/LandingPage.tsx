import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Users, Briefcase, LayoutDashboard } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 text-slate-900 p-6 text-center">
      <div className="max-w-3xl space-y-8">
        <h1 className="text-6xl font-bold tracking-tight bg-linear-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          Hire with Absolute Trust
        </h1>
        <p className="text-xl text-slate-600 max-w-xl mx-auto">
          The premium platform for business owners to find, verify, and hire verified service professionals.
        </p>
        <div className="flex gap-4 justify-center">
          <SignedOut>
            <Link to="/sign-in" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
              Get Started
            </Link>
            <Link to="/sign-up" className="px-8 py-4 bg-white border border-slate-200 hover:bg-slate-50 rounded-full font-semibold transition-all shadow-sm">
              Sign Up
            </Link>
          </SignedOut>
          <SignedIn>
            <Link to="/dashboard" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
              Go to Dashboard
            </Link>
          </SignedIn>
        </div>
      </div>
      
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {[
          { title: "Verified Workers", desc: "Aadhaar verified and AI face-matched", icon: <Users className="w-6 h-6" /> },
          { title: "Smart Screening", desc: "AI matching for the perfect fit", icon: <Briefcase className="w-6 h-6" /> },
          { title: "Real-time Tracking", desc: "Monitor jobs and attendance live", icon: <LayoutDashboard className="w-6 h-6" /> }
        ].map((feature, i) => (
          <div key={i} className="p-8 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 transition-all shadow-sm text-left space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold">{feature.title}</h3>
            <p className="text-slate-600">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

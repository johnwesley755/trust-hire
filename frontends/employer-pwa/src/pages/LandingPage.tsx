import { SignedOut, SignInButton } from "@clerk/clerk-react";
import { Users, Briefcase, LayoutDashboard } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-white p-6 text-center">
      <div className="max-w-3xl space-y-8">
        <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          Hire with Absolute Trust
        </h1>
        <p className="text-xl text-slate-300 max-w-xl mx-auto">
          The premium platform for business owners to find, verify, and hire verified service professionals.
        </p>
        <div className="flex gap-4 justify-center">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-full font-semibold transition-all shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer">
                Get Started
              </button>
            </SignInButton>
          </SignedOut>
          <button className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full font-semibold transition-all backdrop-blur-md cursor-pointer">
            Learn More
          </button>
        </div>
      </div>
      
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {[
          { title: "Verified Workers", desc: "Aadhaar verified and AI face-matched", icon: <Users className="w-6 h-6" /> },
          { title: "Smart Screening", desc: "AI matching for the perfect fit", icon: <Briefcase className="w-6 h-6" /> },
          { title: "Real-time Tracking", desc: "Monitor jobs and attendance live", icon: <LayoutDashboard className="w-6 h-6" /> }
        ].map((feature, i) => (
          <div key={i} className="p-8 rounded-2xl bg-white/2 border border-white/5 hover:border-white/10 transition-all text-left space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold">{feature.title}</h3>
            <p className="text-slate-400">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

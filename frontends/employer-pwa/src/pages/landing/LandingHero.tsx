import { Link } from "react-router-dom";
import { CheckCircle2, Zap, ArrowRight, Star } from "lucide-react";

export function LandingHero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Copy */}
        <div className="space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold border border-indigo-100 uppercase tracking-wider">
            <Zap className="w-4 h-4" />
            Revolutionizing Hiring
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
            Hire{" "}
            <span className="bg-linear-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              Verified
            </span>{" "}
            Professionals{" "}
            <span className="text-indigo-600">Instantly.</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
            India's first premium platform for business owners. Aadhaar
            verified, face-matched, and performance-rated workers at your
            fingertips.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/sign-up"
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg transition-all shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:-translate-y-1 flex items-center justify-center gap-2 group"
            >
              Start Hiring Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="flex -space-x-3 items-center ml-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-full border-4 border-white overflow-hidden bg-slate-200"
                >
                  <img src={`https://i.pravatar.cc/150?u=${i + 20}`} alt="user" />
                </div>
              ))}
              <div className="pl-6 text-sm">
                <div className="flex text-amber-500 mb-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3 h-3 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 font-medium">
                  Trusted by 500+ Businesses
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Visual */}
        <div className="relative animate-float">
          <div className="absolute -inset-4 bg-indigo-500/10 rounded-[2.5rem] blur-3xl" />
          <div className="relative bg-white p-4 rounded-[2.5rem] shadow-2xl border border-white/20">
            <img
              src="/assets/landing/hero-visual.png"
              alt="TrustHire Platform"
              className="rounded-[1.8rem] w-full shadow-inner"
            />
          </div>
          {/* Floating Stat */}
          <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-3xl shadow-xl border border-slate-100 flex items-center gap-4 animate-fade-in-up">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">100%</p>
              <p className="text-xs font-bold text-slate-500 uppercase">
                Verification Rate
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

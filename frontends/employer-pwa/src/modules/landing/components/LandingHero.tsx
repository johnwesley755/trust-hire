import { Link } from "react-router-dom";

export function LandingHero() {
  return (
    <section className="relative min-h-[80vh] flex items-center pt-[72px] pb-8 overflow-hidden bg-brand-beige">
      {/* Decorative Blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-amber/20 organic-blob blur-3xl opacity-50"></div>
      <div className="absolute top-1/2 -right-48 w-[500px] h-[500px] bg-emerald-900/10 organic-blob-alt blur-3xl"></div>
      
      <div className="container mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-8 items-center relative">
        <div className="z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-forest/5 text-brand-forest text-xs font-bold uppercase tracking-wider mb-6">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Early Access Now Open
          </div>
          <h1 className="text-5xl md:text-[68px] font-extrabold leading-[0.95] text-brand-forest text-heavy mb-6">
            Hire Verified Workers. <br/>
            <span className="relative">
              Zero Risk.
              <span className="absolute bottom-1 left-0 w-full h-3 bg-brand-amber -z-10 opacity-60"></span>
            </span>
          </h1>
          <p className="text-xl text-brand-forest/80 leading-snug mb-8 max-w-lg">
            Be among the first employers to hire verified blue-collar talent. Secure your spot on India's most trusted hiring network.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/post-job" className="btn-primary px-10 py-4 uppercase text-lg shadow-[inset_0_-4px_0_rgba(0,0,0,0.1)] hover:translate-y-[-2px] flex items-center justify-center">
              Post Your First Job
            </Link>
            <button className="btn-secondary px-8 py-4 flex items-center gap-3 hover:bg-white">
              <span className="material-symbols-outlined">how_to_reg</span>
              Join the Waitlist
            </button>
          </div>
          <p className="mt-6 text-sm font-bold text-brand-forest/50 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            Aadhaar-linked verification for every profile
          </p>
        </div>

        <div className="relative">
          <div className="organic-blob w-full aspect-square bg-brand-amber/10 absolute -top-4 -right-4 -z-20 scale-105"></div>
          <div className="organic-blob w-full aspect-square overflow-hidden shadow-2xl relative">
            <img 
              alt="Professional Indian chef smiling in a kitchen" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCldjp9y2iCXzw_TYlraY2g4bgvYnLsdXCK4uUj52MODFpJXwuAoEAJUs2GPtD1s2d8lK67_7UHuTHJBg8_H8Ub1p2zW_hMcVHN0oOSiT-9XHZzZvyCx5seHxxo1px1mBmpmC0RNtcgWsKwhH4uo-qTRoPNFWfdfIGKGPhbSpOC8WiYsq1zInGDXDGphRTuZ70orcrHBI9YpgTIRJVfMeydtNINLuF5PZ9s0PSUIrZpHOUBi0Y2HB9vTSS_l2KgQ8zpGkLIP9keqZc" 
            />
          </div>
          {/* Floating Card */}
          <div className="absolute -bottom-4 -left-4 bg-white p-5 rounded-2xl shadow-xl border-l-4 border-brand-amber max-w-[240px]">
            <div className="flex justify-between items-start mb-2">
              <span className="bg-brand-forest text-brand-amber text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Top 1% Talent</span>
            </div>
            <h3 className="font-bold text-brand-forest">Verified Workforce</h3>
            <p className="text-[12px] text-brand-forest/60">Ready to start within 24 hours.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

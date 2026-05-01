import { Link } from "react-router-dom";

export function LandingHero() {
  return (
    <section className="relative min-h-[80vh] flex items-center pt-[72px] pb-8 overflow-hidden bg-[#F5F4EF]">
      {/* Decorative Blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#FACD15]/20 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute top-1/2 -right-48 w-[500px] h-[500px] bg-[#1F3F34]/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-8 items-center relative">
        <div className="z-10 text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1F3F34]/5 text-[#1F3F34] text-[10px] font-black uppercase tracking-widest mb-6 border border-[#1F3F34]/10">
            <span className="flex h-2 w-2 rounded-full bg-[#FACD15] animate-pulse"></span>
            Early Access Now Open
          </div>
          <h1 className="text-5xl md:text-[68px] font-black leading-[0.95] text-[#1F3F34] mb-6 uppercase bricolage">
            Hire Verified <br/>
            <span className="relative">
              Workers.
              <span className="absolute bottom-1 left-0 w-full h-3 bg-[#FACD15] -z-10 opacity-60"></span>
            </span>
          </h1>
          <p className="text-xl text-[#1F3F34]/60 leading-snug mb-10 max-w-lg font-medium">
            Be among the first employers to hire verified blue-collar talent. Secure your spot on India's most trusted hiring network.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/post-job" className="bg-[#FACD15] text-[#1F3F34] px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-[#FACD15]/10 hover:translate-y-[-2px] active:scale-95 transition-all flex items-center justify-center">
              Post Your First Job
            </Link>
            <button className="bg-white text-[#1F3F34] px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-[#1F3F34]/5 border border-[#1F3F34]/5 flex items-center gap-3 hover:bg-[#F5F4EF] active:scale-95 transition-all">
              <span className="material-symbols-outlined">how_to_reg</span>
              Join the Waitlist
            </button>
          </div>
          <p className="mt-8 text-[10px] font-black text-[#1F3F34]/40 uppercase tracking-widest flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            Aadhaar-linked verification for every profile
          </p>
        </div>

        <div className="relative">
          <div className="w-full aspect-square bg-[#FACD15]/5 absolute -top-4 -right-4 -z-20 scale-105 rounded-[5rem]"></div>
          <div className="w-full aspect-square overflow-hidden shadow-2xl relative rounded-[5rem] bg-[#1F3F34]">
            <img 
              alt="Professional Indian chef" 
              className="w-full h-full object-cover grayscale-[0.2]" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCldjp9y2iCXzw_TYlraY2g4bgvYnLsdXCK4uUj52MODFpJXwuAoEAJUs2GPtD1s2d8lK67_7UHuTHJBg8_H8Ub1p2zW_hMcVHN0oOSiT-9XHZzZvyCx5seHxxo1px1mBmpmC0RNtcgWsKwhH4uo-qTRoPNFWfdfIGKGPhbSpOC8WiYsq1zInGDXDGphRTuZ70orcrHBI9YpgTIRJVfMeydtNINLuF5PZ9s0PSUIrZpHOUBi0Y2HB9vTSS_l2KgQ8zpGkLIP9keqZc" 
            />
          </div>
          {/* Floating Card */}
          <div className="absolute -bottom-4 -left-4 bg-white p-6 rounded-[2.5rem] shadow-2xl border-l-4 border-[#FACD15] max-w-[240px] text-left">
            <div className="flex justify-between items-start mb-2">
              <span className="bg-[#1F3F34] text-[#FACD15] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Top 1% Talent</span>
            </div>
            <h3 className="font-black text-[#1F3F34] uppercase bricolage">Verified Workforce</h3>
            <p className="text-[12px] text-[#1F3F34]/60 font-medium">Ready to start within 24 hours.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

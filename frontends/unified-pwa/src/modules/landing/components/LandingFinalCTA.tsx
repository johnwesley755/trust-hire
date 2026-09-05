import { Link } from "react-router-dom";

export function LandingFinalCTA() {
  return (
    <section className="py-20 px-6 md:px-12 max-w-[1440px] mx-auto relative overflow-visible">
      <div className="absolute -top-10 -left-10 w-48 h-48 bg-[#FACD15]/20 blob-1 -z-10 animate-pulse"></div>
      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#456559]/20 blob-3 -z-10 animate-pulse" style={{ animationDelay: "1s" }}></div>
      
      <div className="bg-[#1F3F34] rounded-[60px] p-12 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center gap-16">
        <div className="relative z-10 flex-1">
          <h2 className="text-[42px] md:text-[60px] font-extrabold text-white leading-tight font-headline mb-8">
            Start Your <br/><span className="text-[#FACD15]">Better Life</span> Today.
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link 
              to="/sign-up?role=WORKER"
              className="bg-[#FACD15] text-[#1F3F34] px-10 py-5 rounded-[12px] font-extrabold flex items-center gap-3 hover:brightness-110 transition-all shadow-xl active:scale-95 uppercase text-sm tracking-wider"
            >
              <span className="material-symbols-outlined font-bold">rocket_launch</span>
              Get Started Now
            </Link>
            <Link 
              to="/sign-in"
              className="bg-transparent border-2 border-[#FACD15] text-[#FACD15] px-10 py-5 rounded-[12px] font-extrabold hover:bg-[#FACD15] hover:text-[#1F3F34] transition-all active:scale-95 uppercase text-sm tracking-wider flex items-center justify-center"
            >
              Sign In
            </Link>
          </div>
        </div>
        
        <div className="relative flex-1 w-full max-w-sm">
          {/* Nearest Job Card */}
          <div className="bg-white p-6 rounded-[32px] shadow-2xl animate-pulse border-4 border-primary-fixed/30 relative z-20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <span className="material-symbols-outlined font-bold">location_on</span>
              </div>
              <span className="font-bold text-primary font-label">Job nearby in 2km</span>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-surface-container rounded-full w-3/4"></div>
              <div className="h-4 bg-surface-container rounded-full w-1/2"></div>
              <div className="flex justify-between items-center mt-6">
                <span className="text-xl font-black text-primary font-headline">₹25k Monthly</span>
                <button className="bg-primary text-white px-4 py-2 rounded-[12px] text-sm font-bold hover:scale-105 transition-transform active:scale-95">Apply</button>
              </div>
            </div>
          </div>
          <div className="absolute -z-10 -bottom-20 -right-20 w-80 h-80 bg-primary-fixed/20 blob-2 blur-3xl"></div>
        </div>
      </div>
    </section>
  );
}

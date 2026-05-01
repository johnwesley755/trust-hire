import { Link } from "react-router-dom";

export function LandingDualCTA() {
  return (
    <section className="grid md:grid-cols-2">
      <div className="bg-[#FACD15] p-12 md:p-24 flex flex-col justify-center items-start relative overflow-hidden group text-left">
        <div className="absolute top-0 left-0 w-full h-full bg-[#1F3F34]/5 rounded-full -translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-1000 blur-3xl"></div>
        <h2 className="text-4xl font-black text-[#1F3F34] mb-6 z-10 uppercase bricolage">I want to hire.</h2>
        <p className="text-[#1F3F34] text-lg mb-10 max-w-sm z-10 font-medium">Access verified operatives and scale your tactical capacity today with zero onboarding friction.</p>
        <Link to="/post-job" className="bg-[#1F3F34] text-white font-black px-12 py-5 rounded-2xl uppercase text-sm tracking-widest shadow-xl shadow-[#1F3F34]/10 hover:translate-y-[-4px] active:scale-95 transition-all z-10">
          Post a Tactical Job
        </Link>
      </div>
      <div className="bg-[#1F3F34] p-12 md:p-24 flex flex-col justify-center items-start text-white relative overflow-hidden group text-left">
        <div className="absolute bottom-0 right-0 w-full h-full bg-white/5 rounded-full translate-x-1/2 translate-y-1/2 group-hover:scale-110 transition-transform duration-1000 blur-3xl"></div>
        <h2 className="text-4xl font-black mb-6 text-white z-10 uppercase bricolage">I want a job.</h2>
        <p className="text-emerald-100/70 text-lg mb-10 max-w-sm z-10 font-medium">Join India’s most trusted network. Build your digital tenure and get deployed by top regional brands.</p>
        <Link to="/worker/sign-up" className="bg-[#FACD15] text-[#1F3F34] px-12 py-5 rounded-2xl uppercase text-sm tracking-widest shadow-xl shadow-[#FACD15]/20 hover:translate-y-[-4px] active:scale-95 transition-all z-10 font-black flex items-center justify-center">
          Create Free Profile
        </Link>
      </div>
    </section>
  );
}

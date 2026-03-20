import { Link } from "react-router-dom";

export function LandingDualCTA() {
  return (
    <section className="grid md:grid-cols-2">
      <div className="bg-brand-amber p-12 md:p-20 flex flex-col justify-center items-start relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-full bg-brand-forest/5 organic-blob -translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-1000"></div>
        <h2 className="text-3xl font-extrabold text-brand-forest mb-4 z-10">I want to hire.</h2>
        <p className="text-brand-forest text-md mb-8 max-w-sm z-10">Access verified workers and scale your business today with zero onboarding friction.</p>
        <Link to="/post-job" className="bg-brand-forest text-white font-extrabold px-10 py-4 rounded-lg uppercase text-md shadow-[inset_0_-4px_0_rgba(255,255,255,0.1)] hover:translate-y-[-2px] transition-all z-10">
          Post a Job
        </Link>
      </div>
      <div className="bg-brand-forest p-12 md:p-20 flex flex-col justify-center items-start text-white relative overflow-hidden group">
        <div className="absolute bottom-0 right-0 w-full h-full bg-white/5 organic-blob-alt translate-x-1/2 translate-y-1/2 group-hover:scale-110 transition-transform duration-1000"></div>
        <h2 className="text-3xl font-extrabold mb-4 text-white z-10">I want a job.</h2>
        <p className="text-emerald-100/70 text-md mb-8 max-w-sm z-10">Join India’s most trusted network. Build your digital reputation and get hired by top brands.</p>
        <Link to="/worker/sign-up" className="btn-primary px-10 py-4 uppercase text-md shadow-[inset_0_-4px_0_rgba(0,0,0,0.1)] hover:translate-y-[-2px] z-10 flex items-center justify-center">
          Create Free Profile
        </Link>
      </div>
    </section>
  );
}

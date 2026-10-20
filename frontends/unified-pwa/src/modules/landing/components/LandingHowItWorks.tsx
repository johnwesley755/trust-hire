export function LandingHowItWorks() {
  return (
    <section className="py-16 bg-brand-beige relative overflow-hidden" id="how-it-works">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-amber/5 organic-blob opacity-50"></div>
      <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-emerald-100/30 organic-blob opacity-40"></div>
      <div className="container mx-auto px-6 md:px-12 text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-brand-forest text-heavy">Three steps to peace of mind</h2>
      </div>
      <div className="container mx-auto px-6 md:px-12 relative">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white p-8 rounded-lg relative group hover:-translate-y-2 transition-transform shadow-sm">
            <span className="absolute top-4 right-8 text-7xl font-black text-brand-forest/5 pointer-events-none">01</span>
            <div className="w-14 h-14 bg-brand-amber rounded-DEFAULT flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-brand-forest text-2xl">post_add</span>
            </div>
            <h3 className="text-xl font-bold text-brand-forest mb-3">Post Your Need</h3>
            <p className="text-brand-forest/70 leading-relaxed text-sm">Describe the role, salary, and location. Our AI categorizes and matches your job accurately.</p>
          </div>
          {/* Step 2 */}
          <div className="bg-white p-8 rounded-lg relative group hover:-translate-y-2 transition-transform shadow-sm">
            <span className="absolute top-4 right-8 text-7xl font-black text-brand-forest/5 pointer-events-none">02</span>
            <div className="w-14 h-14 bg-brand-amber rounded-DEFAULT flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-brand-forest text-2xl">fact_check</span>
            </div>
            <h3 className="text-xl font-bold text-brand-forest mb-3">Review Verified</h3>
            <p className="text-brand-forest/70 leading-relaxed text-sm">Choose from pre-screened, government ID-verified workers with real past performance data.</p>
          </div>
          {/* Step 3 */}
          <div className="bg-white p-8 rounded-lg relative group hover:-translate-y-2 transition-transform shadow-sm">
            <span className="absolute top-4 right-8 text-7xl font-black text-brand-forest/5 pointer-events-none">03</span>
            <div className="w-14 h-14 bg-brand-amber rounded-DEFAULT flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-brand-forest text-2xl">handshake</span>
            </div>
            <h3 className="text-xl font-bold text-brand-forest mb-3">Hire & Start</h3>
            <p className="text-brand-forest/70 leading-relaxed text-sm">Communicate directly via our platform and onboard with a single click.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

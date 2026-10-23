export function LandingTierSystem() {
  return (
    <section className="py-16 bg-white relative">
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-emerald-50 organic-blob -z-10"></div>
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl font-extrabold text-brand-forest mb-3">The TrustHire Tier System</h2>
            <p className="text-brand-forest/70 text-md">We standardize skills so you don't have to guess. Every worker is tiered based on verified history.</p>
          </div>
          <div className="bg-brand-beige p-1.5 rounded-lg inline-flex gap-1.5 font-bold">
            <button className="bg-brand-amber px-4 py-1.5 rounded-lg font-bold text-[10px] uppercase shadow-sm">Monthly</button>
            <button className="px-4 py-1.5 rounded-lg font-bold text-[10px] uppercase text-brand-forest/40">Daily</button>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* L1 */}
          <div className="bg-emerald-50/50 p-6 rounded-lg border-2 border-transparent hover:border-brand-amber transition-all">
            <span className="text-emerald-800 font-black text-[10px] block mb-3">LEVEL 01</span>
            <h3 className="text-xl font-bold text-brand-forest mb-1">Beginner</h3>
            <p className="text-brand-forest/60 text-[12px] mb-4">Foundational skills, verified ID.</p>
            <div className="text-xl font-black text-brand-forest mb-4">₹12k - 18k</div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-[10px] font-bold text-brand-forest/70">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ID VERIFIED
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-brand-forest/70">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> BASIC ORIENTATION
              </div>
            </div>
          </div>
          {/* L2 */}
          <div className="bg-emerald-50/50 p-6 rounded-lg border-2 border-transparent hover:border-brand-amber transition-all">
            <span className="text-emerald-800 font-black text-[10px] block mb-3">LEVEL 02</span>
            <h3 className="text-xl font-bold text-brand-forest mb-1">Skilled</h3>
            <p className="text-brand-forest/60 text-[12px] mb-4">2+ yrs exp, rated 4+ stars.</p>
            <div className="text-xl font-black text-brand-forest mb-4">₹20k - 30k</div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-[10px] font-bold text-brand-forest/70">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> SKILL TESTED
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-brand-forest/70">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> POSITIVE REFS
              </div>
            </div>
          </div>
          {/* L3 */}
          <div className="bg-brand-forest p-6 rounded-lg border-4 border-brand-amber relative shadow-xl xl:scale-105">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-amber text-brand-forest text-[9px] font-black px-3 py-1 rounded-full whitespace-nowrap">MOST POPULAR</div>
            <span className="text-brand-amber font-black text-[10px] block mb-3">LEVEL 03</span>
            <h3 className="text-xl font-bold text-white mb-1">Expert</h3>
            <p className="text-white/60 text-[12px] mb-4">5+ yrs exp, Lead potential.</p>
            <div className="text-xl font-black text-brand-amber mb-4">₹35k - 50k</div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-[10px] font-bold text-white/80">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-amber"></span> TEAM MANAGEMENT
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-white/80">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-amber"></span> TOP 5% RATED
              </div>
            </div>
          </div>
          {/* L4 */}
          <div className="bg-emerald-50/50 p-6 rounded-lg border-2 border-transparent hover:border-brand-amber transition-all">
            <span className="text-emerald-800 font-black text-[10px] block mb-3">LEVEL 04</span>
            <h3 className="text-xl font-bold text-brand-forest mb-1">Elite</h3>
            <p className="text-brand-forest/60 text-[12px] mb-4">Industry masters & specialists.</p>
            <div className="text-xl font-black text-brand-forest mb-4">₹60k+</div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-[10px] font-bold text-brand-forest/70">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> SPECIALIST CERTIFIED
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-brand-forest/70">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> REPLACEMENT SUPPORT
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

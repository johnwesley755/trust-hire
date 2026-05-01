export function LandingTierSystem() {
  return (
    <section className="py-24 bg-white relative text-left">
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#1F3F34]/5 rounded-full -z-10 blur-3xl"></div>
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black text-[#1F3F34] mb-4 uppercase bricolage">The Operational <span className="text-[#FACD15]">Tiers</span></h2>
            <p className="text-[#1F3F34]/60 text-lg font-medium">We standardize professional skills to eliminate guesswork. Every operative is tiered based on verified performance history.</p>
          </div>
          <div className="bg-[#F5F4EF] p-2 rounded-2xl inline-flex gap-2 font-black shadow-inner">
            <button className="bg-[#FACD15] text-[#1F3F34] px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[#FACD15]/20">Monthly</button>
            <button className="px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest text-[#1F3F34]/30">Daily</button>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* L1 */}
          <div className="bg-[#F5F4EF] p-10 rounded-[2.5rem] border-2 border-transparent hover:border-[#FACD15] transition-all group shadow-2xl shadow-[#1F3F34]/5">
            <span className="text-[#1F3F34]/40 font-black text-[10px] block mb-4 tracking-[0.2em]">LEVEL 01</span>
            <h3 className="text-2xl font-black text-[#1F3F34] mb-2 uppercase bricolage">Beginner</h3>
            <p className="text-[#1F3F34]/60 text-sm mb-6 font-medium">Foundational skills, 100% verified ID.</p>
            <div className="text-2xl font-black text-[#1F3F34] mb-8 bricolage">₹12k - 18k</div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[10px] font-black text-[#1F3F34] uppercase tracking-widest opacity-60">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> ID VERIFIED
              </div>
              <div className="flex items-center gap-3 text-[10px] font-black text-[#1F3F34] uppercase tracking-widest opacity-60">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> BASIC ORIENTATION
              </div>
            </div>
          </div>
          {/* L2 */}
          <div className="bg-[#F5F4EF] p-10 rounded-[2.5rem] border-2 border-transparent hover:border-[#FACD15] transition-all group shadow-2xl shadow-[#1F3F34]/5">
            <span className="text-[#1F3F34]/40 font-black text-[10px] block mb-4 tracking-[0.2em]">LEVEL 02</span>
            <h3 className="text-2xl font-black text-[#1F3F34] mb-2 uppercase bricolage">Skilled</h3>
            <p className="text-[#1F3F34]/60 text-sm mb-6 font-medium">2+ yrs exp, rated 4.5+ stars.</p>
            <div className="text-2xl font-black text-[#1F3F34] mb-8 bricolage">₹20k - 30k</div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[10px] font-black text-[#1F3F34] uppercase tracking-widest opacity-60">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> SKILL TESTED
              </div>
              <div className="flex items-center gap-3 text-[10px] font-black text-[#1F3F34] uppercase tracking-widest opacity-60">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> POSITIVE REFS
              </div>
            </div>
          </div>
          {/* L3 */}
          <div className="bg-[#1F3F34] p-10 rounded-[2.5rem] border-4 border-[#FACD15] relative shadow-[0_40px_80px_-20px_rgba(31,63,52,0.3)] xl:scale-105 z-10 transition-transform hover:scale-[1.07]">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FACD15] text-[#1F3F34] text-[9px] font-black px-4 py-1.5 rounded-full whitespace-nowrap tracking-widest uppercase shadow-lg shadow-[#FACD15]/20">MOST POPULAR</div>
            <span className="text-[#FACD15] font-black text-[10px] block mb-4 tracking-[0.2em]">LEVEL 03</span>
            <h3 className="text-2xl font-black text-white mb-2 uppercase bricolage">Expert</h3>
            <p className="text-white/60 text-sm mb-6 font-medium">5+ yrs exp, Lead operative potential.</p>
            <div className="text-2xl font-black text-[#FACD15] mb-8 bricolage">₹35k - 50k</div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[10px] font-black text-white uppercase tracking-widest opacity-80">
                <span className="w-2 h-2 rounded-full bg-[#FACD15]"></span> TEAM MANAGEMENT
              </div>
              <div className="flex items-center gap-3 text-[10px] font-black text-white uppercase tracking-widest opacity-80">
                <span className="w-2 h-2 rounded-full bg-[#FACD15]"></span> TOP 5% RATED
              </div>
            </div>
          </div>
          {/* L4 */}
          <div className="bg-[#F5F4EF] p-10 rounded-[2.5rem] border-2 border-transparent hover:border-[#FACD15] transition-all group shadow-2xl shadow-[#1F3F34]/5">
            <span className="text-[#1F3F34]/40 font-black text-[10px] block mb-4 tracking-[0.2em]">LEVEL 04</span>
            <h3 className="text-2xl font-black text-[#1F3F34] mb-2 uppercase bricolage">Elite</h3>
            <p className="text-[#1F3F34]/60 text-sm mb-6 font-medium">Industry masters & technical specialists.</p>
            <div className="text-2xl font-black text-[#1F3F34] mb-8 bricolage">₹60k+</div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[10px] font-black text-[#1F3F34] uppercase tracking-widest opacity-60">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> SPECIALIST CERTIFIED
              </div>
              <div className="flex items-center gap-3 text-[10px] font-black text-[#1F3F34] uppercase tracking-widest opacity-60">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> REPLACEMENT GUARANTEE
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

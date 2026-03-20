export function LandingEarnings() {
  return (
    <section className="bg-primary-fixed py-24 relative overflow-hidden">
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 blob-1"></div>
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 blob-2"></div>
      
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 text-center relative z-10">
        <h2 className="text-[42px] md:text-[52px] font-extrabold text-primary text-heavy mb-16 max-w-4xl mx-auto leading-tight font-headline">
          Workers Who Level Up <br/>Earn 2.5× More
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/40 backdrop-blur-sm p-10 rounded-[40px] border border-white/40 shadow-lg group hover:bg-white/50 transition-colors">
            <p className="text-sm font-bold uppercase tracking-widest text-primary/60 mb-6 font-label">Entry Level</p>
            <div className="text-4xl font-black text-primary mb-2 font-headline">₹12,000</div>
            <p className="text-primary/80 font-body">Average Market Rate</p>
          </div>
          
          <div className="bg-white p-10 rounded-[40px] shadow-2xl scale-110 relative z-10 border-4 border-primary/5">
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-fixed text-xs font-bold px-4 py-1 rounded-full uppercase tracking-tighter">Most Popular</span>
            <p className="text-sm font-bold uppercase tracking-widest text-primary/40 mb-6 font-label">Level 3 Skilled</p>
            <div className="text-5xl font-black text-primary mb-2 font-headline">₹24,500</div>
            <p className="text-primary/80 font-body">TrustHire Weekly Pay</p>
          </div>
          
          <div className="bg-white/40 backdrop-blur-sm p-10 rounded-[40px] border border-white/40 shadow-lg group hover:bg-white/50 transition-colors">
            <p className="text-sm font-bold uppercase tracking-widest text-primary/60 mb-6 font-label">Level 5 Pro</p>
            <div className="text-4xl font-black text-primary mb-2 font-headline">₹38,000+</div>
            <p className="text-primary/80 font-body">VIP Household Managed</p>
          </div>
        </div>
        
        <div className="mt-20">
          <button className="bg-primary text-primary-fixed px-12 py-5 rounded-[12px] font-black uppercase text-lg shadow-xl hover:scale-105 transition-transform active:scale-95">
            Calculate Your Potential
          </button>
        </div>
      </div>
    </section>
  );
}

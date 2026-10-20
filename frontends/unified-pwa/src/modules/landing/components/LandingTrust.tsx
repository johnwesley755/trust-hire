export function LandingTrust() {
  return (
    <section className="bg-primary py-24 px-6 md:px-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-fixed/5 rounded-l-full blur-3xl"></div>
      
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row gap-16 items-center">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 bg-white/10 text-primary-fixed px-4 py-1.5 rounded-full mb-8 font-bold text-sm">
            <span className="material-symbols-outlined text-sm font-bold">lock</span>
            Your Data is Safe
          </div>
          <h2 className="text-[42px] font-extrabold text-white text-heavy mb-8 leading-tight font-headline">We Value Your Privacy</h2>
          
          <div className="space-y-8">
            <div className="flex gap-4 group">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-primary-fixed flex-shrink-0 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">verified_user</span>
              </div>
              <div>
                <h4 className="text-white text-xl font-bold mb-2 font-headline">Identity Protection</h4>
                <p className="text-white/60 font-body">We only verify documents to confirm who you are. Your sensitive documents are encrypted and protected for your privacy.</p>
              </div>
            </div>
            
            <div className="flex gap-4 group">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-primary-fixed flex-shrink-0 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">block</span>
              </div>
              <div>
                <h4 className="text-white text-xl font-bold mb-2 font-headline">No Hidden Agents</h4>
                <p className="text-white/60 font-body">You talk directly to employers. No local middle-men taking your salary cuts.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 w-full max-w-md relative">
          <div className="absolute -inset-10 bg-primary-fixed/10 blob-2 blur-3xl"></div>
          <div className="bg-white/5 border border-white/10 p-10 rounded-[40px] backdrop-blur-md relative z-10 text-center">
            <span className="material-symbols-outlined text-[80px] text-primary-fixed mb-6 block" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
            <p className="text-white/80 text-xl italic mb-6 font-body">"TrustHire never shared my mobile number without my permission. I feel safe working here."</p>
            <p className="text-primary-fixed font-bold uppercase tracking-widest text-sm font-label">— Santosh, Driver</p>
          </div>
        </div>
      </div>
    </section>
  );
}

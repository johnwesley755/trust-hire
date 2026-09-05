export function LandingBenefits() {
  return (
    <section className="py-24 px-6 md:px-12 max-w-[1440px] mx-auto relative">
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-primary-fixed/5 blob-2 -z-10"></div>
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-secondary-container/10 blob-5 -z-10 opacity-50"></div>
      
      <div className="text-center mb-16">
        <h2 className="text-[42px] md:text-[52px] font-extrabold text-primary text-heavy mb-4 leading-tight">Why Workers Love TrustHire</h2>
        <p className="text-lg text-primary/60 max-w-2xl mx-auto">Join the platform where your hard work is respected and rewarded every single day.</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 relative z-10">
        {/* Card 1 */}
        <div className="bg-white p-10 rounded-[40px] shadow-lg border border-surface-container relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-primary-fixed/10 blob-1 group-hover:scale-110 transition-transform"></div>
          <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-8">
            <span className="material-symbols-outlined text-3xl font-bold">military_tech</span>
          </div>
          <h3 className="text-2xl font-black text-primary mb-4">Dignity & Respect</h3>
          <p className="text-primary/70 leading-relaxed relative z-10">Work for verified employers who treat you like a professional. No more shouting or unfair treatment.</p>
        </div>
        
        {/* Card 2 */}
        <div className="bg-white p-10 rounded-[40px] shadow-lg border border-surface-container relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-secondary-container/10 blob-2 group-hover:scale-110 transition-transform"></div>
          <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-8">
            <span className="material-symbols-outlined text-3xl font-bold">payments</span>
          </div>
          <h3 className="text-2xl font-black text-primary mb-4">Direct Payouts</h3>
          <p className="text-primary/70 leading-relaxed relative z-10">Your full salary goes to your bank. No hidden cuts, no middle-men, and no delays in payment.</p>
        </div>
        
        {/* Card 3 */}
        <div className="bg-white p-10 rounded-[40px] shadow-lg border border-surface-container relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-primary-fixed/10 blob-3 group-hover:scale-110 transition-transform"></div>
          <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-8">
            <span className="material-symbols-outlined text-3xl font-bold">distance</span>
          </div>
          <h3 className="text-2xl font-black text-primary mb-4">Jobs Nearby</h3>
          <p className="text-primary/70 leading-relaxed relative z-10">Save time and money on travel. We find the best high-paying jobs within 5km of your home.</p>
        </div>
      </div>
    </section>
  );
}

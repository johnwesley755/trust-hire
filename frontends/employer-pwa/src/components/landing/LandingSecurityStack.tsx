export function LandingSecurityStack() {
  return (
    <section className="py-24 bg-[#1F3F34] relative overflow-hidden text-left">
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#FACD15]/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px]"></div>
      <div className="container mx-auto px-6 md:px-12 relative z-10 mb-16">
        <h2 className="text-4xl md:text-5xl font-black text-white uppercase bricolage tracking-tight mb-4">India’s Safest <br/><span className="text-[#FACD15]">Hiring Engine</span></h2>
        <p className="text-emerald-100/70 text-lg max-w-2xl font-medium">We deploy government-grade verification protocols to ensure your operational environment remains secure and productive.</p>
      </div>
      <div className="container mx-auto px-6 md:px-12 grid md:grid-cols-3 gap-8 relative z-10">
        <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-all duration-500 group">
          <span className="material-symbols-outlined text-[#FACD15] text-4xl mb-8 group-hover:scale-110 transition-transform">fingerprint</span>
          <h3 className="text-2xl font-black text-white mb-4 uppercase bricolage">Biometric Security</h3>
          <p className="text-emerald-100/60 text-sm font-medium">Every operative profile is cryptographically matched against Aadhaar biometrics to eliminate identity theft.</p>
        </div>
        <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-all duration-500 group">
          <span className="material-symbols-outlined text-[#FACD15] text-4xl mb-8 group-hover:scale-110 transition-transform">history</span>
          <h3 className="text-2xl font-black text-white mb-4 uppercase bricolage">Digital Tenure</h3>
          <p className="text-emerald-100/60 text-sm font-medium">No more operational ghosting. Every operative has a recorded immutable history of performance.</p>
        </div>
        <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-all duration-500 group">
          <span className="material-symbols-outlined text-[#FACD15] text-4xl mb-8 group-hover:scale-110 transition-transform">shield</span>
          <h3 className="text-2xl font-black text-white mb-4 uppercase bricolage">Trust Protocols</h3>
          <p className="text-emerald-100/60 text-sm font-medium">Operatives stake a trust deposit that’s programmatically forfeited in verified cases of unethical conduct.</p>
        </div>
      </div>
    </section>
  );
}

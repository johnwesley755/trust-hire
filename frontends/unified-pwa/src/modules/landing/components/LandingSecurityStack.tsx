export function LandingSecurityStack() {
  return (
    <section className="py-16 bg-brand-forest relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-amber/10 rounded-full blur-[100px] organic-blob"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] organic-blob-alt"></div>
      <div className="container mx-auto px-6 md:px-12 relative z-10 text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white text-heavy mb-4">India’s Safest Hiring Engine</h2>
        <p className="text-emerald-100/70 text-lg max-w-xl mx-auto">We use multi-layer verification to ensure your workplace remains safe and productive.</p>
      </div>
      <div className="container mx-auto px-6 md:px-12 grid md:grid-cols-3 gap-6 relative z-10">
        <div className="glass-card p-8 rounded-lg hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined text-brand-amber text-3xl mb-6">fingerprint</span>
          <h3 className="text-xl font-bold text-white mb-3">Biometric Verification</h3>
          <p className="text-emerald-100/60 text-sm">Every profile undergoes strict identity checks to prevent fraud.</p>
        </div>
        <div className="glass-card p-8 rounded-lg hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined text-brand-amber text-3xl mb-6">history</span>
          <h3 className="text-xl font-bold text-white mb-3">Digital Tenure</h3>
          <p className="text-emerald-100/60 text-sm">No more ghosting. Every worker has a recorded history of attendance and performance.</p>
        </div>
        <div className="glass-card p-8 rounded-lg hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined text-brand-amber text-3xl mb-6">shield</span>
          <h3 className="text-xl font-bold text-white mb-3">Trust Protection</h3>
          <p className="text-emerald-100/60 text-sm">Workers post a trust deposit that’s forfeited in cases of unethical behavior.</p>
        </div>
      </div>
    </section>
  );
}

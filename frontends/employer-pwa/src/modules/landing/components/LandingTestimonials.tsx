export function LandingTestimonials() {
  return (
    <section className="py-16 bg-brand-beige relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-amber/10 organic-blob -z-10"></div>
      <div className="container mx-auto px-6 md:px-12 text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-brand-forest text-heavy">Real stories from the hearth</h2>
      </div>
      <div className="container mx-auto px-6 md:px-12 grid md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center text-center">
          <div className="organic-blob w-20 h-20 overflow-hidden mb-4 shadow-md border-4 border-brand-amber/20">
            <img 
              alt="Female restaurant owner profile" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3cwuCOcY8nAmd3_hHnX0dEQF-vMnhk_Mvc2abP25xJ7slJ-7Vc-S9et79QaOwpr8psEB4KVPuYn2ZpMg6xI5vQ2ns6rBNU2lk9bLI74pzFFG3jfiosqrjjHuTZSOtoVmC-siAkspqPDRvhmrj3U834CHDdbLH9dWS4vnq2EpK-rTHY0maRdIuAPZ1GLmEreyB99xbiPjVfJjH5pWY6SsacPJx5auWuj1_0PGObpym317Y8CEjoh4J7eae2HKcfB-X1SkTJVPbvU0" 
            />
          </div>
          <span className="text-brand-amber text-5xl font-serif mb-1 leading-none">“</span>
          <p className="text-brand-forest/80 italic mb-6 text-sm">"TrustHire transformed our staffing. No more last-minute ghosting during peak hours. The verification really works."</p>
          <p className="font-bold text-brand-forest text-sm">Priya Sharma</p>
          <p className="text-[10px] text-brand-forest/40 uppercase tracking-widest font-black">Owner, Saffron Bistro</p>
        </div>
        {/* Card 2 */}
        <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center text-center border-t-8 border-brand-amber">
          <div className="organic-blob-alt w-20 h-20 overflow-hidden mb-4 shadow-md border-4 border-brand-forest/10">
            <img 
              alt="Corporate hiring manager portrait" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCF6r2z6SgOomxly1pEwx4lVZWxsA6X0ZRmq_S6lGLSd_xa4H3oW7SXsd1jhkEoKf_phHaCsBMA4T6L1bW2hBhQt4eBOJ54-kKND6qfU1aUhQSi8h4vXlr4C2sYhKX35XD1LftxUbrAf5BeOi0IkmVudSmchI883AW5kyc6V_J5hD8S1PpiFrMcSaYa6qVrTZwVe51ejPXQVUyUBxKSM_0h7iDeFchoeQzVyVQ5KT7NVgzXcrbG0p_bpotglTtwVSYklczobcX_7Ts" 
            />
          </div>
          <span className="text-brand-amber text-5xl font-serif mb-1 leading-none">“</span>
          <p className="text-brand-forest/80 italic mb-6 text-sm">"Scaling our delivery fleet was a nightmare until we found TrustHire. We hired 40 riders in 3 days, all verified."</p>
          <p className="font-bold text-brand-forest text-sm">Anand Mehta</p>
          <p className="text-[10px] text-brand-forest/40 uppercase tracking-widest font-black">HR Ops, MetroLogistics</p>
        </div>
        {/* Card 3 */}
        <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center text-center">
          <div className="organic-blob w-20 h-20 overflow-hidden mb-4 shadow-md border-4 border-brand-amber/20">
            <img 
              alt="Small business owner smiling" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGpnEpqkSqoKebDlIaU4fUfEVleqGCYNsHmd0CA8-4pTBySmfLl8yxDGRJgjXaI69iBjkimZ0lJcuAoQyRGywV4Z0pmdqElDzzw0geriFcMyr_p9SnIUnN2Wic37dUQNOrbZysyUeFQ42tNd1AkWcJPrVqKHx0D5hyO0WkNAXsZnz3AIRj8bCmVB7wIsUoahvke_x7CuE9pl04sqCWn3F1Dh5xoABtkdITY97BAdbt8zziadkJKaSxbqzRs3DeI_nfgs76tgQE15g" 
            />
          </div>
          <span className="text-brand-amber text-5xl font-serif mb-1 leading-none">“</span>
          <p className="text-brand-forest/80 italic mb-6 text-sm">"I finally have time to focus on growth instead of screening IDs. The L3 workers are truly exceptional professionals."</p>
          <p className="font-bold text-brand-forest text-sm">Rohan Deshmukh</p>
          <p className="text-[10px] text-brand-forest/40 uppercase tracking-widest font-black">Founder, UrbanCare</p>
        </div>
      </div>
    </section>
  );
}

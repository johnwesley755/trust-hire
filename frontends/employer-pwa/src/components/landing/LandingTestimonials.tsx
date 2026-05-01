export function LandingTestimonials() {
  return (
    <section className="py-24 bg-[#F5F4EF] relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FACD15]/10 rounded-full -z-10 blur-3xl"></div>
      <div className="container mx-auto px-6 md:px-12 text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black text-[#1F3F34] uppercase bricolage tracking-tight">Real stories from <br/><span className="text-[#FACD15]">the field</span></h2>
      </div>
      <div className="container mx-auto px-6 md:px-12 grid md:grid-cols-3 gap-8">
        {/* Card 1 */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-[#1F3F34]/5 flex flex-col items-center text-center border border-[#1F3F34]/5 relative group hover:-translate-y-2 transition-all duration-500">
          <div className="w-24 h-24 overflow-hidden mb-6 shadow-xl rounded-[2rem] border-4 border-[#FACD15]/20 bg-[#1F3F34]">
            <img 
              alt="Female business owner" 
              className="w-full h-full object-cover grayscale-[0.2]" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3cwuCOcY8nAmd3_hHnX0dEQF-vMnhk_Mvc2abP25xJ7slJ-7Vc-S9et79QaOwpr8psEB4KVPuYn2ZpMg6xI5vQ2ns6rBNU2lk9bLI74pzFFG3jfiosqrjjHuTZSOtoVmC-siAkspqPDRvhmrj3U834CHDdbLH9dWS4vnq2EpK-rTHY0maRdIuAPZ1GLmEreyB99xbiPjVfJjH5pWY6SsacPJx5auWuj1_0PGObpym317Y8CEjoh4J7eae2HKcfB-X1SkTJVPbvU0" 
            />
          </div>
          <span className="text-[#FACD15] text-6xl font-black mb-2 leading-none opacity-40">“</span>
          <p className="text-[#1F3F34]/60 italic mb-8 text-lg font-medium leading-relaxed">"TrustHire transformed our staffing. No more last-minute ghosting during peak hours. The verification protocols really deliver."</p>
          <div className="mt-auto">
            <p className="font-black text-[#1F3F34] text-sm uppercase tracking-tight">Priya Sharma</p>
            <p className="text-[10px] text-[#1F3F34]/30 uppercase tracking-widest font-black mt-1">Owner, Saffron Bistro</p>
          </div>
        </div>
        {/* Card 2 */}
        <div className="bg-[#1F3F34] p-10 rounded-[2.5rem] shadow-2xl shadow-[#1F3F34]/20 flex flex-col items-center text-center border-t-[12px] border-[#FACD15] relative group hover:-translate-y-2 transition-all duration-500">
          <div className="w-24 h-24 overflow-hidden mb-6 shadow-xl rounded-[2rem] border-4 border-white/10 bg-white/5">
            <img 
              alt="Corporate manager" 
              className="w-full h-full object-cover grayscale-[0.2]" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCF6r2z6SgOomxly1pEwx4lVZWxsA6X0ZRmq_S6lGLSd_xa4H3oW7SXsd1jhkEoKf_phHaCsBMA4T6L1bW2hBhQt4eBOJ54-kKND6qfU1aUhQSi8h4vXlr4C2sYhKX35XD1LftxUbrAf5BeOi0IkmVudSmchI883AW5kyc6V_J5hD8S1PpiFrMcSaYa6qVrTZwVe51ejPXQVUyUBxKSM_0h7iDeFchoeQzVyVQ5KT7NVgzXcrbG0p_bpotglTtwVSYklczobcX_7Ts" 
            />
          </div>
          <span className="text-[#FACD15] text-6xl font-black mb-2 leading-none opacity-40">“</span>
          <p className="text-white/80 italic mb-8 text-lg font-medium leading-relaxed">"Scaling our delivery fleet was a bottleneck until we found TrustHire. We hired 40 operatives in 3 days, all 100% verified."</p>
          <div className="mt-auto">
            <p className="font-black text-white text-sm uppercase tracking-tight">Anand Mehta</p>
            <p className="text-[10px] text-white/30 uppercase tracking-widest font-black mt-1">HR Ops, MetroLogistics</p>
          </div>
        </div>
        {/* Card 3 */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-[#1F3F34]/5 flex flex-col items-center text-center border border-[#1F3F34]/5 relative group hover:-translate-y-2 transition-all duration-500">
          <div className="w-24 h-24 overflow-hidden mb-6 shadow-xl rounded-[2rem] border-4 border-[#FACD15]/20 bg-[#1F3F34]">
            <img 
              alt="Small business founder" 
              className="w-full h-full object-cover grayscale-[0.2]" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGpnEpqkSqoKebDlIaU4fUfEVleqGCYNsHmd0CA8-4pTBySmfLl8yxDGRJgjXaI69iBjkimZ0lJcuAoQyRGywV4Z0pmdqElDzzw0geriFcMyr_p9SnIUnN2Wic37dUQNOrbZysyUeFQ42tNd1AkWcJPrVqKHx0D5hyO0WkNAXsZnz3AIRj8bCmVB7wIsUoahvke_x7CuE9pl04sqCWn3F1Dh5xoABtkdITY97BAdbt8zziadkJKaSxbqzRs3DeI_nfgs76tgQE15g" 
            />
          </div>
          <span className="text-[#FACD15] text-6xl font-black mb-2 leading-none opacity-40">“</span>
          <p className="text-[#1F3F34]/60 italic mb-8 text-lg font-medium leading-relaxed">"I finally have time to focus on growth instead of screening identities. The Tier 3 operatives are truly exceptional professionals."</p>
          <div className="mt-auto">
            <p className="font-black text-[#1F3F34] text-sm uppercase tracking-tight">Rohan Deshmukh</p>
            <p className="text-[10px] text-[#1F3F34]/30 uppercase tracking-widest font-black mt-1">Founder, UrbanCare</p>
          </div>
        </div>
      </div>
    </section>
  );
}

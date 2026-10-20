export function LandingProblemSolution() {
  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-brand-amber/5 organic-blob -translate-x-1/2 -z-10"></div>
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-emerald-50 organic-blob-alt translate-x-1/2 -z-10 opacity-40"></div>
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <div>
              <span className="inline-block px-4 py-1 rounded-full bg-[#EF4444]/10 text-[#EF4444] font-bold text-xs uppercase mb-3">The Problem</span>
              <h2 className="text-3xl font-extrabold text-brand-forest mb-4">Traditional hiring is a gamble.</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-4 text-md text-brand-forest/70">
                  <span className="material-symbols-outlined text-[#EF4444]">cancel</span>
                  Identity fraud and faked certifications.
                </li>
                <li className="flex items-start gap-4 text-md text-brand-forest/70">
                  <span className="material-symbols-outlined text-[#EF4444]">cancel</span>
                  Workers disappearing without notice.
                </li>
              </ul>
            </div>
            <div>
              <span className="inline-block px-4 py-1 rounded-full bg-brand-amber/20 text-brand-forest font-bold text-xs uppercase mb-3">The Solution</span>
              <h2 className="text-3xl font-extrabold text-brand-forest mb-4">TrustHire is the certainty.</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-4 text-md text-brand-forest">
                  <span className="material-symbols-outlined text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  Verified government ID and background validation.
                </li>
                <li className="flex items-start gap-4 text-md text-brand-forest">
                  <span className="material-symbols-outlined text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  Mandatory trust deposits for workers.
                </li>
              </ul>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="organic-blob-alt w-72 h-72 bg-brand-amber rotate-45 absolute -z-10 opacity-10 translate-x-8 translate-y-8"></div>
            <div className="organic-blob w-80 h-80 bg-brand-forest absolute -z-20 opacity-5 -translate-x-6 -translate-y-6"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="organic-blob w-40 h-56 overflow-hidden mt-8 shadow-lg relative">
                <img 
                  alt="Female service worker in uniform" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSCcDgJJ5eZwgMfca2BzKO-NZxDINEzCzAHJvalxLNaAVyV9FACvtWOX7IjGpf17Gf-a9VqkuzhEbew-eOULpW7En_R37sxqTxm2tc8n-AOWCnZy_71l66f2drGaXv5sZnvC9tWiGaFnakfJ5yYdxri5gnJu_in6mre7lMJUD4scrX4PW0DEPeq9WKo7JR_nKSCD8rGTt1FuxDjqGlIf6GmcqT212c2wnztS4Bhs_0sH-PFt-52xAcYzq_gznGEkYqRTks6bUAQG8" 
                />
              </div>
              <div className="organic-blob-alt w-48 h-64 overflow-hidden shadow-lg relative">
                <img 
                  alt="Skilled male technician at work" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4pfQDe1-XYtIDmQBgGp51XyoPCpXH8YUOgiA8cZPMJdRmSZIUTCqg9hIYIl3WdwZ_IYn3RpGN-pUo55m2N7FHQ0Qoe5NNSkCFaeM-3ZqN1-bg1Dwle_FqZSQ0Q5cZ6AT2R4V1aCL3dfxaUTfFVllkK6HpCauRL9zdpyv76Sy_srlhCePnqzHTeLjZdCCX7u_yjSdRu-XhNUHPiw7JTBwk7-frCHxUqW3gWAT-qVH5J-hIc_cYe9mQr5FFUkZhfsOUoYewOapCGVI" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

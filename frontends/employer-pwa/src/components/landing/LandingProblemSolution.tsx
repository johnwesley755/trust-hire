export function LandingProblemSolution() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-[#FACD15]/5 rounded-full -translate-x-1/2 -z-10"></div>
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-[#1F3F34]/5 rounded-full translate-x-1/2 -z-10 opacity-40"></div>
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-12 text-left">
            <div className="space-y-6">
              <span className="inline-block px-4 py-1.5 rounded-full bg-red-50 text-red-600 font-black text-[10px] uppercase tracking-widest border border-red-100">The Problem</span>
              <h2 className="text-4xl font-black text-[#1F3F34] leading-tight uppercase bricolage">Traditional hiring is <br/><span className="text-red-500">a gamble.</span></h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-4 text-md text-[#1F3F34]/60 font-medium">
                  <span className="material-symbols-outlined text-red-400 mt-1">cancel</span>
                  Identity fraud and faked certifications are rampant.
                </li>
                <li className="flex items-start gap-4 text-md text-[#1F3F34]/60 font-medium">
                  <span className="material-symbols-outlined text-red-400 mt-1">cancel</span>
                  Workers disappearing without notice causes project delays.
                </li>
              </ul>
            </div>
            <div className="space-y-6">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#FACD15]/10 text-[#1F3F34] font-black text-[10px] uppercase tracking-widest border border-[#FACD15]/20">The Solution</span>
              <h2 className="text-4xl font-black text-[#1F3F34] leading-tight uppercase bricolage">TrustHire is <br/><span className="text-emerald-600">the certainty.</span></h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-4 text-md text-[#1F3F34] font-medium">
                  <span className="material-symbols-outlined text-emerald-500 mt-1" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  Biometric Aadhaar-linked verification for every operative.
                </li>
                <li className="flex items-start gap-4 text-md text-[#1F3F34] font-medium">
                  <span className="material-symbols-outlined text-emerald-500 mt-1" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  Mandatory trust deposits ensure worker commitment.
                </li>
              </ul>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="w-72 h-72 bg-[#FACD15] rounded-[4rem] rotate-45 absolute -z-10 opacity-10 translate-x-8 translate-y-8"></div>
            <div className="w-80 h-80 bg-[#1F3F34] rounded-[5rem] absolute -z-20 opacity-5 -translate-x-6 -translate-y-6"></div>
            <div className="grid grid-cols-2 gap-6 relative z-10">
              <div className="w-44 h-64 overflow-hidden mt-12 shadow-2xl rounded-[3rem] bg-[#1F3F34]">
                <img 
                  alt="Female service worker" 
                  className="w-full h-full object-cover grayscale-[0.2]" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSCcDgJJ5eZwgMfca2BzKO-NZxDINEzCzAHJvalxLNaAVyV9FACvtWOX7IjGpf17Gf-a9VqkuzhEbew-eOULpW7En_R37sxqTxm2tc8n-AOWCnZy_71l66f2drGaXv5sZnvC9tWiGaFnakfJ5yYdxri5gnJu_in6mre7lMJUD4scrX4PW0DEPeq9WKo7JR_nKSCD8rGTt1FuxDjqGlIf6GmcqT212c2wnztS4Bhs_0sH-PFt-52xAcYzq_gznGEkYqRTks6bUAQG8" 
                />
              </div>
              <div className="w-56 h-72 overflow-hidden shadow-2xl rounded-[4rem] bg-[#1F3F34]">
                <img 
                  alt="Skilled male technician" 
                  className="w-full h-full object-cover grayscale-[0.2]" 
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

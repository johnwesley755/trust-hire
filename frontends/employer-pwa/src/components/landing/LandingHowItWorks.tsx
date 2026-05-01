export function LandingHowItWorks() {
  return (
    <section className="py-24 bg-[#F5F4EF] relative overflow-hidden text-left" id="how-it-works">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FACD15]/5 rounded-full opacity-50 blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-[#1F3F34]/5 rounded-full opacity-40 blur-3xl"></div>
      
      <div className="container mx-auto px-6 md:px-12 mb-16">
        <h2 className="text-4xl md:text-5xl font-black text-[#1F3F34] uppercase bricolage tracking-tight">Three steps to <br/><span className="text-[#FACD15]">peace of mind</span></h2>
      </div>
      
      <div className="container mx-auto px-6 md:px-12 relative">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white p-10 rounded-[2.5rem] relative group hover:-translate-y-2 transition-all duration-500 shadow-2xl shadow-[#1F3F34]/5 border border-[#1F3F34]/5">
            <span className="absolute top-6 right-10 text-8xl font-black text-[#1F3F34]/5 pointer-events-none uppercase">01</span>
            <div className="w-16 h-16 bg-[#FACD15] rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-[#FACD15]/20 group-hover:rotate-6 transition-transform">
              <span className="material-symbols-outlined text-[#1F3F34] text-3xl font-black">post_add</span>
            </div>
            <h3 className="text-2xl font-black text-[#1F3F34] mb-4 uppercase bricolage">Post Your Need</h3>
            <p className="text-[#1F3F34]/60 leading-relaxed font-medium">Describe the role, salary, and location. Our tactical matching system categorizes your job instantly.</p>
          </div>
          {/* Step 2 */}
          <div className="bg-white p-10 rounded-[2.5rem] relative group hover:-translate-y-2 transition-all duration-500 shadow-2xl shadow-[#1F3F34]/5 border border-[#1F3F34]/5">
            <span className="absolute top-6 right-10 text-8xl font-black text-[#1F3F34]/5 pointer-events-none uppercase">02</span>
            <div className="w-16 h-16 bg-[#FACD15] rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-[#FACD15]/20 group-hover:rotate-6 transition-transform">
              <span className="material-symbols-outlined text-[#1F3F34] text-3xl font-black">fact_check</span>
            </div>
            <h3 className="text-2xl font-black text-[#1F3F34] mb-4 uppercase bricolage">Review Verified</h3>
            <p className="text-[#1F3F34]/60 leading-relaxed font-medium">Choose from pre-screened, Aadhaar-verified workers with authenticated performance metrics.</p>
          </div>
          {/* Step 3 */}
          <div className="bg-white p-10 rounded-[2.5rem] relative group hover:-translate-y-2 transition-all duration-500 shadow-2xl shadow-[#1F3F34]/5 border border-[#1F3F34]/5">
            <span className="absolute top-6 right-10 text-8xl font-black text-[#1F3F34]/5 pointer-events-none uppercase">03</span>
            <div className="w-16 h-16 bg-[#FACD15] rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-[#FACD15]/20 group-hover:rotate-6 transition-transform">
              <span className="material-symbols-outlined text-[#1F3F34] text-3xl font-black">handshake</span>
            </div>
            <h3 className="text-2xl font-black text-[#1F3F34] mb-4 uppercase bricolage">Hire & Deploy</h3>
            <p className="text-[#1F3F34]/60 leading-relaxed font-medium">Communicate directly via our secure channel and onboard your new team member with a single click.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

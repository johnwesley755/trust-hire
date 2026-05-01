export function LandingProcess() {
  return (
    <section id="how-it-works" className="py-24 bg-surface-container-low rounded-t-[40px] relative overflow-hidden">
      <div className="absolute top-40 right-10 w-64 h-64 bg-primary-fixed/5 blob-1"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-secondary-container/10 blob-3 opacity-40"></div>
      
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <h2 className="text-[42px] font-extrabold text-primary text-heavy mb-16">3 Steps to Your New Job</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-surface-container-lowest p-8 rounded-[32px] hover:translate-y-[-8px] transition-transform duration-300 shadow-sm border border-transparent hover:border-primary-fixed/30 group">
            <div className="w-16 h-16 bg-primary-fixed/20 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl font-bold">person_add</span>
            </div>
            <span className="text-sm font-bold text-primary/40 uppercase tracking-widest mb-4 block">Step 01</span>
            <h3 className="text-2xl font-extrabold text-primary mb-4">Profile</h3>
            <p className="text-primary/70 leading-relaxed">Enter your skills in the app. No complicated resumes or paperwork needed.</p>
          </div>
          
          {/* Step 2 */}
          <div className="bg-surface-container-lowest p-8 rounded-[32px] hover:translate-y-[-8px] transition-transform duration-300 shadow-sm border border-transparent hover:border-primary-fixed/30 group">
            <div className="w-16 h-16 bg-primary-fixed/20 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl font-bold">badge</span>
            </div>
            <span className="text-sm font-bold text-primary/40 uppercase tracking-widest mb-4 block">Step 02</span>
            <h3 className="text-2xl font-extrabold text-primary mb-4">Aadhaar</h3>
            <p className="text-primary/70 leading-relaxed">Securely verify your identity. We keep your data safe and private always.</p>
          </div>
          
          {/* Step 3 */}
          <div className="bg-surface-container-lowest p-8 rounded-[32px] hover:translate-y-[-8px] transition-transform duration-300 border-2 border-primary-fixed/30 shadow-lg group">
            <div className="w-16 h-16 bg-primary-fixed rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl font-bold">work</span>
            </div>
            <span className="text-sm font-bold text-primary/40 uppercase tracking-widest mb-4 block">Step 03</span>
            <h3 className="text-2xl font-extrabold text-primary mb-4">Get Hired</h3>
            <p className="text-primary/70 leading-relaxed">Get offers directly on your phone. Choose the job that pays the best for you.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

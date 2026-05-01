export function LandingVideoDemo() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-[#1F3F34] mb-4 uppercase bricolage">See TrustHire in Action</h2>
          <p className="text-[#1F3F34]/60 text-lg max-w-2xl mx-auto font-medium">Discover how our platform simplifies the recruitment journey for thousands of enterprise-grade Indian businesses.</p>
        </div>
        <div className="relative max-w-5xl mx-auto group">
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-[#FACD15]/10 rounded-full -z-10 group-hover:scale-110 transition-transform duration-700 blur-2xl"></div>
          <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-[#1F3F34]/5 rounded-full -z-10 group-hover:rotate-12 transition-transform duration-700 blur-2xl"></div>
          <div className="aspect-video bg-[#1F3F34] overflow-hidden shadow-[0_40px_80px_-20px_rgba(31,63,52,0.2)] relative rounded-[4rem]">
            <video 
              className="w-full h-full object-cover grayscale-[0.3] contrast-[1.1]"
              autoPlay
              muted
              loop
              playsInline
              poster="https://lh3.googleusercontent.com/aida-public/AB6AXuDgQx5t1u7iKgQ0ZIgUXtjncGirGWa6h5kdu87_l83lQnxHbRvnxv5gdrdN7pNVd5z4jTruLgn71qurxr6JjyvBhZuI1w_iFPfF4r6-C_0W37ePVZgnH2qqCDay5R6F_pLrjoWb-n_DdbycBxW1DqiBbO_lSqiZwdxpvG46A1vUk78jCgQsfOmpoYQLfTbmXsw5i9iSrpuhNQsqqLhYVxUiOw-6ANGmPuz3VTwbe02veilSShQrXwMswxkKH4fRFz3jN3q6uBbuhHg"
            >
              <source src="/assets/landing/worker-pwa.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-[#1F3F34]/40 to-transparent pointer-events-none"></div>
          </div>
          <p className="text-center mt-10 font-black text-[#1F3F34]/30 uppercase tracking-[0.3em] text-[10px]">3-Minute Platform Operational Overview</p>
        </div>
      </div>
    </section>
  );
}

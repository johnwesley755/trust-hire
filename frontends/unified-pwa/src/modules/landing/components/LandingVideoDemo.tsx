export function LandingVideoDemo() {
  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-forest text-heavy mb-4">See TrustHire in Action</h2>
          <p className="text-brand-forest/70 text-md max-w-xl mx-auto">Discover how our platform simplifies the hiring journey for thousands of Indian businesses.</p>
        </div>
        <div className="relative max-w-4xl mx-auto group">
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-brand-amber/20 organic-blob -z-10 group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald-900/5 organic-blob-alt -z-10 group-hover:rotate-12 transition-transform duration-700"></div>
          <div className="organic-blob-alt aspect-video bg-brand-forest overflow-hidden shadow-2xl relative">
            <video 
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster="https://lh3.googleusercontent.com/aida-public/AB6AXuDgQx5t1u7iKgQ0ZIgUXtjncGirGWa6h5kdu87_l83lQnxHbRvnxv5gdrdN7pNVd5z4jTruLgn71qurxr6JjyvBhZuI1w_iFPfF4r6-C_0W37ePVZgnH2qqCDay5R6F_pLrjoWb-n_DdbycBxW1DqiBbO_lSqiZwdxpvG46A1vUk78jCgQsfOmpoYQLfTbmXsw5i9iSrpuhNQsqqLhYVxUiOw-6ANGmPuz3VTwbe02veilSShQrXwMswxkKH4fRFz3jN3q6uBbuhHg"
            >
              <source src="/assets/landing/worker-pwa.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <p className="text-center mt-6 font-bold text-brand-forest/60 uppercase tracking-widest text-xs">3-Minute Platform Overview</p>
        </div>
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";

export function LandingFinalCTA() {
  return (
    <section className="py-16 px-6 relative overflow-hidden">
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-brand-amber/5 organic-blob -z-10 blur-3xl"></div>
      <div className="max-w-6xl mx-auto bg-brand-forest rounded-xl overflow-hidden relative shadow-2xl">
        <div className="grid md:grid-cols-2 items-center">
          <div className="p-10 md:p-20 text-white z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-heavy leading-tight">Ready to build your dream team?</h2>
            <p className="text-emerald-100/70 text-md mb-8">Join the movement of Indian businesses hiring with confidence on TrustHire.</p>
            <Link to="/sign-up" className="btn-primary px-10 py-4 uppercase text-lg shadow-[inset_0_-4px_0_rgba(0,0,0,0.1)] hover:scale-105 active:scale-95 flex items-center justify-center">
              Get Started Now
            </Link>
          </div>
          <div className="relative h-full min-h-[300px]">
            <div className="organic-blob w-[130%] h-[130%] absolute -top-1/4 -right-1/4 overflow-hidden border-8 border-white/10 shadow-2xl">
              <img 
                alt="Employer and worker shaking hands in a bright office" 
                className="w-full h-full object-cover grayscale brightness-75 contrast-125" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgQx5t1u7iKgQ0ZIgUXtjncGirGWa6h5kdu87_l83lQnxHbRvnxv5gdrdN7pNVd5z4jTruLgn71qurxr6JjyvBhZuI1w_iFPfF4r6-C_0W37ePVZgnH2qqCDay5R6F_pLrjoWb-n_DdbycBxW1DqiBbO_lSqiZwdxpvG46A1vUk78jCgQsfOmpoYQLfTbmXsw5i9iSrpuhNQsqqLhYVxUiOw-6ANGmPuz3VTwbe02veilSShQrXwMswxkKH4fRFz3jN3q6uBbuhHg" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

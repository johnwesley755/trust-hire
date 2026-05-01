import { Link } from "react-router-dom";

export function LandingFinalCTA() {
  return (
    <section className="py-24 px-6 relative overflow-hidden text-left">
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-[#FACD15]/5 rounded-full -z-10 blur-3xl"></div>
      <div className="max-w-6xl mx-auto bg-[#1F3F34] rounded-[4rem] overflow-hidden relative shadow-[0_40px_80px_-20px_rgba(31,63,52,0.3)]">
        <div className="grid md:grid-cols-2 items-center">
          <div className="p-10 md:p-20 text-white z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight uppercase bricolage">Ready to build <br/><span className="text-[#FACD15]">your team?</span></h2>
            <p className="text-emerald-100/70 text-lg mb-12 font-medium">Join the thousands of Indian businesses hiring with 100% confidence on the TrustHire network.</p>
            <Link to="/sign-up" className="bg-[#FACD15] text-[#1F3F34] px-12 py-5 rounded-2xl uppercase text-sm tracking-widest shadow-xl shadow-[#FACD15]/20 hover:scale-105 active:scale-95 flex items-center justify-center font-black transition-all">
              Get Started Now
            </Link>
          </div>
          <div className="relative h-full min-h-[400px]">
            <div className="w-[130%] h-[130%] absolute -top-1/4 -right-1/4 overflow-hidden border-[12px] border-white/5 shadow-2xl rounded-[5rem]">
              <img 
                alt="Professional partnership" 
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

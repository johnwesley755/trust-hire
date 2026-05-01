import { Link } from "react-router-dom";

export function LandingFooter() {
  return (
    <footer className="bg-[#F5F4EF] mt-24 relative overflow-hidden text-left">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#FACD15]/5 rounded-full -z-10 blur-3xl"></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 px-8 py-20 max-w-7xl mx-auto">
        <div className="col-span-2 md:col-span-1">
          <div className="text-3xl font-black text-[#1F3F34] mb-8 uppercase bricolage tracking-tighter">TrustHire</div>
          <p className="text-[#1F3F34]/60 text-sm leading-relaxed max-w-xs font-medium">
            Tactical, human-centric hiring for a better India. Building trust, one operative at a time.
          </p>
        </div>
        <div className="space-y-4">
          <p className="font-black text-[#1F3F34] uppercase text-[10px] tracking-widest mb-6 opacity-40">Company</p>
          <Link className="block text-[#1F3F34]/60 hover:text-[#1F3F34] transition-all text-sm font-black uppercase tracking-tight" to="/about">About</Link>
          <a className="block text-[#1F3F34] hover:text-[#1F3F34] transition-all text-sm font-black uppercase tracking-tight underline decoration-[#FACD15] decoration-4 underline-offset-4" href="#">For Employers</a>
          <Link className="block text-[#1F3F34]/60 hover:text-[#1F3F34] transition-all text-sm font-black uppercase tracking-tight" to="/workers">For Workers</Link>
          <Link className="block text-[#1F3F34]/60 hover:text-[#1F3F34] transition-all text-sm font-black uppercase tracking-tight" to="/safety">Trust & Safety</Link>
        </div>
        <div className="space-y-4">
          <p className="font-black text-[#1F3F34] uppercase text-[10px] tracking-widest mb-6 opacity-40">Legal</p>
          <Link className="block text-[#1F3F34]/60 hover:text-[#1F3F34] transition-all text-sm font-black uppercase tracking-tight" to="/privacy">Privacy Policy</Link>
          <Link className="block text-[#1F3F34]/60 hover:text-[#1F3F34] transition-all text-sm font-black uppercase tracking-tight" to="/terms">Terms of Service</Link>
          <Link className="block text-[#1F3F34]/60 hover:text-[#1F3F34] transition-all text-sm font-black uppercase tracking-tight" to="/cookies">Cookie Policy</Link>
          <span className="block text-[#1F3F34]/30 text-[10px] font-black uppercase tracking-widest mt-4">Language: English</span>
        </div>
        <div className="space-y-4">
          <p className="font-black text-[#1F3F34] uppercase text-[10px] tracking-widest mb-6 opacity-40">Contact</p>
          <p className="text-[#1F3F34]/60 text-sm font-black">hiring@trusthire.in</p>
          <p className="text-[#1F3F34]/60 text-sm font-black">+91 98765 43210</p>
          <div className="flex gap-4 pt-6">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#1F3F34] hover:bg-[#FACD15] transition-all cursor-pointer shadow-xl shadow-[#1F3F34]/5 border border-[#1F3F34]/5">
              <span className="material-symbols-outlined text-xl font-black">public</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#1F3F34] hover:bg-[#FACD15] transition-all cursor-pointer shadow-xl shadow-[#1F3F34]/5 border border-[#1F3F34]/5">
              <span className="material-symbols-outlined text-xl font-black">mail</span>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-[#1F3F34]/5 py-10 text-center px-8 bg-white/50 backdrop-blur-md">
        <p className="text-[#1F3F34]/30 text-[10px] font-black uppercase tracking-[0.3em]">© 2026 TrustHire. Tactical human capital verified.</p>
      </div>
    </footer>
  );
}

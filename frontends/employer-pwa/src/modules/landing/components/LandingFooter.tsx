import { Link } from "react-router-dom";

export function LandingFooter() {
  return (
    <footer className="bg-brand-beige rounded-t-lg mt-12 relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-amber/5 organic-blob -z-10"></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-8 py-12 max-w-7xl mx-auto">
        <div>
          <div className="text-2xl font-black text-brand-forest mb-6">TrustHire</div>
          <p className="text-brand-forest/60 text-[13px] leading-relaxed max-w-xs">
            Human-centric hiring for a better India. Building trust, one job at a time.
          </p>
        </div>
        <div className="space-y-3">
          <p className="font-bold text-brand-forest uppercase text-[10px] tracking-widest mb-4">Company</p>
          <Link className="block text-brand-forest/60 hover:text-brand-forest transition-all text-sm" to="/about">About</Link>
          <a className="block text-brand-forest/60 hover:text-brand-forest transition-all text-sm underline decoration-brand-amber decoration-2" href="#">For Employers</a>
          <Link className="block text-brand-forest/60 hover:text-brand-forest transition-all text-sm" to="/workers">For Workers</Link>
          <Link className="block text-brand-forest/60 hover:text-brand-forest transition-all text-sm" to="/safety">Trust & Safety</Link>
        </div>
        <div className="space-y-3">
          <p className="font-bold text-brand-forest uppercase text-[10px] tracking-widest mb-4">Legal</p>
          <Link className="block text-brand-forest/60 hover:text-brand-forest transition-all text-sm" to="/privacy">Privacy Policy</Link>
          <Link className="block text-brand-forest/60 hover:text-brand-forest transition-all text-sm" to="/terms">Terms of Service</Link>
          <Link className="block text-brand-forest/60 hover:text-brand-forest transition-all text-sm" to="/cookies">Cookie Policy</Link>
          <span className="block text-brand-forest/60 text-sm">Language: English</span>
        </div>
        <div className="space-y-3">
          <p className="font-bold text-brand-forest uppercase text-[10px] tracking-widest mb-4">Contact</p>
          <p className="text-brand-forest/60 text-[13px]">hiring@trusthire.in</p>
          <p className="text-brand-forest/60 text-[13px]">+91 98765 43210</p>
          <div className="flex gap-4 pt-4">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-forest hover:bg-brand-amber transition-colors cursor-pointer shadow-sm">
              <span className="material-symbols-outlined text-sm">public</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-forest hover:bg-brand-amber transition-colors cursor-pointer shadow-sm">
              <span className="material-symbols-outlined text-sm">mail</span>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-brand-forest/5 py-6 text-center px-8">
        <p className="text-brand-forest/40 text-[12px] font-medium">© 2026 TrustHire. Human-centric hiring for a better India.</p>
      </div>
    </footer>
  );
}

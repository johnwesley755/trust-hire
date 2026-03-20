import { Link } from "react-router-dom";
import { useLanguage } from "../../../core/hooks/useLanguage";
import { Briefcase, Globe, Twitter, Linkedin, Instagram } from "lucide-react";

export function LandingFooter() {
  const { t } = useLanguage();

  const LINKS = {
    [t('footer.links.heading1')]: [t('footer.links.findJobs'), t('footer.links.levels'), t('footer.links.skillTests'), t('footer.links.verification')],
    [t('footer.links.heading2')]: [t('footer.links.safety'), t('footer.links.community'), t('footer.links.how'), t('footer.links.faqs')],
    [t('footer.links.heading3')]: [t('footer.links.about'), t('footer.links.blog'), t('footer.links.careers'), t('footer.links.contact')],
  };

  return (
    <footer className="bg-black/90 text-white selection:bg-brand-primary selection:text-brand-secondary relative overflow-hidden">
      
      {/* Background patterns */}
      <div className="absolute inset-0 cloud-grid opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px] -ml-40 -mt-40 pointer-events-none" />

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12 relative z-10 text-left">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-20">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-8">
            <Link to="/" className="flex items-center gap-4 group w-fit">
              <div className="w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center shadow-xl group-hover:rotate-6 transition-transform">
                <Briefcase className="text-brand-secondary w-7 h-7" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-semibold tracking-tight leading-none group-hover:text-brand-primary transition-colors">Trust Hire</span>
                <span className="text-[10px] font-medium text-brand-primary tracking-tight mt-0.5">India's Safest Hub</span>
              </div>
            </Link>
            
            <p className="text-white/50 font-medium leading-relaxed text-sm max-w-sm">
                {t('footer.brand.desc')}
            </p>
            
            <div className="flex gap-4">
              {[
                { icon: <Twitter size={18} />, label: "Twitter" },
                { icon: <Linkedin size={18} />, label: "LinkedIn" },
                { icon: <Instagram size={18} />, label: "Instagram" }
              ].map((s, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-brand-primary hover:text-brand-secondary transition-all flex items-center justify-center text-white/50 border border-white/5 shadow-lg"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          {Object.entries(LINKS).map(([heading, items]) => (
            <div key={heading} className="space-y-8">
              <h6 className="font-semibold text-[10px] tracking-[0.2em] text-white/20">
                {heading}
              </h6>
              <ul className="space-y-4">
                {items.map((item, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-white/40 hover:text-brand-primary font-medium text-sm transition-colors block"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 text-white/20 text-[11px] font-medium">
            <Globe className="w-4 h-4" />
            {t('footer.copyright')}
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-white/20 text-[10px] font-semibold tracking-widest">
            <a href="#" className="hover:text-brand-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-brand-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-brand-primary transition-colors">Cookies</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

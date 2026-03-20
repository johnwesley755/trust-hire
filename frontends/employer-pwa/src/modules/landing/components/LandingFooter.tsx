import { Link } from "react-router-dom";
import { ShieldCheck, Mail, Phone, MapPin, Twitter, Linkedin, Instagram } from "lucide-react";

export function LandingFooter() {
  const LINKS = {
    "Product": ["How it Works", "Talent Vision", "Security Stack", "Pricing"],
    "Resources": ["Documentation", "API Reference", "Compliance", "Privacy Policy"],
    "Company": ["About Us", "Contact", "Careers", "Press Kit"]
  };

  return (
    <footer className="bg-black/90 text-white relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 cloud-grid opacity-[0.03] pointer-events-none" />
      
      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12 relative z-10 border-b border-white/5">
        <div className="bg-brand-primary p-12 lg:p-16 rounded-3xl flex flex-col lg:flex-row items-center justify-between gap-12 text-brand-secondary shadow-2xl">
          <div className="space-y-4 text-center lg:text-left">
            <h3 className="text-4xl lg:text-5xl font-bold tracking-tight leading-none">
                Ready to Scale Your <br />
                <span className="opacity-60">Verified Team?</span>
            </h3>
            <p className="text-lg font-semibold opacity-80 max-w-xl">
              Join leading enterprises using TrustHire to eliminate hiring risk and scale with verified professional talent.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <Link
              to="/sign-up"
              className="px-8 py-4 bg-brand-secondary text-brand-primary rounded-xl font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl text-center"
            >
              Start Hiring
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 bg-white text-brand-secondary rounded-xl font-bold text-lg hover:scale-105 transition-all text-center"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                <ShieldCheck className="text-brand-secondary w-7 h-7" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-2xl font-bold tracking-tight text-white">TrustHire</span>
                <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest mt-1">Enterprise Cloud</span>
              </div>
            </Link>
            <p className="text-white/40 font-semibold leading-relaxed max-w-sm">
              The world's first blockchain-verified talent ecosystem, dedicated to empowering skilled professionals and secure global enterprise growth.
            </p>
            <div className="flex items-center gap-4">
              {[Linkedin, Twitter, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-brand-primary hover:text-brand-secondary transition-all shadow-sm text-white/50">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          {Object.entries(LINKS).map(([heading, items]) => (
            <div key={heading} className="space-y-6">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/30">{heading}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-base font-semibold text-white/50 hover:text-brand-primary transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-white/20">
          <div className="flex flex-wrap justify-center gap-8 text-[10px] font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-brand-primary transition-colors flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> hello@trusthire.io
            </a>
            <a href="#" className="hover:text-brand-primary transition-colors flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" /> +91 (800) 123-4567
            </a>
            <span className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" /> Bengaluru, IN
            </span>
          </div>

          <p className="text-[10px] font-bold uppercase tracking-widest">
            Â© 2026 TrustHire. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}


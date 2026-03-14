import { Link } from "react-router-dom";
import { ShieldCheck, Mail, Phone, MapPin, Globe, Twitter, Linkedin, Instagram } from "lucide-react";

export function LandingFooter() {
  const LINKS = {
    "Product": ["How it Works", "Talent Vision", "Security Stack", "Pricing"],
    "Resources": ["Documentation", "API Reference", "Compliance", "Privacy Policy"],
    "Company": ["About Us", "Contact", "Careers", "Press Kit"]
  };

  return (
    <footer className="bg-brand-secondary text-white relative overflow-hidden">
      {/* Background patterns for dark theme */}
      <div className="absolute inset-0 cloud-grid opacity-[0.03] pointer-events-none" />
      
      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 border-b border-white/5 relative z-10">
        <div className="bg-brand-primary p-12 lg:p-20 rounded-[60px] flex flex-col lg:flex-row items-center justify-between gap-12 text-brand-secondary shadow-[0_50px_100px_-20px_rgba(250,204,21,0.3)]">
          <div className="space-y-6 text-center lg:text-left">
            <h3 className="text-4xl lg:text-6xl font-black tracking-tighter leading-none">
              Ready to Secure <br />
              <span className="opacity-60">Your Global Workforce?</span>
            </h3>
            <p className="text-lg font-bold opacity-80 max-w-xl">
              Join leading enterprises using TrustHire to eliminate hiring risk and scale with verified professional talent.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
            <Link
              to="/sign-up"
              className="px-10 py-5 bg-brand-secondary text-brand-primary rounded-2xl font-black text-lg text-center hover:scale-105 transition-all shadow-2xl"
            >
              Start Hiring Now
            </Link>
            <Link
              to="/contact"
              className="px-10 py-5 bg-white text-brand-secondary rounded-2xl font-black text-lg text-center hover:scale-105 transition-all"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 lg:gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                <ShieldCheck className="text-brand-secondary w-7 h-7" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-3xl font-black tracking-tighter">TrustHire</span>
                <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest mt-1">Enterprise Grade</span>
              </div>
            </Link>
            <p className="text-white/50 font-bold leading-relaxed max-w-sm">
              The world's first blockchain-verified talent ecosystem, dedicated to empowering skilled Indian professionals and secure global enterprise growth.
            </p>
            <div className="flex items-center gap-4">
              {[Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-brand-primary hover:text-brand-secondary transition-all">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          {Object.entries(LINKS).map(([heading, items]) => (
            <div key={heading} className="space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">{heading}</h4>
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm font-bold text-white/60 hover:text-brand-primary transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-white/30">
            <a href="#" className="hover:text-brand-primary transition-colors flex items-center gap-2">
                <Mail className="w-3 h-3" /> hello@trusthire.io
            </a>
            <a href="#" className="hover:text-brand-primary transition-colors flex items-center gap-2">
                <Phone className="w-3 h-3" /> +91 (800) 123-4567
            </a>
            <span className="flex items-center gap-2">
                <MapPin className="w-3 h-3" /> Bengaluru, IN
            </span>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30 border border-white/5 px-4 py-2 rounded-xl">
                <Globe className="w-3 h-3" /> English (IN)
            </div>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">
              © 2026 TrustHire. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

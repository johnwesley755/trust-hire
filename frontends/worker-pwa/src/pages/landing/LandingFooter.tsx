import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const LINKS = {
  "For Workers": ["Find Jobs", "Levels & Stats", "Skill Tests", "Verification"],
  Network: ["Safety", "Community", "How It Works", "FAQs"],
  Company: ["About Us", "Blog", "Careers", "Contact"],
};

export function LandingFooter() {
  return (
    <footer className="bg-[#111] text-white">
      {/* CTA Banner */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-[#f0b429] py-16 px-6"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#111] leading-tight text-center md:text-left">
              Ready to earn{" "}
              <span className="text-brand-teal">more,</span>{" "}
              stress{" "}
              <span className="text-brand-teal">less?</span>
            </h3>
            <p className="text-[#111]/70 font-semibold mt-2 text-center md:text-left text-sm sm:text-base">
              Join 50,000+ verified professionals. Free to sign up.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link
              to="/sign-up"
              className="px-7 py-4 bg-brand-teal text-white rounded-2xl font-black hover:bg-[#2a5f5b] transition-all hover:shadow-xl hover:-translate-y-1 text-center"
            >
              Get Started Free
            </Link>
            <Link
              to="/sign-in"
              className="px-7 py-4 bg-white text-[#111] rounded-2xl font-black hover:bg-brand-cream transition-all hover:-translate-y-1 text-center"
            >
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-[#f0b429] rounded-xl flex items-center justify-center">
                <span className="text-[#1d4744] font-black text-lg leading-none">T</span>
              </div>
              <span className="text-xl font-black">
                Trust<span className="text-[#f0b429]">Hire</span> Pro
              </span>
            </div>
            <p className="text-white/50 font-medium leading-relaxed text-sm">
              Building India's most trusted network of verified, skilled professionals.
            </p>
            <div className="flex gap-3">
              {["𝕏", "in", "ig"].map((s, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#f0b429] hover:text-[#1d4744] transition-all flex items-center justify-center text-sm font-bold"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([heading, items]) => (
            <div key={heading} className="space-y-4">
              <h6 className="font-black uppercase text-xs tracking-[0.2em] text-white/40">
                {heading}
              </h6>
              <ul className="space-y-3">
                {items.map((item, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-white/60 hover:text-[#f0b429] font-semibold text-sm transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-sm font-medium">
            © 2026 TrustHire Pro Inc. Empowering local talent with global trust standards.
          </p>
          <div className="flex gap-6 text-white/30 text-xs font-semibold">
            <a href="#" className="hover:text-white/60 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
            <a href="#" className="hover:text-white/60 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

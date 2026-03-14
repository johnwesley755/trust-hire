import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../../hooks/useLanguage";

export function LandingFooter() {
  const { t } = useLanguage();

  const LINKS = {
    [t('footer.links.heading1')]: [t('footer.links.findJobs'), t('footer.links.levels'), t('footer.links.skillTests'), t('footer.links.verification')],
    [t('footer.links.heading2')]: [t('footer.links.safety'), t('footer.links.community'), t('footer.links.how'), t('footer.links.faqs')],
    [t('footer.links.heading3')]: [t('footer.links.about'), t('footer.links.blog'), t('footer.links.careers'), t('footer.links.contact')],
  };

  return (
    <footer className="bg-[#111] text-white">
      {/* CTA Banner */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-brand-amber py-16 px-6"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#111] leading-tight text-center md:text-left">
              {t('footer.cta.title').split('more,').map((text: string, i: number, arr: string[]) => (
                <span key={i}>
                  {text}{i < arr.length - 1 && <span className="text-brand-teal">more,</span>}
                </span>
              ))}
            </h3>
            <p className="text-[#111]/70 font-semibold mt-2 text-center md:text-left text-sm sm:text-base">
              {t('footer.cta.subtitle')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link
              to="/sign-up"
              className="px-7 py-4 bg-brand-teal text-white rounded-2xl font-black hover:bg-brand-teal-light transition-all hover:shadow-xl hover:-translate-y-1 text-center"
            >
              {t('footer.cta.getStarted')}
            </Link>
            <Link
              to="/sign-in"
              className="px-7 py-4 bg-white text-[#111] rounded-2xl font-black hover:bg-brand-cream transition-all hover:-translate-y-1 text-center"
            >
              {t('footer.cta.signIn')}
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
              <div className="w-9 h-9 bg-brand-amber rounded-xl flex items-center justify-center">
                <span className="text-brand-teal font-black text-lg leading-none">T</span>
              </div>
              <span className="text-xl font-black">
                Trust<span className="text-brand-amber">Hire</span> Pro
              </span>
            </div>
            <p className="text-white/50 font-medium leading-relaxed text-sm">
              {t('footer.brand.desc')}
            </p>
            <div className="flex gap-3">
              {["𝕏", "in", "ig"].map((s, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-brand-amber hover:text-brand-teal transition-all flex items-center justify-center text-sm font-bold"
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
                      className="text-white/60 hover:text-brand-amber font-semibold text-sm transition-colors"
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
            {t('footer.copyright')}
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

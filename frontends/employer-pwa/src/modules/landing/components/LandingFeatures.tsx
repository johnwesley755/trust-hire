import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Lock,
  Database,
  Eye
} from "lucide-react";
import { useTranslate } from "../../../hooks/useTranslate";

const FEATURES_DATA = [
  {
    title: "AI Direct-Scout",
    desc: "Our neural engine scans 50+ industrial metrics to find your perfect worker match in under 5 seconds.",
    key: "f1",
    icon: Eye,
    color: "bg-brand-primary",
    textColor: "text-brand-secondary"
  },
  {
    title: "On-Chain Identity",
    desc: "Every credential and work hour is signed on an immutable blockchain ledger to eliminate fraud.",
    key: "f2",
    icon: Database,
    color: "bg-brand-secondary",
    textColor: "text-brand-primary"
  },
  {
    title: "Biometric Security",
    desc: "Integrated face-match protocol ensures that 100% of attendance is verified and proxy-free.",
    key: "f3",
    icon: ShieldCheck,
    color: "bg-brand-accent",
    textColor: "text-white"
  },
  {
    title: "Smart Compliance",
    desc: "Automated local and federal compliance checks for every deployment, everywhere.",
    key: "f4",
    icon: Lock,
    color: "bg-brand-primary",
    textColor: "text-brand-secondary"
  },
];

export function LandingFeatures() {
  const originalTexts = {
    tag: "Core Infrastructure",
    headingMain: "Enterprise Tools for",
    headingSub: "Bulletproof Ops.",
    f1_title: FEATURES_DATA[0].title,
    f1_desc: FEATURES_DATA[0].desc,
    f2_title: FEATURES_DATA[1].title,
    f2_desc: FEATURES_DATA[1].desc,
    f3_title: FEATURES_DATA[2].title,
    f3_desc: FEATURES_DATA[2].desc,
    f4_title: FEATURES_DATA[3].title,
    f4_desc: FEATURES_DATA[3].desc,
  };

  const { t } = useTranslate(originalTexts);

  return (
    <section id="features" className="py-32 bg-white relative overflow-hidden">
      <div className="absolute inset-0 cloud-grid opacity-10 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center space-y-6 mb-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-sm font-bold text-brand-accent uppercase tracking-widest bg-brand-accent/10 px-6 py-2 rounded-full inline-block"
            >
                {t('tag')}
            </motion.div>
            <h3 className="text-4xl lg:text-8xl font-extrabold tracking-tight text-brand-secondary leading-[0.9]">
                {t('headingMain')} <br />
                <span className="text-brand-primary">{t('headingSub')}</span>
            </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES_DATA.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 bg-white rounded-[60px] shadow-2xl hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] hover:-translate-y-3 transition-all duration-500 group border border-brand-border"
            >
              <div className={`w-20 h-20 ${feature.color} rounded-[32px] flex items-center justify-center mb-10 shadow-xl group-hover:rotate-12 transition-all`}>
                <feature.icon className={`w-10 h-10 ${feature.textColor}`} />
              </div>
              <h4 className="text-3xl font-bold text-brand-secondary mb-4 tracking-tight leading-tight">
                {t(`${feature.key}_title`)}
              </h4>
              <p className="text-sm text-brand-muted font-bold leading-relaxed">
                {t(`${feature.key}_desc`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import { Users, Building2, ShieldCheck } from "lucide-react";

const STATS = [
  { 
    label: "Verified Fleet", 
    value: "124K+", 
    icon: Users,
    color: "bg-brand-primary", 
    textColor: "text-brand-secondary" 
  },
  { 
    label: "Enterprise Partners", 
    value: "2.4K+", 
    icon: Building2,
    color: "bg-brand-secondary", 
    textColor: "text-brand-primary" 
  },
  { 
    label: "Compliance Score", 
    value: "99.9%", 
    icon: ShieldCheck,
    color: "bg-brand-accent", 
    textColor: "text-white" 
  },
];

export function LandingStats() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 cloud-grid opacity-10 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`${stat.color} p-12 rounded-[60px] shadow-2xl flex flex-col items-center text-center gap-6 group hover:-translate-y-3 transition-all duration-500 border-4 border-white`}
            >
              <div className="w-24 h-24 bg-white/20 rounded-[32px] flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform">
                <stat.icon className={`${stat.textColor} w-12 h-12 stroke-[2.5px]`} />
              </div>
              <div>
                <div className={`text-6xl font-extrabold ${stat.textColor} tracking-tight leading-none mb-2`}>
                  {stat.value}
                </div>
                <div className={`text-xs font-bold uppercase tracking-widest ${stat.textColor} opacity-60`}>
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

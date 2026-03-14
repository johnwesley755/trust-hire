import { motion } from "framer-motion";
import { Star, ShieldCheck, Globe2, Briefcase } from "lucide-react";

const TALENT = [
  { name: "Suresh P.", role: "Senior Electrician", rating: 4.9, img: "/images/indi_electrician.png", x: 10, y: 15, score: 99 },
  { name: "Aditi S.", role: "Site Supervisor", rating: 5.0, img: "/images/indi_supervisor.png", x: 25, y: 40, score: 98 },
  { name: "Vikram K.", role: "Systems Engineer", rating: 4.8, img: "/images/indi_group.png", x: 40, y: 10, score: 96 },
  { name: "Rahul M.", role: "Industrial Lead", rating: 4.9, img: "/images/indi_electrician.png", x: 60, y: 35, score: 97 },
  { name: "Priya D.", role: "Project Manager", rating: 5.0, img: "/images/indi_supervisor.png", x: 75, y: 15, score: 99 },
  { name: "Amit R.", role: "Civil Engineer", rating: 4.9, img: "/images/indi_group.png", x: 85, y: 50, score: 98 },
  { name: "Sana V.", role: "Safety Inspector", rating: 4.7, img: "/images/indi_supervisor.png", x: 5, y: 55, score: 95 },
  { name: "Leo T.", role: "Welding Lead", rating: 4.9, img: "/images/indi_electrician.png", x: 35, y: 65, score: 97 },
  { name: "Maya J.", role: "Quality Control", rating: 5.0, img: "/images/indi_supervisor.png", x: 55, y: 70, score: 99 },
  { name: "Arjun N.", role: "Security Chief", rating: 4.8, img: "/images/indi_group.png", x: 70, y: 60, score: 96 },
];

export function LandingTalentCloud() {
  return (
    <section id="vision" className="py-32 relative overflow-hidden bg-brand-bg min-h-screen flex flex-col justify-center">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 cloud-grid opacity-10" />
      <div className="absolute top-0 left-0 w-full h-full oriented-rays pointer-events-none opacity-10" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center w-full">
        <div className="space-y-4 mb-20 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/15 text-brand-secondary rounded-full text-[12px] font-black uppercase tracking-tight border border-brand-primary/20"
          >
            <ShieldCheck className="w-4 h-4 text-brand-primary" />
            Verified Industrial Workforce
          </motion.div>
          <h2 className="text-4xl lg:text-8xl font-black text-brand-secondary tracking-tighter leading-[0.9] mt-6">
            The World's Most <br />
            <span className="text-brand-primary">Trusted Talent Cloud.</span>
          </h2>
          <p className="text-xl text-brand-muted max-w-2xl mx-auto font-bold mt-8 leading-relaxed">
            Eliminating employment fraud through blockchain verification. Deploy skilled Indian professionals with documented, immutable work histories.
          </p>
        </div>

        {/* Talent Cloud Grid - More Dense and Clustered */}
        <div className="relative h-[700px] w-full max-w-6xl mx-auto mt-12 bg-white/40 backdrop-blur-md rounded-[120px] border border-brand-border shadow-2xl relative overflow-visible">
          {TALENT.map((person, i) => (
            <motion.div
              key={i}
              className="absolute group cursor-pointer"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              animate={{
                y: [0, (i % 2 === 0 ? 20 : -20), 0],
                x: [0, (i % 3 === 0 ? 20 : -20), 0],
              }}
              transition={{
                delay: i * 0.05,
                duration: 5 + (i % 4),
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                left: `${person.x}%`,
                top: `${person.y}%`,
              }}
            >
              <div className="relative p-2 glass-card rounded-[40px] hover:scale-125 hover:z-50 transition-all duration-500 overflow-visible shadow-xl border-2 border-white/50 group-hover:border-brand-primary/30 group-hover:shadow-[0_20px_40px_rgba(250,204,21,0.2)]">
                <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-[32px] overflow-hidden border-2 border-white shadow-sm transition-all group-hover:shadow-lg">
                  <img src={person.img} alt={person.name} className="w-full h-full object-cover" />
                </div>
                
                {/* Info Overlay */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-14 left-1/2 -translate-x-1/2 p-3 bg-brand-secondary text-white rounded-2xl shadow-2xl z-20 w-44 opacity-0 group-hover:opacity-100 transition-all pointer-events-none text-center border border-white/10"
                >
                    <div className="text-xs font-black italic">{person.name}</div>
                    <div className="text-[10px] text-brand-primary font-black uppercase tracking-tighter">{person.role}</div>
                    <div className="flex items-center justify-center gap-1 mt-1 text-[10px] font-bold">
                        <Star className="w-2.5 h-2.5 text-brand-primary fill-current" />
                        <span>{person.rating} Rating</span>
                    </div>
                </motion.div>

                {/* Score badge */}
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-brand-secondary rounded-2xl flex flex-col items-center justify-center font-black text-brand-primary border-2 border-white text-[10px] shadow-lg">
                    <span className="text-[8px] leading-none text-white/50">MATCH</span>
                    {person.score}%
                </div>
              </div>
            </motion.div>
          ))}

          {/* Background Central Element */}
          <div className="absolute inset-x-0 bottom-1/4 h-1/2 bg-linear-to-t from-brand-primary/10 to-transparent blur-[120px] -z-10" />
        </div>

        <div className="mt-24 flex flex-col items-center gap-8">
            <button className="px-14 py-6 bg-brand-secondary text-brand-primary rounded-[32px] font-black text-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group">
                Scale Your Workforce
                <Briefcase className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            </button>
            <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 text-sm font-bold text-brand-muted">
                    <Globe2 className="w-5 h-5 text-brand-primary" />
                    Connecting global industry with verified Indian talent.
                </div>
                <div className="text-[10px] font-black text-brand-muted/40 uppercase tracking-widest">TrustHire Verified Network</div>
            </div>
        </div>
      </div>
    </section>
  );
}

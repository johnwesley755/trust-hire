import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Rajesh Kumar",
    role: "L3 Senior Mason",
    location: "Mumbai",
    quote: "TrustPro changed how I find work. Before, I was waiting for contractors to call. Now, I have verified jobs lined up for the whole month, and the pay is always on time.",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=rajesh",
  },
  {
    name: "Anita Desai",
    role: "L2 Verified Chef",
    location: "Pune",
    quote: "The instant bank payouts are a lifesaver. I don't have to chase managers for my daily wages anymore. Everything is transparent and right on my phone.",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=anita",
  },
  {
    name: "Vikram Singh",
    role: "L4 Master Electrician",
    location: "Delhi",
    quote: "Being an L4 Master gets me priority on large corporate projects. The respect and pay scale I get through this platform is unmatched in the industry.",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=vikram",
  },
];

export function LandingTestimonials() {
  return (
    <section className="py-28 bg-[#1d4744] text-white relative overflow-hidden">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 5px 5px, rgba(255,255,255,0.8) 2px, transparent 2px)', backgroundSize: '30px 30px' }} />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16 px-4"
        >
          <span className="text-brand-amber font-black text-xs sm:text-sm uppercase tracking-[0.2em]">
            Worker Stories
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mt-3 leading-tight">
            Trusted by thousands of <br className="hidden sm:block" />
            <span className="text-brand-amber">verified professionals.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/10 flex flex-col relative"
            >
              <Quote className="absolute top-6 right-6 w-12 h-12 text-[#f0b429]/20" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#f0b429] text-[#f0b429]" />
                ))}
              </div>
              
              <p className="text-white/90 text-lg font-medium leading-relaxed mb-8 flex-grow">
                "{t.quote}"
              </p>
              
              <div className="flex items-center gap-4 mt-auto">
                <img 
                  src={t.image} 
                  alt={t.name}
                  className="w-14 h-14 rounded-full border-2 border-[#f0b429] object-cover"
                />
                <div>
                  <h4 className="font-black text-base">{t.name}</h4>
                  <p className="text-[#f0b429] text-sm font-bold">{t.role} <span className="text-white/50 font-medium">· {t.location}</span></p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

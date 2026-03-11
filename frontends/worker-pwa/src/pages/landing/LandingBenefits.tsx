import { useRef, useState, useLayoutEffect } from "react";
import { Zap, Award, MapPin } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

const BENEFITS = [
  {
    icon: <Zap className="w-6 h-6" />,
    color: "bg-[#f5f4ef]",
    textColor: "text-[#1d4744]",
    title: "Premium Earnings",
    desc: "Verified pros earn up to 40% more than market rates. No middlemen, no hidden cuts.",
    tag: "Up to 40% more",
    image: "/assets/landing/worker-payout.png",
  },
  {
    icon: <Award className="w-6 h-6" />,
    color: "bg-[#1d4744]",
    textColor: "text-[#f0b429]",
    title: "Reputation Score",
    desc: "Each job builds your verified work history. Higher ratings unlock bigger corporate contracts.",
    tag: "Blockchain secured",
    image: "/assets/landing/worker-master.png",
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    color: "bg-[#f0b429]",
    textColor: "text-[#1d4744]",
    title: "Smart Job Matching",
    desc: "Get notified instantly about jobs near you that match your exact skills. One-tap applications.",
    tag: "AI-powered match",
    image: "/assets/landing/hero-professional.png",
  },
];

export function LandingBenefits() {
  const targetRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollRange, setScrollRange] = useState(0);

  // Measure the exact overflow distance needed for the track
  useLayoutEffect(() => {
    const updateMeasurements = () => {
      if (trackRef.current) {
        // scrollWidth gives the full hidden width. 
        // We subtract widow width to know exactly how many pixels to scroll.
        // Adding roughly a card's padding gap so it doesn't end abruptly against the edge.
        const maxScrollDist = trackRef.current.scrollWidth - window.innerWidth + 80;
        setScrollRange(maxScrollDist > 0 ? maxScrollDist : 0);
      }
    };
    
    updateMeasurements();
    // Re-check after images potentially load
    const timeout = setTimeout(updateMeasurements, 300);
    window.addEventListener("resize", updateMeasurements);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", updateMeasurements);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  // Translate by the precise pixel delta
  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollRange]); 

  // Dynamically set height so 1px scrolled down = 1px shifted right.
  const containerHeight = scrollRange > 0 ? `calc(100vh + ${scrollRange}px)` : "300vh";

  return (
    <section ref={targetRef} id="benefits" style={{ height: containerHeight }} className="relative z-20 bg-white shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
      
      {/* Sticky container locked precisely to viewport height */}
      <div className="sticky top-0 h-[100svh] min-h-[600px] flex flex-col justify-center overflow-hidden py-12 md:py-20 bg-white">
      
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full shrink-0 mb-6 md:mb-10 lg:mb-12 mt-auto">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[#f0b429] font-black text-sm uppercase tracking-[0.2em] bg-[#f0b429]/10 px-4 py-1.5 rounded-full">
                Why Join Us
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-[64px] font-black text-[#111] mt-6 leading-[1.1] tracking-tight">
                Better Jobs. <br className="hidden md:block"/>
                <span className="text-[#f0b429]">Better Life.</span>
              </h2>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-[#666] max-w-sm leading-relaxed font-medium md:pb-3"
            >
              We built TrustHire to give India's skilled workers access to the
              same premium opportunities as top professionals.
            </motion.p>
          </div>
        </div>

        <div className="relative z-10 pl-6 md:pl-10 lg:pl-[calc((100vw-1280px)/2+24px)] w-full flex-grow mb-auto pb-4">
          <motion.div ref={trackRef} style={{ x }} className="flex gap-6 md:gap-10 w-max h-full items-center">
            {BENEFITS.map((b, i) => (
             <div
                key={i}
                className={`w-[85vw] sm:w-[420px] lg:w-[460px] h-[65vh] min-h-[520px] max-h-[680px] rounded-[32px] md:rounded-[40px] border border-black/5 ${b.color} flex flex-col p-6 lg:p-8 shadow-2xl relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500 shrink-0`}
              >
                {/* Content */}
                <div className="mb-6 z-10 shrink-0">
                  <div className="flex items-start justify-between mb-8">
                    <div className={`w-14 h-14 bg-black/10 ${b.textColor} rounded-2xl flex items-center justify-center shadow-inner pt-1`}>
                      {b.icon}
                    </div>
                    <span className={`inline-block px-4 py-2 bg-black/5 ${b.color === "bg-[#1d4744]" ? "text-white/90" : "text-[#111]"} text-[10px] md:text-xs font-black uppercase tracking-wider rounded-full backdrop-blur-sm border border-white/10`}>
                      {b.tag}
                    </span>
                  </div>

                  <h3 className={`text-3xl lg:text-[34px] font-black ${b.color === "bg-[#1d4744]" ? "text-white" : "text-[#111]"} mb-4 leading-tight`}>{b.title}</h3>
                  <p className={`${b.color === "bg-[#1d4744]" ? "text-white/80" : "text-[#555]"} leading-relaxed font-medium text-[17px] line-clamp-3`}>{b.desc}</p>
                </div>

                {/* Sub-container */}
                <div className="flex-grow flex items-start justify-center w-full bg-white rounded-[20px] md:rounded-[24px] overflow-hidden border border-black/5 relative shadow-inner pt-4 md:pt-6 px-6 mt-2">
                  <img 
                    src={b.image}
                    alt={b.title}
                    className="w-[250px] md:w-[280px] h-auto object-cover object-top drop-shadow-sm transform-gpu transition-transform duration-700 group-hover:scale-105 -mb-4"
                  />
                </div>
              </div>
            ))}
            
            {/* Visual Spacer so the scroll doesn't perfectly hug the edge if window is wide */}
            <div className="w-[10vw] md:w-[20vw] flex-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

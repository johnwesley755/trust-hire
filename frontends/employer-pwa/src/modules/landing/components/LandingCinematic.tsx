import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

export function LandingCinematic() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Immersive scaling effect
  const scale = useTransform(smoothProgress, [0, 0.5, 1], [1.2, 1, 1.1]);
  const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const videoY = useTransform(smoothProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section 
      ref={containerRef} 
      className="relative h-screen w-full bg-black overflow-hidden flex items-center justify-center my-0"
    >
      {/* Immersive Video Layer */}
      <motion.div 
        style={{ 
          scale, 
          opacity,
          y: videoY
        }}
        className="absolute inset-0 w-full h-full"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/assets/landing/worker-pwa.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Subtle Dark Cinematic Overlays - No white shadows */}
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/60" />
      </motion.div>

      {/* Bottom transition gradient - Changed to black to avoid white shadow issue */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-black to-transparent z-20" />
      
      {/* Top transition gradient - Changed to black to avoid white shadow issue */}
      <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-black to-transparent z-20" />
    </section>
  );
}

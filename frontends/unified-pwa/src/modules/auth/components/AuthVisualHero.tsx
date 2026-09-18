import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Eye, ShieldCheck, Sparkles, CheckCircle2, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AuthVisualHeroProps {
  role: 'WORKER' | 'EMPLOYER';
}

export const AuthVisualHero: React.FC<AuthVisualHeroProps> = ({ role }) => {
  const isCandidate = role === 'WORKER';

  return (
    <div className="relative w-full h-full min-h-[580px] md:min-h-[640px] flex flex-col justify-between p-8 sm:p-10 overflow-hidden select-none bg-linear-to-b from-[#0F2752] via-[#0A1931] to-[#050D1A]">
      
      {/* TrustHyre Custom Atmospheric Scenic Geometric Landscape (100% In-Code Vector - Zero External Images) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* TrustHyre Brand Atmospheric Ambient Glows */}
        <div className="absolute -top-24 -left-16 w-80 h-80 bg-[#0066FF]/25 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-0 w-72 h-72 bg-[#38BDF8]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-linear-to-t from-[#050D1A] via-[#0A1931]/90 to-transparent" />

        {/* Custom Layered Vector Landscape in TrustHyre Royal & Deep Blues */}
        <svg 
          className="absolute bottom-0 left-0 right-0 w-full h-[85%] object-cover opacity-90" 
          viewBox="0 0 500 700" 
          preserveAspectRatio="none"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Distant Peak - Cool TrustHyre Soft Blue */}
            <linearGradient id="thDistantPeak" x1="250" y1="50" x2="250" y2="500" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#1E40AF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0A1931" stopOpacity="0.3" />
            </linearGradient>

            {/* Mid Peak - Electric TrustHyre Blue */}
            <linearGradient id="thMidPeak" x1="180" y1="120" x2="250" y2="600" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#1D4ED8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0A1931" stopOpacity="0.9" />
            </linearGradient>

            {/* Front Ridge - Deep Midnight Navy */}
            <linearGradient id="thFrontPeak" x1="250" y1="260" x2="250" y2="700" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0066FF" stopOpacity="0.85" />
              <stop offset="45%" stopColor="#0E234A" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#050D1A" stopOpacity="1" />
            </linearGradient>

            {/* Foreground Base Plateau */}
            <linearGradient id="thBasePeak" x1="250" y1="400" x2="250" y2="700" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0284C7" stopOpacity="0.5" />
              <stop offset="60%" stopColor="#0A1931" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#050D1A" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Distant Layer */}
          <path 
            d="M-20 700 L-20 320 L165 140 L280 270 L390 180 L520 340 L520 700 Z" 
            fill="url(#thDistantPeak)" 
          />

          {/* Mid Layer */}
          <path 
            d="M-40 700 L-40 380 L145 155 L210 230 L290 290 L420 380 L540 700 Z" 
            fill="url(#thMidPeak)" 
          />

          {/* Foreground Hero Range */}
          <path 
            d="M-30 700 L-30 460 L100 310 L250 420 L380 330 L530 480 L530 700 Z" 
            fill="url(#thFrontPeak)" 
          />

          {/* Bottom Horizon Base */}
          <path 
            d="M-20 700 L-20 540 Q120 480 260 520 Q390 560 520 500 L520 700 Z" 
            fill="url(#thBasePeak)" 
          />
        </svg>

        {/* Top subtle grid lines */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-radial from-[#38BDF8]/10 via-transparent to-transparent" />
      </div>

      {/* Official TrustHyre Brand Header */}
      <div className="relative z-10 flex items-center justify-between">
        <Link to="/" className="group flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-1.5 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <img 
              src="/logo.png" 
              alt="TrustHyre" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white leading-none">
              Trust<span className="text-[#38BDF8]">Hyre</span>
            </span>
            <span className="text-[10px] font-bold tracking-widest text-[#94A3B8] uppercase mt-1">
              Verified Marketplace
            </span>
          </div>
        </Link>
      </div>

      {/* Middle Interactive Floating Status Cards (Pure In-Code Custom Graphics) */}
      <div className="relative z-10 my-auto py-8 space-y-4">
        
        {/* Card 1: Vector Candidate / Employer Avatar Badge */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-fit backdrop-blur-xl bg-white/10 hover:bg-white/15 border border-white/20 shadow-xl rounded-full px-4 py-2 flex items-center gap-3 transition-all cursor-default"
        >
          <div className="relative">
            {/* 100% Vector In-Code Avatar Graphic */}
            <div className="w-8 h-8 rounded-full bg-linear-to-tr from-[#0066FF] to-[#38BDF8] flex items-center justify-center text-white font-bold text-xs shadow-xs border border-white/40">
              {isCandidate ? (
                <CheckCircle2 className="w-4 h-4 text-white" />
              ) : (
                <Award className="w-4 h-4 text-white" />
              )}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0A1931] ring-1 ring-emerald-300"></span>
          </div>
          <span className="text-white text-xs sm:text-sm font-bold tracking-wide pr-1">
            {isCandidate ? '46 Jobs applied' : '240+ Verified Candidates'}
          </span>
        </motion.div>

        {/* Card 2: Notification Alert Pill in TrustHyre Theme */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="w-fit backdrop-blur-xl bg-white/10 hover:bg-white/15 border border-white/20 shadow-xl rounded-2xl p-3 pr-6 flex items-center gap-3.5 transition-all cursor-default"
        >
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-[#0066FF] to-[#38BDF8] flex items-center justify-center text-white shadow-xs border border-white/20">
            {isCandidate ? <Briefcase className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
          </div>
          <div className="space-y-1">
            <p className="text-white text-xs sm:text-sm font-bold leading-none">
              {isCandidate ? 'Job alert' : 'Direct hire alert'}
            </p>
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="w-6 h-1.5 rounded-full bg-[#38BDF8]/60"></span>
              <span className="w-3 h-1.5 rounded-full bg-white/30"></span>
            </div>
          </div>
        </motion.div>

        {/* Card 3: Status Review Pill in TrustHyre Theme */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-fit backdrop-blur-xl bg-white/10 hover:bg-white/15 border border-white/20 shadow-xl rounded-full px-4 py-2 flex items-center gap-3 transition-all cursor-default"
        >
          <div className="w-7 h-7 rounded-full bg-linear-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white shadow-xs">
            {isCandidate ? <Eye className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
          </div>
          <span className="text-white text-xs sm:text-sm font-bold tracking-wide">
            {isCandidate ? '12 Reviewed' : '98% Fill rate'}
          </span>
          <span className="w-4 h-1.5 rounded-full bg-emerald-400/40 ml-2"></span>
        </motion.div>

      </div>

      {/* Bottom Hero Punchline with TrustHyre Brand Typography */}
      <div className="relative z-10 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="font-['Outfit',sans-serif] text-white/80 text-sm sm:text-base font-light tracking-wide">
            {isCandidate ? 'Reach the peak of' : 'Build the foundation of'}
          </p>
          <p className="font-['Caveat',cursive] text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-[#38BDF8] via-[#60A5FA] to-[#93C5FD] mt-0.5 drop-shadow-md">
            {isCandidate ? 'your career!' : 'your dream team!'}
          </p>
        </motion.div>
      </div>

    </div>
  );
};

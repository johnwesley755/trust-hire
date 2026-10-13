import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, Lock, Zap, Building2, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LANDING_IMAGES } from '../../landing/constants/landingAssets';

interface AuthVisualHeroProps {
  role: 'WORKER' | 'EMPLOYER';
}

export const AuthVisualHero: React.FC<AuthVisualHeroProps> = ({ role }) => {
  const isCandidate = role === 'WORKER';

  // Sector photography corresponding to role from verified landing assets
  const bgImage = isCandidate 
    ? (LANDING_IMAGES.electrician?.src || LANDING_IMAGES.heroBackgrounds[3]?.src)
    : (LANDING_IMAGES.heroBackgrounds[0]?.src || LANDING_IMAGES.warehouseLogistics?.src);

  return (
    <div className="relative w-full h-full min-h-[580px] lg:min-h-full rounded-[1.75rem] overflow-hidden bg-[#0f2f63] text-white flex flex-col justify-between p-7 sm:p-9 select-none font-['Onest',system-ui,sans-serif]">
      {/* Background Photography with Navy Scrim Overlay matching Landing Hero */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt={isCandidate ? "Verified skilled workforce" : "Enterprise industrial infrastructure"}
          className="w-full h-full object-cover object-center filter brightness-[0.78] contrast-[1.08] scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Multilayer Deep Navy Scrim Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-[#0f2f63]/85 via-[#0f2f63]/75 to-[#0f2f63]/95" />
        <div className="absolute inset-0 bg-[#0f2f63]/30 mix-blend-multiply" />
      </div>

      {/* Top Header: TrustHyre Brand Badge & Live Status Pill */}
      <div className="relative z-10 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2.5 group cursor-pointer">
          <span className="w-8 h-8 rounded-full border border-white/25 bg-white/10 backdrop-blur-md flex items-center justify-center p-1.5 transition-transform group-hover:scale-105 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-white" />
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-medium tracking-[0.24em] uppercase text-white leading-none">
              TrustHyre
            </span>
            <span className="text-[9px] font-medium tracking-[0.16em] uppercase text-white/60 mt-1">
              Verified Marketplace
            </span>
          </div>
        </Link>

        {/* Live Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-medium text-white/90">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>24 Hubs Live</span>
        </div>
      </div>

      {/* Middle Interactive Floating Status Cards matching Landing Page Cards */}
      <div className="relative z-10 my-auto py-8 space-y-3.5">
        
        {/* Card 1: Verified Attendance / Pre-screened */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="backdrop-blur-md bg-white/12 hover:bg-white/18 border border-white/20 rounded-2xl p-4 shadow-xl transition-all"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center text-white shrink-0">
              {isCandidate ? <UserCheck className="w-4 h-4 text-[#5790e6]" /> : <Building2 className="w-4 h-4 text-[#5790e6]" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs sm:text-sm font-medium text-white tracking-tight">
                  {isCandidate ? 'Biometric Geofence Verified' : 'Aadhaar & Face-Verified Crews'}
                </p>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              </div>
              <p className="text-[11px] text-white/75 mt-0.5 leading-snug">
                {isCandidate 
                  ? 'Punch in seamlessly at verified work sites with zero attendance disputes.' 
                  : '100% pre-screened technicians ready for immediate shifts.'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Escrow Payouts / Rapid Fill Speed */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="backdrop-blur-md bg-white/12 hover:bg-white/18 border border-white/20 rounded-2xl p-4 shadow-xl transition-all"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center text-white shrink-0">
              {isCandidate ? <Zap className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-emerald-400" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs sm:text-sm font-medium text-white tracking-tight">
                  {isCandidate ? 'Automated UPI Escrow Payouts' : 'Smart Escrow Vault Protected'}
                </p>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Instant
                </span>
              </div>
              <p className="text-[11px] text-white/75 mt-0.5 leading-snug">
                {isCandidate 
                  ? 'Guaranteed daily wage deposits directly to your UPI ID upon task approval.' 
                  : 'Funds locked securely and released only when verified milestones complete.'}
              </p>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Bottom Hero Headline & Platform Metric Pills */}
      <div className="relative z-10 pt-2 space-y-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-white/70 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5790e6]" />
            <span>{isCandidate ? 'Skilled Workforce Network' : 'Enterprise Logistics & Infra'}</span>
          </div>
          <h2 className="text-2xl sm:text-[1.85rem] font-medium tracking-tight uppercase text-white leading-[1.02]">
            {isCandidate ? (
              <>Work with pride. <br />Get paid daily.</>
            ) : (
              <>Hire with trust. <br />Zero no-shows.</>
            )}
          </h2>
          <p className="text-xs text-white/75 mt-2 leading-relaxed max-w-sm">
            {isCandidate 
              ? 'Join 14,000+ certified specialists across culinary, logistics, electrical and engineering trades.' 
              : 'Deploy verified technical crews to your facility or work site with an average 15-minute dispatch.'}
          </p>
        </div>

        {/* 2-Col Metric Micro-Banner matching Landing Stats */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/15">
          <div>
            <p className="text-lg font-medium text-white tracking-tight">14,000+</p>
            <p className="text-[10px] uppercase tracking-wider text-white/60">Verified Specialists</p>
          </div>
          <div>
            <p className="text-lg font-medium text-white tracking-tight">100%</p>
            <p className="text-[10px] uppercase tracking-wider text-white/60">Escrow Backed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

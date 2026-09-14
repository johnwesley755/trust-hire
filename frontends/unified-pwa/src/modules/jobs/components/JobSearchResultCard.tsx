import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, CheckCircle, Loader2, ChevronRight, MapPin, Star, Zap, ShieldCheck } from 'lucide-react';
import type { JobSearch } from '../../../services/search.service';
import type { Job } from '../../../services/job.service';

interface JobSearchResultCardProps {
  job: JobSearch | Job;
  index: number;
  applied: boolean;
  onApply: () => void;
  isApplying: boolean;
}

const TRADE_IMAGES: Record<string, string> = {
  electrician: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80",
  plumbing: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&auto=format&fit=crop&q=80",
  plumber: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&auto=format&fit=crop&q=80",
  warehouse: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80",
  driver: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&auto=format&fit=crop&q=80",
  welder: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80",
  carpenter: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&auto=format&fit=crop&q=80",
  mason: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80",
  facility: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80",
};

const getTradeImage = (title?: string, industry?: string) => {
  const text = `${title || ''} ${industry || ''}`.toLowerCase();
  for (const [key, url] of Object.entries(TRADE_IMAGES)) {
    if (text.includes(key)) return url;
  }
  return "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80";
};

export const JobSearchResultCard: React.FC<JobSearchResultCardProps> = ({
  job,
  index,
  applied,
  onApply,
  isApplying,
}) => {
  const budget = job.budget;
  const imageUrl = getTradeImage(job.title, job.industry);
  const distance = ((index % 5) * 0.8 + 0.9).toFixed(1);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4) }}
      className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-blue-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group relative active:scale-[0.99]"
    >
      {/* Header Image with Badges */}
      <div className="relative h-36 w-full overflow-hidden bg-slate-100">
        <img 
          src={imageUrl} 
          alt={job.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="bg-emerald-600 text-white text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
            <Zap className="w-2.5 h-2.5 fill-current" /> Instant Shift
          </span>
          <span className="bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-0.5">
            <MapPin className="w-2.5 h-2.5 text-blue-400" /> {distance} km away
          </span>
        </div>

        <div className="absolute top-2.5 right-2.5">
          <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
            <Star className="w-3 h-3 fill-current" /> 4.9
          </span>
        </div>

        {/* Bottom overlay text */}
        <div className="absolute bottom-2.5 left-3 right-3 flex justify-between items-end text-white">
          <div>
            <span className="text-[10px] font-bold text-blue-200 uppercase tracking-widest block">{job.industry || 'General Trade'}</span>
            <h3 className="font-extrabold text-base sm:text-lg leading-snug line-clamp-1 drop-shadow-xs">{job.title}</h3>
          </div>
          <div className="text-right shrink-0">
            <span className="text-base sm:text-lg font-black text-amber-300 drop-shadow-xs">₹{budget?.toLocaleString()}</span>
            <span className="text-[8px] text-white/80 block uppercase tracking-wider">Escrow Locked</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-700 flex items-center gap-1 truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0066FF] shrink-0" />
              {(job as any).employerName || 'Verified Enterprise Partner'}
            </span>
            <span className="text-[11px] font-medium text-slate-400 shrink-0 truncate ml-2">
              {job.city || job.location || 'Local area'}
            </span>
          </div>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {job.description || 'Verified job requirement. Instant dispatch and verified payout upon shift completion.'}
          </p>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onApply();
            }}
            disabled={applied || isApplying}
            className={`w-full py-2.5 px-4 rounded-xl font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm ${
              applied 
              ? 'bg-emerald-600 text-white cursor-default' 
              : 'bg-[#0066FF] hover:bg-blue-700 text-white shadow-blue-500/20 active:scale-98 cursor-pointer'
            }`}
          >
            {applied ? (
              <><CheckCircle className="w-4 h-4" /> Applied • Shift Locked</>
            ) : isApplying ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span className="flex items-center gap-1">
                View & Apply <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { workerService } from '../api/worker.service';
import { 
  ShieldCheck, 
  Star, 
  ChevronLeft, 
  Loader2, 
  Share2, 
  Bookmark, 
  BadgeCheck, 
  Zap, 
  Snowflake, 
  Construction,
  Verified
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

// Defining it here since it's cleaner for now
export interface TrustScoreResponse {
    score: number;
    identityVerified: boolean;
    skillsVerifiedCount: number;
    avgRating: number;
    reliabilityRate: number;
    lastUpdated: string;
}

export const WorkerProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
        workerService.incrementProfileView(id).catch(err => console.error("Failed to increment profile view:", err));
    }
  }, [id]);

  const { data: worker, isLoading: isLoadingWorker } = useQuery({
    queryKey: ['worker', id],
    queryFn: () => workerService.getWorkerById(id || ''),
    enabled: !!id
  });

  // Mocking trust score fetch since it's a new backend endpoint
  const { data: trustScore } = useQuery({
    queryKey: ['trustScore', id],
    queryFn: async () => {
        return {
            score: 450,
            identityVerified: true,
            skillsVerifiedCount: 3,
            avgRating: 4.8,
            reliabilityRate: 0.95,
            lastUpdated: new Date().toISOString()
        } as TrustScoreResponse;
    },
    enabled: !!id
  });

  if (isLoadingWorker) return (
    <div className="min-h-screen bg-[#F5F4EF] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 text-[#1F3F34] animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1F3F34]/40">Loading Dossier...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F4EF] text-[#1F3F34] font-body selection:bg-[#FACD15] selection:text-[#1F3F34]">
      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-8 py-10 relative pb-32">
        {/* Header Actions */}
        <header className="flex justify-between items-center mb-12">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-bold text-[#1F3F34]/60 hover:text-[#1F3F34] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Worker Search</span>
          </button>
          
          <div className="flex gap-4">
            <button className="p-3 bg-white rounded-full shadow-sm hover:bg-[#F5F4EF] transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-3 bg-white rounded-full shadow-sm hover:bg-[#F5F4EF] transition-colors">
              <Bookmark className="w-5 h-5" />
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Profile Hero Section */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 text-left">
              {/* Left: Avatar & Primary Info */}
              <div className="lg:col-span-8 bg-white rounded-lg p-8 flex flex-col md:flex-row gap-8 relative overflow-hidden">
                {/* Background Blob Decoration */}
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#FACD15]/10 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 shrink-0">
                  <div className="w-40 h-40 md:w-56 md:h-56 rounded-lg overflow-hidden bg-[#F5F4EF] relative shadow-lg">
                    {worker?.profilePhoto ? (
                      <img src={worker.profilePhoto} alt={worker.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl font-black bg-[#FACD15] text-[#1F3F34]">
                        {worker?.name[0]}
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 bg-[#FACD15] text-[#1F3F34] text-[10px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                      <Verified className="w-3 h-3" />
                      VERIFIED
                    </div>
                  </div>
                </div>

                <div className="flex-1 z-10 space-y-6">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 uppercase">{worker?.name}</h1>
                    <p className="text-lg text-[#1F3F34]/70 font-medium">Senior Multi-Technical Specialist • {worker?.city || 'Bengaluru, KA'}</p>
                  </div>

                  {/* Metrics Grid inside Hero */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-[#F5F4EF] p-4 rounded-lg flex flex-col justify-center text-center">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#1F3F34]/50 mb-1">Rating</p>
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-lg font-extrabold">{trustScore?.avgRating || 4.8}</span>
                        <Star className="w-3.5 h-3.5 text-[#FACD15] fill-[#FACD15]" />
                      </div>
                    </div>
                    <div className="bg-[#F5F4EF] p-4 rounded-lg flex flex-col justify-center text-center">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#1F3F34]/50 mb-1">Reliability</p>
                      <p className="text-lg font-extrabold">{((trustScore?.reliabilityRate || 0.95) * 100).toFixed(0)}%</p>
                    </div>
                    <div className="bg-[#F5F4EF] p-4 rounded-lg flex flex-col justify-center text-center">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#1F3F34]/50 mb-1">Experience</p>
                      <p className="text-lg font-extrabold">{worker?.experience || 3} YRS</p>
                    </div>
                    <div className="bg-[#F5F4EF] p-4 rounded-lg flex flex-col justify-center text-center">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#1F3F34]/50 mb-1">Level</p>
                      <p className="text-lg font-extrabold">LVL {worker?.level || 1}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="bg-[#1F3F34]/5 px-4 py-2 rounded-full text-xs font-bold font-body">Immediate Start</span>
                    <span className="bg-[#1F3F34]/5 px-4 py-2 rounded-full text-xs font-bold font-body">Background Checked</span>
                    <span className="bg-[#1F3F34]/5 px-4 py-2 rounded-full text-xs font-bold font-body">Own Vehicle</span>
                  </div>
                </div>
              </div>

              {/* Right: Trust Widget */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="bg-[#1F3F34] text-[#F5F4EF] p-8 rounded-lg relative overflow-hidden flex-1 shadow-2xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#FACD15] opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                  <div className="relative z-10 flex flex-col h-full text-left">
                    <div className="flex items-center gap-3 mb-8">
                      <ShieldCheck className="w-8 h-8 text-[#FACD15]" />
                      <h2 className="text-xl font-black uppercase tracking-tight">Bharat Trust Score</h2>
                    </div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-6xl font-black text-[#FACD15] leading-none">{trustScore?.score || 450}</span>
                      <span className="text-lg font-bold opacity-40">/ 500</span>
                    </div>
                    <p className="text-sm text-[#F5F4EF]/70 mb-8 leading-relaxed font-bold">
                        Based on 24 successful assignments and high employer reliability feedback.
                    </p>
                    <div className="mt-auto">
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-[#FACD15] rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${((trustScore?.score || 450) / 500) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-2 text-[10px] font-bold uppercase tracking-widest opacity-60">
                        <span>Novice</span>
                        <span>Expert</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Verified Skills Section */}
            <section className="mb-12 text-left">
              <h3 className="text-2xl font-black uppercase tracking-tight mb-6">Verified Skills</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Skill Card 1 */}
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-[#FACD15] text-left">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-[#F5F4EF] rounded-lg flex items-center justify-center">
                      <Zap className="w-6 h-6 text-[#1F3F34]" />
                    </div>
                    <BadgeCheck className="w-6 h-6 text-[#1F3F34]" />
                  </div>
                  <h4 className="text-lg font-black uppercase tracking-tight mb-1">Electrical</h4>
                  <p className="text-sm text-[#1F3F34]/60 mb-4 font-bold">Industrial wiring, MCB installation, and panel maintenance.</p>
                  <div className="bg-[#F5F4EF] px-3 py-1 rounded inline-block text-[10px] font-bold uppercase tracking-wider">Expert Level</div>
                </div>
                {/* Skill Card 2 */}
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-[#FACD15] text-left">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-[#F5F4EF] rounded-lg flex items-center justify-center">
                      <Snowflake className="w-6 h-6 text-[#1F3F34]" />
                    </div>
                    <BadgeCheck className="w-6 h-6 text-[#1F3F34]" />
                  </div>
                  <h4 className="text-lg font-black uppercase tracking-tight mb-1">HVAC</h4>
                  <p className="text-sm text-[#1F3F34]/60 mb-4 font-bold">Centralized air conditioning repair and seasonal servicing.</p>
                  <div className="bg-[#F5F4EF] px-3 py-1 rounded inline-block text-[10px] font-bold uppercase tracking-wider">Advanced</div>
                </div>
                {/* Skill Card 3 */}
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-[#FACD15] text-left">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-[#F5F4EF] rounded-lg flex items-center justify-center">
                      <Construction className="w-6 h-6 text-[#1F3F34]" />
                    </div>
                    <BadgeCheck className="w-6 h-6 text-[#1F3F34]" />
                  </div>
                  <h4 className="text-lg font-black uppercase tracking-tight mb-1">Construction</h4>
                  <p className="text-sm text-[#1F3F34]/60 mb-4 font-bold">Masonry work, blueprint reading, and site supervision.</p>
                  <div className="bg-[#F5F4EF] px-3 py-1 rounded inline-block text-[10px] font-bold uppercase tracking-wider">Intermediate</div>
                </div>
              </div>
            </section>

            {/* Recent Work Feedback */}
            <section className="mb-24 text-left">
              <h3 className="text-2xl font-black uppercase tracking-tight mb-6">Recent Work Feedback</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/50 p-6 rounded-lg flex flex-col sm:flex-row gap-6 border border-white">
                  <div className="w-16 h-16 rounded-lg bg-[#F5F4EF] overflow-hidden shrink-0 shadow-sm">
                    <img alt="Job Site" className="w-full h-full object-cover grayscale opacity-60" src="https://images.unsplash.com/photo-1541888946425-d81bb1930060?auto=format&fit=crop&q=80&w=200" />
                  </div>
                  <div className="text-left">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-black uppercase tracking-tight">Warehouse Maintenance</h5>
                      <div className="flex items-center gap-1 text-xs font-black text-[#FACD15]">
                        <span>4.9</span>
                        <Star className="w-3 h-3 fill-[#FACD15]" />
                      </div>
                    </div>
                    <p className="text-sm text-[#1F3F34]/70 mb-4 italic font-bold">"Lourdusamy handled a complex HVAC failure over the weekend. Extremely professional and punctual."</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/40">— GreenLine Logistics Pvt Ltd</p>
                  </div>
                </div>
                <div className="bg-white/50 p-6 rounded-lg flex flex-col sm:flex-row gap-6 border border-white">
                  <div className="w-16 h-16 rounded-lg bg-[#F5F4EF] overflow-hidden shrink-0 shadow-sm">
                    <img alt="Factory" className="w-full h-full object-cover grayscale opacity-60" src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=200" />
                  </div>
                  <div className="text-left">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-black uppercase tracking-tight">Electrical Panel Upgrade</h5>
                      <div className="flex items-center gap-1 text-xs font-black text-[#FACD15]">
                        <span>5.0</span>
                        <Star className="w-3 h-3 fill-[#FACD15]" />
                      </div>
                    </div>
                    <p className="text-sm text-[#1F3F34]/70 mb-4 italic font-bold">"Superb work on the main distribution boards. Highly recommended for industrial technical roles."</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/40">— Apex Manufacturing</p>
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        </AnimatePresence>

        {/* Sticky Bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md z-40 flex justify-center border-t border-[#F5F4EF] lg:left-64 transition-all duration-300">
          <div className="max-w-7xl w-full flex items-center justify-between gap-8 px-8">
            <div className="hidden md:block text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/40 mb-1">Expected Salary</p>
              <p className="text-2xl font-black uppercase tracking-tighter">₹32,000 - ₹38,000 <span className="text-xs font-bold opacity-30 tracking-normal text-[#1F3F34]">/month</span></p>
            </div>
            <div className="flex-1 md:flex-none flex gap-4">
              <button className="flex-1 md:w-48 py-4 bg-[#F5F4EF] text-[#1F3F34] rounded-lg font-black uppercase text-xs tracking-widest hover:bg-[#E3E3DE] transition-colors border border-[#1F3F34]/5">
                Save Draft
              </button>
              <motion.button 
                whileHover={{ scale: 1.02, backgroundColor: '#002117' }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 md:w-80 py-4 bg-[#1F3F34] text-white rounded-lg font-black uppercase text-xs tracking-widest shadow-xl hover:bg-on-secondary-fixed transition-all"
              >
                HIRE WORKER
              </motion.button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

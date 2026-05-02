import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { workerService } from '../../../services/worker.service';
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

  const { data: trustScore } = useQuery({
    queryKey: ['trustScore', id],
    queryFn: () => workerService.getTrustScore(id || ''),
    enabled: !!id
  });

  const { data: ratings } = useQuery({
    queryKey: ['workerRatings', id],
    queryFn: () => workerService.getWorkerRatings(id || ''),
    enabled: !!id
  });

  if (isLoadingWorker) return (
    <div className="min-h-screen bg-[#F5F4EF] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 text-[#1F3F34] animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1F3F34]/40">Loading</p>
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
                    {worker?.verificationStatus === 'VERIFIED' && (
                      <div className="absolute bottom-4 left-4 bg-[#FACD15] text-[#1F3F34] text-[10px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                        <Verified className="w-3 h-3" />
                        VERIFIED
                      </div>
                    )}
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
                      <h2 className="text-xl font-black uppercase tracking-tight">Trust Hire Score</h2>
                    </div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-6xl font-black text-[#FACD15] leading-none">{trustScore?.score || 30}</span>
                      <span className="text-lg font-bold opacity-40">/ 100</span>
                    </div>
                    <p className="text-sm text-[#F5F4EF]/70 mb-8 leading-relaxed font-bold">
                        Calculated based on skill certifications, job history, and verified reliability metrics.
                    </p>
                    <div className="mt-auto">
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-[#FACD15] rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${(trustScore?.score || 30)}%` }}
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

            {/* Bio Section */}
            {worker?.bio && (
              <section className="mb-12 text-left">
                <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Professional Bio</h3>
                <div className="bg-white p-8 rounded-lg shadow-sm">
                  <p className="text-lg leading-relaxed text-[#1F3F34]/80 font-medium">
                    {worker.bio}
                  </p>
                </div>
              </section>
            )}

            {/* Verified Skills Section */}
            <section className="mb-12 text-left">
              <h3 className="text-2xl font-black uppercase tracking-tight mb-6">Worker Skills</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {worker?.skills && worker.skills.length > 0 ? (
                  worker.skills.map((skill, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-[#FACD15] text-left flex flex-col justify-between">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-[#F5F4EF] rounded-lg flex items-center justify-center">
                          {skill.toLowerCase().includes('electric') ? <Zap className="w-6 h-6 text-[#1F3F34]" /> : 
                           skill.toLowerCase().includes('hvac') || skill.toLowerCase().includes('ac') ? <Snowflake className="w-6 h-6 text-[#1F3F34]" /> :
                           <Construction className="w-6 h-6 text-[#1F3F34]" />}
                        </div>
                        <BadgeCheck className="w-6 h-6 text-[#1F3F34]" />
                      </div>
                      <h4 className="text-lg font-black uppercase tracking-tight mb-1">{skill}</h4>
                      <div className="mt-4 bg-[#F5F4EF] px-3 py-1 rounded inline-block text-[10px] font-bold uppercase tracking-wider w-fit">Verified Skill</div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full bg-white p-12 rounded-lg text-center border-2 border-dashed border-[#1F3F34]/10">
                    <p className="text-[#1F3F34]/40 font-bold uppercase tracking-widest">No skills listed</p>
                  </div>
                )}
              </div>
            </section>

            {/* Recent Work Feedback */}
            <section className="mb-24 text-left">
              <h3 className="text-2xl font-black uppercase tracking-tight mb-6">Recent Work Feedback</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ratings && ratings.length > 0 ? (
                  ratings.map((rating, idx) => (
                    <div key={idx} className="bg-white/50 p-6 rounded-lg flex flex-col sm:flex-row gap-6 border border-white">
                      <div className="w-16 h-16 rounded-lg bg-[#F5F4EF] overflow-hidden shrink-0 shadow-sm flex items-center justify-center">
                        <Star className="w-8 h-8 text-[#1F3F34]/10" />
                      </div>
                      <div className="text-left flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-black uppercase tracking-tight">Project Feedback</h5>
                          <div className="flex items-center gap-1 text-xs font-black text-[#FACD15]">
                            <span>{rating.score?.toFixed(1)}</span>
                            <Star className="w-3 h-3 fill-[#FACD15]" />
                          </div>
                        </div>
                        <p className="text-sm text-[#1F3F34]/70 mb-4 italic font-bold">"{rating.comment || 'No comment provided.'}"</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/40">— {new Date(rating.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full bg-white/30 p-12 rounded-lg text-center border-2 border-dashed border-[#1F3F34]/5">
                    <p className="text-[#1F3F34]/30 font-bold uppercase tracking-widest">No feedback received yet</p>
                  </div>
                )}
              </div>
            </section>
          </motion.div>
        </AnimatePresence>

      </main>
    </div>
  );
};

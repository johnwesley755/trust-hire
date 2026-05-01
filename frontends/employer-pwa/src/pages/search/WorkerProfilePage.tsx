import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchWorkerById, fetchTrustScore, fetchWorkerRatings, incrementProfileView } from '../../store/slices/searchSlice';
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
  const dispatch = useAppDispatch();

  const { currentWorker: worker, trustScore, ratings, loading } = useAppSelector((state) => state.search);

  useEffect(() => {
    if (id) {
        dispatch(incrementProfileView(id));
        dispatch(fetchWorkerById(id));
        dispatch(fetchTrustScore(id));
        dispatch(fetchWorkerRatings(id));
    }
  }, [id, dispatch]);

  if (loading && !worker) return (
    <div className="min-h-screen bg-[#F5F4EF] flex flex-col items-center justify-center gap-8">
        <Loader2 className="h-16 w-16 text-[#1F3F34] animate-spin opacity-20" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1F3F34]/30 animate-pulse">Synchronizing Dossier...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F4EF] text-[#1F3F34] font-body selection:bg-[#FACD15] selection:text-[#1F3F34]">
      {/* Main Content Area */}
      <main className="max-w-[1600px] mx-auto px-8 lg:px-16 py-12 relative pb-40 text-left">
        {/* Header Actions */}
        <header className="flex justify-between items-center mb-16">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-[#1F3F34]/30 hover:text-[#FACD15] transition-all group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-3 transition-transform" />
            <span>RETURN TO INTEL HUB</span>
          </button>
          
          <div className="flex gap-6">
            <button className="w-14 h-14 bg-white rounded-2xl shadow-2xl shadow-[#1F3F34]/5 border border-[#EFEEE9] flex items-center justify-center text-[#1F3F34]/20 hover:text-[#FACD15] transition-all hover:-translate-y-1 active:scale-90">
              <Share2 className="w-6 h-6" />
            </button>
            <button className="w-14 h-14 bg-white rounded-2xl shadow-2xl shadow-[#1F3F34]/5 border border-[#EFEEE9] flex items-center justify-center text-[#1F3F34]/20 hover:text-[#FACD15] transition-all hover:-translate-y-1 active:scale-90">
              <Bookmark className="w-6 h-6" />
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Profile Hero Section */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
              {/* Left: Avatar & Primary Info */}
              <div className="lg:col-span-8 bg-white rounded-[4rem] p-10 md:p-14 lg:p-20 flex flex-col md:flex-row gap-12 lg:gap-20 relative overflow-hidden shadow-2xl shadow-[#1F3F34]/5 border border-[#EFEEE9]">
                {/* Background Blob Decoration */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#FACD15] opacity-[0.03] rounded-full blur-[100px]"></div>
                
                <div className="relative z-10 shrink-0">
                  <div className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-[3.5rem] overflow-hidden bg-[#F5F4EF] relative shadow-2xl shadow-[#1F3F34]/10 border-8 border-white ring-1 ring-[#EFEEE9] grayscale-[0.2] hover:grayscale-0 transition-all duration-700">
                    {worker?.profilePhoto ? (
                      <img src={worker.profilePhoto} alt={worker.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-8xl font-black bg-[#FACD15] text-[#1F3F34] bricolage">
                        {worker?.name?.[0]}
                      </div>
                    )}
                    {worker?.verificationStatus === 'VERIFIED' && (
                      <div className="absolute bottom-6 left-6 bg-[#FACD15] text-[#1F3F34] text-[10px] font-black px-5 py-2.5 rounded-2xl flex items-center gap-3 shadow-2xl shadow-[#FACD15]/40 border-2 border-white">
                        <Verified className="w-4 h-4 font-black" />
                        VERIFIED OPERATIVE
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 z-10 space-y-10 py-6">
                  <div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-4 uppercase bricolage leading-[0.85] text-[#1F3F34]">{worker?.name}</h1>
                    <div className="flex flex-wrap items-center gap-6 mt-8 text-[11px] font-black uppercase tracking-[0.3em] text-[#1F3F34]/40">
                        <p className="flex items-center gap-3"><Zap className="w-5 h-5 text-[#FACD15]" /> SENIOR SPECIALIST</p>
                        <span className="w-2 h-2 bg-[#FACD15] rounded-full opacity-40"></span>
                        <p className="flex items-center gap-3"><Construction className="w-5 h-5 text-[#FACD15]" /> {worker?.city || 'BENGALURU HUB'}</p>
                    </div>
                  </div>

                  {/* Metrics Grid inside Hero */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    <MetricCard label="RATING" value={trustScore?.avgRating?.toFixed(1) || "4.8"} icon={<Star className="w-4 h-4 text-[#FACD15] fill-[#FACD15]" />} />
                    <MetricCard label="RELIABILITY" value={`${((trustScore?.reliabilityRate || 0.95) * 100).toFixed(0)}%`} />
                    <MetricCard label="TENURE" value={`${worker?.experience || 3} YRS`} />
                    <MetricCard label="RANK" value={`LVL ${worker?.level || 1}`} />
                  </div>

                  <div className="flex flex-wrap gap-4 pt-6">
                    <Badge text="IMMEDIATE MOBILIZATION" />
                    <Badge text="VALIDATED BACKGROUND" />
                    <Badge text="AUTONOMOUS LOGISTICS" />
                  </div>
                </div>
              </div>

              {/* Right: Trust Widget */}
              <div className="lg:col-span-4 flex flex-col gap-10">
                <div className="bg-[#1F3F34] text-white p-12 lg:p-16 rounded-[4rem] relative overflow-hidden flex-1 shadow-[0_50px_100px_-20px_rgba(31,63,52,0.4)] flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-[#FACD15] opacity-[0.05] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                  <div className="relative z-10 space-y-12">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                        <ShieldCheck className="w-10 h-10 text-[#FACD15]" />
                      </div>
                      <h2 className="text-3xl font-black uppercase tracking-tighter bricolage">Trust Hire<br/>Protocol</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-baseline gap-4">
                            <span className="text-8xl font-black text-[#FACD15] leading-none bricolage">{trustScore?.score || 30}</span>
                            <span className="text-2xl font-black opacity-20 bricolage">/ 100</span>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 leading-relaxed">
                            VALIDATED VIA SKILL CERTIFICATION, MISSION HISTORY, AND REPUTATION METRICS.
                        </p>
                    </div>
                    
                    <div className="pt-10">
                      <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-1 shadow-inner">
                        <div 
                            className="h-full bg-[#FACD15] rounded-full transition-all duration-[2000ms] ease-out shadow-[0_0_20px_rgba(250,205,21,0.6)]"
                            style={{ width: `${(trustScore?.score || 30)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-6 text-[9px] font-black uppercase tracking-[0.5em] text-white/30">
                        <span>NOVICE</span>
                        <span>STRATEGIST</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Bio Section */}
            {worker?.bio && (
              <section className="mb-20">
                <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-[#1F3F34]/20 mb-10 pl-6 border-l-4 border-[#FACD15]">EXECUTIVE DOSSIER</h3>
                <div className="bg-white p-12 lg:p-16 rounded-[4rem] shadow-2xl shadow-[#1F3F34]/5 border border-[#EFEEE9] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5F4EF] rounded-full -mt-16 -mr-16 group-hover:scale-150 transition-transform duration-1000"></div>
                  <p className="text-2xl lg:text-3xl leading-relaxed text-[#1F3F34]/80 font-medium italic relative z-10">
                    "{worker.bio}"
                  </p>
                </div>
              </section>
            )}

            {/* Verified Skills Section */}
            <section className="mb-20">
              <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-[#1F3F34]/20 mb-10 pl-6 border-l-4 border-[#FACD15]">CERTIFIED SKILLSETS</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {worker?.skills && worker.skills.length > 0 ? (
                  worker.skills.map((skill: string, idx: number) => (
                    <div key={idx} className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-[#1F3F34]/5 border border-[#EFEEE9] hover:border-[#FACD15] transition-all duration-500 group">
                      <div className="flex justify-between items-start mb-10">
                        <div className="w-16 h-16 bg-[#F5F4EF] rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-[#1F3F34] group-hover:rotate-12 transition-all duration-500">
                          {skill.toLowerCase().includes('electric') ? <Zap className="w-8 h-8 text-[#FACD15]" /> : 
                           skill.toLowerCase().includes('hvac') || skill.toLowerCase().includes('ac') ? <Snowflake className="w-8 h-8 text-[#FACD15]" /> :
                           <Construction className="w-8 h-8 text-[#FACD15]" />}
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#C7EBDB] flex items-center justify-center shadow-xl shadow-emerald-500/10">
                            <BadgeCheck className="w-6 h-6 text-[#4a6b5e]" />
                        </div>
                      </div>
                      <h4 className="text-2xl font-black uppercase tracking-tight mb-2 bricolage">{skill}</h4>
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#1F3F34]/20">VERIFIED CAPABILITY</p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full bg-white/50 p-20 rounded-[4rem] text-center border-4 border-dashed border-[#EFEEE9] shadow-inner">
                    <p className="text-[11px] font-black uppercase tracking-[0.5em] text-[#1F3F34]/10">ZERO ASSETS CATALOGED</p>
                  </div>
                )}
              </div>
            </section>

            {/* Recent Work Feedback */}
            <section className="mb-32">
              <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-[#1F3F34]/20 mb-10 pl-6 border-l-4 border-[#FACD15]">REPUTATION LOGS</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {ratings && ratings.length > 0 ? (
                  ratings.map((rating: any, idx: number) => (
                    <div key={idx} className="bg-white p-10 rounded-[3.5rem] flex flex-col sm:flex-row gap-10 border border-[#EFEEE9] shadow-2xl shadow-[#1F3F34]/5 hover:shadow-[#1F3F34]/10 transition-all duration-700">
                      <div className="w-20 h-20 rounded-[2rem] bg-[#F5F4EF] overflow-hidden shrink-0 shadow-inner flex items-center justify-center border-2 border-white">
                        <Star className="w-10 h-10 text-[#FACD15]" />
                      </div>
                      <div className="flex-1 space-y-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="text-lg font-black uppercase tracking-tight text-[#1F3F34]">Tactical Feedback</h5>
                            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-[#1F3F34]/20 mt-1">MISSION LOG #{idx + 104}</p>
                          </div>
                          <div className="bg-[#1F3F34] px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black text-[#FACD15] shadow-xl">
                            <span>{rating.score?.toFixed(1)}</span>
                            <Star className="w-3 h-3 fill-[#FACD15]" />
                          </div>
                        </div>
                        <p className="text-md text-[#1F3F34]/60 leading-relaxed font-bold italic">"{rating.comment || 'Mission parameters exceeded without textual report.'}"</p>
                        <div className="pt-4 border-t border-[#F5F4EF] flex justify-between items-center">
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#1F3F34]/30">{new Date(rating.createdAt).toLocaleDateString()}</span>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-[#FACD15] rounded-full"></div>
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#1F3F34]/40">VERIFIED REVIEW</span>
                            </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full bg-[#EFEEE9]/30 p-20 rounded-[4rem] text-center border-4 border-dashed border-[#1F3F34]/5 shadow-inner">
                    <p className="text-[11px] font-black uppercase tracking-[0.5em] text-[#1F3F34]/10">ZERO FEEDBACK CYCLES REGISTERED</p>
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

function MetricCard({ label, value, icon }: { label: string, value: string, icon?: React.ReactNode }) {
  return (
    <div className="bg-[#F5F4EF] p-6 rounded-[2rem] flex flex-col justify-center text-center border border-transparent hover:border-[#FACD15]/20 transition-all shadow-inner group">
      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#1F3F34]/30 mb-3 group-hover:text-[#FACD15] transition-colors">{label}</p>
      <div className="flex items-center justify-center gap-2">
        <span className="text-2xl font-black text-[#1F3F34] bricolage">{value}</span>
        {icon}
      </div>
    </div>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span className="bg-[#1F3F34] text-[#FACD15] px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] border border-white/5 shadow-xl shadow-[#1F3F34]/10 hover:scale-105 transition-transform cursor-default">
      {text}
    </span>
  );
}

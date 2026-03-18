import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { workerService } from '../api/worker.service';
import { ShieldCheck, MapPin, Award, Star, Briefcase, ChevronLeft, Calendar, Loader2, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

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

  const { data: worker, isLoading: isLoadingWorker } = useQuery({
    queryKey: ['worker', id],
    queryFn: () => workerService.getWorkerById(id || ''),
    enabled: !!id
  });

  // Mocking trust score fetch since it's a new backend endpoint
  const { data: trustScore } = useQuery({
    queryKey: ['trustScore', id],
    queryFn: async () => {
        // In a real app we'd have a specific service. 
        // For demonstration, we'll mock the response based on the backend we just created.
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
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 text-brand-primary animate-spin" />
        <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-muted">Loading profile...</p>
    </div>
  );

  const stats = [
    { label: 'Rating', value: `${trustScore?.avgRating} / 5`, icon: <Star className="text-brand-primary h-5 w-5" /> },
    { label: 'Reliability', value: `${(trustScore?.reliabilityRate || 0) * 100}%`, icon: <ShieldCheck className="text-brand-primary h-5 w-5" /> },
    { label: 'Experience', value: `${worker?.experience} YRS`, icon: <Briefcase className="text-brand-primary h-5 w-5" /> },
    { label: 'Exp Level', value: `LVL ${worker?.level}`, icon: <Award className="text-brand-primary h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-brand-bg text-brand-secondary selection:bg-brand-primary selection:text-brand-secondary">
      <div className="absolute inset-0 cloud-grid opacity-[0.03] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-6 py-12 pb-32 relative z-10">
        <button 
            onClick={() => navigate(-1)}
            className="mb-10 flex items-center gap-3 text-brand-muted hover:text-brand-primary transition-all font-semibold uppercase tracking-widest text-[10px] group"
        >
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Search
        </button>

        <div className="space-y-12">
            {/* Profile Header */}
            <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-brand-surface border border-brand-border rounded-[3rem] p-10 flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left shadow-2xl relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
                    <ShieldCheck className="w-64 h-64 text-brand-primary" />
                </div>

                <div className="h-40 w-40 rounded-4xl bg-brand-secondary text-brand-primary flex items-center justify-center text-6xl font-bold shadow-2xl border border-brand-secondary shrink-0 relative z-10 overflow-hidden">
                    {worker?.profilePhoto ? (
                        <img src={worker.profilePhoto} alt={worker.name} className="w-full h-full object-cover" />
                    ) : (
                        worker?.name[0]
                    )}
                </div>
                
                <div className="flex-1 space-y-6 relative z-10 pt-2">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-5xl font-bold text-neutral-900 tracking-tight leading-tight mb-4">{worker?.name}</h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                <span className="text-brand-muted flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest">
                                    <MapPin className="h-4 w-4 text-brand-primary" /> {worker?.city || worker?.address || worker?.location}
                                </span>
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-border" />
                                <span className="text-brand-muted text-[10px] font-semibold uppercase tracking-widest">Joined Jan 2026</span>
                            </div>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
                                {worker?.email && (
                                    <span className="text-brand-muted flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest">
                                        <Mail className="h-4 w-4 text-brand-primary" /> {worker.email}
                                    </span>
                                )}
                                {worker?.phoneNumber && (
                                    <span className="text-brand-muted flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest">
                                        <Phone className="h-4 w-4 text-brand-primary" /> {worker.phoneNumber}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="bg-brand-secondary px-8 py-5 rounded-4xl flex items-center gap-4 shadow-2xl border border-brand-secondary">
                            <ShieldCheck className="h-8 w-8 text-brand-primary" />
                            <div className="text-left">
                                <span className="block text-[8px] font-semibold text-brand-primary uppercase tracking-widest leading-none mb-1">Trust Score</span>
                                <span className="text-3xl font-bold text-brand-primary leading-none uppercase tracking-tight">{trustScore?.score}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-brand-bg/50 p-6 rounded-3xl border border-brand-border text-brand-muted font-medium relative shadow-inner">
                        <p className="leading-relaxed">"{worker?.bio || "No professional overview provided."}"</p>
                    </div>
                </div>
            </motion.section>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
                <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-brand-surface border border-brand-border p-8 rounded-4xl text-center space-y-3 shadow-xl hover:border-brand-primary/30 transition-all group"
                >
                    <div className="mx-auto w-12 h-12 bg-brand-secondary rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        {stat.icon}
                    </div>
                    <div>
                        <span className="block text-2xl font-bold text-brand-secondary uppercase tracking-tight leading-none mb-1">{stat.value}</span>
                        <span className="block text-[8px] font-semibold text-brand-muted uppercase tracking-widest">{stat.label}</span>
                    </div>
                </motion.div>
            ))}
            </div>

            {/* Verified Skills */}
            <section className="space-y-8">
                <div className="flex items-center gap-4">
                    <Award className="text-brand-primary h-8 w-8" />
                    <h2 className="text-3xl font-bold text-neutral-900 uppercase tracking-tight">Verified Skills</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {worker?.skills.map((skill: string, i: number) => (
                    <motion.div 
                        key={i} 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white border border-brand-border p-8 rounded-4xl flex items-center justify-between shadow-2xl group hover:border-brand-primary/50 transition-all cursor-default"
                    >
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-brand-secondary rounded-2xl shadow-xl group-hover:rotate-12 transition-transform">
                                <ShieldCheck className="h-7 w-7 text-brand-primary" />
                            </div>
                            <div>
                                <h4 className="font-bold text-xl text-brand-secondary uppercase tracking-tight mb-1">{skill}</h4>
                                <span className="text-[10px] text-brand-primary font-semibold uppercase tracking-widest">Verified by TrustHire</span>
                            </div>
                        </div>
                        <Calendar className="h-6 w-6 text-brand-border group-hover:text-brand-primary transition-colors" />
                    </motion.div>
                    ))}
                </div>
            </section>

            <motion.button 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-brand-secondary text-brand-primary py-6 rounded-4xl font-bold text-2xl uppercase tracking-widest shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-brand-secondary hover:bg-neutral-900 active:scale-[0.99] transition-all"
            >
                Hire Worker
            </motion.button>
        </div>
      </div>
    </div>
  );
};

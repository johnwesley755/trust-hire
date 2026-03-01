import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { workerService } from '../api/worker.service';
import { ShieldCheck, MapPin, Award, Star, Briefcase, ChevronLeft, Calendar } from 'lucide-react';

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

  if (isLoadingWorker) return <div className="min-h-screen bg-primary-950 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div></div>;

  return (
    <div className="min-h-screen bg-primary-950 text-white p-6 pb-32">
      <button 
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-white/40 hover:text-white transition-colors"
      >
        <ChevronLeft className="h-5 w-5" /> Back to Search
      </button>

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Profile Header */}
        <section className="bg-primary-900/40 border border-white/10 rounded-4xl p-10 flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left">
          <div className="h-32 w-32 rounded-3xl bg-linear-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-4xl font-black shadow-2xl shadow-emerald-500/20">
            {worker?.name[0]}
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold tracking-tight">{worker?.name}</h1>
                <p className="text-white/40 flex items-center justify-center md:justify-start gap-1 mt-1">
                  <MapPin className="h-4 w-4" /> {worker?.location} • Joined Jan 2026
                </p>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 px-6 py-3 rounded-2xl flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-emerald-400" />
                <div>
                  <span className="block text-xs font-bold text-emerald-400 uppercase tracking-widest">Trust Score</span>
                  <span className="text-2xl font-black text-emerald-400">{trustScore?.score}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Avg. Rating', value: `${trustScore?.avgRating} / 5`, icon: <Star className="text-amber-400" /> },
            { label: 'Reliability', value: `${(trustScore?.reliabilityRate || 0) * 100}%`, icon: <ShieldCheck className="text-blue-400" /> },
            { label: 'Experience', value: `${worker?.experience} Years`, icon: <Briefcase className="text-indigo-400" /> },
            { label: 'Level', value: `L${worker?.level}`, icon: <Award className="text-rose-400" /> },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-3xl text-center space-y-2">
                <div className="mx-auto w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                    {stat.icon}
                </div>
                <span className="block text-xl font-bold">{stat.value}</span>
                <span className="block text-xs font-bold text-white/40 uppercase tracking-widest">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Verified Skills */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Award className="text-emerald-400" /> Verified Skill Badges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {worker?.skills.map((skill: string, i: number) => (
              <div key={i} className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-3xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/10 rounded-2xl">
                    <ShieldCheck className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{skill}</h4>
                    <span className="text-xs text-emerald-500/60 font-medium uppercase tracking-wider">Verified Assessment</span>
                  </div>
                </div>
                <Calendar className="h-5 w-5 text-white/10" />
              </div>
            ))}
          </div>
        </section>

        <button className="w-full bg-white text-primary-950 py-5 rounded-3xl font-black text-xl hover:bg-emerald-400 hover:text-white transition-all shadow-2xl shadow-white/5">
          HIRE THIS WORKER
        </button>
      </div>
    </div>
  );
};

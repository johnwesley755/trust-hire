import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { jobService } from '../api/job.service';
import { applicationService } from '../api/application.service';
import { profileService } from '../api/profile.service';
import { useState } from 'react';
import { MapPin, Send, CheckCircle, ShieldCheck, Clock } from 'lucide-react';
import { formatMissingProfileFields, getMissingProfileFields } from '../utils/profileCompletion';

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hasJustApplied, setHasJustApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  const { data: job, isLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: () => jobService.getJobById(id!),
    enabled: !!id
  });

  const { data: profile } = useQuery({
    queryKey: ['workerProfile'],
    queryFn: profileService.getProfile,
  });

  const { data: myApplications = [], refetch: refetchApplications } = useQuery({
    queryKey: ['myApplications'],
    queryFn: applicationService.getMyApplications,
  });

  const mutation = useMutation({
    mutationFn: (data: Parameters<typeof applicationService.applyForJob>[0]) => applicationService.applyForJob(data),
    onSuccess: async () => {
      setHasJustApplied(true);
      await refetchApplications();
    },
    onError: async (error: Error | any) => {
      const message = (error as any)?.response?.data?.message || (error as any)?.message || 'Failed to submit application.';
      if (String(message).toLowerCase().includes('already applied')) {
        setHasJustApplied(true);
        await refetchApplications();
        return;
      }
      alert(message);
    }
  });

  const handleApply = () => {
    const missingFields = getMissingProfileFields(profile);
    if (missingFields.length > 0) {
      alert(`Complete your profile before applying. Missing: ${formatMissingProfileFields(missingFields)}.`);
      navigate('/profile');
      return;
    }
    mutation.mutate({ jobId: id!, coverLetter });
  };

  const alreadyApplied = hasJustApplied || myApplications.some((application) => application.jobId === id);

  if (isLoading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!job) return <div className="min-h-screen bg-slate-50 text-slate-900 p-8">Job not found.</div>;

  return (
    <div className="min-h-screen bg-brand-bg text-brand-secondary pb-32 selection:bg-brand-primary selection:text-brand-secondary">
      <header className="p-6 glass-header sticky top-0 z-50 flex items-center justify-between">
        <div className="flex flex-col">
            <span className="text-[10px] font-bold tracking-widest text-brand-primary uppercase">Opportunity Detail</span>
            <h1 className="text-xl font-bold truncate leading-none mt-1">{job.title}</h1>
        </div>
      </header>

      <main className="p-8 md:p-12 max-w-2xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 bg-brand-secondary text-brand-primary text-[10px] font-bold tracking-widest rounded-lg uppercase border border-brand-secondary shadow-lg shadow-brand-secondary/10">
                    {job.industry}
                </span>
                <div className="flex items-center gap-1 text-[10px] font-bold text-brand-primary py-1.5 px-3 bg-white border border-brand-border rounded-lg tracking-widest shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5" /> TrustVerified
                </div>
              </div>
              <h2 className="text-5xl font-bold leading-[0.85] tracking-tighter">{job.title}</h2>
              <p className="text-brand-muted/80 flex items-center gap-2 font-semibold text-sm tracking-tight">
                <MapPin className="w-4 h-4 text-brand-primary" /> {job.location}
              </p>
            </div>
            <div className="bg-white p-6 rounded-4xl border border-brand-border shadow-xl shadow-brand-secondary/5 self-stretch md:self-auto flex flex-col justify-center items-center md:items-end">
              <div className="text-4xl font-bold text-brand-secondary flex items-center gap-1 tracking-tighter">
                <span className="text-brand-primary text-2xl">₹</span>
                {job.budget?.toLocaleString()}
              </div>
              <p className="text-[10px] text-brand-muted font-bold tracking-widest uppercase mt-1">Project Allocation</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-4xl bg-white border border-brand-border flex items-center gap-4 shadow-sm hover:shadow-xl transition-all group">
              <div className="p-3 bg-brand-bg rounded-2xl text-brand-primary group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-brand-muted font-bold tracking-widest uppercase">Client status</p>
                <p className="text-sm font-bold">Verified Partner</p>
              </div>
            </div>
            <div className="p-6 rounded-4xl bg-white border border-brand-border flex items-center gap-4 shadow-sm hover:shadow-xl transition-all group">
               <div className="p-3 bg-brand-bg rounded-2xl text-brand-primary group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-brand-muted font-bold tracking-widest uppercase">Timeline</p>
                <p className="text-sm font-bold">Active Today</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6 bg-white p-10 rounded-[3rem] border border-brand-border shadow-sm">
          <div className="flex items-center gap-3 border-b border-brand-bg pb-4">
            <div className="w-1.5 h-6 bg-brand-primary rounded-full" />
            <h3 className="text-[10px] font-bold tracking-widest text-brand-muted uppercase">Scope of Work</h3>
          </div>
          <p className="text-brand-secondary/80 leading-relaxed text-xl font-medium tracking-tight">
            {job.description}
          </p>
        </section>

        {!alreadyApplied ? (
          <section className="space-y-8 p-10 rounded-[3rem] bg-brand-secondary text-brand-primary shadow-2xl shadow-brand-secondary/20 border border-brand-secondary relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-[0.03] rounded-bl-full pointer-events-none group-hover:opacity-[0.05] transition-opacity" />
            
            <div className="space-y-2 relative z-10">
              <h3 className="text-3xl font-bold tracking-tighter">Ready to start?</h3>
              <p className="text-brand-primary/60 text-sm font-medium tracking-tight">Express your interest to the employer directly.</p>
            </div>
            
            <div className="relative z-10 space-y-4">
                <textarea 
                placeholder="Briefly state your experience or why you're a fit..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 min-h-[160px] focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all font-medium text-brand-primary placeholder:text-brand-primary/20 text-lg"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                />
                <button 
                onClick={handleApply}
                disabled={mutation.isPending}
                className="w-full py-6 bg-brand-primary text-brand-secondary rounded-2xl font-bold text-lg hover:bg-white transition-all active:scale-[0.98] shadow-2xl shadow-brand-primary/20 disabled:opacity-50 flex items-center justify-center gap-3 cursor-pointer tracking-tight"
                >
                {mutation.isPending ? 'Syncing Application...' : <><Send className="w-6 h-6" /> Submit Application</>}
                </button>
            </div>
          </section>
        ) : (
          <div className="p-12 rounded-[3rem] bg-white border border-brand-border text-center space-y-6 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-700">
             <div className="absolute top-0 inset-x-0 h-2 bg-emerald-500/20" />
            <div className="w-24 h-24 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
              <CheckCircle className="w-12 h-12 text-emerald-500" />
            </div>
            <div className="space-y-2">
                <h3 className="text-4xl font-bold tracking-tighter text-brand-secondary">Application sent!</h3>
                <p className="text-brand-muted font-medium text-lg leading-tight px-4 opacity-70">Your profile is now being reviewed. We'll notify you once the employer responds.</p>
            </div>
            <button 
                onClick={() => navigate('/dashboard')} 
                className="px-12 py-5 bg-brand-secondary text-brand-primary rounded-3xl font-bold text-sm transition-all hover:bg-neutral-800 cursor-pointer shadow-xl shadow-brand-secondary/10 active:scale-95 tracking-widest uppercase"
            >
                Back to Dashboard
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

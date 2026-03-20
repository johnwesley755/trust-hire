import { useQuery } from "@tanstack/react-query";
import { applicationService } from "../../jobs/api/application.service";
import { jobService } from "../../jobs/api/job.service";
import { Clock, XCircle, ChevronRight, Globe, ShieldCheck, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function HistoryPage() {
  const { data: applications, isLoading } = useQuery({
    queryKey: ['myApplications'],
    queryFn: applicationService.getMyApplications,
  });

  const jobIds = Array.from(new Set(applications?.map((app) => app.jobId) || []));
  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ['appliedJobs', jobIds],
    queryFn: () => jobService.getJobsByIds(jobIds),
    enabled: jobIds.length > 0,
  });

  const jobsById = new Map(jobs.filter((job) => job.id).map((job) => [job.id!, job]));

  return (
    <>
        <div className="absolute inset-0 cloud-grid opacity-[0.05] pointer-events-none" />
        
        <header className="p-8 lg:p-12 border-b border-brand-border bg-brand-bg/80 backdrop-blur-3xl sticky top-0 z-40">
            <div className="max-w-4xl mx-auto space-y-2">
                <div className="flex items-center gap-2 text-brand-secondary/40 font-semibold tracking-widest text-[10px]">
                    <Globe className="w-3.5 h-3.5 text-brand-primary" /> Engagement log
                </div>
                <h1 className="text-5xl font-bold tracking-tighter text-brand-secondary leading-[0.9]">Experience repository</h1>
                <p className="text-brand-muted font-medium text-lg opacity-60">Chronicle of your professional integrations and performance.</p>
            </div>
        </header>

        <main className="max-w-4xl mx-auto p-8 lg:p-12 w-full space-y-8 relative z-10 pb-32 md:pb-12">
            {isLoading || jobsLoading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-6">
                    <div className="w-16 h-16 border-4 border-brand-primary border-t-brand-secondary rounded-full animate-spin" />
                    <p className="text-brand-muted font-semibold tracking-widest text-[10px] animate-pulse">Retrieving Records...</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {applications?.map((app, i) => (
                        <motion.div 
                            key={app.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white border border-brand-border p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:border-brand-primary transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-bl-full pointer-events-none group-hover:bg-brand-primary/10 transition-colors" />
                            
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-brand-secondary text-brand-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <FileText className="w-7 h-7" />
                                    </div>
                                    <div className="space-y-1 text-left">
                                        <h4 className="font-bold text-xl text-brand-secondary tracking-tight group-hover:text-brand-primary transition-colors leading-none">
                                          {jobsById.get(app.jobId)?.title || `Job ID: ${app.jobId.substring(0, 8)}`}
                                        </h4>
                                        <p className="text-[10px] font-semibold tracking-widest text-brand-primary/70 uppercase">
                                          {jobsById.get(app.jobId)?.city || jobsById.get(app.jobId)?.address || jobsById.get(app.jobId)?.location || 'Location not available'}
                                        </p>
                                        <div className="flex items-center gap-2 text-brand-muted font-semibold tracking-widest text-[9px]">
                                            <Clock className="w-3 h-3 text-brand-primary" /> Logged on {new Date(app.appliedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <StatusBadge status={app.status || 'PENDING'} />
                            </div>
                            
                            <div className="bg-brand-bg/50 border border-brand-border/50 rounded-2xl p-6 mb-8 text-left">
                                <p className="text-brand-muted font-medium text-sm leading-relaxed truncate">
                                    "{app.coverLetter}"
                                </p>
                            </div>

                            <button className="w-full flex items-center justify-between text-[10px] font-semibold text-brand-secondary/40 tracking-widest pt-6 border-t border-brand-border/50 group-hover:text-brand-secondary transition-colors group/btn">
                                Access full dossier
                                <div className="p-2 bg-brand-bg rounded-lg group-hover/btn:bg-brand-secondary group-hover/btn:text-brand-primary transition-all">
                                    <ChevronRight className="w-4 h-4" />
                                </div>
                            </button>
                        </motion.div>
                    ))}

                    {(!applications || applications.length === 0) && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-32 bg-white border border-dashed border-brand-border rounded-[3rem] space-y-6 shadow-inner"
                        >
                            <div className="w-20 h-20 bg-brand-bg rounded-full flex items-center justify-center mx-auto opacity-30">
                                <Clock className="w-10 h-10 text-brand-secondary" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-brand-secondary font-semibold text-xl tracking-tight">Empty repository</p>
                                <p className="text-brand-muted font-medium">No professional engagements recorded on this profile yet.</p>
                            </div>
                        </motion.div>
                    )}
                </div>
            )}
        </main>
      </>
    );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    PENDING: 'bg-brand-primary/10 text-brand-primary border-brand-primary/20 shadow-[0_0_10px_rgba(250,204,21,0.1)]',
    ACCEPTED: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]',
    REJECTED: 'bg-brand-accent/5 text-brand-accent border-brand-accent/10 shadow-[0_0_10px_rgba(239,68,68,0.1)]',
  } as const;

  const icons = {
    PENDING: <Clock className="w-3.5 h-3.5" />,
    ACCEPTED: <ShieldCheck className="w-3.5 h-3.5" />,
    REJECTED: <XCircle className="w-3.5 h-3.5" />,
  } as const;

  return (
    <span className={`px-4 py-2 rounded-xl text-[9px] font-semibold tracking-widest border flex items-center gap-2 transition-all ${styles[status as keyof typeof styles] || styles.PENDING}`}>
      {icons[status as keyof typeof icons] || icons.PENDING}
      {status}
    </span>
  );
}

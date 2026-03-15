import { useQuery } from '@tanstack/react-query';
import { jobService } from '../api/job.service';
import { Briefcase, ArrowLeft, MapPin, IndianRupee, Loader2, ChevronRight, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function ActiveJobsPage() {
    const navigate = useNavigate();
    const { data: jobs, isLoading } = useQuery({ queryKey: ['employerJobs'], queryFn: jobService.getEmployerJobs });

    return (
        <div className="min-h-screen bg-brand-bg text-brand-secondary selection:bg-brand-primary selection:text-brand-secondary">
            <div className="absolute inset-0 cloud-grid opacity-[0.03] pointer-events-none" />
            
            <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => navigate('/dashboard')} 
                            className="w-14 h-14 bg-white border border-brand-border rounded-2xl flex items-center justify-center hover:bg-brand-primary/10 transition-all shadow-xl active:scale-90 group"
                        >
                            <ArrowLeft className="w-6 h-6 text-brand-secondary group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div>
                            <h2 className="text-5xl font-bold tracking-tight text-neutral-900 leading-tight">Active Jobs</h2>
                            <p className="text-brand-primary text-[10px] font-semibold uppercase tracking-widest mt-2">Manage your current listings</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => navigate('/post-job')}
                        className="bg-brand-secondary text-brand-primary px-10 py-5 rounded-4xl font-semibold uppercase tracking-widest shadow-2xl hover:bg-neutral-800 active:scale-[0.98] transition-all flex items-center gap-3"
                    >
                        <Plus className="w-6 h-6" />
                        Post a Job
                    </button>
                </header>

                <main>
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-4">
                            <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-muted">Loading jobs...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {jobs?.map((job, idx) => (
                                <motion.div 
                                    key={job.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-brand-surface p-8 rounded-4xl border border-brand-border hover:border-brand-primary/50 transition-all shadow-2xl flex flex-col justify-between group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 blur-3xl rounded-full -mr-16 -mt-16" />
                                    
                                    <div className="space-y-6 relative z-10">
                                        <div className="flex justify-between items-start">
                                            <div className="w-16 h-16 rounded-[1.5rem] bg-brand-secondary text-brand-primary flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                                                <Briefcase className="w-7 h-7" />
                                            </div>
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-widest border ${
                                                job.status === 'OPEN' ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/20' : 'bg-brand-muted/10 text-brand-muted border-brand-muted/20'
                                            }`}>
                                                {job.status === 'OPEN' ? 'Active' : 'Closed'}
                                            </span>
                                        </div>
                                        
                                        <div>
                                            <h3 className="text-2xl font-bold text-brand-secondary uppercase tracking-tight leading-tight mb-2 group-hover:text-brand-primary transition-colors">{job.title}</h3>
                                            <p className="text-brand-muted font-medium text-sm line-clamp-2 leading-relaxed">{job.description}</p>
                                        </div>

                                        <div className="flex flex-wrap gap-3">
                                            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-brand-secondary bg-white px-4 py-2 rounded-xl border border-brand-border shadow-sm">
                                                <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                                                <span>{job.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-brand-primary bg-brand-secondary px-4 py-2 rounded-xl border border-brand-secondary shadow-lg shadow-brand-secondary/10">
                                                <IndianRupee className="w-3.5 h-3.5" />
                                                <span>{job.budget?.toLocaleString() || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-brand-border/30 flex gap-3 relative z-10">
                                         <button 
                                            onClick={() => navigate('/applications')}
                                            className="w-full py-4 bg-white text-brand-secondary hover:bg-neutral-900 hover:text-brand-primary rounded-2xl font-semibold text-xs uppercase tracking-widest transition-all border border-brand-border shadow-md flex items-center justify-center gap-2 group/btn"
                                        >
                                            View Applications <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                            
                            {(!jobs || jobs.length === 0) && (
                                <div className="col-span-full text-center py-32 bg-brand-surface rounded-4xl border border-dashed border-brand-border/50">
                                    <div className="w-24 h-24 bg-brand-secondary/5 rounded-full flex items-center justify-center mx-auto mb-8">
                                        <Briefcase className="w-10 h-10 text-brand-muted/30" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-neutral-900 uppercase tracking-tight mb-2">No Active Jobs</h3>
                                    <p className="text-brand-muted font-medium uppercase tracking-widest text-xs">You haven't posted any jobs yet.</p>
                                    <button 
                                        onClick={() => navigate('/post-job')}
                                        className="mt-10 bg-brand-primary text-brand-secondary px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-xl hover:bg-brand-secondary hover:text-brand-primary transition-all"
                                    >
                                        Post Your First Job
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

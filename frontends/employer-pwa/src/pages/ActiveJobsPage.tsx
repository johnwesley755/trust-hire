import { useQuery } from '@tanstack/react-query';
import { jobService } from '../api/job.service';
import { Briefcase, ArrowLeft, MapPin, IndianRupee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ActiveJobsPage() {
    const navigate = useNavigate();
    const { data: jobs, isLoading } = useQuery({ queryKey: ['employerJobs'], queryFn: jobService.getEmployerJobs });

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex">
            <div className="flex-1 p-10 overflow-auto">
                <header className="flex justify-between items-end mb-12">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/dashboard')} className="p-3 bg-white border border-slate-200 rounded-full hover:bg-slate-100 transition-all cursor-pointer shadow-sm">
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </button>
                        <div>
                            <h2 className="text-3xl font-black tracking-tight">My Active Jobs</h2>
                            <p className="text-slate-500 mt-1">Manage and view all your posted jobs.</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => navigate('/post-job')}
                        className="bg-primary-600 text-white px-8 py-3 rounded-full font-bold hover:bg-primary-700 transition-all active:scale-95 cursor-pointer shadow-lg"
                    >
                        Post New Job
                    </button>
                </header>

                <main>
                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {jobs?.map((job) => (
                                <div key={job.id} className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-primary-400 transition-all shadow-sm flex flex-col justify-between group">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="w-12 h-12 rounded-xl bg-slate-50 text-primary-600 flex items-center justify-center border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
                                                <Briefcase className="w-6 h-6" />
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                                job.status === 'OPEN' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-600 border-slate-200'
                                            }`}>
                                                {job.status}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold group-hover:text-primary-600 transition-colors">{job.title}</h3>
                                            <p className="text-sm text-slate-500 line-clamp-2 mt-1">{job.description}</p>
                                        </div>
                                        <div className="flex flex-wrap gap-3 mt-4">
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                                <MapPin className="w-3.5 h-3.5" />
                                                <span>{job.location}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                                                <IndianRupee className="w-3.5 h-3.5" />
                                                <span>{job.budget?.toLocaleString() || 'Flexible'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-6 border-t border-slate-100 flex gap-2">
                                         {/* Potential for manage applications shortcut per job */}
                                         <button 
                                            onClick={() => navigate('/applications')}
                                            className="w-full py-2.5 bg-slate-50 text-primary-600 hover:bg-primary-50 rounded-xl font-bold text-sm transition-colors border border-slate-100 cursor-pointer"
                                        >
                                            View Applications
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {(!jobs || jobs.length === 0) && (
                                <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                                    <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">No Jobs Posted</h3>
                                    <p className="text-slate-500">You haven't posted any jobs yet.</p>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

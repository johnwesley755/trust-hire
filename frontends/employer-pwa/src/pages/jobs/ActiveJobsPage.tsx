import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchMyJobs } from '../../store/slices/jobSlice';
import { fetchApplicationsForEmployerJobs } from '../../store/slices/applicationSlice';
import { 
    PlusCircle, 
    Plus, 
    Layers, 
    IndianRupee, 
    MapPin, 
    ArrowRight, 
    ChevronLeft, 
    ChevronRight,
    Loader2,
    Utensils,
    Shield,
    Sun,
    Package,
    Tag
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export function ActiveJobsPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    
    const { myJobs: jobs, loading: jobsLoading } = useAppSelector((state) => state.jobs);
    const { applications, loading: appsLoading } = useAppSelector((state) => state.applications);

    useEffect(() => {
        dispatch(fetchMyJobs());
    }, [dispatch]);

    const jobIds = useMemo(() => jobs.map((j: any) => j.id).filter((id: any): id is string => !!id), [jobs]);

    useEffect(() => {
        if (jobIds.length > 0) {
            dispatch(fetchApplicationsForEmployerJobs(jobIds));
        }
    }, [dispatch, jobIds]);

    // Calculate metadata for each job
    const jobMetadata = useMemo(() => {
        if (!jobs || !applications) return {};
        
        return jobs.reduce((acc: any, job: any) => {
            const jobApps = applications.filter((app: any) => app.jobId === job.id);
            const newApps = jobApps.filter((app: any) => app.status === 'PENDING').length;
            
            acc[job.id!] = {
                totalCount: jobApps.length,
                newCount: newApps,
                workerIds: jobApps.slice(0, 2).map(app => app.workerId)
            };
            return acc;
        }, {} as Record<string, { totalCount: number; newCount: number; workerIds: string[] }>);
    }, [jobs, applications]);

    const isLoading = jobsLoading || (jobIds.length > 0 && appsLoading);

    const getSectorIcon = (industry: string) => {
        const ind = industry.toLowerCase();
        if (ind.includes('culinary') || ind.includes('hospitality') || ind.includes('cook')) return <Utensils className="w-5 h-5" />;
        if (ind.includes('construct') || ind.includes('infra')) return <Layers className="w-5 h-5" />;
        if (ind.includes('safety') || ind.includes('security')) return <Shield className="w-5 h-5" />;
        if (ind.includes('solar') || ind.includes('renew')) return <Sun className="w-5 h-5" />;
        if (ind.includes('logistic') || ind.includes('ware')) return <Package className="w-5 h-5" />;
        return <Tag className="w-5 h-5" />;
    };

    if (isLoading && jobs.length === 0) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
            <Loader2 className="w-16 h-16 text-[#1F3F34] animate-spin opacity-20" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1F3F34]/30 animate-pulse">Gathering Intel...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F5F4EF] text-[#1F3F34] font-body selection:bg-[#FACD15] selection:text-[#1F3F34]">
            {/* Main Content Canvas */}
            <main className="max-w-[1600px] mx-auto py-12 px-8 lg:px-16 text-left">
                {/* Page Header Section */}
                <section className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-10">
                    <div className="space-y-4">
                        <h1 className="text-5xl font-black bricolage text-[#1F3F34] tracking-tighter uppercase leading-[0.9]">
                            Strategic<br/>
                            <span className="text-[#1F3F34]/30">Deployment Hub</span>
                        </h1>
                        <p className="text-[#1F3F34]/60 font-medium text-lg max-w-xl">
                            Overseeing {jobs.length} active operational clusters across {new Set(jobs.map((j: any) => j.industry)).size} strategic sectors.
                        </p>
                    </div>
                    <button 
                        onClick={() => navigate('/post-job')}
                        className="bg-[#FACD15] text-[#1F3F34] px-10 py-5 rounded-2xl font-black flex items-center gap-4 shadow-2xl shadow-[#FACD15]/30 hover:scale-[1.05] active:scale-95 transition-all bricolage uppercase text-xs tracking-[0.2em]"
                    >
                        <PlusCircle className="w-6 h-6 font-black" />
                        Initialize New Mission
                    </button>
                </section>

                {/* High-Density Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <AnimatePresence>
                        {jobs.map((job: any, idx: number) => {
                            const meta = jobMetadata[job.id!] || { totalCount: 0, newCount: 0, workerIds: [] };
                            const isUrgent = job.description.toLowerCase().includes('urgent') || idx === 1;

                            return (
                                <motion.div 
                                    key={job.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-white p-10 rounded-[2.5rem] group hover:shadow-2xl transition-all duration-700 flex flex-col relative overflow-hidden border border-[#EFEEE9]"
                                >
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#FACD15]/5 -mr-24 -mt-24 rounded-full blur-3xl group-hover:bg-[#FACD15]/10 transition-colors duration-700"></div>
                                    
                                    <div className="flex justify-between items-start mb-10 relative z-10">
                                        <div className={`px-5 py-2 text-[9px] font-black rounded-full tracking-[0.2em] bricolage uppercase border-2 ${
                                            isUrgent ? 'bg-[#ffdad6] text-[#ba1a1a] border-[#ffdad6]' : 'bg-[#c7ebdb] text-[#4a6b5e] border-[#c7ebdb]'
                                        }`}>
                                            {isUrgent ? 'URGENT BREACH' : 'STABLE ASSET'}
                                        </div>
                                        <span className="text-[9px] font-black text-[#1F3F34]/20 uppercase tracking-[0.3em]">
                                            IDX-{job.id?.slice(-4).toUpperCase()}
                                        </span>
                                    </div>

                                    <h3 className="text-3xl font-black text-[#1F3F34] bricolage leading-tight mb-8 group-hover:text-[#FACD15] transition-colors duration-500 uppercase tracking-tight">
                                        {job.title}
                                    </h3>

                                    <div className="space-y-6 mb-12">
                                        <div className="flex items-center gap-4 text-[#1F3F34]/60 text-[11px] font-black uppercase tracking-widest">
                                            <div className="w-10 h-10 rounded-xl bg-[#F5F4EF] flex items-center justify-center text-[#1F3F34] border border-[#EFEEE9] shadow-inner">
                                                {getSectorIcon(job.industry)}
                                            </div>
                                            <span>{job.industry}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-[#1F3F34]/60 text-[11px] font-black uppercase tracking-widest">
                                            <div className="w-10 h-10 rounded-xl bg-[#F5F4EF] flex items-center justify-center text-[#1F3F34] border border-[#EFEEE9] shadow-inner">
                                                <IndianRupee className="w-5 h-5 text-[#FACD15]" />
                                            </div>
                                            <span className="text-[#1F3F34]">₹{job.budget?.toLocaleString()} <span className="opacity-40">/ MO</span></span>
                                        </div>
                                        <div className="flex items-center gap-4 text-[#1F3F34]/60 text-[11px] font-black uppercase tracking-widest">
                                            <div className="w-10 h-10 rounded-xl bg-[#F5F4EF] flex items-center justify-center text-[#1F3F34] border border-[#EFEEE9] shadow-inner">
                                                <MapPin className="w-5 h-5 text-[#FACD15]" />
                                            </div>
                                            <span className="truncate">{job.location}</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto flex items-center justify-between border-t border-[#F5F4EF] pt-8 gap-6">
                                        <div className="flex -space-x-4">
                                            {meta.workerIds.length > 0 ? (
                                                meta.workerIds.map((wid: string) => (
                                                    <div key={wid} className="w-12 h-12 rounded-xl border-4 border-white bg-[#F5F4EF] flex items-center justify-center text-[10px] font-black overflow-hidden shadow-lg grayscale hover:grayscale-0 transition-all">
                                                        <img 
                                                            src={`https://i.pravatar.cc/100?u=${wid}`} 
                                                            alt="worker" 
                                                            className="w-full h-full object-cover" 
                                                        />
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="w-12 h-12 rounded-xl border-4 border-white bg-[#F5F4EF] flex items-center justify-center text-[10px] font-black text-[#1F3F34]/10 shadow-inner">
                                                    0
                                                </div>
                                            )}
                                            {meta.totalCount > 2 && (
                                                <div className="w-12 h-12 rounded-xl border-4 border-white bg-[#1F3F34] flex items-center justify-center text-[10px] font-black text-[#FACD15] shadow-lg">
                                                    +{meta.totalCount - 2}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-[8px] uppercase font-black tracking-[0.4em] text-[#1F3F34]/20 mb-1">INTEL FLOW</span>
                                            <span className="text-sm font-black text-[#1F3F34] bricolage uppercase">
                                                {meta.newCount > 0 ? `${meta.newCount} UNREAD` : `${meta.totalCount} SECURED`}
                                            </span>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => navigate('/applications')}
                                        className="mt-10 w-full bg-[#1F3F34] text-white py-5 rounded-2xl font-black flex items-center justify-center gap-4 hover:bg-[#FACD15] hover:text-[#1F3F34] transition-all duration-300 group/btn bricolage uppercase text-[10px] tracking-[0.3em] shadow-2xl shadow-[#1F3F34]/20"
                                    >
                                        ANALYZE OPERATIVES
                                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                                    </button>
                                </motion.div>
                            );
                        })}

                        {/* Create New Opening / Empty State Card */}
                        <motion.button 
                            onClick={() => navigate('/post-job')}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.02 }}
                            className="border-4 border-dashed border-[#1F3F34]/10 hover:border-[#FACD15]/50 hover:bg-white transition-all duration-500 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center group bg-[#F5F4EF]/50 min-h-[500px]"
                        >
                            <div className="h-24 w-24 bg-white rounded-3xl border-2 border-[#EFEEE9] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-[#FACD15] group-hover:border-[#FACD15] transition-all duration-700 shadow-xl shadow-[#1F3F34]/5">
                                <Plus className="w-12 h-12 text-[#1F3F34]/20 group-hover:text-[#1F3F34] group-hover:rotate-90 transition-all duration-700" />
                            </div>
                            <h3 className="text-2xl font-black bricolage text-[#1F3F34] mb-3 uppercase tracking-tight">Expand Outreach</h3>
                            <p className="text-[10px] text-[#1F3F34]/40 px-12 font-black uppercase tracking-[0.2em] leading-relaxed">
                                Initiate a new tactical briefing to recruit regional expertise.
                            </p>
                        </motion.button>
                    </AnimatePresence>
                </div>

                {/* Pagination/Footer Stats */}
                <footer className="mt-24 flex flex-col lg:flex-row justify-between items-center bg-[#1F3F34] text-[#F5F4EF] p-12 lg:p-20 rounded-[4rem] gap-12 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(31,63,52,0.4)]">
                    <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#FACD15] opacity-[0.03] rounded-full blur-[100px]"></div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-16 relative z-10 w-full lg:w-auto">
                        <div className="text-center sm:text-left">
                            <span className="block text-[9px] uppercase tracking-[0.4em] text-[#FACD15] font-black bricolage mb-3">TOTAL VISIBILITY</span>
                            <span className="text-5xl font-black bricolage tracking-tighter text-white">
                                {((jobs.length) * 112).toLocaleString()} <span className="text-[10px] opacity-30 font-black uppercase tracking-[0.4em] ml-2">HITS</span>
                            </span>
                        </div>
                        <div className="hidden sm:block h-20 w-px bg-white/10"></div>
                        <div className="text-center sm:text-left">
                            <span className="block text-[9px] uppercase tracking-[0.4em] text-[#FACD15] font-black bricolage mb-3">ENGAGEMENT INDEX</span>
                            <span className="text-5xl font-black bricolage tracking-tighter text-white">
                                {applications.length} <span className="text-[10px] opacity-30 font-black uppercase tracking-[0.4em] ml-2">ASSETS</span>
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-10 relative z-10 bg-white/5 p-3 rounded-full border border-white/10 backdrop-blur-md shadow-2xl">
                        <button className="w-14 h-14 rounded-full border border-white/10 hover:bg-[#FACD15] hover:text-[#1F3F34] transition-all flex items-center justify-center group active:scale-90">
                            <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div className="px-6 text-[10px] font-black uppercase tracking-[0.4em] bricolage text-white/40">
                            PAGE <span className="text-[#FACD15]">01</span> <span className="opacity-20 mx-2">/</span> 03
                        </div>
                        <button className="w-14 h-14 rounded-full border border-white/10 hover:bg-[#FACD15] hover:text-[#1F3F34] transition-all flex items-center justify-center group active:scale-90">
                            <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </footer>
            </main>
        </div>
    );
}

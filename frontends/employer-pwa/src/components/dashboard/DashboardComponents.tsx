import React from 'react';
import { Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchMyJobs } from '../../store/slices/jobSlice';
import { fetchApplicationsForEmployerJobs } from '../../store/slices/applicationSlice';
import { fetchProfilesByUserIds } from '../../store/slices/searchSlice';
import { useNavigate } from 'react-router-dom';

export const StatsGrid = () => {
    const { stats } = useAppSelector((state) => state.dashboard);
    
    const statsData = [
        { 
            label: 'Active Jobs', 
            value: stats?.activeJobs || 0, 
            trend: '+2 vs last week', 
            trendColor: 'text-emerald-700 bg-emerald-50',
            icon: 'work',
            trendIcon: 'trending_up'
        },
        { 
            label: 'Applicants', 
            value: stats?.totalApplicants || 0, 
            trend: 'Live updates', 
            trendColor: 'text-[#1F3F34]/40 bg-[#F5F4EF]',
            icon: 'group',
            trendIcon: 'check_circle'
        },
        { 
            label: 'Interviewing', 
            value: stats?.interviewingCount || 0, 
            trend: `${stats?.interviewingCount || 0} tactical calls`, 
            trendColor: 'text-amber-600 bg-amber-50',
            icon: 'video_call',
            trendIcon: 'schedule'
        },
        { 
            label: 'Total Hired', 
            value: stats?.totalHired || 0, 
            trend: 'Direct deployments', 
            trendColor: 'text-[#1F3F34] bg-[#FACD15]/20',
            icon: 'verified',
            trendIcon: 'star'
        },
    ];

    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {statsData.map((stat) => (
                <div key={stat.label} className="bg-white p-6 rounded-[2.5rem] shadow-2xl shadow-[#1F3F34]/5 border border-[#EFEEE9] flex flex-col justify-between hover:shadow-xl transition-all group cursor-pointer text-left">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1F3F34]/30 mb-2">{stat.label}</p>
                            <h3 className="text-4xl font-black text-[#1F3F34] bricolage">{stat.value}</h3>
                        </div>
                        <div className="w-12 h-12 bg-[#F5F4EF] text-[#1F3F34]/40 rounded-2xl flex items-center justify-center group-hover:bg-[#FACD15] group-hover:text-[#1F3F34] transition-all group-hover:rotate-6">
                            <span className="material-symbols-outlined text-2xl font-black">{stat.icon}</span>
                        </div>
                    </div>
                    <div className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 px-3 py-1.5 rounded-full w-fit ${stat.trendColor}`}>
                        <span className="material-symbols-outlined text-[14px] font-black">{stat.trendIcon}</span>
                        <span>{stat.trend}</span>
                    </div>
                </div>
            ))}
        </section>
    );
};

export const ApplicationsTable = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { myJobs } = useAppSelector((state) => state.jobs);
    const { applications, loading, error } = useAppSelector((state) => state.applications);
    const { workers: profiles } = useAppSelector((state) => state.search);
    
    React.useEffect(() => {
        if (myJobs.length === 0) {
            dispatch(fetchMyJobs());
        }
    }, [dispatch, myJobs.length]);

    React.useEffect(() => {
        if (myJobs.length > 0) {
            const jobIds = myJobs.map(j => j.id);
            dispatch(fetchApplicationsForEmployerJobs(jobIds));
        }
    }, [dispatch, myJobs]);

    React.useEffect(() => {
        if (applications.length > 0) {
            const workerIds = applications.map((app: any) => app.workerId);
            dispatch(fetchProfilesByUserIds(workerIds));
        }
    }, [dispatch, applications]);

    const workersById = new Map(profiles.map((p: any) => [p.userId, p]));
    const jobsById = new Map(myJobs.map((j) => [j.id, j]));

    if (loading && applications.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-[#EFEEE9] shadow-sm">
                <Loader2 className="w-12 h-12 text-[#1F3F34] animate-spin mx-auto opacity-20" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-[#EFEEE9] shadow-sm">
                <h4 className="text-xl font-black text-[#1F3F34] uppercase bricolage mb-2">Error Loading Data</h4>
                <p className="text-[#1F3F34]/40 font-medium text-sm">{error}</p>
            </div>
        );
    }

    if (applications.length === 0) {
        return (
            <div className="text-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-[#F5F4EF] text-left px-12 flex flex-col items-center">
                <div className="w-20 h-20 bg-[#F5F4EF] rounded-full flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-4xl text-[#1F3F34]/20">group</span>
                </div>
                <h4 className="text-2xl font-black text-[#1F3F34] uppercase bricolage mb-2">No Applications Found</h4>
                <p className="text-[#1F3F34]/40 font-medium">New tactical worker applications will appear here once your jobs are live.</p>
                <button onClick={() => navigate('/post-job')} className="mt-8 bg-[#FACD15] text-[#1F3F34] px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-[#FACD15]/20 hover:scale-105 transition-all">
                    Post a Job Now
                </button>
            </div>
        );
    }

    return (
        <section className="space-y-6 text-left">
            <div className="flex justify-between items-center px-4">
                <h3 className="text-[10px] font-black text-[#1F3F34] uppercase tracking-[0.3em] opacity-40">Recent Tactical Applications</h3>
                <button onClick={() => navigate('/applications')} className="text-[10px] font-black text-[#1F3F34] uppercase tracking-widest hover:bg-[#FACD15] px-4 py-2 rounded-xl transition-all border border-[#EFEEE9] flex items-center gap-2">
                    View Pipeline <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
            </div>
            <div className="bg-white rounded-[3rem] shadow-2xl shadow-[#1F3F34]/5 border border-[#EFEEE9] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[#F5F4EF] border-b border-[#EFEEE9]">
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/40">Operative</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/40">Role Position</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/40">Verified Tier</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/40">TrustScore</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/40 text-right">Interaction</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EFEEE9]">
                            {applications.slice(0, 5).map((app: any) => {
                                const worker = workersById.get(app.workerId);
                                const trustScore = (worker as any)?.trustScore || 85;
                                const tier = (worker as any)?.tier || 'Silver';
                                const tierColor = tier === 'Gold' ? 'bg-[#1F3F34] text-[#FACD15]' : 'bg-[#F5F4EF] text-[#1F3F34] border border-[#1F3F34]/10';
                                const scoreColor = trustScore > 90 ? 'border-emerald-500 text-emerald-600' : 'border-amber-500 text-amber-600';

                                return (
                                    <tr key={app.id} className="hover:bg-[#F5F4EF]/50 transition-all cursor-pointer group" onClick={() => navigate(`/worker/${app.workerId}`)}>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-14 h-14 shrink-0">
                                                    <img 
                                                        src={worker?.profileImageUrl || "https://i.pravatar.cc/100?u=" + app.workerId}
                                                        alt="Candidate" 
                                                        className="w-full h-full rounded-2xl border-2 border-white shadow-lg object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all" 
                                                    />
                                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-[3px] border-white rounded-full shadow-sm"></div>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-[#1F3F34] leading-tight uppercase bricolage">{worker?.fullName || 'Anonymous Operative'}</p>
                                                    <p className="text-[10px] text-[#1F3F34]/30 font-black uppercase tracking-widest mt-1">Deployed {new Date(app.appliedAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <p className="text-[10px] font-black text-[#1F3F34] uppercase tracking-widest">{jobsById.get(app.jobId)?.title || 'Operational Role'}</p>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] shadow-sm ${tierColor}`}>
                                                {tier} TIER
                                            </span>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center ${scoreColor.split(' ')[0]} bg-white shadow-inner`}>
                                                    <span className="text-[11px] font-black text-[#1F3F34]">{trustScore}</span>
                                                </div>
                                                <span className={`text-[9px] font-black uppercase tracking-widest ${scoreColor.split(' ')[1]}`}>{trustScore > 90 ? 'ELITE' : 'STABLE'}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <button className="bg-[#1F3F34] text-white font-black text-[10px] uppercase tracking-widest px-6 py-2.5 rounded-xl shadow-lg shadow-[#1F3F34]/10 hover:bg-[#FACD15] hover:text-[#1F3F34] transition-all">
                                                Inspect
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

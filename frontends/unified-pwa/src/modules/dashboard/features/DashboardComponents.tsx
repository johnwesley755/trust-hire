import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { jobService } from '../../../services/job.service';
import { applicationService } from '../../../services/application.service';
import { workerService } from '../../../services/worker.service';
import { dashboardService } from '../../../services/dashboard.service';
import { useNavigate } from 'react-router-dom';
import { UserAvatar } from '../../../components/common/UserAvatar';

export const StatsGrid = () => {
    const { data: stats } = useQuery({ 
        queryKey: ['employerStats'], 
        queryFn: dashboardService.getEmployerStats 
    });
    
    const statsData = [
        { 
            label: 'Active Jobs', 
            value: stats?.activeJobs || 0, 
            trend: '+2 vs last week', 
            trendColor: 'text-green-700 bg-green-50',
            icon: 'work',
            trendIcon: 'trending_up'
        },
        { 
            label: 'Applicants', 
            value: stats?.totalApplicants || 0, 
            trend: 'Live updates', 
            trendColor: 'text-[#1F3F34]/60',
            icon: 'group',
            trendIcon: 'check_circle'
        },
        { 
            label: 'Interviewing', 
            value: stats?.interviewingCount || 0, 
            trend: `${stats?.interviewingCount || 0} calls scheduled`, 
            trendColor: 'text-amber-600 bg-amber-50',
            icon: 'video_call',
            trendIcon: 'schedule'
        },
        { 
            label: 'Total Hired', 
            value: stats?.totalHired || 0, 
            trend: 'Direct placements', 
            trendColor: 'text-[#1F3F34] bg-[#FACD15]/20',
            icon: 'verified',
            trendIcon: 'star'
        },
        { 
            label: 'Notifications', 
            value: stats?.unreadNotifications || 0, 
            trend: 'Recent alerts', 
            trendColor: 'text-blue-600 bg-blue-50',
            icon: 'notifications',
            trendIcon: 'notifications_active'
        },
    ];

    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {statsData.map((stat) => (
                <div key={stat.label} className="bg-white p-5 rounded-2xl shadow-sm border border-[#EFEEE9] flex flex-col justify-between hover:shadow-md transition-shadow group">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#1F3F34]/40 mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-black text-[#1F3F34]">{stat.value}</h3>
                        </div>
                        <div className="p-2 bg-[#FACD15]/10 text-[#1F3F34] rounded-xl group-hover:bg-[#FACD15] transition-colors">
                            <span className="material-symbols-outlined">{stat.icon}</span>
                        </div>
                    </div>
                    <div className={`mt-4 text-[10px] font-bold flex items-center gap-1 w-fit px-2 py-1 rounded-full ${stat.trendColor}`}>
                        <span className="material-symbols-outlined text-[14px]">{stat.trendIcon}</span>
                        <span>{stat.trend}</span>
                    </div>
                </div>
            ))}
        </section>
    );
};

export const ApplicationsTable = () => {
    const navigate = useNavigate();
    const { data: jobs = [] } = useQuery({ queryKey: ['employerJobs'], queryFn: jobService.getEmployerJobs });
    const jobIds = jobs.map((j: any) => j.id).filter((id: any): id is string => !!id);
    
    const { data: applications, isLoading, isError, error } = useQuery({
        queryKey: ['recentApplications', jobIds.join(',')],
        queryFn: () => applicationService.getApplicationsForEmployerJobs(jobIds),
        enabled: jobIds.length > 0
    });

    const workerIds = applications?.map((application) => application.workerId) || [];
    const { data: workers = [] } = useQuery({
        queryKey: ['applicationWorkers', workerIds.join(',')],
        queryFn: () => workerService.getProfilesByUserIds(workerIds),
        enabled: workerIds.length > 0
    });

    const workersById = new Map(workers.map((worker) => [worker.userId, worker]));
    const jobsById = new Map(jobs.filter((job: any) => job.id).map((job: any) => [job.id!, job]));

    if (isLoading) return <div className="text-center py-20"><Loader2 className="w-12 h-12 text-[#1F3F34] animate-spin mx-auto" /></div>;

    if (isError) return (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#EFEEE9] shadow-sm">
            <h4 className="text-xl font-semibold text-[#1F3F34] tracking-tight mb-2">Couldn't load applications</h4>
            <p className="text-[#1F3F34]/60 font-medium text-sm max-w-xl mx-auto">
                {String((error as any)?.response?.data?.message || (error as any)?.message || 'Request failed')}
            </p>
        </div>
    );

    if (!applications?.length) return (
        <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-[#EFEEE9]">
            <span className="material-symbols-outlined text-4xl text-[#1F3F34]/20 mb-4 block">group</span>
            <h4 className="text-xl font-semibold text-[#1F3F34] tracking-tight mb-2">No Applications Found</h4>
            <p className="text-[#1F3F34]/40 font-medium">New worker applications will appear here.</p>
        </div>
    );

    return (
        <section className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-[#1F3F34] uppercase tracking-widest">Recent Applications</h3>
                <button onClick={() => navigate('/applications')} className="text-xs font-bold text-[#1F3F34]/60 hover:text-[#1F3F34] transition-colors flex items-center gap-1">
                    View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-[#EFEEE9] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[#EFEEE9]/30 border-b border-[#EFEEE9]">
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#1F3F34]/40">Candidate</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#1F3F34]/40">Position</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#1F3F34]/40">Tier</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#1F3F34]/40">TrustScore</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#1F3F34]/40 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EFEEE9]">
                            {applications.slice(0, 5).map((app) => {
                                const worker = workersById.get(app.workerId);
                                const trustScore = (worker as any)?.trustScore || 85;
                                const tier = (worker as any)?.tier || 'Silver';
                                const tierColor = tier === 'Gold' ? 'bg-[#1F3F34] text-white' : tier === 'Silver' ? 'bg-[#EFEEE9] text-[#1F3F34] border border-[#1F3F34]/10' : 'bg-[#EFEEE9] text-[#1F3F34]/40';
                                const scoreColor = trustScore > 90 ? 'border-green-500 text-green-600' : 'border-amber-500 text-amber-600';

                                return (
                                    <tr key={app.id} className="hover:bg-[#EFEEE9]/20 transition-colors cursor-pointer" onClick={() => navigate('/applications')}>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <UserAvatar 
                                                    src={worker?.profileImageUrl} 
                                                    name={worker?.fullName || 'Anonymous'} 
                                                    size="md"
                                                    showStatus={true}
                                                    statusOnline={true}
                                                />
                                                <div>
                                                    <p className="text-sm font-bold text-[#1F3F34] leading-tight">{worker?.fullName || 'Anonymous'}</p>
                                                    <p className="text-[10px] text-[#1F3F34]/40 font-medium">Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-xs font-semibold text-[#1F3F34]/70">{jobsById.get(app.jobId)?.title || 'Position'}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tighter ${tierColor}`}>
                                                {tier}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-1.5">
                                                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${scoreColor.split(' ')[0]}`}>
                                                    <span className="text-[10px] font-black text-[#1F3F34]">{trustScore}</span>
                                                </div>
                                                <span className={`text-[9px] font-bold uppercase ${scoreColor.split(' ')[1]}`}>{trustScore > 90 ? 'Elite' : 'High'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button className="text-[#1F3F34] font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 ml-auto hover:bg-[#EFEEE9] px-3 py-1.5 rounded-full transition-colors">
                                                View Profile <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
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

import { useUser } from "../../../providers/AuthContext";
import { StatsGrid, ApplicationsTable } from "../features/DashboardComponents";
import { DashboardHeader } from "../components/DashboardHeader";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { applicationService } from '../../../services/application.service';
import { workerService } from "../../../services/worker.service";
import { Loader2 } from "lucide-react";
import apiClient from "../../../api/apiClient";
import { dashboardService } from "../../../services/dashboard.service";

export default function DashboardPage() {
    const navigate = useNavigate();
    const { user } = useUser();

    const { data: stats } = useQuery({ 
        queryKey: ['employerStats'], 
        queryFn: dashboardService.getEmployerStats 
    });

    const blobMaskStyle = {
        maskImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23FF0066' d='M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90,-16.3,88.5,-0.9C87,14.6,81.4,29.1,73.1,41.9C64.8,54.7,53.8,65.7,40.8,72.8C27.8,79.9,13.9,83.1,-0.5,83.9C-14.8,84.7,-29.7,83.1,-43.3,76.5C-56.9,70,-69.2,58.4,-77.3,44.7C-85.4,31.1,-89.3,15.5,-88.1,0.7C-86.9,-14.1,-80.6,-28.2,-71.7,-40.5C-62.8,-52.8,-51.2,-63.3,-38.2,-71.1C-25.2,-78.9,-12.6,-84,1.4,-86.4C15.4,-88.8,30.7,-83.6,44.7,-76.4Z' transform='translate(100 100)' /%3E%3C/svg%3E")`,
        maskSize: 'cover',
        WebkitMaskImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23FF0066' d='M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90,-16.3,88.5,-0.9C87,14.6,81.4,29.1,73.1,41.9C64.8,54.7,53.8,65.7,40.8,72.8C27.8,79.9,13.9,83.1,-0.5,83.9C-14.8,84.7,-29.7,83.1,-43.3,76.5C-56.9,70,-69.2,58.4,-77.3,44.7C-85.4,31.1,-89.3,15.5,-88.1,0.7C-86.9,-14.1,-80.6,-28.2,-71.7,-40.5C-62.8,-52.8,-51.2,-63.3,-38.2,-71.1C-25.2,-78.9,-12.6,-84,1.4,-86.4C15.4,-88.8,30.7,-83.6,44.7,-76.4Z' transform='translate(100 100)' /%3E%3C/svg%3E")`,
        WebkitMaskSize: 'cover',
    };

    // Fetch applications for mobile view logic
    const { data: applications = [], isLoading: appsLoading } = useQuery({
        queryKey: ['recent-applications-mobile'],
        queryFn: () => applicationService.getApplicationsForEmployerJobs([]) // This is a placeholder, in real app we'd pass jobIds
    });

    const { data: activities = [], isLoading: activitiesLoading } = useQuery({
        queryKey: ['recent-activities'],
        queryFn: async () => {
            const res = await apiClient.get('/api/activities/recent?limit=5');
            return res.data.data;
        }
    });

    const workerIds = [...new Set(applications.map(app => app.workerId))];
    const { data: workers = [], isLoading: workersLoading } = useQuery({
        queryKey: ['workers-mobile', workerIds],
        queryFn: () => workerService.getProfilesByUserIds(workerIds),
        enabled: workerIds.length > 0
    });

    const workersById = new Map(workers.map(w => [w.userId, w]));

    if (appsLoading || workersLoading || activitiesLoading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-[#F5F4EF]">
                <Loader2 className="w-8 h-8 animate-spin text-[#1F3F34]" />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col min-h-screen bg-[#F5F4EF] selection:bg-[#FACD15] selection:text-[#1F3F34]">
            {/* Desktop Header */}
            <div className="hidden md:block">
                <DashboardHeader />
            </div>
            
            <main className="flex-1 p-4 lg:p-8 pt-20 md:pt-8">
                <div className="max-w-[1600px] mx-auto">
                    
                    {/* MOBILE VIEW (ONLY) */}
                    <div className="md:hidden space-y-6 max-w-lg mx-auto pb-24">
                        {/* Welcome Section */}
                        <section className="px-2">
                            <h2 className="text-2xl font-bold text-brand-secondary leading-tight">Namaste, {user?.firstName || 'Partner'}</h2>
                            <p className="text-sm font-medium text-secondary opacity-80">Here's your hiring snapshot for today.</p>
                        </section>

                        {/* Mobile Stats Grid (2x2) */}
                        <section className="grid grid-cols-2 gap-3">
                            {[
                                { label: 'Active Jobs', val: stats?.activeJobs || 0, icon: 'work', color: 'text-[#456559] bg-[#456559]/10' },
                                { label: 'Applicants', val: stats?.totalApplicants || 0, icon: 'group', color: 'text-[#231b00] bg-[#FACD15]', border: 'border-2 border-[#FACD15]' },
                                { label: 'Interviewing', val: stats?.interviewingCount || 0, icon: 'video_chat', color: 'text-[#456559] bg-[#456559]/10' },
                                { label: 'Hired', val: stats?.totalHired || 0, icon: 'verified_user', color: 'text-[#456559] bg-[#456559]/10' }
                            ].map((stat, i) => (
                                <div key={i} className={`bg-white p-5 rounded-3xl shadow-sm border border-black/3 ${stat.border || ''}`}>
                                    <span className={`material-symbols-outlined ${stat.color} p-2 rounded-2xl text-lg mb-3 block w-fit`}>{stat.icon}</span>
                                    <div className="text-2xl font-bold text-brand-secondary">{stat.val}</div>
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-secondary/60">{stat.label}</div>
                                </div>
                            ))}
                        </section>

                        {/* Mobile Hiring Insights (Dark Green) */}
                        <section className="bg-[#1F3F34] rounded-[2.5rem] p-6 text-white overflow-hidden relative shadow-lg shadow-[#1F3F34]/10">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FACD15] opacity-10 rounded-full blur-3xl"></div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-bold text-lg">Hiring Insights</h3>
                                    <span className="material-symbols-outlined text-[#FACD15]">trending_up</span>
                                </div>
                                <p className="text-sm text-[#e3e3de] font-medium mb-5 leading-relaxed">Your "Warehouse Associate" role is trending 20% higher in Pune this week.</p>
                                <div className="flex gap-2">
                                    <div className="bg-white/10 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">Pune Metro</div>
                                    <div className="bg-white/10 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">Logistics</div>
                                </div>
                            </div>
                        </section>

                        {/* Mobile Recent Applications */}
                        <section className="space-y-4">
                            <div className="flex justify-between items-center px-2">
                                <h3 className="font-bold text-xl text-brand-secondary">Recent Applications</h3>
                                <button onClick={() => navigate('/applications')} className="text-xs font-bold text-secondary uppercase tracking-widest hover:underline">View All</button>
                            </div>
                            
                            {applications.slice(0, 3).map((app, i) => {
                                const worker = workersById.get(app.workerId);
                                const isGold = i % 2 === 0; // Placeholder for tier logic
                                return (
                                    <div key={app.id || i} className="bg-white rounded-full p-3 flex items-center gap-4 border border-black/3 shadow-sm">
                                        <div className="w-14 h-14 relative shrink-0">
                                            <div 
                                                className={`absolute inset-0 ${isGold ? 'bg-[#FACD15]/20' : 'bg-[#abcebf]/20'} transform ${i % 2 === 0 ? 'rotate-45' : '-rotate-12'}`}
                                                style={blobMaskStyle}
                                            ></div>
                                            <img
                                                alt={worker?.fullName || 'Worker'}
                                                className="w-full h-full object-cover rounded-full relative z-10"
                                                src={worker?.profileImageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuB_zqEHvRAcU3DqBK5n4GCpb5RxEGerBOsc6sd8kk3tLuXBuWuJ2iXcWbVn64JUwGnmEGaadHJe-BUh9TVyLihsFxxLBymk0PaGjwmQgO60gWSokyK67fYt25kBH-P89iX_ve3CIoStPDBgYImvtzCca1BBM-NMyVsiB2eiT-S6P1gY41XY8oZDJdeHqkMUINCCzdqkFwMge72p1YpGXTifK7PpmvJBK803AF3SD_Wn0cEpHxwk-AoMso7cR633s1OExukShsqb6Js"}
                                            />
                                        </div>
                                    <div className="grow">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-brand-secondary">{worker?.fullName || 'Arjun Sharma'}</h4>
                                            <span className={`${isGold ? 'bg-[#FACD15] text-on-secondary-fixed' : 'bg-surface-container-high text-secondary'} text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter`}>
                                                {isGold ? 'Gold Tier' : 'Silver Tier'}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-secondary/70 font-medium">Forklift Operator • 4y Exp</p>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <span className="material-symbols-outlined text-[12px] text-[#FACD15]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                            <span className="text-[11px] font-bold text-brand-secondary">TrustScore: 98/100</span>
                                        </div>
                                    </div>
                                    <button className="bg-surface-container-high w-10 h-10 flex items-center justify-center rounded-full active:scale-90 transition-transform mr-1">
                                        <span className="material-symbols-outlined text-brand-secondary">chevron_right</span>
                                    </button>
                                    </div>
                                );
                            })}
                        </section>

                        {/* Mobile Recent Activity */}
                        <section className="space-y-4">
                            <h3 className="font-bold text-xl text-brand-secondary px-2">Recent Activity</h3>
                            <div className="bg-surface-container rounded-4xl p-4 space-y-3">
                                {activities.length > 0 ? (
                                    activities.map((activity, i) => (
                                        <div key={i} className={`flex items-center gap-4 bg-white p-4 rounded-3xl border-l-4 ${i % 2 === 0 ? 'border-[#FACD15]' : 'border-[#456559]'} shadow-sm`}>
                                            <div className="text-center min-w-[50px]">
                                                <div className="text-[11px] font-bold text-secondary uppercase leading-tight">
                                                    {new Date(activity.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div className="h-8 w-px bg-[#e3e3de]/50"></div>
                                            <div>
                                                <div className="font-bold text-sm text-brand-secondary">{activity.description}</div>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <span className="material-symbols-outlined text-[14px] text-secondary">
                                                        {activity.type === 'JOB_POSTED' ? 'add_circle' : 
                                                         activity.type === 'APPLICATION_RECEIVED' ? 'description' : 
                                                         activity.type === 'HIRED' ? 'verified_user' : 'history'}
                                                    </span>
                                                    <span className="text-[10px] font-medium text-secondary/70">{activity.type.replace('_', ' ')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-white p-8 rounded-3xl text-center border border-black/3 shadow-sm">
                                        <p className="text-xs font-bold text-secondary/40 uppercase tracking-widest">No recent activity</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Mobile Enterprise Banner */}
                        <section className="bg-surface-container-high rounded-[2.5rem] p-8 border-2 border-dashed border-[#FACD15]/30 text-center relative overflow-hidden">
                            <span className="material-symbols-outlined text-[#FACD15] text-5xl mb-3 block" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                            <h4 className="font-bold text-brand-secondary text-lg">Enterprise Tier 1</h4>
                            <p className="text-xs text-secondary/70 font-medium mt-1">Dedicated Account Manager: <span className="font-bold text-brand-secondary">Rahul V.</span></p>
                            <button className="mt-6 w-full bg-[#1F3F34] text-on-secondary-fixed py-4 rounded-full font-bold text-xs uppercase tracking-widest active:scale-[0.98] transition-all hover:bg-[#2d5849]">Get Priority Support</button>
                        </section>
                    </div>

                    {/* Floating Action Button (Mobile) */}
                    <button 
                        onClick={() => navigate('/post-job')}
                        className="md:hidden fixed bottom-8 right-6 w-16 h-16 bg-[#FACD15] text-[#002117] rounded-full shadow-2xl shadow-[#FACD15]/40 flex items-center justify-center z-50 active:scale-90 transition-transform group"
                    >
                        <span className="material-symbols-outlined text-3xl transition-transform group-active:rotate-90">add</span>
                    </button>

                    {/* DESKTOP VIEW (ONLY) */}
                    <div className="hidden md:grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Side: Main Content (9 Columns) */}
                        <div className="lg:col-span-9 space-y-8">
                            {/* Welcome Section */}
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2 text-[#1F3F34]/40 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">
                                        <span className="w-1.5 h-1.5 bg-[#FACD15] rounded-full animate-pulse"></span>
                                        System Active
                                    </div>
                                    <h1 className="text-4xl font-black text-[#1F3F34] leading-tight">
                                        Welcome back,<br/>
                                        <span className="text-[#1F3F34]/40">{user?.firstName || 'Partner'}</span> 👋
                                    </h1>
                                </div>
                                <div className="flex gap-2">
                                    <button className="bg-white px-5 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#1F3F34] border border-[#EFEEE9] hover:bg-[#EFEEE9] transition-colors flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm">download</span>
                                        Generate Report
                                    </button>
                                    <button className="bg-[#1F3F34] px-5 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-white hover:bg-[#2a5546] transition-colors flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm">share</span>
                                        Export Data
                                    </button>
                                </div>
                            </div>

                            <StatsGrid />

                            {/* Hiring Insights Section */}
                            <section className="bg-[#1F3F34] rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FACD15]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-[#FACD15]/10 transition-colors"></div>
                                
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 relative z-10">
                                    <div className="space-y-4 max-w-sm">
                                        <div className="bg-[#FACD15] text-[#1F3F34] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest w-fit">
                                            Premium Insights
                                        </div>
                                        <h3 className="text-3xl font-black leading-tight">Your hiring efficiency is up by 24.8%</h3>
                                        <p className="text-white/60 text-sm font-medium">Based on 128 successful placements in the last quarter across all positions.</p>
                                        <button className="flex items-center gap-2 text-[#FACD15] font-bold text-[10px] uppercase tracking-widest hover:gap-4 transition-all">
                                            EXPLORE ANALYTICS <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                        </button>
                                    </div>

                                    <div className="flex-1 w-full max-w-md h-32 md:h-48">
                                        <svg className="w-full h-full" viewBox="0 0 400 150">
                                            <path className="fill-none stroke-[#FACD15] stroke-3" d="M0,120 Q50,110 80,80 T160,60 T240,90 T320,40 T400,20"></path>
                                            <path className="fill-[#FACD15]/10 stroke-none" d="M0,120 Q50,110 80,80 T160,60 T240,90 T320,40 T400,20 V150 H0 Z"></path>
                                        </svg>
                                    </div>
                                </div>
                            </section>

                            <ApplicationsTable />
                        </div>

                        {/* Right Side: Utils Sidebar (3 Columns) */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Quick Actions */}
                            <div className="bg-white rounded-3xl p-6 border border-[#EFEEE9] shadow-sm">
                                <h4 className="text-[10px] font-bold text-[#1F3F34]/40 uppercase tracking-widest mb-6 px-1">Quick Management</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: 'Shortlist', icon: 'star', color: 'text-amber-500 bg-amber-50', path: '/find-workers' },
                                        { label: 'Schedule', icon: 'event', color: 'text-blue-500 bg-blue-50', path: '/applications' },
                                        { label: 'Reports', icon: 'analytics', color: 'text-emerald-500 bg-emerald-50', path: '/dashboard' },
                                        { label: 'Contracts', icon: 'description', color: 'text-purple-500 bg-purple-50', path: '/jobs' }
                                    ].map(action => (
                                        <button 
                                            key={action.label} 
                                            onClick={() => navigate(action.path)}
                                            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#EFEEE9]/30 hover:bg-[#EFEEE9] transition-all group border border-transparent"
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${action.color} group-hover:scale-110 transition-transform`}>
                                                <span className="material-symbols-outlined text-xl">{action.icon}</span>
                                            </div>
                                            <span className="text-[9px] font-black uppercase text-[#1F3F34]">{action.label}</span>
                                        </button>
                                    ))}
                                </div>
                                <button 
                                    onClick={() => navigate('/find-workers')}
                                    className="w-full mt-4 flex items-center justify-between p-4 rounded-2xl bg-[#1F3F34] text-white hover:bg-[#2a5546] transition-colors"
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest">Find Direct Talent</span>
                                    <span className="material-symbols-outlined text-lg text-[#FACD15]">person_search</span>
                                </button>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white rounded-3xl p-6 border border-[#EFEEE9] shadow-sm">
                                <div className="flex justify-between items-center mb-6 px-1">
                                    <h4 className="text-[10px] font-bold text-[#1F3F34]/40 uppercase tracking-widest">Recent Activity</h4>
                                    <span className="w-2 h-2 bg-[#FACD15] rounded-full animate-pulse"></span>
                                </div>
                                <div className="space-y-4">
                                    {activities.length > 0 ? (
                                        activities.map((activity, i) => (
                                            <div key={i} className="flex items-start gap-4 p-3 rounded-2xl border border-dashed border-[#EFEEE9] group hover:border-[#FACD15] transition-colors cursor-pointer">
                                                <div className="w-10 h-10 rounded-xl bg-[#EFEEE9]/50 flex items-center justify-center group-hover:bg-[#FACD15]/10 transition-colors shrink-0">
                                                    <span className="material-symbols-outlined text-[#1F3F34]/40 group-hover:text-[#1F3F34]">
                                                        {activity.type === 'JOB_POSTED' ? 'add_circle' : 
                                                         activity.type === 'APPLICATION_RECEIVED' ? 'description' : 
                                                         activity.type === 'HIRED' ? 'verified_user' : 'history'}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[10px] font-bold text-[#1F3F34]/40 uppercase tracking-widest">
                                                        {new Date(activity.createdAt).toLocaleDateString()}
                                                    </p>
                                                    <p className="text-xs font-black text-[#1F3F34] leading-tight mb-1">{activity.description}</p>
                                                    <p className="text-[9px] font-bold text-[#1F3F34]/30 uppercase tracking-tighter">{activity.type.replace('_', ' ')}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-[10px] font-bold text-[#1F3F34]/20 uppercase tracking-widest">No recent activity</p>
                                        </div>
                                    )}
                                    <button className="w-full py-3 text-[10px] font-bold text-[#1F3F34]/40 uppercase tracking-widest hover:text-[#1F3F34] transition-colors">
                                        View All Logs
                                    </button>
                                </div>
                            </div>

                            {/* Tier Benefit Card */}
                            <div className="bg-linear-to-br from-[#1F3F34] to-[#2a5546] rounded-3xl p-6 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4">
                                    <span className="material-symbols-outlined text-[#FACD15] text-4xl opacity-20">verified</span>
                                </div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-[#FACD15] mb-2">GOLD PARTNER STATUS</p>
                                <h5 className="text-xl font-black mb-4 leading-tight">92% Priority Access to Elite Workers</h5>
                                <p className="text-[10px] font-medium text-white/60 mb-6 leading-relaxed">Your tier allows you to see background verified workers 48 hours before Standard partners.</p>
                                <button className="bg-[#FACD15] text-[#1F3F34] px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-[#FACD15]/20 hover:scale-105 transition-transform active:scale-95">
                                    View Tier Benefits
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

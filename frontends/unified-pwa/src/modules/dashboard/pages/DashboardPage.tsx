import { useUser } from "../../../providers/AuthContext";
import { StatsGrid, ApplicationsTable } from "../features/DashboardComponents";
import { DashboardHeader } from "../components/DashboardHeader";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { applicationService } from '../../../services/application.service';
import { workerService } from "../../../services/worker.service";
import { Loader2, Plus, Zap, Users, ShieldCheck, MapPin, Search, ArrowRight, FileText } from "lucide-react";
import apiClient from "../../../api/apiClient";
import { dashboardService } from "../../../services/dashboard.service";
import { UserAvatar } from "../../../components/common/UserAvatar";

export default function DashboardPage() {
    const navigate = useNavigate();
    const { user } = useUser();

    const { data: stats, isLoading: statsLoading } = useQuery({ 
        queryKey: ['employerStats'], 
        queryFn: dashboardService.getEmployerStats 
    });

    const { data: applications = [], isLoading: appsLoading } = useQuery({
        queryKey: ['recent-applications-mobile'],
        queryFn: () => applicationService.getApplicationsForEmployerJobs([])
    });

    const { data: activities = [], isLoading: activitiesLoading } = useQuery({
        queryKey: ['recent-activities'],
        queryFn: async () => {
            const res = await apiClient.get('/api/activities/recent?limit=5');
            return res.data;
        }
    });

    const workerIds = [...new Set(applications.map((app: any) => app.workerId))].filter((id): id is string => typeof id === 'string');
    const { data: workers = [], isLoading: workersLoading } = useQuery({
        queryKey: ['workers-mobile', workerIds.join(',')],
        queryFn: () => workerService.getProfilesByUserIds(workerIds),
        enabled: workerIds.length > 0
    });

    const workersById = new Map(workers.map((w: any) => [w.userId, w]));

    const isInitialLoading = (appsLoading || workersLoading || activitiesLoading || statsLoading) && !stats && applications.length === 0;

    if (isInitialLoading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-slate-50 min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-[#0066FF]" />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col min-h-screen bg-slate-50/50 selection:bg-blue-100 selection:text-[#0066FF] font-sans">
            {/* Desktop Header */}
            <div className="hidden md:block">
                <DashboardHeader />
            </div>
            
            <main className="flex-1 p-4 lg:p-8 pt-16 md:pt-6">
                <div className="max-w-[1600px] mx-auto">
                    
                    {/* MOBILE VIEW */}
                    <div className="md:hidden space-y-5 max-w-lg mx-auto pb-24">
                        <section className="px-1">
                            <h2 className="text-xl font-extrabold text-[#0A1931] leading-tight">Namaste, {user?.firstName || 'Partner'}</h2>
                            <p className="text-xs font-medium text-slate-500">Here is your workforce dispatch snapshot for today.</p>
                        </section>

                        <section className="grid grid-cols-2 gap-3">
                            {[
                                { label: 'Active Jobs', val: stats?.activeJobs || 0, color: 'text-[#0066FF] bg-blue-50' },
                                { label: 'Applicants', val: stats?.totalApplicants || 0, color: 'text-indigo-600 bg-indigo-50' },
                                { label: 'Under Review', val: stats?.interviewingCount || 0, color: 'text-amber-600 bg-amber-50' },
                                { label: 'Dispatched', val: stats?.totalHired || 0, color: 'text-emerald-600 bg-emerald-50' },
                                { label: 'Live Alerts', val: stats?.unreadNotifications || 0, color: 'text-sky-600 bg-sky-50', fullWidth: true }
                            ].map((stat, i) => (
                                <div key={i} className={`bg-white p-4 rounded-2xl shadow-xs border border-slate-200/80 ${stat.fullWidth ? 'col-span-2' : ''}`}>
                                    <div className="text-2xl font-black text-slate-900">{stat.val}</div>
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">{stat.label}</div>
                                </div>
                            ))}
                        </section>

                        <section className="bg-gradient-to-br from-[#0A1931] to-[#0066FF] rounded-3xl p-6 text-white relative shadow-lg shadow-blue-950/15">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-extrabold text-base">Instant Talent Radar Active</h3>
                                <span className="text-[9px] font-black uppercase tracking-wider bg-amber-400 text-slate-900 px-2 py-0.5 rounded-sm">LIVE</span>
                            </div>
                            <p className="text-xs text-blue-100/80 mb-4">
                                48 verified electricians and plumbing technicians are currently within a 5 km radius of your sites.
                            </p>
                            <button 
                                onClick={() => navigate('/find-workers')}
                                className="w-full py-2.5 bg-white text-[#0066FF] font-bold text-xs rounded-xl shadow-xs active:scale-98"
                            >
                                Dispatch Offers Now
                            </button>
                        </section>

                        {/* Mobile Floating Action Button */}
                        <button 
                            onClick={() => navigate('/post-job')} 
                            className="fixed bottom-6 right-6 w-14 h-14 bg-[#0066FF] text-white rounded-full flex items-center justify-center shadow-xl shadow-blue-600/30 z-50 active:scale-95 transition-all"
                        >
                            <Plus className="w-7 h-7" />
                        </button>
                    </div>

                    {/* DESKTOP VIEW */}
                    <div className="hidden md:grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Left Side: Main Content (9 Columns) */}
                        <div className="lg:col-span-9 space-y-6">
                            {/* Welcome Section */}
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                                <div>
                                    <div className="flex items-center gap-2 text-blue-600 font-bold uppercase tracking-wider text-[10px] mb-1">
                                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                                        Workforce Dispatch Ready
                                    </div>
                                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1931] tracking-tight">
                                        Enterprise Dashboard • <span className="text-slate-400 font-semibold">{user?.firstName || 'Partner'}</span>
                                    </h1>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => navigate('/find-workers')}
                                        className="bg-slate-100 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                                    >
                                        <Search className="w-3.5 h-3.5 text-[#0066FF]" />
                                        Find Nearby Talent
                                    </button>
                                    <button 
                                        onClick={() => navigate('/post-job')}
                                        className="bg-[#0066FF] px-4 py-2.5 rounded-xl text-xs font-bold text-white hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        Post New Shift
                                    </button>
                                </div>
                            </div>

                            <StatsGrid />

                            {/* Hiring Insights Section */}
                            <section className="bg-gradient-to-r from-[#0A1931] to-[#0066FF] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-md shadow-blue-950/15">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                                    <div className="space-y-3 max-w-lg">
                                        <div className="bg-amber-400 text-slate-900 px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider w-fit">
                                            Escrow & Instant Dispatch Active
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-extrabold leading-tight">
                                            Instant Hire & Verified Workforce Guarantee
                                        </h3>
                                        <p className="text-blue-100/80 text-xs font-medium leading-relaxed">
                                            Every candidate possesses background-checked KYC, Aadhaar validation, and trade skill certifications. Payouts are protected in escrow until shift signoff.
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => navigate('/find-workers')}
                                            className="bg-white hover:bg-slate-100 text-[#0066FF] px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                                        >
                                            <Zap className="w-3.5 h-3.5 fill-current text-amber-500" />
                                            Instant Dispatch
                                        </button>
                                    </div>
                                </div>
                            </section>

                            <ApplicationsTable />
                        </div>

                        {/* Right Side: Utils Sidebar (3 Columns) */}
                        <div className="lg:col-span-3 space-y-5">
                            {/* Quick Management */}
                            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">Operations Hub</h4>
                                <div className="grid grid-cols-2 gap-2.5">
                                    {[
                                        { label: 'Talent Search', icon: <Users className="w-4 h-4 text-[#0066FF]" />, bg: 'bg-blue-50', path: '/find-workers' },
                                        { label: 'Applications', icon: <FileText className="w-4 h-4 text-indigo-600" />, bg: 'bg-indigo-50', path: '/applications' },
                                        { label: 'Post Shift', icon: <Plus className="w-4 h-4 text-emerald-600" />, bg: 'bg-emerald-50', path: '/post-job' },
                                        { label: 'Radar Map', icon: <MapPin className="w-4 h-4 text-amber-600" />, bg: 'bg-amber-50', path: '/find-workers' }
                                    ].map(action => (
                                        <button 
                                            key={action.label} 
                                            onClick={() => navigate(action.path)}
                                            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50/50 hover:border-blue-200 transition-all border border-slate-100 cursor-pointer"
                                        >
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 ${action.bg}`}>
                                                {action.icon}
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-700">{action.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live System Logs</h4>
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                </div>
                                <div className="space-y-2.5">
                                    {activities.length > 0 ? (
                                        activities.map((activity: any, i: number) => (
                                            <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                                        {new Date(activity.createdAt).toLocaleDateString()}
                                                    </p>
                                                    <p className="text-xs font-bold text-slate-800 leading-tight truncate">{activity.description}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-6 text-xs text-slate-400">
                                            No recent dispatch events
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

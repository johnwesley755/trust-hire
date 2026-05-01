import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchEmployerStats, fetchRecentActivities } from '../../store/slices/dashboardSlice';
import { fetchProfile } from '../../store/slices/profileSlice';
import { StatsGrid, ApplicationsTable } from "../../components/dashboard/DashboardComponents";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const { stats, activities, loading: statsLoading } = useAppSelector((state) => state.dashboard);
    const { loading: profileLoading } = useAppSelector((state) => state.profile);

    useEffect(() => {
        dispatch(fetchEmployerStats());
        dispatch(fetchRecentActivities());
        dispatch(fetchProfile());
    }, [dispatch]);

    if (statsLoading || profileLoading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-[#F5F4EF] min-h-screen">
                <Loader2 className="w-12 h-12 animate-spin text-[#1F3F34] opacity-20" />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col min-h-screen bg-[#F5F4EF] selection:bg-[#FACD15] selection:text-[#1F3F34]">
            <DashboardHeader />
            
            <main className="flex-1 p-4 lg:p-10 pt-8">
                <div className="max-w-[1600px] mx-auto">
                    
                    {/* MOBILE VIEW (ONLY) */}
                    <div className="md:hidden space-y-8 max-w-lg mx-auto pb-24 text-left">
                        {/* Welcome Section */}
                        <section className="px-4">
                            <h2 className="text-3xl font-black text-[#1F3F34] leading-tight uppercase bricolage">Namaste, {user?.firstName || 'Partner'}</h2>
                            <p className="text-sm font-medium text-[#1F3F34]/60 uppercase tracking-widest mt-1">Hiring snapshot for today.</p>
                        </section>

                        {/* Mobile Stats Grid (2x2) */}
                        <section className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'Active Jobs', val: stats?.activeJobs || 0, icon: 'work', color: 'text-[#1F3F34] bg-[#1F3F34]/5' },
                                { label: 'Applicants', val: stats?.totalApplicants || 0, icon: 'group', color: 'text-[#1F3F34] bg-[#FACD15]', border: 'border-2 border-[#FACD15] shadow-lg shadow-[#FACD15]/20' },
                                { label: 'Tactical calls', val: stats?.interviewingCount || 0, icon: 'video_chat', color: 'text-[#1F3F34] bg-[#1F3F34]/5' },
                                { label: 'Deployed', val: stats?.totalHired || 0, icon: 'verified_user', color: 'text-[#1F3F34] bg-[#1F3F34]/5' }
                            ].map((stat, i) => (
                                <div key={i} className={`bg-white p-6 rounded-[2rem] shadow-sm border border-[#EFEEE9] ${stat.border || ''}`}>
                                    <span className={`material-symbols-outlined ${stat.color} p-2.5 rounded-xl text-lg mb-4 block w-fit font-black`}>{stat.icon}</span>
                                    <div className="text-3xl font-black text-[#1F3F34] bricolage">{stat.val}</div>
                                    <div className="text-[9px] font-black uppercase tracking-widest text-[#1F3F34]/40 mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </section>

                        {/* Mobile Hiring Insights */}
                        <section className="bg-[#1F3F34] rounded-[3rem] p-8 text-white overflow-hidden relative shadow-2xl shadow-[#1F3F34]/20">
                            <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#FACD15] opacity-10 rounded-full blur-3xl"></div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="font-black text-xl uppercase bricolage">Hiring Insights</h3>
                                    <span className="material-symbols-outlined text-[#FACD15] font-black">trending_up</span>
                                </div>
                                <p className="text-md text-white/80 font-medium mb-6 leading-relaxed">Your "Warehouse Associate" role is trending 24% higher in Pune Metro this week.</p>
                                <div className="flex gap-3">
                                    <div className="bg-white/10 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md border border-white/5">Pune Metro</div>
                                    <div className="bg-white/10 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md border border-white/5">Logistics</div>
                                </div>
                            </div>
                        </section>

                        {/* Mobile Recent Activity */}
                        <section className="space-y-6">
                            <h3 className="font-black text-xl text-[#1F3F34] px-4 uppercase bricolage">Recent Operational Activity</h3>
                            <div className="space-y-4">
                                {activities.length > 0 ? (
                                    activities.map((activity, i) => (
                                        <div key={i} className={`flex items-center gap-4 bg-white p-5 rounded-[2rem] border-l-[6px] shadow-sm ${i % 2 === 0 ? 'border-[#FACD15]' : 'border-[#1F3F34]'}`}>
                                            <div className="text-center min-w-[60px]">
                                                <div className="text-[10px] font-black text-[#1F3F34]/40 uppercase tracking-widest leading-tight">
                                                    {new Date(activity.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                </div>
                                            </div>
                                            <div className="h-10 w-px bg-[#EFEEE9]"></div>
                                            <div>
                                                <div className="font-black text-sm text-[#1F3F34] leading-tight mb-1">{activity.description}</div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-[14px] text-[#1F3F34]/30 font-black">
                                                        {activity.type === 'JOB_POSTED' ? 'add_circle' : 
                                                         activity.type === 'APPLICATION_RECEIVED' ? 'description' : 
                                                         activity.type === 'HIRED' ? 'verified_user' : 'history'}
                                                    </span>
                                                    <span className="text-[9px] font-black text-[#1F3F34]/30 uppercase tracking-widest">{activity.type.replace('_', ' ')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-white p-12 rounded-[3rem] text-center border border-[#EFEEE9] shadow-sm">
                                        <p className="text-[10px] font-black text-[#1F3F34]/20 uppercase tracking-[0.2em]">Operational logs clear</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Mobile Enterprise Banner */}
                        <section className="bg-white rounded-[3rem] p-10 border-4 border-dashed border-[#FACD15]/20 text-center relative overflow-hidden">
                            <div className="w-16 h-16 bg-[#FACD15]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="material-symbols-outlined text-[#FACD15] text-3xl font-black" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                            </div>
                            <h4 className="font-black text-[#1F3F34] text-xl uppercase bricolage">Enterprise Gold Tier</h4>
                            <p className="text-xs text-[#1F3F34]/40 font-black uppercase tracking-widest mt-2">Dedicated Account Manager: <span className="text-[#1F3F34]">Rahul V.</span></p>
                            <button className="mt-8 w-full bg-[#1F3F34] text-white py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#1F3F34]/10 active:scale-[0.98] transition-all">Get Priority Support</button>
                        </section>
                    </div>

                    {/* Floating Action Button (Mobile) */}
                    <button 
                        onClick={() => navigate('/post-job')}
                        className="md:hidden fixed bottom-8 right-6 w-16 h-16 bg-[#FACD15] text-[#1F3F34] rounded-2xl shadow-2xl shadow-[#FACD15]/40 flex items-center justify-center z-50 active:scale-90 transition-all group border-4 border-white"
                    >
                        <span className="material-symbols-outlined text-3xl font-black transition-transform group-active:rotate-90">add</span>
                    </button>

                    {/* DESKTOP VIEW (ONLY) */}
                    <div className="hidden md:grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Left Side: Main Content (9 Columns) */}
                        <div className="lg:col-span-9 space-y-10">
                            {/* Welcome Section */}
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left">
                                <div>
                                    <div className="flex items-center gap-3 text-[#1F3F34]/30 font-black uppercase tracking-[0.3em] text-[10px] mb-4">
                                        <span className="w-2 h-2 bg-[#FACD15] rounded-full animate-pulse shadow-[0_0_8px_#FACD15]"></span>
                                        Tactical Systems Active
                                    </div>
                                    <h1 className="text-5xl font-black text-[#1F3F34] leading-[0.9] uppercase bricolage tracking-tight">
                                        Welcome back,<br/>
                                        <span className="text-[#1F3F34]/30">{user?.firstName || 'Partner'}</span>
                                    </h1>
                                </div>
                                <div className="flex gap-3">
                                    <button className="bg-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#1F3F34] border border-[#EFEEE9] shadow-sm hover:bg-[#F5F4EF] transition-all flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm font-black">download</span>
                                        Platform Report
                                    </button>
                                    <button className="bg-[#1F3F34] px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-[#1F3F34]/10 hover:bg-[#2a5546] transition-all flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm font-black">share</span>
                                        Export Analytics
                                    </button>
                                </div>
                            </div>

                            <StatsGrid />

                            {/* Hiring Insights Section */}
                            <section className="bg-[#1F3F34] rounded-[3.5rem] p-12 text-white relative overflow-hidden group shadow-2xl shadow-[#1F3F34]/20 text-left">
                                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FACD15]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] group-hover:bg-[#FACD15]/10 transition-all duration-1000"></div>
                                
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 relative z-10">
                                    <div className="space-y-6 max-w-md">
                                        <div className="bg-[#FACD15] text-[#1F3F34] px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] w-fit shadow-lg shadow-[#FACD15]/20">
                                            Tactical Insights
                                        </div>
                                        <h3 className="text-4xl font-black leading-tight uppercase bricolage">Operational efficiency is up <span className="text-[#FACD15]">28.4%</span></h3>
                                        <p className="text-white/60 text-lg font-medium leading-relaxed">Based on verified deployment of 128 Tier-3 operatives across your active project sites.</p>
                                        <button className="flex items-center gap-3 text-[#FACD15] font-black text-[10px] uppercase tracking-[0.2em] hover:gap-6 transition-all group">
                                            EXPLORE OPERATIONAL ANALYTICS <span className="material-symbols-outlined text-lg font-black group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                        </button>
                                    </div>

                                    <div className="flex-1 w-full h-48 opacity-40 group-hover:opacity-80 transition-opacity duration-1000">
                                        <svg className="w-full h-full" viewBox="0 0 400 150">
                                            <defs>
                                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#FACD15" stopOpacity="0.4" />
                                                    <stop offset="100%" stopColor="#FACD15" stopOpacity="0" />
                                                </linearGradient>
                                            </defs>
                                            <path className="fill-none stroke-[#FACD15] stroke-[4]" d="M0,120 Q50,110 80,80 T160,60 T240,90 T320,40 T400,20"></path>
                                            <path className="fill-[url(#chartGradient)] stroke-none" d="M0,120 Q50,110 80,80 T160,60 T240,90 T320,40 T400,20 V150 H0 Z"></path>
                                            {[80, 160, 240, 320].map((x, i) => (
                                                <circle key={i} cx={x} cy={x === 160 ? 60 : x === 240 ? 90 : x === 320 ? 40 : 80} r="4" fill="#FACD15" />
                                            ))}
                                        </svg>
                                    </div>
                                </div>
                            </section>

                            <ApplicationsTable />
                        </div>

                        {/* Right Side: Utils Sidebar (3 Columns) */}
                        <div className="lg:col-span-3 space-y-8 text-left">
                            {/* Quick Actions */}
                            <div className="bg-white rounded-[3rem] p-8 border border-[#EFEEE9] shadow-sm">
                                <h4 className="text-[10px] font-black text-[#1F3F34]/30 uppercase tracking-[0.3em] mb-8 px-2">Mission Control</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: 'Shortlist', icon: 'star', color: 'text-amber-500 bg-amber-50', path: '/find-workers' },
                                        { label: 'Schedule', icon: 'event', color: 'text-blue-500 bg-blue-50', path: '/applications' },
                                        { label: 'Reports', icon: 'analytics', color: 'text-emerald-500 bg-emerald-50', path: '/dashboard' },
                                        { label: 'Logistics', icon: 'local_shipping', color: 'text-purple-500 bg-purple-50', path: '/jobs' }
                                    ].map(action => (
                                        <button 
                                            key={action.label} 
                                            onClick={() => navigate(action.path)}
                                            className="flex flex-col items-center justify-center p-6 rounded-[2rem] bg-[#F5F4EF] hover:bg-[#FACD15] transition-all group border border-transparent shadow-sm hover:shadow-xl hover:shadow-[#FACD15]/20"
                                        >
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${action.color} group-hover:bg-white group-hover:scale-110 transition-all shadow-inner`}>
                                                <span className="material-symbols-outlined text-2xl font-black">{action.icon}</span>
                                            </div>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-[#1F3F34]">{action.label}</span>
                                        </button>
                                    ))}
                                </div>
                                <button 
                                    onClick={() => navigate('/find-workers')}
                                    className="w-full mt-6 flex items-center justify-between p-5 rounded-[2rem] bg-[#1F3F34] text-white hover:bg-[#2d5849] transition-all shadow-xl shadow-[#1F3F34]/10 group"
                                >
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] ml-2">Find Operatives</span>
                                    <span className="material-symbols-outlined text-xl text-[#FACD15] font-black group-hover:rotate-12 transition-transform">person_search</span>
                                </button>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white rounded-[3rem] p-8 border border-[#EFEEE9] shadow-sm">
                                <div className="flex justify-between items-center mb-8 px-2">
                                    <h4 className="text-[10px] font-black text-[#1F3F34]/30 uppercase tracking-[0.3em]">Operational Logs</h4>
                                    <span className="w-2.5 h-2.5 bg-[#FACD15] rounded-full animate-pulse shadow-[0_0_8px_#FACD15]"></span>
                                </div>
                                <div className="space-y-6">
                                    {activities.length > 0 ? (
                                        activities.map((activity, i) => (
                                            <div key={i} className="flex items-start gap-4 p-4 rounded-[2rem] border border-dashed border-[#EFEEE9] group hover:border-[#FACD15] hover:bg-[#F5F4EF]/50 transition-all cursor-pointer relative overflow-hidden">
                                                <div className="w-10 h-10 rounded-xl bg-[#F5F4EF] flex items-center justify-center group-hover:bg-[#FACD15] transition-all shrink-0 shadow-inner">
                                                    <span className="material-symbols-outlined text-[#1F3F34]/30 group-hover:text-[#1F3F34] text-lg font-black">
                                                        {activity.type === 'JOB_POSTED' ? 'add_circle' : 
                                                         activity.type === 'APPLICATION_RECEIVED' ? 'description' : 
                                                         activity.type === 'HIRED' ? 'verified_user' : 'history'}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[9px] font-black text-[#1F3F34]/30 uppercase tracking-widest mb-1">
                                                        {new Date(activity.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                    </p>
                                                    <p className="text-xs font-black text-[#1F3F34] leading-snug group-hover:text-[#1F3F34] transition-colors line-clamp-2 uppercase bricolage">{activity.description}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12">
                                            <p className="text-[10px] font-black text-[#1F3F34]/20 uppercase tracking-[0.2em]">No recent logs</p>
                                        </div>
                                    )}
                                    <button className="w-full py-4 text-[9px] font-black text-[#1F3F34]/30 uppercase tracking-[0.2em] hover:text-[#1F3F34] transition-all hover:bg-[#F5F4EF] rounded-2xl">
                                        View Mission Logs
                                    </button>
                                </div>
                            </div>

                            {/* Tier Benefit Card */}
                            <div className="bg-[#1F3F34] rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-[#1F3F34]/30 group">
                                <div className="absolute -top-4 -right-4 p-6 group-hover:scale-110 transition-transform duration-700">
                                    <span className="material-symbols-outlined text-[#FACD15] text-6xl opacity-10 font-black">verified</span>
                                </div>
                                <div className="relative z-10">
                                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#FACD15] mb-4">GOLD STATUS ACTIVE</p>
                                    <h5 className="text-2xl font-black mb-6 leading-tight uppercase bricolage">Priority Access to <span className="text-[#FACD15]">Elite</span> Operatives</h5>
                                    <p className="text-sm font-medium text-white/50 mb-8 leading-relaxed">Your Gold tier allows you to inspect background-verified operatives 48 hours before Standard partners.</p>
                                    <button className="w-full bg-[#FACD15] text-[#1F3F34] py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#FACD15]/20 hover:scale-[1.05] active:scale-95 transition-all">
                                        Inspect Tier Benefits
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

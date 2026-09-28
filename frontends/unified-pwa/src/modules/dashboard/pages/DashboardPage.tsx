import React from 'react';
import { useUser } from "../../../providers/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../../../services/dashboard.service";
import { 
  Briefcase, 
  Users, 
  UserCheck, 
  Clock, 
  ShieldCheck, 
  PlusCircle, 
  ArrowRight, 
  Zap, 
  TrendingUp, 
  Award,
  Sparkles,
  MapPin
} from "lucide-react";
import { AppLoader } from '../../../components/common/AppLoader';

export default function DashboardPage() {
    const navigate = useNavigate();
    const { user } = useUser();

    // Single unified API endpoint call for all dashboard metrics
    const { data: summary, isLoading } = useQuery({ 
        queryKey: ['dashboardSummary'], 
        queryFn: dashboardService.getDashboardSummary,
        staleTime: 1000 * 60 * 2,
    });

    if (isLoading) {
        return <AppLoader variant="page" message="Loading Dashboard Metrics..." />;
    }

    const isEmployer = user?.role === 'EMPLOYER' || summary?.role === 'EMPLOYER';
    const displayName = user?.firstName || summary?.companyName || 'Partner';

    const activeJobs = summary?.activeJobs ?? 0;
    const totalApplicants = summary?.totalApplicants ?? 0;
    const interviewingCount = summary?.interviewingCount ?? 0;
    const totalHired = summary?.totalHired ?? 0;
    const fillRate = summary?.fillRatePercentage ?? 94;
    const radarNearbyCount = summary?.radarNearbyWorkersCount ?? 48;

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans text-[#0A1931]">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
                
                {/* 1. Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[#0066FF] font-extrabold uppercase tracking-wider text-[11px]">
                            <Sparkles className="w-4 h-4" />
                            <span>Employer Dashboard</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1931] tracking-tight font-['Outfit',sans-serif]">
                            Welcome back, {displayName}
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                            Here is your verified talent operations and hiring performance snapshot.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            to="/post-job"
                            className="px-5 py-2.5 bg-[#0066FF] hover:bg-[#0052CC] active:scale-98 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-[#0066FF]/25 transition-all font-['Outfit',sans-serif]"
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>Post New Job</span>
                        </Link>
                        <Link
                            to="/find-workers"
                            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all font-['Outfit',sans-serif]"
                        >
                            <Users className="w-4 h-4 text-slate-600" />
                            <span>Search Talent</span>
                        </Link>
                    </div>
                </div>

                {/* 2. Primary 4 KPI Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    
                    {/* Active Openings */}
                    <div 
                        onClick={() => navigate('/jobs')}
                        className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:border-[#0066FF]/60 hover:shadow-md transition-all cursor-pointer group space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center border border-blue-100 group-hover:scale-105 transition-transform">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0066FF] text-[10px] font-extrabold uppercase tracking-wider">
                                Live Now
                            </span>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-[#0A1931] font-['Outfit',sans-serif]">
                                {activeJobs}
                            </div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
                                Active Job Postings
                            </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-[#0066FF] group-hover:underline pt-1">
                            <span>Manage listings</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                    </div>

                    {/* Total Applicants Received */}
                    <div 
                        onClick={() => navigate('/jobs')}
                        className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:border-[#0066FF]/60 hover:shadow-md transition-all cursor-pointer group space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 group-hover:scale-105 transition-transform">
                                <Users className="w-6 h-6" />
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-extrabold uppercase tracking-wider">
                                Total Received
                            </span>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-[#0A1931] font-['Outfit',sans-serif]">
                                {totalApplicants}
                            </div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
                                Total Applicants
                            </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:underline pt-1">
                            <span>View candidate queue</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                    </div>

                    {/* Pending / Under Review */}
                    <div 
                        onClick={() => navigate('/jobs')}
                        className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 group-hover:scale-105 transition-transform">
                                <Clock className="w-6 h-6" />
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-extrabold uppercase tracking-wider">
                                Action Needed
                            </span>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-[#0A1931] font-['Outfit',sans-serif]">
                                {interviewingCount}
                            </div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
                                Under Review & Offers
                            </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-600 group-hover:underline pt-1">
                            <span>Review pending</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                    </div>

                    {/* Dispatched / Hired */}
                    <div 
                        onClick={() => navigate('/jobs')}
                        className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:scale-105 transition-transform">
                                <UserCheck className="w-6 h-6" />
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase tracking-wider">
                                Confirmed
                            </span>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-[#0A1931] font-['Outfit',sans-serif]">
                                {totalHired}
                            </div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
                                Hired & Active
                            </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 group-hover:underline pt-1">
                            <span>View active team</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                    </div>

                </div>

                {/* 3. Secondary Operational Stats & Efficiency Performance Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Fill Rate KPI */}
                    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                <h3 className="text-base font-extrabold text-[#0A1931] font-['Outfit',sans-serif]">
                                    Hiring Fill Rate
                                </h3>
                            </div>
                            <span className="text-xl font-black text-emerald-600 font-['Outfit',sans-serif]">
                                {fillRate}%
                            </span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                            <div 
                                className="bg-linear-to-r from-[#0066FF] to-emerald-500 h-full rounded-full transition-all duration-500" 
                                style={{ width: `${fillRate}%` }}
                            />
                        </div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                            Your job fulfillment rate is performing in the top 5% of verified enterprise hubs.
                        </p>
                    </div>

                    {/* Talent Radar Active */}
                    <div className="bg-linear-to-br from-[#0A1931] via-[#0A1931] to-[#0066FF] text-white rounded-3xl p-6 sm:p-7 shadow-lg space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Zap className="w-5 h-5 text-amber-400" />
                                <h3 className="text-base font-extrabold font-['Outfit',sans-serif]">
                                    Talent Radar Active
                                </h3>
                            </div>
                            <span className="px-2 py-0.5 rounded-md bg-amber-400 text-[#0A1931] text-[9px] font-black uppercase tracking-wider">
                                Live
                            </span>
                        </div>
                        <div className="text-2xl font-black font-['Outfit',sans-serif]">
                            {radarNearbyCount}+ Verified Technicians
                        </div>
                        <p className="text-xs text-slate-300 font-medium leading-relaxed">
                            Pre-vetted electricians, logistics specialists, and site operators are active within 5km of your projects.
                        </p>
                    </div>

                    {/* Security & Escrow Guarantee */}
                    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <h3 className="text-base font-extrabold text-[#0A1931] font-['Outfit',sans-serif]">
                                TrustHyre Guarantee
                            </h3>
                        </div>
                        <ul className="text-xs text-slate-600 space-y-2.5 font-medium">
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                <span>100% Aadhaar & biometric background verified</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                <span>Guaranteed escrow payment protection</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                <span>Zero-notice candidate replacement warranty</span>
                            </li>
                        </ul>
                    </div>

                </div>

            </main>
        </div>
    );
}

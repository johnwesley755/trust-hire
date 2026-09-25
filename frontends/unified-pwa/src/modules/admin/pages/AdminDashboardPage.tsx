import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../../services/admin.service';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Briefcase, 
  FileCheck2, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  ShieldAlert, 
  Loader2,
  Building2,
  UserCheck
} from 'lucide-react';
import { toast } from 'sonner';

export const AdminDashboardPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['adminStats'],
    queryFn: adminService.getStats,
    refetchInterval: 30000,
  });

  const { data: pendingVerifications = [], isLoading: isLoadingVerifications } = useQuery({
    queryKey: ['adminVerifications', 'PENDING'],
    queryFn: () => adminService.getVerifications('PENDING'),
  });

  const verifyMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'VERIFIED' | 'REJECTED' }) =>
      adminService.updateVerificationStatus(id, status),
    onSuccess: (_, variables) => {
      toast.success(`Verification marked as ${variables.status.toLowerCase()}`);
      queryClient.invalidateQueries({ queryKey: ['adminVerifications'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    }
  });

  if (isLoadingStats) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-[#0066FF] animate-spin" />
      </div>
    );
  }

  const kpiCards = [
    {
      title: 'Total Registered Users',
      value: stats?.totalUsers || 0,
      sub: `${stats?.totalWorkers || 0} Candidates • ${stats?.totalEmployers || 0} Employers`,
      icon: Users,
      color: 'bg-blue-50 text-[#0066FF] border border-blue-100'
    },
    {
      title: 'Active Job Openings',
      value: stats?.openJobs || 0,
      sub: `${stats?.totalJobs || 0} Total Postings Created`,
      icon: Briefcase,
      color: 'bg-amber-50 text-amber-600 border border-amber-100'
    },
    {
      title: 'Pending Verifications',
      value: stats?.pendingVerifications || 0,
      sub: `${stats?.totalVerifications || 0} Total Records Evaluated`,
      icon: FileCheck2,
      color: 'bg-rose-50 text-rose-600 border border-rose-100',
      alert: (stats?.pendingVerifications || 0) > 0
    },
    {
      title: 'Successful Hirings',
      value: stats?.totalHired || 0,
      sub: `₹${(stats?.escrowVolume || 0).toLocaleString()} Processed Payouts`,
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600 border border-emerald-100'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />
        
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A1931] tracking-tight">Platform Command Center</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Real-time ecosystem metrics, identity verification queue, and platform health.</p>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>All Services Operational</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={idx}
              className="bg-white border border-slate-200/80 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{kpi.title}</span>
                <div className={`w-11 h-11 rounded-2xl ${kpi.color} flex items-center justify-center shadow-xs`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <span className="text-3xl font-black text-[#0A1931]">{kpi.value.toLocaleString()}</span>
                <p className="text-xs text-slate-500 font-medium mt-1">{kpi.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: KYC Queue */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <FileCheck2 className="w-5 h-5 text-[#0066FF]" />
                <h2 className="text-base font-bold text-[#0A1931]">Pending KYC Verifications</h2>
              </div>
              <Link 
                to="/admin/verifications"
                className="text-xs font-bold text-[#0066FF] hover:text-blue-700 flex items-center gap-1"
              >
                <span>View Full Queue</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {isLoadingVerifications ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 text-[#0066FF] animate-spin" />
              </div>
            ) : pendingVerifications.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200/60">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">All identity verification requests cleared!</p>
                <p className="text-[11px] text-slate-400 mt-0.5">No pending documents in queue.</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {pendingVerifications.slice(0, 4).map((rec) => (
                  <div 
                    key={rec.id}
                    className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0066FF] font-black flex items-center justify-center text-sm border border-blue-100">
                        {rec.userName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#0A1931]">{rec.userName}</h4>
                        <p className="text-[11px] text-slate-500">{rec.userEmail || rec.userPhone || 'Registered User'}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 border border-blue-200 text-[#0066FF] rounded-md text-[9px] font-black uppercase">
                          {rec.verificationType}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => verifyMutation.mutate({ id: rec.id, status: 'VERIFIED' })}
                        disabled={verifyMutation.isPending}
                        className="flex-1 sm:flex-none px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => verifyMutation.mutate({ id: rec.id, status: 'REJECTED' })}
                        disabled={verifyMutation.isPending}
                        className="flex-1 sm:flex-none px-3.5 py-2 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-700 hover:text-rose-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center">
            <span>Approved verifications instantly grant verified trust badges.</span>
            <Link to="/admin/verifications" className="text-[#0066FF] font-bold hover:underline">
              Manage all ({pendingVerifications.length})
            </Link>
          </div>
        </div>

        {/* Right Column: Platform Fast Feeds */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recent Registrations */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#0066FF]" />
                <h3 className="text-sm font-bold text-[#0A1931]">Recent Registrations</h3>
              </div>
              <Link to="/admin/users" className="text-xs font-bold text-[#0066FF] hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {(stats?.recentUsers || []).map((u: any) => (
                <div key={u.id} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-0">
                  <div>
                    <span className="font-bold text-slate-800 block">{[u.first_name, u.last_name].filter(Boolean).join(' ') || u.email}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{u.email}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
                    u.role === 'EMPLOYER' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-[#0A1931] mb-3">Quick Navigation</h3>
            <div className="grid grid-cols-3 gap-2.5">
              <Link
                to="/admin/leads"
                className="p-3 bg-slate-50/80 hover:bg-emerald-50/50 border border-slate-200/80 hover:border-emerald-200 rounded-2xl flex flex-col items-start gap-1 transition-all group"
              >
                <Building2 className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-800">Hiring Companies</span>
              </Link>
              <Link
                to="/admin/users"
                className="p-3 bg-slate-50/80 hover:bg-blue-50/50 border border-slate-200/80 hover:border-blue-200 rounded-2xl flex flex-col items-start gap-1 transition-all group"
              >
                <Users className="w-4 h-4 text-[#0066FF] group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-800">Users Directory</span>
              </Link>
              <Link
                to="/admin/jobs"
                className="p-3 bg-slate-50/80 hover:bg-amber-50/50 border border-slate-200/80 hover:border-amber-200 rounded-2xl flex flex-col items-start gap-1 transition-all group"
              >
                <Briefcase className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-800">Job Moderation</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};


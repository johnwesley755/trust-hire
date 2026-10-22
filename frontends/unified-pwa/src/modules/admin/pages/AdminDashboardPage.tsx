import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../../services/admin.service';
import { Link } from 'react-router-dom';
import { AppLoader } from '../../../components/common/AppLoader';
import { 
  Users, 
  Briefcase, 
  FileCheck2, 
  CheckCircle2, 
  ArrowUpRight, 
  Loader2,
  Building2,
  UserCheck,
  ShieldCheck,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

export const AdminDashboardPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['adminStats'],
    queryFn: adminService.getStats,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  const { data: pendingVerifications = [], isLoading: isLoadingVerifications } = useQuery({
    queryKey: ['adminVerifications', 'PENDING'],
    queryFn: () => adminService.getVerifications('PENDING'),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
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
      <AppLoader variant="page" message="Loading admin intelligence..." />
    );
  }

  const kpiCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      sub: `${stats?.totalWorkers || 0} Candidates • ${stats?.totalEmployers || 0} Employers`,
      icon: Users,
      color: 'bg-blue-50 text-[#0f2f63] border border-blue-100'
    },
    {
      title: 'Active Job Postings',
      value: stats?.openJobs || 0,
      sub: `${stats?.totalJobs || 0} Total Listings Created`,
      icon: Briefcase,
      color: 'bg-amber-50 text-amber-700 border border-amber-200'
    },
    {
      title: 'Pending Verifications',
      value: stats?.pendingVerifications || 0,
      sub: `${stats?.totalVerifications || 0} Evaluated Records`,
      icon: FileCheck2,
      color: 'bg-rose-50 text-rose-700 border border-rose-200',
      alert: (stats?.pendingVerifications || 0) > 0
    },
    {
      title: 'Completed Hirings',
      value: stats?.totalHired || 0,
      sub: `₹${(stats?.escrowVolume || 0).toLocaleString()} Escrow Settlements`,
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    },
  ];

  return (
    <div className="space-y-6 font-['Onest',system-ui,sans-serif]">
      {/* Welcome Banner */}
      <div className="bg-white border border-[#e6e8ec] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xs relative overflow-hidden">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-medium uppercase text-[#717784] mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563c9]" />
            <span>Platform Overview</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-medium text-[#0a0a0a] tracking-tight">
            Command Center
          </h1>
          <p className="text-xs sm:text-sm text-[#717784] mt-1 leading-relaxed">
            Real-time ecosystem metrics, workforce identity review queue, and platform operational health.
          </p>
        </div>
        
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Services Operational</span>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={idx}
              className="bg-white border border-[#e6e8ec] rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between shadow-xs hover:border-[#0f2f63]/30 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium uppercase tracking-wider text-[#717784]">{kpi.title}</span>
                <div className={`w-10 h-10 rounded-xl ${kpi.color} flex items-center justify-center shadow-2xs`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <span className="text-3xl font-semibold text-[#0a0a0a] tracking-tight">{kpi.value.toLocaleString()}</span>
                <p className="text-xs text-[#717784] mt-1">{kpi.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Verification Queue */}
        <div className="lg:col-span-7 bg-white border border-[#e6e8ec] rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#e6e8ec]">
              <div className="flex items-center gap-2.5">
                <FileCheck2 className="w-5 h-5 text-[#0f2f63]" />
                <h2 className="text-base font-semibold text-[#0a0a0a]">Pending Verifications</h2>
              </div>
              <Link 
                to="/admin/verifications"
                className="text-xs font-medium text-[#2563c9] hover:underline inline-flex items-center gap-1"
              >
                <span>Full Queue ({pendingVerifications.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {isLoadingVerifications ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 text-[#0f2f63] animate-spin" />
              </div>
            ) : pendingVerifications.length === 0 ? (
              <div className="text-center py-12 bg-[#f8fafc] rounded-xl border border-[#e6e8ec]">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-semibold text-[#0a0a0a]">All identity verification requests cleared!</p>
                <p className="text-[11px] text-[#717784] mt-0.5">No pending documents in queue.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingVerifications.slice(0, 4).map((rec) => (
                  <div 
                    key={rec.id}
                    className="p-3.5 bg-[#f8fafc] border border-[#e6e8ec] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-[#f4f4f4] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0f2f63] font-bold flex items-center justify-center text-sm border border-blue-100 shrink-0">
                        {rec.userName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-[#0a0a0a]">{rec.userName}</h4>
                        <p className="text-[11px] text-[#717784]">{rec.userEmail || rec.userPhone || 'Registered User'}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 border border-blue-200 text-[#0f2f63] rounded-md text-[9px] font-bold uppercase tracking-wider">
                          {rec.verificationType}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => verifyMutation.mutate({ id: rec.id, status: 'VERIFIED' })}
                        disabled={verifyMutation.isPending}
                        className="flex-1 sm:flex-none px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-medium uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => verifyMutation.mutate({ id: rec.id, status: 'REJECTED' })}
                        disabled={verifyMutation.isPending}
                        className="flex-1 sm:flex-none px-3.5 py-1.5 bg-white hover:bg-rose-50 border border-[#e6e8ec] hover:border-rose-200 text-[#717784] hover:text-rose-600 rounded-full text-xs font-medium uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-5 pt-4 border-t border-[#e6e8ec] text-[11px] text-[#717784] flex justify-between items-center">
            <span>Approved records instantly receive verified trust badges.</span>
            <Link to="/admin/verifications" className="text-[#0f2f63] font-medium hover:underline">
              Inspect Queue &rarr;
            </Link>
          </div>
        </div>

        {/* Right Column: Platform Feeds & Fast Nav */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recent Registrations */}
          <div className="bg-white border border-[#e6e8ec] rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#e6e8ec]">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#0f2f63]" />
                <h3 className="text-sm font-semibold text-[#0a0a0a]">Recent Registrations</h3>
              </div>
              <Link to="/admin/users" className="text-xs font-medium text-[#2563c9] hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-2.5">
              {(stats?.recentUsers || []).slice(0, 5).map((u: any) => (
                <div key={u.id} className="flex items-center justify-between text-xs py-1.5 border-b border-[#e6e8ec] last:border-0">
                  <div>
                    <span className="font-semibold text-[#0a0a0a] block">{[u.first_name, u.last_name].filter(Boolean).join(' ') || u.email}</span>
                    <span className="text-[10px] text-[#717784] font-normal">{u.email}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                    u.role === 'EMPLOYER' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-blue-50 text-[#0f2f63] border border-blue-200'
                  }`}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white border border-[#e6e8ec] rounded-2xl p-6 shadow-xs">
            <h3 className="text-sm font-semibold text-[#0a0a0a] mb-3">Quick Navigation</h3>
            <div className="grid grid-cols-3 gap-2.5">
              <Link
                to="/admin/leads"
                className="p-3 bg-[#f8fafc] hover:bg-emerald-50/50 border border-[#e6e8ec] hover:border-emerald-200 rounded-xl flex flex-col items-start gap-1 transition-all group"
              >
                <Building2 className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-[#0a0a0a]">Companies</span>
              </Link>
              <Link
                to="/admin/users"
                className="p-3 bg-[#f8fafc] hover:bg-blue-50/50 border border-[#e6e8ec] hover:border-blue-200 rounded-xl flex flex-col items-start gap-1 transition-all group"
              >
                <Users className="w-4 h-4 text-[#0f2f63] group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-[#0a0a0a]">Directory</span>
              </Link>
              <Link
                to="/admin/jobs"
                className="p-3 bg-[#f8fafc] hover:bg-amber-50/50 border border-[#e6e8ec] hover:border-amber-200 rounded-xl flex flex-col items-start gap-1 transition-all group"
              >
                <Briefcase className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-[#0a0a0a]">Moderation</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

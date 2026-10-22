import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService, type AdminJobItem } from '../../../services/admin.service';
import { Briefcase, Search, Trash2, MapPin, IndianRupee, Users, Loader2, Globe, RefreshCw, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { AppLoader } from '../../../components/common/AppLoader';

export const AdminJobsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['adminJobs', selectedStatus, searchQuery],
    queryFn: () => adminService.getJobs({ status: selectedStatus, q: searchQuery }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteJob(id),
    onSuccess: () => {
      toast.success('Job removed by administrator');
      queryClient.invalidateQueries({ queryKey: ['adminJobs'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    }
  });

  const syncExternalMutation = useMutation({
    mutationFn: () => adminService.syncExternalJobs({ limit: 25 }),
    onSuccess: (data: any) => {
      const res = data?.data || data;
      toast.success(`External sync complete: ${res?.insertedCount || 0} inserted, ${res?.duplicatesMerged || 0} duplicates merged.`);
      queryClient.invalidateQueries({ queryKey: ['adminJobs'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to sync external jobs');
    }
  });

  const freshnessMutation = useMutation({
    mutationFn: () => adminService.runFreshnessCycle(),
    onSuccess: (data: any) => {
      const res = data?.data || data;
      toast.success(`Freshness check finished: scanned ${res?.scannedCount || 0}, expired ${res?.expiredCount || 0} dead postings.`);
      queryClient.invalidateQueries({ queryKey: ['adminJobs'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to run freshness check');
    }
  });

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete the job posting "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const statusTabs = [
    { label: 'All Jobs', value: 'ALL' },
    { label: 'Open Requisitions', value: 'OPEN' },
    { label: 'Filled / Closed', value: 'FILLED' },
  ];

  return (
    <div className="space-y-6 font-['Onest',system-ui,sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-medium uppercase text-[#717784] mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563c9]" />
            <span>Marketplace Quality</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-medium text-[#0a0a0a] tracking-tight">
            Job Postings & Moderation
          </h1>
          <p className="text-xs sm:text-sm text-[#717784] mt-1 leading-relaxed">
            Review active job openings, remove spam listings, and aggregate verified partner vacancies.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => syncExternalMutation.mutate()}
            disabled={syncExternalMutation.isPending}
            className="px-3.5 py-2 rounded-full bg-[#0f2f63] hover:bg-[#1a4487] text-white text-xs font-medium uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-xs active:scale-95 cursor-pointer disabled:opacity-60"
            title="Fetch and ingest fresh verified jobs from partner portals"
          >
            {syncExternalMutation.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Globe className="w-3.5 h-3.5 text-blue-300" />
            )}
            <span>{syncExternalMutation.isPending ? 'Syncing...' : 'Sync Partner Jobs'}</span>
          </button>

          <button
            type="button"
            onClick={() => freshnessMutation.mutate()}
            disabled={freshnessMutation.isPending}
            className="px-3.5 py-2 rounded-full bg-white hover:bg-[#f4f4f4] border border-[#e6e8ec] text-[#0a0a0a] text-xs font-medium uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-xs active:scale-95 cursor-pointer disabled:opacity-60"
            title="Scan existing external postings for expired/dead vacancy links"
          >
            {freshnessMutation.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            )}
            <span>{freshnessMutation.isPending ? 'Checking...' : 'Check Freshness'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div className="inline-flex p-1 rounded-full bg-[#f4f4f4] border border-[#e6e8ec] overflow-x-auto max-w-full">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedStatus(tab.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                selectedStatus === tab.value
                  ? 'bg-[#0f2f63] text-white shadow-xs'
                  : 'text-[#717784] hover:text-[#0a0a0a]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, employer, city..."
            className="w-full bg-[#f4f4f4]/60 hover:bg-[#f4f4f4] focus:bg-white border border-[#e6e8ec] focus:border-[#0f2f63] rounded-xl px-3.5 py-2 pl-9 text-xs text-[#0a0a0a] placeholder:text-[#9ea3ae] outline-hidden shadow-2xs transition-all"
          />
          <Search className="w-4 h-4 text-[#9ea3ae] absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Jobs Grid */}
      {isLoading ? (
        <AppLoader variant="page" message="Loading job openings..." />
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#e6e8ec] shadow-xs">
          <Briefcase className="w-10 h-10 text-[#9ea3ae] mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-[#0a0a0a]">No jobs found</h3>
          <p className="text-xs text-[#717784] mt-1">No jobs matched your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {jobs.map((job: any) => {
            const rawExpiry = job.expiresAt || job.expires_at;
            const createdDate = job.createdAt || job.created_at;
            const effectiveExpiry = rawExpiry
              ? new Date(rawExpiry)
              : (createdDate ? new Date(new Date(createdDate).getTime() + 30 * 24 * 60 * 60 * 1000) : null);
            const isExpired = Boolean(
              job.status === 'EXPIRED' ||
              job.status === 'CLOSED' ||
              (effectiveExpiry && effectiveExpiry.getTime() <= Date.now())
            );

            return (
              <div 
                key={job.id}
                className={`bg-white border rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xs hover:border-[#0f2f63]/30 transition-all relative overflow-hidden ${
                  isExpired ? 'border-rose-200 bg-rose-50/10' : 'border-[#e6e8ec]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                        isExpired
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : job.status === 'OPEN' 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                          : 'bg-[#f4f4f4] text-[#717784] border border-[#e6e8ec]'
                      }`}>
                        {isExpired ? 'EXPIRED' : job.status}
                      </span>
                      {(job.is_external || job.isExternal) && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          {job.source_name || job.sourceName || 'External Partner'}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#717784] font-mono">
                      {job.created_at ? new Date(job.created_at).toLocaleDateString() : ''}
                    </span>
                  </div>

                <h3 className="text-sm font-semibold text-[#0a0a0a] leading-tight mb-1">{job.title}</h3>
                <p className="text-xs text-[#717784] font-medium">{job.employer_name || 'Verified Employer'}</p>

                <div className="mt-3 pt-3 border-t border-[#e6e8ec] space-y-1.5 text-xs text-[#717784]">
                  <div className="flex items-center gap-1.5 text-[#0a0a0a]">
                    <MapPin className="w-3.5 h-3.5 text-[#9ea3ae]" />
                    <span>{job.city || job.location || 'Location on file'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#0a0a0a]">
                    <IndianRupee className="w-3.5 h-3.5 text-[#9ea3ae]" />
                    <span>₹{job.budget?.toLocaleString() || 0} Budget</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#0f2f63] font-medium">
                    <Users className="w-3.5 h-3.5 text-[#2563c9]" />
                    <span>{job.applicantCount || 0} Total Applicants</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#e6e8ec] flex items-center justify-between">
                <span className="text-[11px] text-[#717784] font-medium">{job.city || job.location || 'Pan India'}</span>
                <button
                  onClick={() => handleDelete(job.id, job.title)}
                  disabled={deleteMutation.isPending}
                  className="px-3 py-1.5 bg-white hover:bg-rose-50 border border-[#e6e8ec] hover:border-rose-200 text-[#717784] hover:text-rose-600 rounded-full text-xs font-medium uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

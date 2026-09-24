import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService, type AdminJobItem } from '../../../services/admin.service';
import { Briefcase, Search, Trash2, MapPin, IndianRupee, Users, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete the job posting "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const statusTabs = [
    { label: 'All Jobs', value: 'ALL' },
    { label: 'Open', value: 'OPEN' },
    { label: 'Closed / Filled', value: 'FILLED' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[#0A1931] tracking-tight">Job & Shift Moderation</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Review active requisitions, manage flagged postings, and maintain marketplace quality.</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedStatus(tab.value)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedStatus === tab.value
                  ? 'bg-[#0066FF] text-white shadow-xs shadow-blue-500/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
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
            className="w-full bg-white border border-slate-200 focus:border-[#0066FF] rounded-xl px-3.5 py-2 pl-9 text-xs text-slate-900 placeholder:text-slate-400 outline-none shadow-xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Jobs Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#0066FF] animate-spin" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
          <Briefcase className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">No jobs found</h3>
          <p className="text-xs text-slate-400 mt-1">No job requisitions matched your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {jobs.map((job) => (
            <div 
              key={job.id}
              className="bg-white border border-slate-200/80 rounded-3xl p-5 flex flex-col justify-between space-y-4 shadow-xs hover:border-slate-300 transition-all relative overflow-hidden"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
                    job.status === 'OPEN' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {job.status}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {job.created_at ? new Date(job.created_at).toLocaleDateString() : ''}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#0A1931] leading-tight mb-1">{job.title}</h3>
                <p className="text-xs text-slate-500 font-medium">{job.employer_name || 'Verified Employer'}</p>

                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.city || job.location || 'Location on file'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                    <span>₹{job.budget?.toLocaleString() || 0} Budget</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#0066FF] font-semibold">
                    <Users className="w-3.5 h-3.5" />
                    <span>{job.applicantCount || 0} Total Applicants</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono truncate max-w-[140px]">{job.id}</span>
                <button
                  onClick={() => handleDelete(job.id, job.title)}
                  disabled={deleteMutation.isPending}
                  className="px-3 py-1.5 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Job</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


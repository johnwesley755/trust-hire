import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationService, type JobApplication } from '../../../services/application.service';
import { jobService } from '../../../services/job.service';
import { workerService } from '../../../services/worker.service';
import { queryKeys } from '../../../lib/queryKeys';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  ChevronRight, 
  Loader2, 
  MapPin, 
  BadgeCheck, 
  IndianRupee, 
  ArrowLeft, 
  Plus, 
  Briefcase, 
  Sparkles,
  ShieldCheck,
  Star,
  PhoneCall,
  Package,
  Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UserAvatar } from '../../../components/common/UserAvatar';
import { AppLoader } from '../../../components/common/AppLoader';
import { DataTablePagination } from '../../../components/common/DataTablePagination';
import { Tabs } from '../../../components/common/Tabs';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ApplicationManagementPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'OFFER_SENT' | 'ACCEPTED' | 'REJECTED'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [jobCurrentPage, setJobCurrentPage] = useState(1);
  const [jobPageSize, setJobPageSize] = useState(10);
  const [jobSearchQuery, setJobSearchQuery] = useState('');

  const { data: jobs = [], isLoading: isJobsLoading } = useQuery<import('../../../types').Job[]>({ 
    queryKey: queryKeys.jobs.employerJobs, 
    queryFn: jobService.getEmployerJobs 
  });
  
  const jobIds = jobs.map((j: import('../../../types').Job) => j.id).filter((id): id is string => !!id);
  
  const { data: allApplicationsRaw = [], isLoading: isAppsLoading } = useQuery<JobApplication[]>({
    queryKey: queryKeys.jobs.allEmployerApplications(jobIds),
    queryFn: () => applicationService.getApplicationsForEmployerJobs(jobIds),
    enabled: jobIds.length > 0,
  });

  const allApplications = allApplicationsRaw;

  const selectedJobApplications = allApplications.filter(app => {
    if (app.jobId !== selectedJobId) return false;
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'ACCEPTED') return app.status === 'ACCEPTED' || app.status === 'APPROVED';
    if (statusFilter === 'REJECTED') return app.status === 'REJECTED' || app.status === 'DECLINED';
    return app.status === statusFilter;
  });

  const workerIds = selectedJobApplications.map((app) => app.workerId);
  
  const { data: workers = [] } = useQuery({
    queryKey: queryKeys.workers.byUserIds(workerIds),
    queryFn: () => workerService.getProfilesByUserIds(workerIds),
    enabled: selectedJobId !== null && workerIds.length > 0,
  });

  const workersById = new Map<string, any>();
  workers.forEach((worker) => {
    if (worker.userId) workersById.set(worker.userId, worker);
    if (worker.id) workersById.set(worker.id, worker);
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: JobApplication['status'] }) => 
      applicationService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.employer.profile });
    }
  });

  const getApplicationCountForJob = (jobId: string) => {
    return allApplications.filter(app => app.jobId === jobId).length;
  };

  const getPendingCountForJob = (jobId: string) => {
    return allApplications.filter(app => app.jobId === jobId && app.status === 'PENDING').length;
  };

  const selectedJob = jobs.find((j: import('../../../types').Job) => j.id === selectedJobId);

  const filteredJobs = jobs.filter((job: import('../../../types').Job) => {
    if (!jobSearchQuery.trim()) return true;
    const q = jobSearchQuery.toLowerCase();
    return (
      (job.title || '').toLowerCase().includes(q) ||
      (job.industry || '').toLowerCase().includes(q) ||
      (job.location || '').toLowerCase().includes(q)
    );
  });

  const jobTotalPages = Math.max(1, Math.ceil(filteredJobs.length / jobPageSize));
  const paginatedJobs = filteredJobs.slice(
    (jobCurrentPage - 1) * jobPageSize,
    jobCurrentPage * jobPageSize
  );

  const allJobApps = allApplications.filter(app => app.jobId === selectedJobId);
  const countAll = allJobApps.length;
  const countPending = allJobApps.filter(app => app.status === 'PENDING').length;
  const countOfferSent = allJobApps.filter(app => app.status === 'OFFER_SENT').length;
  const countAccepted = allJobApps.filter(app => app.status === 'ACCEPTED' || app.status === 'APPROVED').length;
  const countRejected = allJobApps.filter(app => app.status === 'REJECTED' || app.status === 'DECLINED').length;

  if (isJobsLoading || (isAppsLoading && !allApplications)) {
    return <AppLoader variant="page" message="Syncing Applicants Feed..." />;
  } 

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      <AnimatePresence mode="wait">
        {!selectedJobId ? (
          <motion.div
            key="job-list"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="max-w-6xl mx-auto space-y-6"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#0066FF] uppercase tracking-wider mb-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  Hiring & Applications Hub
                </div>
                <h1 className="text-2xl font-black text-[#0A1931] tracking-tight">
                  Active Openings & Applications
                </h1>
                <p className="text-slate-500 font-medium text-xs sm:text-sm mt-0.5">
                  Select an opening to review candidates, inspect credentials, and manage hiring.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-white px-3.5 py-1.5 rounded-xl flex items-center gap-2 border border-slate-200 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-bold text-slate-700">
                    {allApplications?.length || 0} Total Received
                  </span>
                </div>
                <button
                  onClick={() => navigate('/post-job')}
                  className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052cc] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Post a Job
                </button>
              </div>
            </div>

            {/* Grid of Job Postings */}
            {jobs.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center max-w-2xl mx-auto mt-8">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-black text-[#0A1931] mb-2 uppercase tracking-tight">No Active Jobs</h3>
                    <p className="text-slate-500 font-medium mb-6 text-sm">You currently don't have any active job postings. Once you post a new job, it will appear here for you to manage applications and track performance.</p>
                    <button 
                        onClick={() => navigate('/post-job')}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#0066FF] hover:bg-blue-700 text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all text-sm"
                    >
                        <Plus className="w-4 h-4" /> Post Your First Job
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                  {/* Search and Summary Control Bar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div className="relative flex-1 max-w-md">
                      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <Input
                        type="text"
                        value={jobSearchQuery}
                        onChange={(e) => {
                          setJobSearchQuery(e.target.value);
                          setJobCurrentPage(1);
                        }}
                        placeholder="Filter openings by title, industry, or location..."
                        className="pl-9 bg-slate-50 hover:bg-slate-100/60 focus-visible:bg-white"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 px-1">
                      <span>
                        {filteredJobs.length} {filteredJobs.length === 1 ? 'opening' : 'openings'} {jobSearchQuery ? 'matching' : 'active'}
                      </span>
                    </div>
                  </div>

                  {/* Active Jobs Table View using shadcn UI */}
                  <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="w-[30%] min-w-[180px]">Job & Industry</TableHead>
                          <TableHead className="w-[24%] max-w-[210px]">Location</TableHead>
                          <TableHead className="w-[14%] whitespace-nowrap">Budget / Pay</TableHead>
                          <TableHead className="w-[10%] whitespace-nowrap">Status</TableHead>
                          <TableHead className="w-[12%] whitespace-nowrap">Candidates</TableHead>
                          <TableHead className="w-[10%] whitespace-nowrap">Posted</TableHead>
                          <TableHead className="w-[10%] text-right whitespace-nowrap">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedJobs.length > 0 ? (
                          paginatedJobs.map((job: import('../../../types').Job) => {
                            const pendingCount = getPendingCountForJob(job.id!);
                            const totalCount = getApplicationCountForJob(job.id!);
                            const isUrgent = Boolean(job.description?.toLowerCase().includes('urgent'));
                            const locationText = job.location || job.city || 'Local area';

                            return (
                              <TableRow
                                key={job.id}
                                onClick={() => setSelectedJobId(job.id!)}
                                className="group cursor-pointer"
                              >
                                {/* Job & Industry */}
                                <TableCell className="max-w-[220px]">
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0066FF] font-extrabold text-sm shrink-0 group-hover:scale-105 transition-all shadow-2xs">
                                      <Briefcase className="w-4 h-4 text-[#0066FF]" />
                                    </div>
                                    <div className="min-w-0">
                                      <button
                                        type="button"
                                        onClick={() => setSelectedJobId(job.id!)}
                                        className="font-bold text-[#0A1931] group-hover:text-[#0066FF] transition-colors truncate hover:underline text-left cursor-pointer block max-w-[170px]"
                                        title={job.title}
                                      >
                                        {job.title}
                                      </button>
                                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold mt-0.5">
                                        <Badge variant="secondary" className="px-1.5 py-0 text-[9px] font-bold">
                                          {job.industry || 'General'}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                </TableCell>

                                {/* Location with truncation and tooltip */}
                                <TableCell className="max-w-[210px]">
                                  <div className="flex items-center gap-1.5 text-slate-700 font-medium min-w-0">
                                    <MapPin className="w-3.5 h-3.5 text-[#0066FF] shrink-0" />
                                    <span 
                                      className="truncate block text-xs" 
                                      title={locationText}
                                    >
                                      {locationText}
                                    </span>
                                  </div>
                                </TableCell>

                                {/* Compensation */}
                                <TableCell className="whitespace-nowrap">
                                  <div className="font-extrabold text-[#0A1931] text-xs">
                                    ₹{(job.budget || 0).toLocaleString()}
                                  </div>
                                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block">
                                    Escrow Protected
                                  </span>
                                </TableCell>

                                {/* Status */}
                                <TableCell className="whitespace-nowrap">
                                  <Badge variant={isUrgent ? 'urgent' : 'success'}>
                                    {isUrgent ? 'URGENT' : 'ACTIVE'}
                                  </Badge>
                                </TableCell>

                                {/* Candidates */}
                                <TableCell className="whitespace-nowrap">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-extrabold text-slate-800 text-xs">
                                      {totalCount} Total
                                    </span>
                                    {pendingCount > 0 && (
                                      <Badge variant="warning" className="px-1.5 py-0 text-[9px] font-black lowercase first-letter:uppercase">
                                        <Sparkles className="w-2.5 h-2.5 text-amber-600 mr-0.5" />
                                        {pendingCount} new
                                      </Badge>
                                    )}
                                  </div>
                                </TableCell>

                                {/* Posted Date */}
                                <TableCell className="whitespace-nowrap text-slate-500 font-medium">
                                  {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recent'}
                                </TableCell>

                                {/* Actions */}
                                <TableCell className="text-right whitespace-nowrap">
                                  <Button
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedJobId(job.id!);
                                    }}
                                    className="gap-1 shadow-xs group-hover:scale-102"
                                  >
                                    <span>Review</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="h-28 text-center text-slate-400 text-xs">
                              No job openings matched your search query.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>

                    {/* Pagination */}
                    <DataTablePagination
                      currentPage={jobCurrentPage}
                      totalPages={jobTotalPages}
                      pageSize={jobPageSize}
                      totalItems={filteredJobs.length}
                      onPageChange={setJobCurrentPage}
                      onPageSizeChange={(size) => {
                        setJobPageSize(size);
                        setJobCurrentPage(1);
                      }}
                      itemName="openings"
                    />
                  </div>
                </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="applicant-list"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            className="max-w-7xl mx-auto space-y-6"
          >
            {/* Back Button & Job Breadcrumb */}
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setSelectedJobId(null)}
                className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#0066FF] transition-colors py-2 px-3 bg-white border border-slate-200 rounded-xl shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to All Openings
              </button>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">
                  {selectedJob?.status || 'Active'}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  ID: #{selectedJobId.substring(0, 8)}
                </span>
              </div>
            </div>

            {/* Selected Job Banner */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-50 text-[#0066FF] border border-blue-100">
                    {selectedJob?.industry || 'Job Opening'}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    Escrow Protected
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-[#0A1931] tracking-tight">
                  {selectedJob?.title}
                </h1>
                <p className="text-sm text-slate-500 font-medium max-w-2xl line-clamp-2">
                  {selectedJob?.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 pt-1">
                  <span className="flex items-center gap-1 text-[#0066FF] font-black">
                    <IndianRupee className="w-3.5 h-3.5" /> ₹{selectedJob?.budget?.toLocaleString()} / month
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {selectedJob?.location}
                  </span>
                </div>
              </div>

              {/* Job Candidate Pipeline Metrics Card */}
              <div className="flex items-center gap-3 sm:gap-5 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 self-start md:self-center shrink-0">
                <div className="text-center px-1.5 sm:px-2.5">
                  <div className="text-lg sm:text-xl font-black text-[#0A1931]">{countAll}</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total</div>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="text-center px-1.5 sm:px-2.5">
                  <div className="text-lg sm:text-xl font-black text-amber-600">{countPending}</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Review</div>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="text-center px-1.5 sm:px-2.5">
                  <div className="text-lg sm:text-xl font-black text-emerald-600">{countAccepted}</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Hired</div>
                </div>
              </div>
            </div>

            {/* Status Filter Tabs Bar using Reusable Tabs Component */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <Tabs
                tabs={[
                  { id: 'ALL', label: 'All Applicants', count: countAll },
                  { id: 'PENDING', label: 'Under Review', count: countPending },
                  { id: 'OFFER_SENT', label: 'Offers Sent', count: countOfferSent },
                  { id: 'ACCEPTED', label: 'Approved', count: countAccepted },
                  { id: 'REJECTED', label: 'Declined', count: countRejected },
                ]}
                activeTab={statusFilter}
                onChange={(tabId) => {
                  setStatusFilter(tabId as any);
                  setCurrentPage(1);
                }}
              />

              <div className="text-xs font-bold text-slate-500 self-end sm:self-auto px-1">
                Showing <span className="text-[#0A1931] font-black">{selectedJobApplications.length}</span> applicant{selectedJobApplications.length === 1 ? '' : 's'}
              </div>
            </div>

            {/* Applicants Table View using shadcn UI */}
            {selectedJobApplications.length > 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[24%] min-w-[160px]">Candidate</TableHead>
                      <TableHead className="w-[16%] whitespace-nowrap">Role & Experience</TableHead>
                      <TableHead className="w-[20%] max-w-[160px]">Contact & Location</TableHead>
                      {/* Rating / TrustScore - Temporarily hidden until TrustScore engine is fully implemented */}
                      {/* <TableHead className="w-[10%] whitespace-nowrap">Rating</TableHead> */}
                      <TableHead className="w-[14%]">Key Skills</TableHead>
                      <TableHead className="w-[12%] whitespace-nowrap">Applied</TableHead>
                      <TableHead className="w-[12%] whitespace-nowrap">Status</TableHead>
                      <TableHead className="w-[12%] text-right whitespace-nowrap">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedJobApplications
                      .slice((Math.min(currentPage, Math.max(1, Math.ceil(selectedJobApplications.length / pageSize))) - 1) * pageSize, Math.min(currentPage, Math.max(1, Math.ceil(selectedJobApplications.length / pageSize))) * pageSize)
                      .map((app: JobApplication) => {
                        const worker = workersById.get(app.workerId);
                        const candidateName = worker?.fullName || worker?.name || 'Candidate';
                        const candidateRole = worker?.level && !worker.level.startsWith('L') 
                          ? worker.level 
                          : (worker?.experienceYears ? `${worker.experienceYears}y exp` : 'Verified');
                        // const ratingDisplay = worker?.rating ? Number(worker.rating).toFixed(1) : (worker?.trustScore ? (worker.trustScore / 20).toFixed(1) : '4.8');
                        const locationDisplay = worker?.city || worker?.location || worker?.address || 'Location on file';
                        const isVerified = Boolean(worker?.identityVerified || worker?.isVerified);

                        const rawSkills = worker?.skills;
                        const skillsArray = Array.isArray(rawSkills) 
                          ? rawSkills 
                          : typeof rawSkills === 'string' && rawSkills.trim().length > 0 
                            ? rawSkills.split(',').map((s: string) => s.trim()).filter(Boolean)
                            : [];

                        const isApproved = app.status === 'ACCEPTED' || app.status === 'APPROVED';
                        const isOfferSent = app.status === 'OFFER_SENT';
                        const isDeclined = app.status === 'REJECTED' || app.status === 'DECLINED';

                        return (
                          <TableRow key={app.id} className="group">
                            {/* Candidate Avatar & Name */}
                            <TableCell>
                              <div className="flex items-center gap-2.5">
                                <UserAvatar 
                                  src={worker?.profileImageUrl} 
                                  name={candidateName} 
                                  size="md" 
                                />
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => navigate(`/worker/${app.workerId}`)}
                                      className="font-bold text-[#0A1931] group-hover:text-[#0066FF] transition-colors truncate hover:underline text-left cursor-pointer text-xs"
                                    >
                                      {candidateName}
                                    </button>
                                    {isVerified && (
                                      <span title="ID Verified" className="inline-flex shrink-0">
                                        <BadgeCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-slate-400 font-mono block">
                                    ID: {app.workerId.slice(0, 8)}...
                                  </span>
                                </div>
                              </div>
                            </TableCell>

                            {/* Role & Experience */}
                            <TableCell className="whitespace-nowrap">
                              <div className="space-y-0.5">
                                <span className="font-semibold text-slate-800 text-xs block">
                                  {candidateRole}
                                </span>
                                <Badge variant="default" className="text-[9px] px-1.5 py-0">
                                  {worker?.experienceYears ? `${worker.experienceYears}+ Yrs` : 'Verified'}
                                </Badge>
                              </div>
                            </TableCell>

                            {/* Contact & Location */}
                            <TableCell className="max-w-[150px]">
                              <div className="space-y-0.5 text-xs text-slate-600">
                                <div className="flex items-center gap-1.5 font-medium min-w-0">
                                  <MapPin className="w-3.5 h-3.5 text-[#0066FF] shrink-0" />
                                  <span className="truncate block" title={locationDisplay}>{locationDisplay}</span>
                                </div>
                                {worker?.phoneNumber && (
                                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                                    <PhoneCall className="w-3 h-3 text-emerald-600 shrink-0" />
                                    <span>{worker.phoneNumber}</span>
                                  </div>
                                )}
                              </div>
                            </TableCell>

                            {/* Rating / TrustScore - Temporarily hidden until TrustScore engine is implemented */}
                            {/*
                            <TableCell className="whitespace-nowrap">
                              <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200/80 rounded-lg text-xs font-black">
                                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                <span>{ratingDisplay}</span>
                              </div>
                            </TableCell>
                            */}

                            {/* Key Skills */}
                            <TableCell>
                              <div className="flex flex-wrap gap-1 max-w-[160px]">
                                {skillsArray.length > 0 ? (
                                  <>
                                    {skillsArray.slice(0, 2).map((skill: string) => (
                                      <Badge key={skill} variant="secondary" className="text-[9px] px-1.5 py-0 font-normal">
                                        {skill}
                                      </Badge>
                                    ))}
                                    {skillsArray.length > 2 && (
                                      <span className="text-slate-400 text-[9px] font-bold self-center">
                                        +{skillsArray.length - 2}
                                      </span>
                                    )}
                                  </>
                                ) : (
                                  <span className="text-slate-400 italic text-[10px]">General</span>
                                )}
                              </div>
                            </TableCell>

                            {/* Applied Date */}
                            <TableCell className="whitespace-nowrap text-slate-500 font-medium">
                              {new Date(app.appliedAt).toLocaleDateString()}
                            </TableCell>

                            {/* Status */}
                            <TableCell className="whitespace-nowrap">
                              <Badge variant={isApproved ? 'success' : isOfferSent ? 'warning' : isDeclined ? 'destructive' : 'default'}>
                                {app.status === 'PENDING' ? 'Under Review' : app.status}
                              </Badge>
                            </TableCell>

                            {/* Actions */}
                            <TableCell className="whitespace-nowrap text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {app.status === 'PENDING' && (
                                  <>
                                    <Button 
                                      size="sm"
                                      variant="success"
                                      onClick={() => mutation.mutate({ id: app.id!, status: 'ACCEPTED' })}
                                      disabled={mutation.isPending}
                                      className="gap-1 px-2.5 h-7.5"
                                      title="Approve & Hire"
                                    >
                                      <CheckCircle2 className="w-3 h-3" />
                                      <span>Approve</span>
                                    </Button>
                                    <Button 
                                      size="icon"
                                      variant="ghost"
                                      onClick={() => mutation.mutate({ id: app.id!, status: 'REJECTED' })}
                                      disabled={mutation.isPending}
                                      className="h-7.5 w-7.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                      title="Decline"
                                    >
                                      <XCircle className="w-3.5 h-3.5" />
                                    </Button>
                                  </>
                                )}
                                <Button 
                                  size="sm"
                                  variant="outline"
                                  onClick={() => navigate(`/worker/${app.workerId}`)}
                                  className="gap-1 h-7.5 px-2.5"
                                >
                                  <span>Profile</span>
                                  <ChevronRight className="w-3 h-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>

                {/* Table Footer: Standardized Pagination */}
                <DataTablePagination
                  currentPage={Math.min(currentPage, Math.max(1, Math.ceil(selectedJobApplications.length / pageSize)))}
                  totalPages={Math.max(1, Math.ceil(selectedJobApplications.length / pageSize))}
                  totalItems={selectedJobApplications.length}
                  pageSize={pageSize}
                  pageSizeOptions={[5, 10, 20, 50]}
                  onPageChange={(page) => setCurrentPage(page)}
                  onPageSizeChange={(size) => {
                    setPageSize(size);
                    setCurrentPage(1);
                  }}
                  itemName="applicants"
                />
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 space-y-3">
                <div className="w-16 h-16 bg-blue-50 text-[#0066FF] rounded-2xl flex items-center justify-center mx-auto">
                  <User className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-[#0A1931]">No Candidates Found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {statusFilter === 'ALL' 
                    ? 'No candidates have applied for this specific role yet. Try promoting the job or searching nearby workers.'
                    : `No applicants currently under the "${statusFilter}" status.`}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}


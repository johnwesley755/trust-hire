import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useOutletContext } from "react-router-dom";
import { AppLoader } from "../../../components/common/AppLoader";
import { applicationService } from "../../../services/application.service";
import { jobService } from "../../../services/job.service";
import { queryKeys } from "../../../lib/queryKeys";
import { motion } from "framer-motion";
import { useState } from "react";
import { useUser } from "../../../providers/AuthContext";
import { 
  CheckCircle2, Clock, MapPin, Calendar, 
  ChevronRight, Sparkles, ShieldCheck, AlertCircle, 
  FileText, Briefcase, Zap, ArrowRight, XCircle, Loader2,
  Table as TableIcon, LayoutGrid
} from "lucide-react";
import { DataTablePagination } from "../../../components/common/DataTablePagination";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AppliedJobsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const outletCtx = useOutletContext<{ setIsSidebarOpen?: (open: boolean) => void }>() || {};
  const [activeFilter, setActiveFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: applications = [], isLoading } = useQuery({
    queryKey: queryKeys.jobs.myApplications,
    queryFn: applicationService.getMyApplications,
  });

  const jobIds = Array.from(new Set(applications.map((application) => application.jobId)));
  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ['appliedJobsPage', jobIds],
    queryFn: () => jobService.getJobsByIds(jobIds),
    enabled: jobIds.length > 0,
  });

  const jobsById = new Map(jobs.filter((job) => job.id).map((job) => [job.id!, job]));

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      applicationService.updateStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.setQueryData<any[]>(queryKeys.jobs.myApplications, (old = []) => 
        (old || []).map((app: any) => app.id === variables.id ? { ...app, status: variables.status } : app)
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });
      queryClient.invalidateQueries({ queryKey: ['recommendedJobs'] });
    }
  });

  const filteredApplications = applications.filter(app => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Offers Received') return app.status === 'OFFER_SENT';
    if (activeFilter === 'Under Review') return app.status === 'PENDING' || app.status === 'REVIEWING' || app.status === 'APPLIED';
    if (activeFilter === 'Approved & Hired') return app.status === 'ACCEPTED' || app.status === 'APPROVED' || app.status === 'COMPLETED';
    return true;
  });

  const totalPages = Math.ceil(filteredApplications.length / pageSize) || 1;
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (isLoading || jobsLoading) {
    return <AppLoader variant="page" message="Loading your applications..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans">
      <main className="pt-6 px-4 sm:px-8 w-full max-w-7xl mx-auto space-y-6">
        
        {/* Screen Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1931] tracking-tight">
                My Job Applications
              </h1>
              <span className="bg-blue-50 text-[#0066FF] text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
                Live Pipeline
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Tracking {applications.length} submitted applications & escrow guarantees
            </p>
          </div>
          
          {/* Status Filter Tabs & View Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start md:self-auto overflow-x-auto no-scrollbar">
              {['All', 'Offers Received', 'Under Review', 'Approved & Hired'].map(filter => {
                const count = applications.filter(app => {
                  if (filter === 'All') return true;
                  if (filter === 'Offers Received') return app.status === 'OFFER_SENT';
                  if (filter === 'Under Review') return app.status === 'PENDING' || app.status === 'REVIEWING' || app.status === 'APPLIED';
                  if (filter === 'Approved & Hired') return app.status === 'ACCEPTED' || app.status === 'APPROVED' || app.status === 'COMPLETED';
                  return true;
                }).length;

                return (
                  <button 
                    key={filter}
                    onClick={() => {
                      setActiveFilter(filter);
                      setCurrentPage(1);
                    }}
                    className={`${
                      activeFilter === filter 
                        ? 'bg-[#0066FF] text-white shadow-xs font-bold' 
                        : 'text-slate-600 hover:text-[#0066FF] font-semibold'
                    } px-3.5 py-1.5 rounded-lg text-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap`}
                  >
                    {filter} ({count})
                  </button>
                );
              })}
            </div>

            {/* View Switcher Toggle */}
            <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200/80 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-[#0066FF] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title="Table View"
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-[#0066FF] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title="Card View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Cards</span>
              </button>
            </div>
          </div>
        </div>

        {/* List of Applications */}
        {filteredApplications.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 space-y-4">
            <div className="w-16 h-16 bg-blue-50 text-[#0066FF] rounded-2xl flex items-center justify-center mx-auto">
              <Briefcase className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">No applications in this view</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Discover open jobs in your area and apply with 1-click verified credentials.
              </p>
            </div>
            <Button
              onClick={() => navigate('/search')}
              className="px-5 py-2.5 uppercase tracking-wider"
            >
              Explore Available Jobs
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {viewMode === 'table' ? (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[30%] min-w-[200px]">Job & Employer</TableHead>
                      <TableHead className="w-[12%] whitespace-nowrap">Category</TableHead>
                      <TableHead className="w-[18%] max-w-[180px]">Location</TableHead>
                      <TableHead className="w-[12%] whitespace-nowrap">Applied Date</TableHead>
                      <TableHead className="w-[14%] whitespace-nowrap">Compensation</TableHead>
                      <TableHead className="w-[14%] whitespace-nowrap">Status</TableHead>
                      <TableHead className="w-[10%] text-right whitespace-nowrap">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedApplications.map((app) => {
                      const job = jobsById.get(app.jobId);
                      const status = app.status;
                      const isOfferSent = status === 'OFFER_SENT';
                      const isHired = status === 'ACCEPTED' || status === 'APPROVED' || status === 'COMPLETED';
                      const isDeclined = status === 'REJECTED' || status === 'DECLINED';
                      const employerName = (job as any)?.employerName || 'Verified Enterprise Partner';
                      const employerInitial = employerName.charAt(0).toUpperCase();

                      return (
                        <TableRow key={app.id} className="group">
                          {/* Job & Employer with Logo/Avatar */}
                          <TableCell className="max-w-[220px]">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 font-extrabold text-sm shrink-0 group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-[#0066FF] transition-all overflow-hidden shadow-2xs">
                                {(job as any)?.logoUrl ? (
                                  <img
                                    src={(job as any).logoUrl}
                                    alt={employerName}
                                    className="w-full h-full object-contain"
                                  />
                                ) : (
                                  <span>{employerInitial}</span>
                                )}
                              </div>
                              <div className="min-w-0">
                                <button
                                  type="button"
                                  onClick={() => navigate(`/job/${app.jobId}`)}
                                  className="font-bold text-[#0A1931] group-hover:text-[#0066FF] transition-colors truncate hover:underline text-left cursor-pointer block max-w-[180px]"
                                  title={job?.title}
                                >
                                  {job?.title || "Job Opening"}
                                </button>
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mt-0.5">
                                  <span className="text-slate-800 font-semibold truncate max-w-[120px]" title={employerName}>
                                    {employerName}
                                  </span>
                                  <ShieldCheck className="w-3.5 h-3.5 text-[#0066FF] shrink-0" />
                                </div>
                              </div>
                            </div>
                          </TableCell>

                          {/* Category */}
                          <TableCell className="whitespace-nowrap">
                            <Badge variant="secondary" className="px-2 py-0.5 text-[9px] font-bold">
                              {job?.industry || 'General Category'}
                            </Badge>
                          </TableCell>

                          {/* Location */}
                          <TableCell className="max-w-[180px]">
                            <div className="flex items-center gap-1.5 text-slate-700 font-medium min-w-0">
                              <MapPin className="w-3.5 h-3.5 text-[#0066FF] shrink-0" />
                              <span className="truncate block text-xs" title={job?.city || 'Local area'}>
                                {job?.city || 'Local area'}
                              </span>
                            </div>
                          </TableCell>

                          {/* Applied Date */}
                          <TableCell className="whitespace-nowrap text-slate-500 font-medium">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {new Date(app.appliedAt).toLocaleDateString()}
                            </span>
                          </TableCell>

                          {/* Compensation */}
                          <TableCell className="whitespace-nowrap">
                            <div className="font-extrabold text-[#0A1931] text-xs">
                              ₹{(job?.budget || 0).toLocaleString()}
                            </div>
                            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block">
                              Escrow Ready
                            </span>
                          </TableCell>

                          {/* Status */}
                          <TableCell className="whitespace-nowrap">
                            {isOfferSent ? (
                              <Badge variant="warning" className="animate-pulse">
                                <Sparkles className="w-2.5 h-2.5 mr-0.5 text-amber-600" /> Offer Received
                              </Badge>
                            ) : isHired ? (
                              <Badge variant="success">
                                <CheckCircle2 className="w-2.5 h-2.5 mr-0.5 text-emerald-600" /> Approved & Hired
                              </Badge>
                            ) : isDeclined ? (
                              <Badge variant="destructive">
                                <XCircle className="w-2.5 h-2.5 mr-0.5 text-rose-600" /> Declined
                              </Badge>
                            ) : (
                              <Badge variant="default">
                                <Clock className="w-2.5 h-2.5 mr-0.5 text-[#0066FF]" /> Under Review
                              </Badge>
                            )}
                          </TableCell>

                          {/* Actions */}
                          <TableCell className="text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {isOfferSent && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="success"
                                    onClick={() => statusMutation.mutate({ id: app.id, status: 'ACCEPTED' })}
                                    disabled={statusMutation.isPending}
                                    className="gap-1 px-2.5 h-7.5"
                                    title="Accept Offer"
                                  >
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>Accept</span>
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => statusMutation.mutate({ id: app.id, status: 'DECLINED' })}
                                    disabled={statusMutation.isPending}
                                    className="px-2 h-7.5 text-rose-600 hover:bg-rose-50"
                                    title="Decline Offer"
                                  >
                                    Decline
                                  </Button>
                                </>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => navigate(`/job/${app.jobId}`)}
                                className="gap-1 h-7.5 px-2.5"
                              >
                                <span>Details</span>
                                <ChevronRight className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {paginatedApplications.map((app, index) => {
                  const job = jobsById.get(app.jobId);
                  const status = app.status;
                  const isOfferSent = status === 'OFFER_SENT';
                  const isHired = status === 'ACCEPTED' || status === 'APPROVED' || status === 'COMPLETED';
                  const isDeclined = status === 'REJECTED' || status === 'DECLINED';
                  const isPending = !isOfferSent && !isHired && !isDeclined;

                  return (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className={`bg-white p-5 rounded-2xl border ${
                        isOfferSent 
                          ? 'border-amber-400 shadow-md ring-2 ring-amber-400/20' 
                          : isHired 
                            ? 'border-emerald-400 shadow-md ring-1 ring-emerald-400/30' 
                            : isDeclined 
                              ? 'border-rose-200 shadow-xs' 
                              : 'border-slate-200/80 shadow-xs'
                      } flex flex-col justify-between group hover:shadow-md transition-all relative overflow-hidden`}
                    >
                      {/* Top Bar */}
                      <div className="flex justify-between items-start gap-3">
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                              {job?.industry || 'General Category'}
                            </span>
                            {isOfferSent ? (
                              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 animate-pulse">
                                <Sparkles className="w-3 h-3 text-amber-600" /> Offer Received
                              </span>
                            ) : isHired ? (
                              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-emerald-600" /> Approved & Hired
                              </span>
                            ) : isDeclined ? (
                              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-900 flex items-center gap-1">
                                <XCircle className="w-3 h-3 text-rose-600" /> Declined
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200">
                                Under Review
                              </span>
                            )}
                          </div>
                          <h3 className="font-extrabold text-base sm:text-lg text-slate-900 group-hover:text-[#0066FF] transition-colors truncate">
                            {job?.title || "Job Opening"}
                          </h3>
                          <p className="text-xs text-slate-500 font-medium flex items-center gap-1 truncate">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#0066FF] shrink-0" />
                            {(job as any)?.employerName || 'Verified Enterprise Partner'}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-base sm:text-lg font-black text-slate-900">
                            ₹{(job?.budget || 0).toLocaleString()}
                          </span>
                          <span className="text-[9px] text-emerald-600 font-bold block uppercase tracking-wider">
                            Escrow Ready
                          </span>
                        </div>
                      </div>

                      {/* 2-Step Progress Tracker */}
                      <div className="my-4 py-3 px-4 bg-slate-50 rounded-xl border border-slate-100">
                        {!isDeclined ? (
                          <>
                            <div className="flex items-center justify-between text-xs font-bold mb-2 text-slate-600">
                              <span className="flex items-center gap-1 text-[#0066FF]">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#0066FF]" /> 1. Applied
                              </span>
                              <span className={`flex items-center gap-1 ${isHired ? 'text-emerald-600 font-black' : isOfferSent ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                                <Sparkles className={`w-3.5 h-3.5 ${isHired ? 'text-emerald-600' : isOfferSent ? 'text-amber-500' : 'text-slate-300'}`} /> 2. Approved & Hired
                              </span>
                            </div>
                            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-500 ${
                                  isHired 
                                    ? 'bg-emerald-500 w-full' 
                                    : isOfferSent 
                                      ? 'bg-amber-400 w-3/4' 
                                      : 'bg-[#0066FF] w-1/2'
                                }`}
                              />
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center gap-2 text-xs font-bold text-rose-600">
                            <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                            <span>Application closed by employer.</span>
                          </div>
                        )}
                      </div>

                      {/* Special Offer Received Banner & Action Buttons */}
                      {isOfferSent && (
                        <div className="mb-3 p-3 bg-amber-50 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <p className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                              Employer sent you a job offer!
                            </p>
                            <p className="text-[11px] text-amber-700 font-medium mt-0.5">
                              Accept to confirm your job and lock in secure escrow pay.
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => statusMutation.mutate({ id: app.id, status: 'ACCEPTED' })}
                              disabled={statusMutation.isPending}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {statusMutation.isPending ? 'Confirming...' : 'Accept Offer'}
                            </button>
                            <button
                              onClick={() => statusMutation.mutate({ id: app.id, status: 'DECLINED' })}
                              disabled={statusMutation.isPending}
                              className="px-2.5 py-1.5 bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 rounded-lg text-xs font-bold transition-all cursor-pointer"
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Meta Details & Action */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-slate-600 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-[#0066FF]" />
                            {job?.city || 'Local area'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(app.appliedAt).toLocaleDateString()}
                          </span>
                        </div>

                        <button 
                          onClick={() => navigate(`/job/${app.jobId}`)}
                          className="text-xs font-bold text-[#0066FF] hover:text-blue-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform cursor-pointer"
                        >
                          {isHired ? 'View Hired Job' : 'View Job Details'}
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            <DataTablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={filteredApplications.length}
              onPageChange={setCurrentPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { applicationService } from "../api/application.service";
import { jobService } from "../api/job.service";
import { motion } from "framer-motion";
import { Briefcase, ChevronRight, Clock, FileText, Globe, ShieldCheck } from "lucide-react";

export default function AppliedJobsPage() {
  const navigate = useNavigate();

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['myApplications'],
    queryFn: applicationService.getMyApplications,
  });

  const jobIds = Array.from(new Set(applications.map((application) => application.jobId)));
  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ['appliedJobsPage', jobIds],
    queryFn: () => jobService.getJobsByIds(jobIds),
    enabled: jobIds.length > 0,
  });

  const jobsById = new Map(jobs.filter((job) => job.id).map((job) => [job.id!, job]));

  return (
    <>
      <div className="absolute inset-0 cloud-grid opacity-[0.05] pointer-events-none" />

      <header className="p-8 lg:p-12 border-b border-brand-border bg-brand-bg/80 backdrop-blur-3xl sticky top-0 z-40">
          <div className="max-w-5xl mx-auto space-y-2">
            <div className="flex items-center gap-2 text-brand-secondary/40 font-semibold tracking-widest text-[10px]">
              <Globe className="w-3.5 h-3.5 text-brand-primary" /> Application registry
            </div>
            <h1 className="text-5xl font-bold tracking-tighter text-brand-secondary leading-[0.9]">Applied jobs</h1>
            <p className="text-brand-muted font-medium text-lg opacity-60">Review every job you have already applied for.</p>
          </div>
        </header>

        <main className="max-w-5xl mx-auto p-8 lg:p-12 w-full space-y-8 relative z-10 pb-32 md:pb-12">
          {isLoading || jobsLoading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-6">
              <div className="w-16 h-16 border-4 border-brand-primary border-t-brand-secondary rounded-full animate-spin" />
              <p className="text-brand-muted font-semibold tracking-widest text-[10px] animate-pulse">Loading applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-32 bg-white border border-dashed border-brand-border rounded-[3rem] space-y-6 shadow-inner">
              <div className="w-20 h-20 bg-brand-bg rounded-full flex items-center justify-center mx-auto opacity-30">
                <Briefcase className="w-10 h-10 text-brand-secondary" />
              </div>
              <div className="space-y-2">
                <p className="text-brand-secondary font-semibold text-xl tracking-tight">No applied jobs yet</p>
                <p className="text-brand-muted font-medium">Once you apply, your submitted jobs will appear here.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {applications.map((application, index) => {
                const job = jobsById.get(application.jobId);

                return (
                  <motion.div
                    key={application.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white border border-brand-border p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:border-brand-primary transition-all group"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-brand-secondary tracking-tight">
                          {job?.title || `Job ${application.jobId.substring(0, 8)}`}
                        </h3>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-primary/70">
                          {job?.industry || 'Industry unavailable'}
                        </p>
                        <p className="text-sm text-brand-muted font-medium">
                          {job?.city || job?.address || job?.location || 'Location unavailable'}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="px-4 py-2 rounded-xl text-[10px] font-semibold tracking-widest border bg-brand-primary/10 text-brand-primary border-brand-primary/20 inline-flex items-center gap-2">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          {application.status}
                        </span>
                        <p className="mt-3 text-[10px] font-semibold tracking-widest text-brand-muted flex items-center justify-end gap-2">
                          <Clock className="w-3.5 h-3.5 text-brand-primary" />
                          {new Date(application.appliedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="bg-brand-bg/50 border border-brand-border/50 rounded-2xl p-6 mb-6">
                      <p className="text-brand-muted font-medium text-sm leading-relaxed">
                        {application.coverLetter || job?.description || "No application note provided."}
                      </p>
                    </div>

                    <button
                      onClick={() => navigate(`/job/${application.jobId}`)}
                      className="w-full flex items-center justify-between text-[10px] font-semibold text-brand-secondary/40 tracking-widest pt-4 border-t border-brand-border/50 group-hover:text-brand-secondary transition-colors"
                    >
                      View job detail
                      <div className="p-2 bg-brand-bg rounded-lg group-hover:bg-brand-secondary group-hover:text-brand-primary transition-all">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </main>
      </>
    );
}

import { useQuery } from "@tanstack/react-query";
import { applicationService } from "../api/application.service";
import { Briefcase, Clock, CheckCircle, XCircle, ChevronRight } from "lucide-react";

export default function HistoryPage() {
  const { data: applications, isLoading } = useQuery({
    queryKey: ['myApplications'],
    queryFn: applicationService.getMyApplications,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      <header className="p-8 bg-indigo-50 border-b border-slate-200">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">Work History</h1>
          <p className="text-slate-500 text-sm mt-1">Track your applications and past engagements.</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-6 space-y-4">
        {applications?.map((app) => (
          <div key={app.id} className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:border-indigo-400 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold">Job ID: {app.jobId.substring(0, 8)}...</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Applied on {new Date(app.appliedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <StatusBadge status={app.status || 'PENDING'} />
            </div>
            
            <p className="text-sm text-slate-600 line-clamp-1 mb-4">
              "{app.coverLetter}"
            </p>

            <button className="w-full flex items-center justify-between text-xs font-bold text-indigo-500 uppercase tracking-widest pt-4 border-t border-slate-100 group-hover:text-indigo-600">
              View Details
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}

        {(!applications || applications.length === 0) && (
          <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-3xl">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Clock className="w-8 h-8" />
            </div>
            <p className="text-slate-500 italic">You haven't applied for any jobs yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    PENDING: 'bg-amber-50 text-amber-600 border-amber-100',
    ACCEPTED: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    REJECTED: 'bg-rose-50 text-rose-600 border-rose-100',
  } as const;

  const icons = {
    PENDING: <Clock className="w-3 h-3" />,
    ACCEPTED: <CheckCircle className="w-3 h-3" />,
    REJECTED: <XCircle className="w-3 h-3" />,
  } as const;

  return (
    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border flex items-center gap-1 ${styles[status as keyof typeof styles] || styles.PENDING}`}>
      {icons[status as keyof typeof icons] || icons.PENDING}
      {status}
    </span>
  );
}

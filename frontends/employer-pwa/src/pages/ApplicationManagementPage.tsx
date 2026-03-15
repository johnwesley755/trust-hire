import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationService, type JobApplication } from '../api/application.service';
import { jobService } from '../api/job.service';
import { ArrowLeft, CheckCircle, XCircle, Clock, User, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ApplicationManagementPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: jobs } = useQuery({ queryKey: ['employerJobs'], queryFn: jobService.getEmployerJobs });
  const jobIds = jobs?.map(j => j.id).filter((id): id is string => !!id) || [];
  
  const { data: applications, isLoading } = useQuery({
      queryKey: ['allEmployerApplications', jobIds],
      queryFn: () => applicationService.getApplicationsByJobs(jobIds),
      enabled: jobIds.length > 0
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: JobApplication['status'] }) => 
      applicationService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allEmployerApplications'] });
    }
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-8">
      <header className="max-w-6xl mx-auto mb-12 flex items-center gap-6">
        <button onClick={() => navigate('/dashboard')} className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-100 transition-all cursor-pointer shadow-sm">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-4xl font-black tracking-tight">Manage Applications</h1>
          <p className="text-slate-500 font-medium">Review and respond to worker interest.</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        {isLoading ? (
          <div className="flex justify-center py-20 animate-pulse">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {applications?.map((app) => (
              <div key={app.id} className="p-8 rounded-3xl bg-white border border-slate-200 hover:border-indigo-400 transition-all flex flex-col md:flex-row gap-8 items-start md:items-center shadow-sm">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 text-indigo-600 shadow-sm">
                      <User className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Worker #{app.workerId.substring(0, 8)}</h3>
                      <p className="text-sm text-slate-500 font-medium flex items-center gap-2 uppercase tracking-widest">
                        <Clock className="w-3 h-3" /> Applied {new Date(app.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 italic text-slate-600 relative">
                    <FileText className="absolute top-4 right-4 w-5 h-5 text-slate-200" />
                    <p className="line-clamp-3">"{app.coverLetter || "No cover letter provided."}"</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="flex flex-col gap-2 w-full">
                    <span className={`px-4 py-2 rounded-xl text-center text-xs font-black uppercase tracking-widest border ${
                      app.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                      app.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                      'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      {app.status}
                    </span>
                    
                    {app.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => mutation.mutate({ id: app.id!, status: 'ACCEPTED' })}
                          className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/10"
                        >
                          <CheckCircle className="w-4 h-4" /> Accept
                        </button>
                        <button 
                          onClick={() => mutation.mutate({ id: app.id!, status: 'REJECTED' })}
                          className="flex-1 py-3 bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 text-slate-600 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {(!applications || applications.length === 0) && (
                <div className="text-center py-24 bg-white rounded-[40px] border border-dashed border-slate-200 space-y-4">
                    <p className="text-slate-400 italic text-xl">No applications to manage yet.</p>
                </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

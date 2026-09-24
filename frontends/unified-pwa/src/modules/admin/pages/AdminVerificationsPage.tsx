import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService, type VerificationItem } from '../../../services/admin.service';
import { 
  FileCheck2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye, 
  Loader2, 
  X,
  ExternalLink,
  ShieldCheck,
  Search
} from 'lucide-react';
import { toast } from 'sonner';

export const AdminVerificationsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [activePreviewDoc, setActivePreviewDoc] = useState<string | null>(null);
  const [rejectModalItem, setRejectModalItem] = useState<VerificationItem | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const { data: verifications = [], isLoading } = useQuery({
    queryKey: ['adminVerifications', selectedStatus],
    queryFn: () => adminService.getVerifications(selectedStatus),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, failureReason }: { id: string; status: 'VERIFIED' | 'REJECTED'; failureReason?: string }) =>
      adminService.updateVerificationStatus(id, status, failureReason),
    onSuccess: (_, variables) => {
      toast.success(`Verification marked as ${variables.status.toLowerCase()}`);
      setRejectModalItem(null);
      setRejectReason('');
      queryClient.invalidateQueries({ queryKey: ['adminVerifications'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    }
  });

  const handleApprove = (id: string) => {
    updateStatusMutation.mutate({ id, status: 'VERIFIED' });
  };

  const handleConfirmReject = () => {
    if (!rejectModalItem) return;
    updateStatusMutation.mutate({
      id: rejectModalItem.id,
      status: 'REJECTED',
      failureReason: rejectReason || 'Document could not be verified.'
    });
  };

  const statusTabs = [
    { label: 'All Records', value: 'ALL' },
    { label: 'Pending Review', value: 'PENDING' },
    { label: 'Verified', value: 'VERIFIED' },
    { label: 'Rejected', value: 'REJECTED' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0A1931] tracking-tight">Identity & Document Verifications</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Review government IDs, Aadhaar documents, and live face verification records.</p>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelectedStatus(tab.value)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedStatus === tab.value
                ? 'bg-[#0066FF] text-white shadow-xs shadow-blue-500/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#0066FF] animate-spin" />
        </div>
      ) : verifications.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
          <FileCheck2 className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">No verification records found</h3>
          <p className="text-xs text-slate-400 mt-1">No submissions match the selected status filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {verifications.map((item) => (
            <div 
              key={item.id}
              className="bg-white border border-slate-200/80 rounded-3xl p-5 flex flex-col justify-between space-y-4 shadow-xs hover:border-slate-300 transition-all relative overflow-hidden"
            >
              {/* Header inside Card */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-[#0066FF] font-black flex items-center justify-center text-sm">
                    {item.userName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0A1931]">{item.userName}</h3>
                    <p className="text-[11px] text-slate-500 truncate max-w-[160px]">{item.userEmail || item.userPhone || 'User'}</p>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                  item.status === 'VERIFIED' || item.status === 'APPROVED'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : item.status === 'REJECTED'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {item.status}
                </span>
              </div>

              {/* Document Previews */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block mb-1.5 uppercase">ID Document</span>
                  {item.docImageUrl ? (
                    <div 
                      onClick={() => setActivePreviewDoc(item.docImageUrl!)}
                      className="relative group h-24 rounded-xl overflow-hidden bg-white border border-slate-200 cursor-pointer shadow-xs"
                    >
                      <img src={item.docImageUrl} alt="ID Document" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Eye className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="h-24 rounded-xl bg-slate-100/70 border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400 font-bold">
                      Not Uploaded
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-500 block mb-1.5 uppercase">Live Selfie</span>
                  {item.liveImageUrl ? (
                    <div 
                      onClick={() => setActivePreviewDoc(item.liveImageUrl!)}
                      className="relative group h-24 rounded-xl overflow-hidden bg-white border border-slate-200 cursor-pointer shadow-xs"
                    >
                      <img src={item.liveImageUrl} alt="Live Selfie" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Eye className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="h-24 rounded-xl bg-slate-100/70 border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400 font-bold">
                      Not Provided
                    </div>
                  )}
                </div>
              </div>

              {/* Failure reason if rejected */}
              {item.failureReason && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-700 font-medium">
                  <strong>Reason:</strong> {item.failureReason}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleApprove(item.id)}
                  disabled={updateStatusMutation.isPending || item.status === 'VERIFIED'}
                  className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{item.status === 'VERIFIED' ? 'Approved' : 'Approve'}</span>
                </button>
                <button
                  onClick={() => setRejectModalItem(item)}
                  disabled={updateStatusMutation.isPending || item.status === 'REJECTED'}
                  className="flex-1 py-2 px-3 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 disabled:opacity-40 text-slate-700 hover:text-rose-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Preview Modal */}
      {activePreviewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative max-w-2xl w-full bg-white rounded-3xl p-4 border border-slate-200 overflow-hidden shadow-2xl flex flex-col items-center">
            <button
              onClick={() => setActivePreviewDoc(null)}
              className="absolute top-3 right-3 p-2 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-full cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={activePreviewDoc} alt="Document Preview" className="max-h-[75vh] w-auto object-contain rounded-2xl" />
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#0A1931]">Reject Verification</h3>
              <button 
                onClick={() => setRejectModalItem(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Provide feedback to <strong>{rejectModalItem.userName}</strong> regarding why this submission was rejected.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Document image is blurry, name mismatch, or expired ID."
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 focus:border-rose-500 focus:bg-white rounded-xl p-3 text-xs text-slate-900 placeholder:text-slate-400 outline-none"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectModalItem(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={updateStatusMutation.isPending}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


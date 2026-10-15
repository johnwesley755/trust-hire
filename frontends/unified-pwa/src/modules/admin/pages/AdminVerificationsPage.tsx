import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService, type VerificationItem } from '../../../services/admin.service';
import { 
  FileCheck2, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Loader2, 
  X,
  ShieldCheck,
  Search,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { AppLoader } from '../../../components/common/AppLoader';

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
    <div className="space-y-6 font-['Onest',system-ui,sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-medium uppercase text-[#717784] mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563c9]" />
            <span>Compliance & Trust</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-medium text-[#0a0a0a] tracking-tight">
            Identity & Document Verifications
          </h1>
          <p className="text-xs sm:text-sm text-[#717784] mt-1 leading-relaxed">
            Review government IDs, biometric records, and credential authenticity for verified portal access.
          </p>
        </div>
      </div>

      {/* Tabs Filter (Segmented Pills) */}
      <div className="inline-flex p-1 rounded-full bg-[#f4f4f4] border border-[#e6e8ec] overflow-x-auto max-w-full">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelectedStatus(tab.value)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              selectedStatus === tab.value
                ? 'bg-[#0f2f63] text-white shadow-xs'
                : 'text-[#717784] hover:text-[#0a0a0a]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      {isLoading ? (
        <AppLoader variant="page" message="Loading identity verifications..." />
      ) : verifications.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#e6e8ec] shadow-xs">
          <FileCheck2 className="w-10 h-10 text-[#9ea3ae] mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-[#0a0a0a]">No verification records found</h3>
          <p className="text-xs text-[#717784] mt-1">No submissions match the selected status filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {verifications.map((item) => (
            <div 
              key={item.id}
              className="bg-white border border-[#e6e8ec] rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xs hover:border-[#0f2f63]/30 transition-all relative overflow-hidden"
            >
              {/* Header inside Card */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-[#0f2f63] font-bold flex items-center justify-center text-sm shrink-0">
                    {item.userName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#0a0a0a]">{item.userName}</h3>
                    <p className="text-[11px] text-[#717784] truncate max-w-[160px]">{item.userEmail || item.userPhone || 'Registered User'}</p>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                  item.status === 'VERIFIED' || item.status === 'APPROVED'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : item.status === 'REJECTED'
                    ? 'bg-rose-50 text-rose-800 border border-rose-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  {item.status}
                </span>
              </div>

              {/* Document Previews */}
              <div className="grid grid-cols-2 gap-2 bg-[#f8fafc] p-3 rounded-xl border border-[#e6e8ec]">
                <div>
                  <span className="text-[10px] font-semibold text-[#717784] block mb-1.5 uppercase tracking-wider">ID Document</span>
                  {item.docImageUrl ? (
                    <div 
                      onClick={() => setActivePreviewDoc(item.docImageUrl!)}
                      className="relative group h-24 rounded-lg overflow-hidden bg-white border border-[#e6e8ec] cursor-pointer shadow-2xs"
                    >
                      <img src={item.docImageUrl} alt="ID Document" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-[#0f2f63]/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Eye className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="h-24 rounded-lg bg-[#f4f4f4] border border-dashed border-[#e6e8ec] flex items-center justify-center text-[10px] text-[#9ea3ae] font-medium text-center p-2">
                      Not Uploaded
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-semibold text-[#717784] block mb-1.5 uppercase tracking-wider">Live Selfie</span>
                  {item.liveImageUrl ? (
                    <div 
                      onClick={() => setActivePreviewDoc(item.liveImageUrl!)}
                      className="relative group h-24 rounded-lg overflow-hidden bg-white border border-[#e6e8ec] cursor-pointer shadow-2xs"
                    >
                      <img src={item.liveImageUrl} alt="Live Selfie" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-[#0f2f63]/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Eye className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="h-24 rounded-lg bg-[#f4f4f4] border border-dashed border-[#e6e8ec] flex items-center justify-center text-[10px] text-[#9ea3ae] font-medium text-center p-2">
                      Not Provided
                    </div>
                  )}
                </div>
              </div>

              {/* Failure reason if rejected */}
              {item.failureReason && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-800 font-medium">
                  <strong>Reason:</strong> {item.failureReason}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#e6e8ec]">
                <button
                  onClick={() => handleApprove(item.id)}
                  disabled={updateStatusMutation.isPending || item.status === 'VERIFIED'}
                  className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-full text-xs font-medium uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{item.status === 'VERIFIED' ? 'Approved' : 'Approve'}</span>
                </button>
                <button
                  onClick={() => setRejectModalItem(item)}
                  disabled={updateStatusMutation.isPending || item.status === 'REJECTED'}
                  className="flex-1 py-2 px-3 bg-white hover:bg-rose-50 border border-[#e6e8ec] hover:border-rose-200 disabled:opacity-40 text-[#717784] hover:text-rose-600 rounded-full text-xs font-medium uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
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
          <div className="relative max-w-2xl w-full bg-white rounded-2xl p-4 border border-[#e6e8ec] overflow-hidden shadow-2xl flex flex-col items-center">
            <button
              onClick={() => setActivePreviewDoc(null)}
              className="absolute top-3 right-3 p-2 text-[#717784] hover:text-[#0a0a0a] bg-[#f4f4f4] hover:bg-[#e6e8ec] rounded-full cursor-pointer z-10"
            >
              <X className="w-4 h-4" />
            </button>
            <img src={activePreviewDoc} alt="Document Preview" className="max-h-[75vh] w-auto object-contain rounded-xl" />
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-[#e6e8ec] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-[#e6e8ec]">
              <h3 className="text-base font-semibold text-[#0a0a0a]">Reject Verification</h3>
              <button 
                onClick={() => setRejectModalItem(null)}
                className="text-[#717784] hover:text-[#0a0a0a] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#717784]">
              Provide feedback to <strong className="text-[#0a0a0a]">{rejectModalItem.userName}</strong> regarding why this submission was rejected.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Document image is blurry, name mismatch, or expired ID."
              rows={3}
              className="w-full bg-[#f4f4f4]/60 hover:bg-[#f4f4f4] focus:bg-white border border-[#e6e8ec] focus:border-rose-500 rounded-xl p-3 text-xs text-[#0a0a0a] placeholder:text-[#9ea3ae] outline-hidden"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectModalItem(null)}
                className="px-4 py-2 bg-[#f4f4f4] hover:bg-[#e6e8ec] text-[#717784] rounded-full text-xs font-medium uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={updateStatusMutation.isPending}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-medium uppercase tracking-wider cursor-pointer shadow-xs"
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

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { searchAlertService, type SearchAlert } from '../../../../services/searchAlert.service';
import { 
  X, 
  Bell, 
  BellOff, 
  Trash2, 
  MapPin, 
  Briefcase, 
  Search, 
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { AppLoader } from '../../../../components/common/AppLoader';

interface ManageAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alertType?: 'JOB_ALERT' | 'CANDIDATE_ALERT';
}

export const ManageAlertsModal: React.FC<ManageAlertsModalProps> = ({
  isOpen,
  onClose,
  alertType = 'JOB_ALERT'
}) => {
  const queryClient = useQueryClient();

  const { data: alerts = [], isLoading, refetch } = useQuery<SearchAlert[]>({
    queryKey: ['searchAlerts', alertType],
    queryFn: () => searchAlertService.getMyAlerts(alertType),
    enabled: isOpen
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      searchAlertService.toggleAlert(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['searchAlerts'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => searchAlertService.deleteAlert(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['searchAlerts'] });
    }
  });

  if (!isOpen) return null;

  const isJobAlert = alertType === 'JOB_ALERT';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-['Onest',system-ui,sans-serif] animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#e6e8ec] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-[#0f2f63] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-white">
              <Bell className="w-5 h-5 text-[#5790e6]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">
                {isJobAlert ? 'My Job Alerts' : 'My Talent Alerts'}
              </h2>
              <p className="text-xs text-white/70">
                {isJobAlert 
                  ? 'Receive instant alerts when matching jobs are posted by verified employers.'
                  : 'Get notified when new verified specialists in your required trades become available.'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Alerts List Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {isLoading ? (
            <div className="py-12 flex items-center justify-center">
              <AppLoader message="Loading your alerts..." />
            </div>
          ) : alerts.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#f4f4f4] flex items-center justify-center text-[#717784]">
                <BellOff className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#0a0a0a]">No saved search alerts yet</h3>
              <p className="text-xs text-[#717784] max-w-xs mx-auto">
                {isJobAlert 
                  ? 'Search for jobs by title, city, or trade and tap "Subscribe to Alerts" to get notified automatically.'
                  : 'Search for verified workers by skills and location and save search alerts.'}
              </p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div 
                key={alert.id}
                className={`p-4 rounded-2xl border transition-all space-y-3 ${
                  alert.is_active 
                    ? 'bg-white border-[#e6e8ec] shadow-xs' 
                    : 'bg-[#fafafa] border-[#ebecef] opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#0a0a0a]">
                        {alert.title}
                      </h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        alert.is_active 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                      }`}>
                        {alert.is_active ? 'Active' : 'Paused'}
                      </span>
                    </div>

                    {/* Criteria Tags */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {alert.city && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#717784] bg-[#f4f4f4] px-2 py-0.5 rounded-md">
                          <MapPin className="w-3 h-3 text-[#2563c9]" />
                          {alert.city}
                        </span>
                      )}
                      {alert.category && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#717784] bg-[#f4f4f4] px-2 py-0.5 rounded-md">
                          <Briefcase className="w-3 h-3 text-[#2563c9]" />
                          {alert.category}
                        </span>
                      )}
                      {alert.query && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#717784] bg-[#f4f4f4] px-2 py-0.5 rounded-md">
                          <Search className="w-3 h-3 text-[#2563c9]" />
                          "{alert.query}"
                        </span>
                      )}
                      {alert.min_salary && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          ₹{Number(alert.min_salary).toLocaleString('en-IN')}+
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleMutation.mutate({ id: alert.id, isActive: !alert.is_active })}
                      title={alert.is_active ? 'Pause Alert' : 'Resume Alert'}
                      className="p-1.5 rounded-xl hover:bg-[#f4f4f4] text-[#717784] hover:text-[#0a0a0a] transition-all cursor-pointer"
                    >
                      {alert.is_active ? (
                        <ToggleRight className="w-6 h-6 text-emerald-600" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-zinc-400" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete alert "${alert.title}"?`)) {
                          deleteMutation.mutate(alert.id);
                        }
                      }}
                      title="Delete Alert"
                      className="p-1.5 rounded-xl hover:bg-rose-50 text-[#717784] hover:text-rose-600 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#717784] pt-1 border-t border-[#f0f0f0]">
                  <span>Frequency: {alert.frequency || 'Instant'}</span>
                  <span>Matches Triggered: {alert.match_count || 0}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f4f4f4] border-t border-[#e6e8ec] flex items-center justify-between text-xs text-[#717784]">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#2563c9]" />
            Enterprise Reverse Search Alert System
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0f2f63] hover:bg-[#183b74] text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

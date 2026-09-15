import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2, User, Briefcase, MapPin, IndianRupee, Clock, FileText } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService, type WorkerProfile } from '../../../services/profile.service';

interface EditWorkerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: WorkerProfile;
}

export const EditWorkerProfileModal: React.FC<EditWorkerProfileModalProps> = ({
  isOpen,
  onClose,
  profile
}) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    fullName: '',
    skills: '',
    experienceYears: 0,
    hourlyRate: 0,
    city: '',
    address: '',
    bio: ''
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        skills: profile.skills || '',
        experienceYears: profile.experienceYears || 0,
        hourlyRate: profile.hourlyRate || 0,
        city: profile.city || profile.location || '',
        address: profile.address || '',
        bio: profile.bio || ''
      });
    }
  }, [profile, isOpen]);

  const mutation = useMutation({
    mutationFn: (updates: Partial<WorkerProfile>) => profileService.updateWorkerProfile(updates),
    onSuccess: (updatedData) => {
      // Live patch without triggering GET network refetch
      queryClient.setQueryData<WorkerProfile>(['workerProfile'], (old) => ({
        ...(old || {} as WorkerProfile),
        ...formData,
        ...(updatedData || {})
      }));
      queryClient.setQueryData(['profile'], (old: any) => ({
        ...(old || {}),
        ...formData,
        ...(updatedData || {})
      }));
      onClose();
    },
    onError: (err: any) => {
      setErrorMsg(err?.response?.data?.message || err?.message || 'Failed to update profile');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    mutation.mutate({
      fullName: formData.fullName,
      skills: formData.skills,
      experienceYears: Number(formData.experienceYears),
      hourlyRate: Number(formData.hourlyRate),
      city: formData.city,
      location: formData.city,
      address: formData.address,
      bio: formData.bio
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
            <div>
              <h2 className="text-lg font-bold text-[#0A1931]">Edit Worker Profile</h2>
              <p className="text-xs text-slate-500 font-medium">Update your trade skills, hourly rate, and experience.</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {errorMsg && (
              <div className="p-3 text-xs font-semibold text-red-700 bg-red-50 rounded-xl border border-red-200">
                {errorMsg}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#0066FF]" /> Full Name
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0066FF] focus:bg-white transition-all font-medium text-[#0A1931]"
                placeholder="e.g. Ramesh Kumar"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[#0066FF]" /> Skills & Trades (comma separated)
              </label>
              <input
                type="text"
                required
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0066FF] focus:bg-white transition-all font-medium text-[#0A1931]"
                placeholder="e.g. Electrician, Wiring, Solar Installation"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#0066FF]" /> Experience (Years)
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={formData.experienceYears}
                  onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0066FF] focus:bg-white transition-all font-medium text-[#0A1931]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-[#0066FF]" /> Hourly Rate (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0066FF] focus:bg-white transition-all font-medium text-[#0A1931]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0066FF]" /> City / Region
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0066FF] focus:bg-white transition-all font-medium text-[#0A1931]"
                  placeholder="e.g. Chennai, Bangalore"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> Locality / Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0066FF] focus:bg-white transition-all font-medium text-[#0A1931]"
                  placeholder="e.g. Velachery Main Road"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#0066FF]" /> Professional Bio
              </label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0066FF] focus:bg-white transition-all font-medium text-[#0A1931] resize-none"
                placeholder="Brief summary of your trade background and specialties..."
              />
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="px-5 py-2.5 bg-[#0066FF] hover:bg-[#0052cc] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" /> Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

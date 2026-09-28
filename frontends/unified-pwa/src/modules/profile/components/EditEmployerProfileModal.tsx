import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2, Building2, Briefcase, Globe, MapPin, FileText, Camera, UploadCloud, CheckCircle2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService, type EmployerProfile } from '../../../services/profile.service';
import { useAuth, useUser } from '../../../providers/AuthContext';
import { queryKeys } from '../../../lib/queryKeys';

interface EditEmployerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: EmployerProfile;
}

export const EditEmployerProfileModal: React.FC<EditEmployerProfileModalProps> = ({
  isOpen,
  onClose,
  profile
}) => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string>('');
  const [isProcessingLogo, setIsProcessingLogo] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    companyWebsite: '',
    profileBio: '',
    city: '',
    address: ''
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setProfileImageUrl(profile.profileImageUrl || (profile as any).profile_image_url || user?.profileImageUrl || '');
      setFormData({
        companyName: profile.companyName || '',
        industry: profile.industry || '',
        companyWebsite: profile.companyWebsite || '',
        profileBio: profile.profileBio || '',
        city: profile.city || profile.location || '',
        address: profile.address || ''
      });
    }
  }, [profile, isOpen, user]);

  const handleModalLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg("Please select an image file (PNG, JPG, JPEG, WEBP).");
      return;
    }

    setIsProcessingLogo(true);
    setErrorMsg(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          setProfileImageUrl(canvas.toDataURL('image/jpeg', 0.85));
        } else {
          setProfileImageUrl(event.target?.result as string);
        }
        setIsProcessingLogo(false);
      };
      img.onerror = () => {
        setErrorMsg("Failed to process image.");
        setIsProcessingLogo(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const mutation = useMutation({
    mutationFn: (updates: Partial<EmployerProfile>) => profileService.updateEmployerProfile(updates),
    onSuccess: (updatedData) => {
      if (profileImageUrl) {
        updateUser({
          ...user,
          profileImageUrl: profileImageUrl,
          profile_image_url: profileImageUrl
        });
      }
      // Live patch without triggering GET network refetch
      queryClient.setQueryData(queryKeys.employer.profile, (old: any) => ({
        ...(old || {}),
        ...formData,
        profileImageUrl,
        profile_image_url: profileImageUrl,
        ...(updatedData || {})
      }));
      queryClient.invalidateQueries({ queryKey: queryKeys.employer.profile });
      onClose();
    },
    onError: (err: any) => {
      setErrorMsg(err?.response?.data?.message || err?.message || 'Failed to update employer profile');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    mutation.mutate({
      companyName: formData.companyName,
      profileImageUrl: profileImageUrl || undefined,
      profile_image_url: profileImageUrl || undefined,
      industry: formData.industry,
      companyWebsite: formData.companyWebsite,
      profileBio: formData.profileBio,
      city: formData.city,
      location: formData.city,
      address: formData.address
    } as any);
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
              <h2 className="text-lg font-bold text-[#0A1931]">Edit Employer Profile</h2>
              <p className="text-xs text-slate-500 font-medium">Update your company details, logo, industry, and address.</p>
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

            {/* Company Logo Section */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-4">
              <input 
                type="file"
                ref={fileInputRef}
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleModalLogoUpload}
                className="hidden"
              />

              <div className="w-16 h-16 bg-white flex items-center justify-center rounded-2xl border border-slate-200 overflow-hidden shrink-0 shadow-2xs">
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt="Company Logo" className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="w-8 h-8 text-slate-300" />
                )}
              </div>

              <div className="flex-1 space-y-1">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#0066FF]" />
                  Company Logo
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessingLogo}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
                  >
                    {isProcessingLogo ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin text-[#0066FF]" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-3 h-3 text-[#0066FF]" />
                        <span>{profileImageUrl ? "Change Logo" : "Upload Logo"}</span>
                      </>
                    )}
                  </button>
                  {profileImageUrl && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Attached
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#0066FF]" /> Company Name
              </label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0066FF] focus:bg-white transition-all font-medium text-[#0A1931]"
                placeholder="e.g. Apex Infrastructure Ltd."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#0066FF]" /> Industry Sector
                </label>
                <input
                  type="text"
                  required
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0066FF] focus:bg-white transition-all font-medium text-[#0A1931]"
                  placeholder="e.g. Construction & Heavy Industry"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#0066FF]" /> Website
                </label>
                <input
                  type="text"
                  value={formData.companyWebsite}
                  onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0066FF] focus:bg-white transition-all font-medium text-[#0A1931]"
                  placeholder="https://company.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0066FF]" /> City / Hub
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0066FF] focus:bg-white transition-all font-medium text-[#0A1931]"
                  placeholder="e.g. Mumbai, Bengaluru"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> Operational Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0066FF] focus:bg-white transition-all font-medium text-[#0A1931]"
                  placeholder="e.g. Industrial Area Phase 2"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#0066FF]" /> Company Overview / Bio
              </label>
              <textarea
                rows={3}
                value={formData.profileBio}
                onChange={(e) => setFormData({ ...formData, profileBio: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0066FF] focus:bg-white transition-all font-medium text-[#0A1931] resize-none"
                placeholder="Tell potential candidates about your company and work culture..."
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

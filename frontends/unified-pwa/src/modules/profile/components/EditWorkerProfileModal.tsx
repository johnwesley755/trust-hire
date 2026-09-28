import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2, User, Briefcase, MapPin, GraduationCap, Languages, Calendar, Award, Sparkles, Camera, UploadCloud, CheckCircle2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService, type WorkerProfile } from '../../../services/profile.service';
import { queryKeys } from '../../../lib/queryKeys';
import { useAuth, useUser } from '../../../providers/AuthContext';
import { UserAvatar } from '../../../components/common/UserAvatar';

interface EditWorkerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: WorkerProfile;
}

const EDUCATION_OPTIONS = [
  "Below 10th Pass",
  "10th Pass",
  "12th Pass",
  "Diploma / ITI",
  "Graduate / Degree",
  "Post Graduate"
];

const ENGLISH_LEVELS = [
  { id: 'FLUENT', label: 'Fluent English' },
  { id: 'GOOD', label: 'Good English' },
  { id: 'BASIC', label: 'Basic English' },
  { id: 'NONE', label: 'No English' }
];

export const EditWorkerProfileModal: React.FC<EditWorkerProfileModalProps> = ({
  isOpen,
  onClose,
  profile
}) => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string>('');
  const [isProcessingPhoto, setIsProcessingPhoto] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    fullName: '',
    skills: '',
    experienceYears: 0,
    hourlyRate: 0,
    city: '',
    address: '',
    bio: '',
    dob: '',
    gender: 'MALE',
    highestEducation: '12th Pass',
    collegeName: '',
    degree: '',
    specialization: '',
    schoolMedium: '',
    englishProficiency: 'BASIC',
    languagesKnown: 'English, Hindi, Tamil',
    preferredRoles: 'Electrician, Customer Support',
    willingToRelocate: false,
    preferredCities: 'Chennai, Bangalore',
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setProfileImageUrl(profile.profileImageUrl || (profile as any).profile_image_url || (profile as any).profilePhoto || user?.profileImageUrl || '');
      setFormData({
        fullName: profile.fullName || '',
        skills: profile.skills || '',
        experienceYears: profile.experienceYears || 0,
        hourlyRate: profile.hourlyRate || 0,
        city: profile.city || profile.location || '',
        address: profile.address || '',
        bio: profile.bio || '',
        dob: profile.dob || '',
        gender: profile.gender || 'MALE',
        highestEducation: profile.highestEducation || '12th Pass',
        collegeName: profile.collegeName || '',
        degree: profile.degree || '',
        specialization: profile.specialization || '',
        schoolMedium: profile.schoolMedium || '',
        englishProficiency: profile.englishProficiency || 'BASIC',
        languagesKnown: profile.languagesKnown?.join(', ') || 'English, Hindi, Tamil',
        preferredRoles: profile.preferredRoles?.join(', ') || profile.skills || 'Electrician, Customer Support',
        willingToRelocate: Boolean(profile.willingToRelocate),
        preferredCities: profile.preferredCities?.join(', ') || 'Chennai, Bangalore',
      });
    }
  }, [profile, isOpen, user]);

  const handleModalPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg("Please select an image file (PNG, JPG, JPEG, WEBP).");
      return;
    }

    setIsProcessingPhoto(true);
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
        setIsProcessingPhoto(false);
      };
      img.onerror = () => {
        setErrorMsg("Failed to process image.");
        setIsProcessingPhoto(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const mutation = useMutation({
    mutationFn: (updates: Partial<WorkerProfile>) => profileService.updateWorkerProfile(updates),
    onSuccess: (updatedData) => {
      if (profileImageUrl) {
        updateUser({
          ...user,
          profileImageUrl: profileImageUrl,
          profile_image_url: profileImageUrl
        });
      }
      // Live patch without triggering GET network refetch
      queryClient.setQueryData(queryKeys.workers.detail('me'), (old: any) => ({
        ...(old || {}),
        ...formData,
        profileImageUrl,
        profile_image_url: profileImageUrl,
        profilePhoto: profileImageUrl,
        languagesKnown: formData.languagesKnown.split(',').map(s => s.trim()).filter(Boolean),
        preferredRoles: formData.preferredRoles.split(',').map(s => s.trim()).filter(Boolean),
        preferredCities: formData.preferredCities.split(',').map(s => s.trim()).filter(Boolean),
        ...(updatedData || {})
      }));
      queryClient.invalidateQueries({ queryKey: queryKeys.workers.detail('me') });
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
      profileImageUrl: profileImageUrl || undefined,
      profile_image_url: profileImageUrl || undefined,
      profilePhoto: profileImageUrl || undefined,
      skills: formData.skills,
      experienceYears: Number(formData.experienceYears) || 0,
      hourlyRate: Number(formData.hourlyRate) || 0,
      city: formData.city,
      location: `${formData.address ? formData.address + ', ' : ''}${formData.city}`,
      address: formData.address,
      bio: formData.bio,
      dob: formData.dob || null,
      gender: formData.gender,
      highestEducation: formData.highestEducation,
      collegeName: formData.collegeName || null,
      degree: formData.degree || null,
      specialization: formData.specialization || null,
      schoolMedium: formData.schoolMedium || null,
      englishProficiency: formData.englishProficiency,
      languagesKnown: formData.languagesKnown.split(',').map(s => s.trim()).filter(Boolean),
      preferredRoles: formData.preferredRoles.split(',').map(s => s.trim()).filter(Boolean),
      willingToRelocate: formData.willingToRelocate,
      preferredCities: formData.preferredCities.split(',').map(s => s.trim()).filter(Boolean),
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
          className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
            <div>
              <h2 className="text-lg font-black text-[#0A1931]">Edit Candidate Profile</h2>
              <p className="text-xs text-slate-500 font-medium">Update your photo, bio, education, languages, and preferred roles.</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {errorMsg && (
              <div className="p-3 text-xs font-semibold text-red-700 bg-red-50 rounded-xl border border-red-200">
                {errorMsg}
              </div>
            )}

            {/* Profile Photo Section */}
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 flex items-center gap-4">
              <input 
                type="file"
                ref={fileInputRef}
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleModalPhotoUpload}
                className="hidden"
              />

              <div className="relative group shrink-0">
                <UserAvatar 
                  src={profileImageUrl}
                  name={formData.fullName || 'Candidate'}
                  size="lg"
                />
              </div>

              <div className="flex-1 space-y-1">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#0066FF]" />
                  Profile Photo
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessingPhoto}
                    className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
                  >
                    {isProcessingPhoto ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin text-[#0066FF]" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-3 h-3 text-[#0066FF]" />
                        <span>{profileImageUrl ? "Change Photo" : "Upload Photo"}</span>
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

            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Personal Details</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#0066FF]" /> Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0066FF] focus:bg-white font-medium text-[#0A1931]"
                    placeholder="e.g. Ramesh Kumar"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#0066FF]" /> Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0066FF] focus:bg-white font-medium text-[#0A1931]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0066FF] focus:bg-white font-medium text-[#0A1931]"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#0066FF]" /> City / Town
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0066FF] focus:bg-white font-medium text-[#0A1931]"
                    placeholder="e.g. Chennai, Bangalore"
                  />
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="space-y-4 pt-3 border-t border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-[#0066FF]" /> Academic Background
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Highest Education</label>
                  <select
                    value={formData.highestEducation}
                    onChange={(e) => setFormData({ ...formData, highestEducation: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0066FF] focus:bg-white font-medium text-[#0A1931]"
                  >
                    {EDUCATION_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">College / Institution</label>
                  <input
                    type="text"
                    value={formData.collegeName}
                    onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0066FF] focus:bg-white font-medium text-[#0A1931]"
                    placeholder="e.g. Loyola College / Govt Higher Secondary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Degree / Certificate</label>
                  <input
                    type="text"
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0066FF] focus:bg-white font-medium text-[#0A1931]"
                    placeholder="e.g. B.Com, B.Sc, ITI Electrical"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Specialization / Stream</label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0066FF] focus:bg-white font-medium text-[#0A1931]"
                    placeholder="e.g. Computer Science, Accounting"
                  />
                </div>
              </div>
            </div>

            {/* Languages & Roles */}
            <div className="space-y-4 pt-3 border-t border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-[#0066FF]" /> Languages & Preferences
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">English Proficiency</label>
                  <select
                    value={formData.englishProficiency}
                    onChange={(e) => setFormData({ ...formData, englishProficiency: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0066FF] focus:bg-white font-medium text-[#0A1931]"
                  >
                    {ENGLISH_LEVELS.map((lvl) => (
                      <option key={lvl.id} value={lvl.id}>{lvl.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Languages Known (comma separated)</label>
                  <input
                    type="text"
                    value={formData.languagesKnown}
                    onChange={(e) => setFormData({ ...formData, languagesKnown: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0066FF] focus:bg-white font-medium text-[#0A1931]"
                    placeholder="e.g. English, Tamil, Hindi, Telugu"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#0066FF]" /> Preferred Job Roles (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.preferredRoles}
                  onChange={(e) => setFormData({ ...formData, preferredRoles: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0066FF] focus:bg-white font-medium text-[#0A1931]"
                  placeholder="e.g. Electrician, Customer Support, Retail Executive"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#0066FF]" /> Technical Skills & Tools (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0066FF] focus:bg-white font-medium text-[#0A1931]"
                  placeholder="e.g. Three-Phase Wiring, Solar Installation, CRM Tools"
                />
              </div>
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

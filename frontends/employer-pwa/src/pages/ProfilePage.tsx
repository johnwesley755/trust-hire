import { useState } from 'react';
import { useAuth, useUser } from "../providers/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService, type EmployerProfile } from "../api/profile.service";
import apiClient from "../api/apiClient";
import { User, Mail, MapPin, Building2, LogOut, ShieldCheck, Camera, Loader2, Globe } from "lucide-react";

export default function ProfilePage() {
  const { logout } = useAuth();
  const { user } = useUser();
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['employerProfile'],
    queryFn: profileService.getProfile,
  });

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<EmployerProfile>) => profileService.updateProfile({ ...profile!, ...updates }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employerProfile'] });
      setIsEditingLocation(false);
    }
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // 1. Upload to Media Service
      const uploadRes = await apiClient.post('/api/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const newImageUrl = uploadRes.data.url;

      // 2. Sync to Auth Service
      await apiClient.post('/api/auth/sync', { profileImageUrl: newImageUrl });

      // 3. Update localStorage and trigger re-render
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userObj = JSON.parse(storedUser);
        userObj.profileImageUrl = newImageUrl;
        localStorage.setItem('user', JSON.stringify(userObj));
        window.location.reload();
      }
    } catch (err: any) {
      console.error("Failed to upload image:", err);
      alert(err.response?.data?.message || "Failed to update profile image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <main className="flex-1 overflow-auto">
        {/* Profile Header */}
        <div className="bg-brand-bg border-b border-brand-border p-4 md:p-8 pt-8 md:pt-12">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center space-y-4">
            <div className="relative group cursor-pointer">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                title="Change Profile Photo"
              />
              {user?.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt={user.firstName || ""} 
                    className={`w-24 h-24 rounded-3xl border-4 border-white shadow-xl object-cover transition-opacity ${isUploadingImage ? 'opacity-50' : 'group-hover:opacity-75'}`}
                  />
              ) : (
                  <div className="w-24 h-24 rounded-3xl border-4 border-white shadow-xl bg-slate-100 flex items-center justify-center text-slate-400">
                    <User className="w-10 h-10" />
                  </div>
              )}
              
              <div className={`absolute inset-0 bg-slate-900/40 rounded-3xl flex items-center justify-center transition-all opacity-0 ${!isUploadingImage && 'group-hover:opacity-100'}`}>
                <Camera className="w-8 h-8 text-white" />
              </div>

              {isUploadingImage && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-3xl flex items-center justify-center z-20">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                </div>
              )}

              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-xl border-4 border-white z-20 flex items-center justify-center shadow-lg">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center gap-3 mb-1">
                <h1 className="text-4xl font-black tracking-tight text-neutral-900 uppercase">
                    {user?.firstName} {user?.lastName}
                </h1>
                <div className="bg-emerald-500 text-white p-1 rounded-lg shadow-lg shadow-emerald-500/20">
                    <ShieldCheck className="w-5 h-5" />
                </div>
              </div>
              <p className="text-brand-primary font-bold uppercase tracking-[0.2em] text-xs">Verified Enterprise Administrator</p>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-8 pb-32">
          {/* Company Info Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                Company Details
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Company Name</p>
                <p className="font-semibold text-slate-900 text-lg">{profile?.companyName || "Not Set"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Industry</p>
                <p className="font-semibold text-slate-900">{profile?.industry || "Not Set"}</p>
              </div>
              <div className="space-y-1 md:col-span-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Website</p>
                <div className="flex items-center gap-2 text-indigo-600 font-semibold underline underline-offset-4">
                  <Globe className="w-4 h-4" />
                  <a href={profile?.companyWebsite} target="_blank" rel="noreferrer">{profile?.companyWebsite || "None"}</a>
                </div>
              </div>
              <div className="space-y-1 md:col-span-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">About Company</p>
                <p className="text-slate-600 leading-relaxed font-medium">{profile?.profileBio || "No bio added yet."}</p>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-600" />
                Personal Information
              </h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                  <p className="font-semibold text-slate-900">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Work Location</p>
                  {isEditingLocation ? (
                      <div className="mt-2 flex gap-2">
                        <input 
                          type="text"
                          value={locationInput}
                          onChange={(e) => setLocationInput(e.target.value)}
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                          placeholder="Enter city, country"
                          autoFocus
                        />
                        <button 
                          onClick={() => updateMutation.mutate({ city: locationInput })}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md active:scale-95 transition-all"
                        >
                          Save
                        </button>
                      </div>
                  ) : (
                      <div className="flex items-center justify-between group">
                        <p className="font-semibold text-slate-900">
                          {profile?.city || "Location not set"}
                        </p>
                        <button 
                          onClick={() => {
                            setIsEditingLocation(true);
                            setLocationInput(profile?.city || "");
                          }}
                          className="text-xs font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Update
                        </button>
                      </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Logout Section */}
          <div className="pt-8">
            <button 
              onClick={logout}
              className="w-full bg-white border border-red-100 text-red-600 py-4 rounded-3xl font-black shadow-sm hover:bg-red-50 transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
            >
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Sign Out
            </button>
            <p className="text-center text-slate-400 text-xs mt-6 font-bold tracking-widest uppercase">
              TrustHire Enterprise v1.0.0
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

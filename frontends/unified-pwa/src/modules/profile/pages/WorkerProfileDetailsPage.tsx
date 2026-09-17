import { useEffect, useState } from "react";
import { useAuth, useUser } from "../../../providers/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOutletContext, Link } from "react-router-dom";
import { profileService, type WorkerProfile } from "../../../services/profile.service";
import { applicationService } from "../../../services/application.service";
import { queryKeys } from "../../../lib/queryKeys";
import { NotificationCenter } from '../../dashboard/components/NotificationCenter';
import apiClient from "../../../api/apiClient";
import { UserAvatar } from "../../../components/common/UserAvatar";
import { ShieldCheck, Award, MapPin, MapPinned, Star, History, Camera, Edit2, CheckCircle2, ArrowRight, Zap } from "lucide-react";
import { EditWorkerProfileModal } from "../components/EditWorkerProfileModal";

export default function WorkerProfileDetailsPage() {
  const { logout } = useAuth();
  const { user } = useUser();
  const outletCtx = useOutletContext<{ setIsSidebarOpen?: (open: boolean) => void }>() || {};
  const setIsSidebarOpen = outletCtx?.setIsSidebarOpen || (() => {});
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  const { data: profile } = useQuery<WorkerProfile | null>({
    queryKey: queryKeys.workers.detail('me'),
    queryFn: profileService.getWorkerProfile,
  });

  const { data: myApplications = [] } = useQuery({
    queryKey: queryKeys.jobs.myApplications,
    queryFn: applicationService.getMyApplications,
  });

  const handleUpdateGPSLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setLocationStatus("Detecting GPS coordinates...");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          let detectedCity = profile?.city || 'Local area';
          let detectedAddress = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

          try {
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
            if (geoRes.ok) {
              const geoData = await geoRes.json();
              const addr = geoData.address;
              detectedCity = addr.city || addr.town || addr.suburb || addr.state_district || detectedCity;
              detectedAddress = [addr.suburb || addr.neighbourhood, detectedCity].filter(Boolean).join(', ');
            }
          } catch {
            // fallback
          }

          await profileService.updateProfile({
            latitude,
            longitude,
            city: detectedCity,
            address: detectedAddress,
            location: detectedAddress,
          });

          queryClient.setQueryData(['workerProfile'], (old: any) => ({
            ...(old || {}),
            latitude,
            longitude,
            city: detectedCity,
            address: detectedAddress,
            location: detectedAddress,
          }));

          setLocationStatus(`Live: ${detectedAddress}`);
        } catch (err: any) {
          console.error("GPS update error:", err);
          setLocationStatus("Failed to update profile location");
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.warn("GPS error:", err);
        setIsLocating(false);
        setLocationStatus("GPS access denied");
        alert("Please enable location access in your browser settings to match nearby shifts.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const isVerified = Boolean(user?.identityVerified || (user as any)?.isVerified || (profile as any)?.is_verified || (profile as any)?.isVerified);
  const completedJobsCount = (profile as any)?.completed_jobs || (profile as any)?.completedJobs || myApplications.filter((a: any) => a.status === 'ACCEPTED' || a.status === 'COMPLETED').length;
  const ratingDisplay = (profile as any)?.rating ? Number((profile as any).rating).toFixed(1) : (profile?.trustScore ? `${(profile.trustScore / 200).toFixed(1)}` : 'New');

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* MOBILE HEADER */}
      <header className="lg:hidden bg-white sticky top-0 z-50 border-b border-slate-200 shadow-sm">
        <div className="flex justify-between items-center px-4 py-3">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="text-[#0A1931] hover:bg-slate-100 p-2 rounded-full active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">menu</span>
            </button>
            <h1 className="text-lg font-black text-[#0A1931] tracking-tight">TrustHyre</h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-full transition-all cursor-pointer"
              title="Edit Profile"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <NotificationCenter />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10 space-y-6">
        
        {/* Page Header (Desktop) */}
        <div className="hidden lg:flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-black text-[#0A1931] tracking-tight">Worker Dossier</h1>
            <p className="text-slate-500 font-medium text-sm mt-1">Manage your identity, skills, and shift history.</p>
          </div>
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-bold shadow-xs transition-all text-xs cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit Profile
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* LEFT COLUMN: Identity & Trust Score */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Identity Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0066FF]/5 rounded-bl-[100px]"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="relative mb-4 group cursor-pointer">
                  <UserAvatar 
                    src={profile?.profileImageUrl || user?.profileImageUrl} 
                    name={profile?.fullName || user?.firstName} 
                    size="xl" 
                  />
                  <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#0066FF] rounded-full border-2 border-white flex items-center justify-center shadow-md">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                </div>

                <h2 className="text-xl font-black text-[#0A1931]">{profile?.fullName || user?.firstName || 'Worker'}</h2>
                <p className="text-slate-500 font-medium text-sm mt-0.5">{profile?.skills?.split(',')[0] || 'Specialist'}</p>

                <div className={`mt-4 flex items-center gap-1.5 px-3 py-1 rounded-full border ${
                  isVerified ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-xs font-bold">{isVerified ? 'Aadhaar Verified' : 'Unverified Worker'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-100">
                <div className="text-center">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Jobs Done</p>
                  <p className="text-xl font-black text-[#0A1931] mt-1">{completedJobsCount}</p>
                </div>
                <div className="text-center border-l border-slate-100">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Rating</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <span className="text-xl font-black text-[#0A1931]">{ratingDisplay}</span>
                    <Star className="w-4 h-4 text-[#FACD15] fill-[#FACD15]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <MapPinned className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0A1931]">Work Location</h3>
                  <p className="text-xs text-slate-500 font-medium">Matching area</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#0066FF] mt-0.5 shrink-0" />
                <p className="text-sm font-semibold text-slate-700">
                  {profile?.address || profile?.city || profile?.location || 'Location not set'}
                </p>
              </div>
              {profile?.latitude && profile?.longitude && (
                <p className="text-[11px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  GPS Live ({profile.latitude.toFixed(2)}°, {profile.longitude.toFixed(2)}°)
                </p>
              )}
              {locationStatus && (
                <p className="text-xs font-semibold text-blue-600 mt-2">{locationStatus}</p>
              )}
              <button 
                onClick={handleUpdateGPSLocation}
                disabled={isLocating}
                className="mt-4 w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-[#0066FF] font-bold text-sm rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <MapPin className="w-4 h-4" />
                {isLocating ? 'Detecting Location...' : 'Update GPS Location'}
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN: Expertise & History */}
          <div className="lg:col-span-2 space-y-6">

            {/* Expertise & Skills */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-lg font-black text-[#0A1931] mb-5 flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#0066FF]" /> Verified Expertise
              </h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {profile?.skills?.split(',').map((skill, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                    <span className="font-bold text-[#0A1931]">{skill.trim()}</span>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                )) || (
                  <div className="col-span-2 text-center py-8 text-slate-500">
                    No skills added yet.
                  </div>
                )}
              </div>
            </div>

            {/* Recent Shift History */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-black text-[#0A1931] flex items-center gap-2">
                  <History className="w-5 h-5 text-[#0A1931]" /> Shift History
                </h3>
                <Link to="/applied-jobs" className="text-sm font-bold text-[#0066FF] hover:underline">View All</Link>
              </div>
              
              <div className="divide-y divide-slate-100">
                {myApplications.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    <History className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-[#0A1931]">No shift history yet</p>
                    <p className="text-xs text-slate-500 mt-1">Browse available openings to start working and earning.</p>
                    <Link to="/search" className="inline-block mt-4 px-4 py-2 bg-[#0066FF] text-white text-xs font-bold rounded-xl hover:bg-blue-700">
                      Find Shifts
                    </Link>
                  </div>
                ) : (
                  myApplications.slice(0, 5).map((app: any) => (
                    <div key={app.id} className="p-4 sm:p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center font-bold text-[#0066FF] shrink-0">
                          <Zap className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#0A1931]">{app.job?.title || app.jobTitle || 'Shift'}</h4>
                          <p className="text-sm text-slate-500 mt-0.5">
                            {app.job?.location || app.job?.city || 'Local area'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right w-full sm:w-auto flex flex-row sm:flex-col justify-between sm:justify-end items-center sm:items-end">
                        <span className="font-black text-emerald-600">₹{app.job?.budget?.toLocaleString() || 'Negotiated'}</span>
                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded mt-1 ${
                          app.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                          app.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      <EditWorkerProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile || undefined}
      />
    </div>
  );
}

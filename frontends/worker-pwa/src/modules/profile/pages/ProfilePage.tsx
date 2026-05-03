import { useEffect, useState } from "react";
import { useAuth, useUser } from "../../../providers/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOutletContext, Link } from "react-router-dom";
import { profileService, type WorkerProfile } from "../../../services/profile.service";
import { NotificationCenter } from '../../dashboard/components/NotificationCenter';
import apiClient from "../../../api/apiClient";
import { ProfileHeroCard } from "../components/ProfileHeroCard";
import { ProfileStatsCard } from "../components/ProfileStatsCard";
import { ProfileDetailsForm } from "../components/ProfileDetailsForm";
import { ExpertiseMatrix } from "../components/ExpertiseMatrix";
import { ProfileSideActions } from "../components/ProfileSideActions";
import { LevelProgressCard } from "../components/LevelProgressCard";

export default function ProfilePage() {
  const { logout } = useAuth();
  const { user } = useUser();
  const { setIsSidebarOpen } = useOutletContext<{ setIsSidebarOpen: (open: boolean) => void }>();
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [isMobileEditing, setIsMobileEditing] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    bio: "",
    skills: "",
    experienceYears: "",
    hourlyRate: "",
    address: "",
    city: "",
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
  });
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ['workerProfile'],
    queryFn: profileService.getProfile,
  });

  useEffect(() => {
    if (!profile) return;
    setProfileForm({
      fullName: profile.fullName || `${user?.first_name || ''} ${user?.last_name || ''}`.trim(),
      bio: profile.bio || "",
      skills: profile.skills || "",
      experienceYears: profile.experienceYears?.toString() || "",
      hourlyRate: profile.hourlyRate?.toString() || "",
      address: profile.address || "",
      city: profile.city || "",
      latitude: profile.latitude,
      longitude: profile.longitude,
    });
  }, [profile, user]);

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<WorkerProfile>) => profileService.updateProfile({ ...profile!, ...updates }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workerProfile'] });
      setIsEditingLocation(false);
      setIsMobileEditing(false);
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
      const uploadRes = await apiClient.post('/api/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const newImageUrl = uploadRes.data.url;
      await apiClient.post('/api/auth/sync', { profile_image_url: newImageUrl });

      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userObj = JSON.parse(storedUser);
        userObj.profile_image_url = newImageUrl;
        localStorage.setItem('user', JSON.stringify(userObj));
      }
      queryClient.invalidateQueries({ queryKey: ['workerProfile'] });
      window.location.reload();
    } catch (err: any) {
      console.error("Failed to upload image:", err);
      alert(err.response?.data?.message || "Failed to update profile image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleUpdateLocation = () => {
    updateMutation.mutate({ location: locationInput, address: locationInput });
  };

  const handleSaveProfileDetails = () => {
    updateMutation.mutate({
      fullName: profileForm.fullName,
      bio: profileForm.bio,
      skills: profileForm.skills,
      experienceYears: profileForm.experienceYears === "" ? undefined : Number(profileForm.experienceYears),
      hourlyRate: profileForm.hourlyRate === "" ? undefined : Number(profileForm.hourlyRate),
      address: profileForm.address,
      city: profileForm.city,
      latitude: profileForm.latitude,
      longitude: profileForm.longitude,
      location: profileForm.address || profileForm.city,
    });
  };

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsEditingLocation(true);
      setLocationInput("Detecting GPS...");
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          let newAddress = "Current Location (GPS)";
          let newCity = "";
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
              { headers: { 'Accept-Language': 'en' } }
            );
            const data = await response.json();
            newAddress = data.display_name;
            newCity = data.address.city || data.address.town || data.address.village || data.address.suburb || "";
          } catch (err) {
             console.error("Reverse geocoding failed", err);
          }
          
          setLocationInput(newAddress);
          updateMutation.mutate({ 
            latitude, 
            longitude,
            location: newAddress,
            address: newAddress,
            city: newCity
          });
        },
        (err) => {
          console.error("Geolocation error:", err);
          setLocationInput("GPS Failed");
        }
      );
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Blobs for Design Fidelity */}
      <div className="absolute top-[-5%] right-[-5%] w-[500px] h-[500px] bg-[#FACD15]/5 organic-blob -z-10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[0%] left-[-5%] w-[600px] h-[600px] bg-[#1F3F34]/5 organic-blob -z-10 blur-3xl pointer-events-none"></div>

      {/* MOBILE VIEW: Worker Dossier */}
      <div className="lg:hidden text-on-surface font-body pb-10">
        <header className="bg-[#F5F4EF]/80 backdrop-blur-md sticky top-0 z-50 shadow-[0_20px_40px_-10px_rgba(31,63,52,0.08)]">
          <div className="flex justify-between items-center px-6 py-4 w-full">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="text-[#1F3F34] hover:bg-[#FACD15]/10 p-2 transition-colors rounded-full active:scale-90 duration-200"
              >
                <span className="material-symbols-outlined">menu</span>
              </button>
              <h1 className="text-xl font-extrabold text-[#1F3F34] tracking-tight">Worker Profile</h1>
            </div>
            <div className="flex items-center gap-2">
              <NotificationCenter />
              <div className="w-10 h-10 rounded-full bg-[#e9e8e3] overflow-hidden border-2 border-[#FACD15]">
                <img src={user?.profile_image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"} alt="Portrait" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 pt-4 space-y-4 max-w-md mx-auto">
          {/* Level Progress Card */}
          <LevelProgressCard />

          {/* Profile Hero Card */}
          <section className="bg-white rounded-lg p-5 shadow-sm relative overflow-hidden border border-[#1F3F34]/5">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#ffe081]/20 rounded-full blur-3xl"></div>
            <div className="flex items-start gap-5 relative z-10">
              <div className="relative">
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-[#e9e8e3] rotate-1">
                  <img src={user?.profile_image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"} alt="Profile" className="w-full h-full object-cover" />
                </div>
                {profile?.identityVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full shadow-lg border-2 border-white z-20">
                    <span className="material-symbols-outlined text-xs font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-1">
                <h2 className="text-2xl font-black text-[#1F3F34] leading-none tracking-tight">{profileForm.fullName}</h2>
                <p className="text-sm font-bold text-[#1F3F34]/70 leading-tight">{profile?.bio?.split('.')[0] || "Professional Worker"}</p>
                <div className="flex gap-2 mt-2">
                  <span className="bg-[#c7ebdb] text-[#002117] px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">Level {profile?.level || '1'}</span>
                  {profile?.identityVerified && (
                    <span className="bg-emerald-500 text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
                      <span className="material-symbols-outlined text-[10px] font-bold">verified</span>
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Trust Score Card */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-4 flex flex-col justify-between border-b-4 border-[#FACD15] shadow-sm">
              <p className="text-[10px] font-bold text-[#1F3F34]/50 uppercase tracking-widest">Trust Score</p>
              <div className="flex items-end gap-1 mt-2">
                <span className="text-3xl font-black text-[#1F3F34]">4.9</span>
                <span className="text-sm font-bold text-[#1F3F34]/40 mb-1">/5.0</span>
              </div>
              <div className="flex items-center gap-1 text-[#FACD15] mt-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                ))}
              </div>
            </div>
            <div className="bg-[#1F3F34] text-white rounded-lg p-4 flex flex-col justify-between shadow-sm">
              <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Performance</p>
              <div className="mt-2">
                <span className="text-xl font-black block">Gold Tier</span>
                <p className="text-[10px] text-white/70 leading-tight mt-1">Top 2% of specialists in {profile?.city || "your region"}.</p>
              </div>
            </div>
          </div>

          {/* Application Details */}
          <section className="bg-[#efeee9] rounded-lg p-5 border border-black/5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-black text-[#1F3F34] uppercase tracking-[0.2em]">Application</h3>
              <button 
                onClick={() => setIsMobileEditing(!isMobileEditing)} 
                className="text-[#1F3F34]/60 hover:text-[#1F3F34] transition-colors"
                title="Toggle Edit Mode"
              >
                <span className="material-symbols-outlined text-lg">{isMobileEditing ? 'close' : 'edit_note'}</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-[#1F3F34]/50 uppercase block mb-1">Full Name</label>
                  {isMobileEditing ? (
                    <input 
                      type="text"
                      className="w-full bg-white border border-[#1F3F34]/10 rounded-md px-2 py-1 text-sm font-bold text-[#1F3F34] focus:outline-none focus:border-[#FACD15]"
                      value={profileForm.fullName}
                      onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm font-bold text-[#1F3F34] truncate">{profileForm.fullName}</p>
                  )}
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#1F3F34]/50 uppercase block mb-1">City</label>
                  {isMobileEditing ? (
                    <input 
                      type="text"
                      className="w-full bg-white border border-[#1F3F34]/10 rounded-md px-2 py-1 text-sm font-bold text-[#1F3F34] focus:outline-none focus:border-[#FACD15]"
                      value={profileForm.city}
                      onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm font-bold text-[#1F3F34] truncate">{profile?.city || "India"}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-[#1F3F34]/50 uppercase block mb-1">Experience (Yrs)</label>
                  {isMobileEditing ? (
                    <input 
                      type="number"
                      className="w-full bg-white border border-[#1F3F34]/10 rounded-md px-2 py-1 text-sm font-bold text-[#1F3F34] focus:outline-none focus:border-[#FACD15]"
                      value={profileForm.experienceYears}
                      onChange={(e) => setProfileForm({ ...profileForm, experienceYears: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm font-bold text-[#1F3F34]">{profile?.experienceYears || 0} Years</p>
                  )}
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#1F3F34]/50 uppercase block mb-1">Base Rate (₹/hr)</label>
                  {isMobileEditing ? (
                    <input 
                      type="number"
                      className="w-full bg-white border border-[#1F3F34]/10 rounded-md px-2 py-1 text-sm font-bold text-[#1F3F34] focus:outline-none focus:border-[#FACD15]"
                      value={profileForm.hourlyRate}
                      onChange={(e) => setProfileForm({ ...profileForm, hourlyRate: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm font-bold text-[#1F3F34]">₹{profile?.hourlyRate || 0}/hr</p>
                  )}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#1F3F34]/50 uppercase block mb-1">Permanent Address</label>
                {isMobileEditing ? (
                  <textarea 
                    className="w-full bg-white border border-[#1F3F34]/10 rounded-md px-2 py-1 text-sm font-medium text-[#1F3F34] focus:outline-none focus:border-[#FACD15] min-h-[60px]"
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  />
                ) : (
                  <p className="text-sm font-medium text-[#1F3F34]/80 leading-snug line-clamp-2">{profile?.address || "No address provided"}</p>
                )}
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#1F3F34]/50 uppercase block mb-1">Professional Bio</label>
                {isMobileEditing ? (
                  <textarea 
                    className="w-full bg-white border border-[#1F3F34]/10 rounded-md px-2 py-1 text-sm font-medium text-[#1F3F34] focus:outline-none focus:border-[#FACD15] min-h-[80px]"
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-[#1F3F34]/80 leading-relaxed italic font-medium line-clamp-3">{profile?.bio || "No professional bio provided yet."}</p>
                )}
              </div>
              
              {isMobileEditing && (
                <div className="pt-2">
                  <button 
                    onClick={handleSaveProfileDetails}
                    disabled={updateMutation.isPending}
                    className="w-full bg-[#1F3F34] text-[#FACD15] py-3 rounded-lg font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
                  >
                    {updateMutation.isPending ? 'Syncing...' : (
                      <>
                        <span className="material-symbols-outlined text-[16px]">save</span>
                        Submit
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Expertise Matrix */}
          <section className="bg-white rounded-lg p-5 shadow-sm border border-[#1F3F34]/5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-black text-[#1F3F34] uppercase tracking-[0.2em]">Expertise Matrix</h3>
              <span className="text-[10px] font-black text-[#FACD15] bg-[#1F3F34] px-2 py-0.5 rounded">
                {(profileForm.skills || "").split(',').filter(Boolean).length || 0} Skills
              </span>
            </div>
            
            {isMobileEditing ? (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#1F3F34]/50 uppercase block mb-1">Skills (Comma separated)</label>
                <textarea 
                  className="w-full bg-[#efeee9] border border-[#1F3F34]/10 rounded-md px-3 py-2 text-xs font-bold text-[#1F3F34] focus:outline-none focus:border-[#FACD15] min-h-[80px]"
                  value={profileForm.skills}
                  onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })}
                  placeholder="e.g. Electrical, Plumbing, HVAC"
                />
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {(profile?.skills || "").split(',').filter(Boolean).map((skill, i) => (
                  <span key={i} className="bg-[#e9e8e3] text-[#1F3F34] px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px]">
                      {skill.toLowerCase().includes('electric') ? 'electrical_services' : 
                       skill.toLowerCase().includes('plumb') ? 'plumbing' : 
                       skill.toLowerCase().includes('air') ? 'hvac' : 
                       skill.toLowerCase().includes('security') ? 'security' : 'star'}
                    </span>
                    {skill.trim()}
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* Operational Actions */}
          <section className="space-y-3">
            <button className="w-full bg-[#FACD15] text-[#002117] h-14 rounded-lg flex items-center justify-center gap-3 font-extrabold uppercase tracking-widest text-sm shadow-[inset_0_-2px_0_rgba(0,0,0,0.1)] active:scale-95 transition-transform">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              Certification Vault
            </button>
            <Link 
              to="/settings"
              className="w-full bg-white border-2 border-[#1F3F34]/5 text-[#1F3F34] h-14 rounded-lg flex items-center justify-center gap-3 font-extrabold uppercase tracking-widest text-sm active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined">settings</span>
              Settings
            </Link>
            <button 
              onClick={logout}
              className="w-full bg-[#efeee9] text-[#ba1a1a] h-14 rounded-lg flex items-center justify-center gap-3 font-bold uppercase tracking-widest text-[10px] active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined">logout</span>
              Terminate Session
            </button>
          </section>
        </main>
      </div>

      {/* DESKTOP VIEW: Legacy Bento Layout */}
      <main className="hidden lg:block p-4 md:p-8 md:pr-12 space-y-8 pb-32 relative z-10">
        {/* Header Section */}
        <div className="mb-10 space-y-1">
          <div className="flex items-center gap-2 text-[#414845]/60 font-black uppercase tracking-[0.2em] text-[10px]">
            <span className="material-symbols-outlined text-[14px]">globe</span> 
            Identity & Professional Integrity
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[#1F3F34] tracking-tight leading-none">Worker Profile</h1>
          <p className="text-[#414845]/60 font-medium text-sm">Control your verified credentials, status, and network presence.</p>
        </div>

        {/* Level Progress Card */}
        <section className="mb-8">
          <LevelProgressCard />
        </section>

        {/* Hero & Stats Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ProfileHeroCard 
              user={user}
              profile={profile}
              isUploadingImage={isUploadingImage}
              onImageUpload={handleImageUpload}
              isEditingLocation={isEditingLocation}
              setIsEditingLocation={setIsEditingLocation}
              locationInput={locationInput}
              setLocationInput={setLocationInput}
              onUpdateLocation={handleUpdateLocation}
              useCurrentLocation={useCurrentLocation}
            />
          </div>
          <div className="lg:col-span-1">
            <ProfileStatsCard 
              level={profile?.level || '1'}
              experienceYears={profile?.experienceYears || 0}
            />
          </div>
        </div>

        {/* Main Content & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form and Skills */}
          <div className="lg:col-span-2 space-y-8">
            <ProfileDetailsForm 
              form={profileForm}
              setForm={setProfileForm}
              onSave={handleSaveProfileDetails}
              isSaving={updateMutation.isPending}
            />
            
            <ExpertiseMatrix 
              skills={profile?.skills || ""}
            />
          </div>

          {/* Right Column: Actions and Badges */}
          <div className="lg:col-span-1">
            <ProfileSideActions 
              onLogout={logout}
            />
          </div>
        </div>
        
        {/* Version Footer */}
        <div className="text-center pt-16">
          <p className="text-[10px] font-black text-[#1F3F34]/20 uppercase tracking-[0.3em]">
            TrustHire System v2.5.2 • Encrypted Professional Network
          </p>
        </div>
      </main>

      <style>{`
        .organic-blob {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
        }
      `}</style>
    </div>
  );
}

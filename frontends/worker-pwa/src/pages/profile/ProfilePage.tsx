import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { logout } from "../../store/slices/authSlice";
import { fetchProfile, updateWorkerProfile } from "../../store/slices/profileSlice";
import { useOutletContext, Link } from "react-router-dom";
import apiClient from "../../api/apiClient";
import { ProfileHeroCard } from "../../components/profile/ProfileHeroCard";
import { ProfileStatsCard } from "../../components/profile/ProfileStatsCard";
import { ProfileDetailsForm } from "../../components/profile/ProfileDetailsForm";
import { ExpertiseMatrix } from "../../components/profile/ExpertiseMatrix";
import { ProfileSideActions } from "../../components/profile/ProfileSideActions";
import { LevelProgressCard } from "../../components/profile/LevelProgressCard";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { profile, loading } = useAppSelector((state) => state.profile);
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

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

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
      await dispatch(updateWorkerProfile({ profile_image_url: newImageUrl })).unwrap();
      dispatch(fetchProfile());
    } catch (err: any) {
      console.error("Failed to upload image:", err);
      alert(err.response?.data?.message || "Failed to update profile image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSaveProfileDetails = async () => {
    try {
      await dispatch(updateWorkerProfile({
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
      })).unwrap();
      setIsEditingLocation(false);
      setIsMobileEditing(false);
      dispatch(fetchProfile());
    } catch (err: any) {
      alert(err || "Failed to save profile");
    }
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
          await dispatch(updateWorkerProfile({ 
            latitude, 
            longitude,
            location: newAddress,
            address: newAddress,
            city: newCity
          })).unwrap();
          dispatch(fetchProfile());
        },
        (err) => {
          console.error("Geolocation error:", err);
          setLocationInput("GPS Failed");
        }
      );
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="relative min-h-screen selection:bg-[#FACD15] selection:text-[#1F3F34]">
      {/* Background Blobs */}
      <div className="absolute top-[-5%] right-[-5%] w-[500px] h-[500px] bg-[#FACD15]/5 organic-blob -z-10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[0%] left-[-5%] w-[600px] h-[600px] bg-[#1F3F34]/5 organic-blob -z-10 blur-3xl pointer-events-none"></div>

      {/* MOBILE VIEW */}
      <div className="lg:hidden text-on-surface font-body pb-10">
        <header className="bg-[#F5F4EF]/80 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-[#1F3F34]/5">
          <div className="flex justify-between items-center px-6 py-4 w-full">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="text-[#1F3F34] hover:bg-[#FACD15]/10 p-2 transition-colors rounded-full"
              >
                <span className="material-symbols-outlined">menu</span>
              </button>
              <h1 className="text-xl font-black text-[#1F3F34] tracking-tight bricolage">Profile</h1>
            </div>
          </div>
        </header>

        <main className="px-4 pt-4 space-y-4 max-w-md mx-auto">
          <LevelProgressCard />
          <section className="bg-white rounded-xl p-5 shadow-sm border border-[#1F3F34]/5">
            <div className="flex items-start gap-5">
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100">
                <img src={user?.profile_image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"} alt="Portrait" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-black text-[#1F3F34] leading-none tracking-tight bricolage">{profileForm.fullName}</h2>
                <div className="flex gap-2 mt-3">
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-[10px] font-black uppercase">Level {profile?.level || '1'}</span>
                  <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-[10px] font-black uppercase">Verified</span>
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-4 border-b-4 border-[#FACD15] shadow-sm">
              <p className="text-[10px] font-black text-[#1F3F34]/40 uppercase tracking-widest">Trust Score</p>
              <div className="flex items-end gap-1 mt-2">
                <span className="text-3xl font-black text-[#1F3F34]">4.9</span>
                <span className="text-sm font-black text-[#1F3F34]/20 mb-1">/5.0</span>
              </div>
            </div>
            <div className="bg-[#1F3F34] text-white rounded-xl p-4 shadow-sm">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Rank</p>
              <div className="mt-2">
                <span className="text-xl font-black block">Elite Operative</span>
              </div>
            </div>
          </div>

          <section className="bg-white rounded-xl p-5 border border-[#1F3F34]/5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-black text-[#1F3F34] uppercase tracking-widest bricolage">Operations Data</h3>
              <button onClick={() => setIsMobileEditing(!isMobileEditing)} className="text-[#1F3F34]/40 hover:text-[#1F3F34]">
                <span className="material-symbols-outlined">{isMobileEditing ? 'close' : 'edit'}</span>
              </button>
            </div>
            
            <div className="space-y-4">
               <div>
                  <label className="text-[10px] font-black text-[#1F3F34]/40 uppercase block mb-1">Identity</label>
                  {isMobileEditing ? (
                    <input value={profileForm.fullName} onChange={(e) => setProfileForm({...profileForm, fullName: e.target.value})} className="w-full bg-[#F5F4EF] border-none rounded-lg px-3 py-2 text-sm font-black text-[#1F3F34]"/>
                  ) : (
                    <p className="text-sm font-black text-[#1F3F34]">{profileForm.fullName}</p>
                  )}
               </div>
               <div>
                  <label className="text-[10px] font-black text-[#1F3F34]/40 uppercase block mb-1">Station</label>
                  {isMobileEditing ? (
                    <input value={profileForm.city} onChange={(e) => setProfileForm({...profileForm, city: e.target.value})} className="w-full bg-[#F5F4EF] border-none rounded-lg px-3 py-2 text-sm font-black text-[#1F3F34]"/>
                  ) : (
                    <p className="text-sm font-black text-[#1F3F34]">{profileForm.city || 'Not set'}</p>
                  )}
               </div>
               {isMobileEditing && (
                 <button onClick={handleSaveProfileDetails} className="w-full bg-[#1F3F34] text-[#FACD15] py-4 rounded-xl font-black uppercase tracking-widest text-[10px]">Sync Updates</button>
               )}
            </div>
          </section>

          <button onClick={handleLogout} className="w-full bg-[#F5F4EF] text-red-600 py-4 rounded-xl font-black uppercase tracking-widest text-[10px]">Terminate Session</button>
        </main>
      </div>

      {/* DESKTOP VIEW */}
      <main className="hidden lg:block p-4 md:p-8 md:pr-12 space-y-8 pb-32 relative z-10">
        <div className="mb-10 space-y-1">
          <h1 className="text-4xl font-black text-[#1F3F34] tracking-tight leading-none bricolage">Dossier Overview</h1>
          <p className="text-[#414845]/60 font-medium text-sm">Verified professional identity and operational status.</p>
        </div>

        <section className="mb-8">
          <LevelProgressCard />
        </section>

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
              onUpdateLocation={handleSaveProfileDetails}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ProfileDetailsForm 
              form={profileForm}
              setForm={setProfileForm}
              onSave={handleSaveProfileDetails}
              isSaving={loading}
            />
            <ExpertiseMatrix skills={profile?.skills || ""} />
          </div>
          <div className="lg:col-span-1">
            <ProfileSideActions onLogout={handleLogout} />
          </div>
        </div>
      </main>
      <style>{`
        .bricolage { font-family: 'Bricolage Grotesque', sans-serif; }
        .organic-blob { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
      `}</style>
    </div>
  );
}

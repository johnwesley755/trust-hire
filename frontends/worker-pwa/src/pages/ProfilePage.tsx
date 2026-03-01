import { useState } from "react";
import { useUser, SignOutButton } from "@clerk/clerk-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService, type WorkerProfile } from "../api/profile.service";
import { User, Mail, MapPin, Award, LogOut, ChevronRight, ShieldCheck, Navigation } from "lucide-react";

export default function ProfilePage() {
  const { user } = useUser();
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['workerProfile'],
    queryFn: profileService.getProfile,
  });

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<WorkerProfile>) => profileService.updateProfile({ ...profile!, ...updates }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workerProfile'] });
      setIsEditingLocation(false);
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const handleUpdateLocation = () => {
    updateMutation.mutate({ location: locationInput });
  };

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          updateMutation.mutate({ 
            latitude: pos.coords.latitude, 
            longitude: pos.coords.longitude,
            location: locationInput || "Current Location" 
          });
        },
        (err) => console.error("Geolocation error:", err)
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Profile Header */}
      <div className="bg-white border-b border-slate-200 p-8 pt-12">
        <div className="max-w-2xl mx-auto flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <img 
              src={user?.imageUrl} 
              alt={user?.fullName || ""} 
              className="w-24 h-24 rounded-3xl border-4 border-white shadow-xl"
            />
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-xl border-4 border-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">{user?.fullName}</h1>
            <div className="flex flex-col items-center gap-2 mt-1">
              {isEditingLocation ? (
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={locationInput} 
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder="Enter city..."
                    className="text-sm border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                  />
                  <button 
                    onClick={useCurrentLocation}
                    disabled={updateMutation.isPending}
                    className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-xs font-bold border border-indigo-100 flex items-center gap-1"
                    title="Use my current GPS location"
                  >
                    <Navigation className="w-3 h-3" /> GPS
                  </button>
                  <button 
                    onClick={handleUpdateLocation}
                    disabled={updateMutation.isPending}
                    className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs font-bold"
                  >
                    Save
                  </button>
                  <button 
                    onClick={() => setIsEditingLocation(false)}
                    className="bg-slate-200 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    setLocationInput(profile?.location || "");
                    setIsEditingLocation(true);
                  }}
                  className="text-slate-500 text-sm flex items-center justify-center gap-1 hover:text-indigo-600 transition-colors"
                >
                  <MapPin className="w-3 h-3" /> {profile?.location || "Set your location"}
                </button>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-100">
                Level {profile?.level || '1'}
            </span>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
                Verified
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Info Sections */}
        <section className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-lg">Account Information</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Full Name</p>
                <p className="font-semibold">{user?.fullName}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Email Address</p>
                <p className="font-semibold">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Professional Stats */}
        <section className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
           <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-lg">Professional Details</h3>
          </div>
          <div className="p-6 grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter mb-1">Experience</p>
                <p className="text-xl font-black italic">{profile?.experienceYears || 0} Years</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter mb-1">Hourly Rate</p>
                <p className="text-xl font-black italic">₹{profile?.hourlyRate || 0}</p>
            </div>
          </div>
          <div className="px-6 pb-6">
             <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter mb-2">My Skills</p>
             <div className="flex flex-wrap gap-2">
                {profile?.skills.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold shadow-sm">{skill}</span>
                ))}
             </div>
          </div>
        </section>

        {/* Action List */}
        <div className="space-y-3">
            <button className="w-full bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between group hover:border-indigo-400 transition-all shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Award className="w-5 h-5" />
                    </div>
                    <span className="font-bold">My Certifications</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-400 transition-colors" />
            </button>
            
            <SignOutButton>
                <button className="w-full bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center justify-between group hover:bg-rose-100 transition-all shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/20">
                            <LogOut className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-rose-600">Sign Out</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-rose-300 group-hover:text-rose-600 transition-colors" />
                </button>
            </SignOutButton>
        </div>
      </div>
    </div>
  );
}

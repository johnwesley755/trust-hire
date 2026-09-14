import { useEffect, useState } from "react";
import { useAuth, useUser } from "../../../providers/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOutletContext, Link } from "react-router-dom";
import { profileService, type WorkerProfile } from "../../../services/profile.service";
import { NotificationCenter } from '../../dashboard/components/NotificationCenter';
import apiClient from "../../../api/apiClient";
import { UserAvatar } from "../../../components/common/UserAvatar";
import { ShieldCheck, Award, MapPin, MapPinned, Star, History, Camera, Edit2, CheckCircle2, ArrowRight, Zap } from "lucide-react";

export default function WorkerProfileDetailsPage() {
  const { logout } = useAuth();
  const { user } = useUser();
  const outletCtx = useOutletContext<{ setIsSidebarOpen?: (open: boolean) => void }>() || {};
  const setIsSidebarOpen = outletCtx?.setIsSidebarOpen || (() => {});
  const queryClient = useQueryClient();

  const { data: profile } = useQuery<WorkerProfile>({
    queryKey: ['workerProfile'],
    queryFn: profileService.getWorkerProfile,
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['Google_Sans',sans-serif] pb-24">
      {/* MOBILE HEADER */}
      <header className="lg:hidden bg-white sticky top-0 z-50 border-b border-slate-200 shadow-sm">
        <div className="flex justify-between items-center px-4 py-3">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="text-[#0A1931] hover:bg-slate-100 p-2 rounded-full active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-xl">menu</span>
            </button>
            <h1 className="text-lg font-black text-[#0A1931] tracking-tight">TrustHyre</h1>
          </div>
          <div className="flex items-center gap-3">
            <NotificationCenter />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-10 space-y-6">
        
        {/* Page Header (Desktop) */}
        <div className="hidden lg:flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#0A1931] tracking-tight">Worker Dossier</h1>
            <p className="text-slate-500 font-medium mt-1">Manage your identity, skills, and shift history.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-bold shadow-sm transition-all text-sm">
            <Edit2 className="w-4 h-4" /> Edit Profile
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

                <div className="mt-4 flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200/50">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-xs font-bold">Aadhaar Verified</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-100">
                <div className="text-center">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Jobs Done</p>
                  <p className="text-xl font-black text-[#0A1931] mt-1">24</p>
                </div>
                <div className="text-center border-l border-slate-100">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Rating</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <span className="text-xl font-black text-[#0A1931]">4.9</span>
                    <Star className="w-4 h-4 text-[#FACD15] fill-[#FACD15]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Level & TrustScore */}
            <div className="bg-gradient-to-br from-[#0A1931] to-[#0066FF] rounded-3xl p-6 text-white shadow-xl shadow-[#0066FF]/10 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 blur-2xl rounded-full"></div>
              
              <div className="flex justify-between items-start relative z-10 mb-6">
                <div>
                  <p className="text-xs text-blue-200 font-bold uppercase tracking-wider">Current Tier</p>
                  <h3 className="text-2xl font-black mt-1">L2 Pro Worker</h3>
                </div>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                  <Award className="w-6 h-6 text-[#FACD15]" />
                </div>
              </div>

              <div className="space-y-2 relative z-10">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-blue-100">TrustScore</span>
                  <span className="text-white font-bold">840 / 1000</span>
                </div>
                <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
                  <div className="h-full bg-[#FACD15] rounded-full shadow-[0_0_10px_rgba(250,205,21,0.5)]" style={{ width: '84%' }}></div>
                </div>
                <p className="text-xs text-blue-200 pt-1">Top 15% in your city. Unlocks ₹200 bonus per shift.</p>
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
              <p className="text-sm font-medium text-slate-700">{profile?.address || profile?.city || 'Location not set'}</p>
              <button className="mt-4 w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-[#0066FF] font-bold text-sm rounded-xl border border-slate-200 transition-colors">
                Update GPS Location
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN: Expertise & History */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Wallet / Earnings Quick Look */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6 justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                  <span className="text-2xl font-black">₹</span>
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">Escrow Wallet Balance</p>
                  <h3 className="text-3xl font-black text-[#0A1931]">₹4,250<span className="text-lg text-slate-400 font-bold">.00</span></h3>
                </div>
              </div>
              <button className="w-full sm:w-auto px-6 py-3 bg-[#0A1931] hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-slate-900/10 transition-all flex items-center justify-center gap-2">
                Withdraw to Bank
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

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
                {/* Dummy History Items */}
                <div className="p-4 sm:p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 shrink-0">12</div>
                    <div>
                      <h4 className="font-bold text-[#0A1931]">Industrial Wiring Shift</h4>
                      <p className="text-sm text-slate-500 mt-1">L&T Construction • Peenya, BLR</p>
                    </div>
                  </div>
                  <div className="text-right w-full sm:w-auto flex flex-row sm:flex-col justify-between sm:justify-end items-center sm:items-end">
                    <span className="font-black text-emerald-600">₹1,200</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded mt-1">Settled</span>
                  </div>
                </div>
                
                <div className="p-4 sm:p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 shrink-0">08</div>
                    <div>
                      <h4 className="font-bold text-[#0A1931]">Panel Installation</h4>
                      <p className="text-sm text-slate-500 mt-1">TATA Power • Whitefield, BLR</p>
                    </div>
                  </div>
                  <div className="text-right w-full sm:w-auto flex flex-row sm:flex-col justify-between sm:justify-end items-center sm:items-end">
                    <span className="font-black text-emerald-600">₹1,450</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded mt-1">Settled</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

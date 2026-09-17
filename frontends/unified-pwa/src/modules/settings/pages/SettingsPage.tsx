import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/apiClient';
import { useAuth } from '../../../providers/AuthContext';
import { queryKeys } from '../../../lib/queryKeys';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Shield, 
  Bell, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  ArrowUpRight, 
  Loader2,
  KeyRound,
  Mail,
  Smartphone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  theme: string;
  language: string;
}

export const SettingsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'account' | 'security' | 'notifications'>('account');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Password change state
  const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });

  const { data: settings, isLoading } = useQuery({
    queryKey: queryKeys.settings.user,
    queryFn: async () => {
      const response = await apiClient.get('/api/settings');
      return response.data;
    }
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (updates: Partial<UserSettings>) => {
      const newSettings = { ...settings, ...updates };
      const response = await apiClient.put('/api/settings', newSettings);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.user });
      showFeedback('success', 'Preferences updated successfully');
    },
    onError: () => {
      showFeedback('error', 'Failed to update preferences');
    }
  });

  const handleUpdateSettings = (updates: Partial<UserSettings>) => {
    updateSettingsMutation.mutate(updates);
  };

  const passwordMutation = useMutation({
    mutationFn: async () => {
      return await apiClient.post('/api/settings/password', {
        oldPassword: passwords.old,
        newPassword: passwords.new
      });
    },
    onSuccess: () => {
      showFeedback('success', 'Password changed successfully');
      setPasswords({ old: '', new: '', confirm: '' });
    },
    onError: () => {
      showFeedback('error', 'Failed to change password. Verify your current password.');
    }
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      showFeedback('error', 'New passwords do not match');
      return;
    }
    passwordMutation.mutate();
  };

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3500);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#0066FF] animate-spin" />
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Loading Preferences...</p>
      </div>
    );
  }

  const navTabs = [
    { id: 'account', label: user?.role === 'EMPLOYER' ? 'Company Account' : 'Worker Profile', icon: user?.role === 'EMPLOYER' ? Building2 : User },
    { id: 'security', label: 'Security & Access', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 pt-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <header className="pb-5 border-b border-slate-200">
          <h1 className="text-2xl font-black text-[#0A1931] tracking-tight">System & Account Settings</h1>
          <p className="text-slate-500 font-medium text-xs sm:text-sm mt-0.5">
            Configure your security credentials, notification channels, and account parameters.
          </p>
        </header>

        {/* Feedback Alert */}
        <AnimatePresence>
          {message && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-3.5 rounded-xl flex items-center gap-2.5 text-xs font-bold border ${
                message.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Navigation Sidebar */}
          <nav className="md:col-span-4 space-y-1.5">
            {navTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    isActive 
                      ? 'bg-[#0066FF] text-white shadow-xs' 
                      : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Content Area */}
          <div className="md:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <AnimatePresence mode="wait">
              {activeTab === 'account' && (
                <motion.section 
                  key="account"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <h2 className="text-base font-bold text-[#0A1931]">Account Summary</h2>
                      <p className="text-xs text-slate-400">Authenticated identity and credential tier.</p>
                    </div>
                    <button
                      onClick={() => navigate('/profile')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0066FF] text-xs font-bold rounded-lg transition-all cursor-pointer"
                    >
                      View Live Profile <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account Email</p>
                      <p className="text-sm font-bold text-[#0A1931]">{user?.email || 'N/A'}</p>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Role Type</p>
                      <p className="text-sm font-bold text-[#0066FF] capitalize">{user?.role || 'Standard'}</p>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verification Status</p>
                      <p className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Aadhaar Verified
                      </p>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Security Tier</p>
                      <p className="text-sm font-bold text-slate-700">Level 3 Enterprise Guard</p>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100/80 flex items-start gap-3">
                    <Shield className="w-4 h-4 text-[#0066FF] shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      To modify official legal company credentials or government IDs, visit the Profile Dossier or contact enterprise verification compliance.
                    </p>
                  </div>
                </motion.section>
              )}

              {activeTab === 'security' && (
                <motion.section 
                  key="security"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  className="space-y-5"
                >
                  <div className="pb-4 border-b border-slate-100">
                    <h2 className="text-base font-bold text-[#0A1931]">Security & Password</h2>
                    <p className="text-xs text-slate-400">Keep your login credentials secure and up to date.</p>
                  </div>

                  <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <KeyRound className="w-3.5 h-3.5 text-slate-400" /> Current Password
                      </label>
                      <input 
                        type="password" 
                        required
                        value={passwords.old}
                        onChange={e => setPasswords({...passwords, old: e.target.value})}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0066FF] focus:bg-white transition-all font-medium text-[#0A1931]"
                        placeholder="••••••••"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-slate-400" /> New Password
                      </label>
                      <input 
                        type="password" 
                        required
                        value={passwords.new}
                        onChange={e => setPasswords({...passwords, new: e.target.value})}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0066FF] focus:bg-white transition-all font-medium text-[#0A1931]"
                        placeholder="••••••••"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-slate-400" /> Confirm New Password
                      </label>
                      <input 
                        type="password" 
                        required
                        value={passwords.confirm}
                        onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0066FF] focus:bg-white transition-all font-medium text-[#0A1931]"
                        placeholder="••••••••"
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={passwordMutation.isPending}
                      className="px-5 py-2.5 bg-[#0A1931] hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    >
                      {passwordMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                      Update Password
                    </button>
                  </form>
                </motion.section>
              )}

              {activeTab === 'notifications' && (
                <motion.section 
                  key="notifications"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  className="space-y-5"
                >
                  <div className="pb-4 border-b border-slate-100">
                    <h2 className="text-base font-bold text-[#0A1931]">Notification Channels</h2>
                    <p className="text-xs text-slate-400">Choose how and when TrustHyre contacts your organization.</p>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { id: 'emailNotifications', label: 'Email Notifications', desc: 'Shift dispatch summaries, invoices, and credential updates.', icon: Mail },
                      { id: 'pushNotifications', label: 'Mobile & Web Push', desc: 'Real-time candidate matches, applicant responses, and urgent notices.', icon: Smartphone },
                      { id: 'marketingEmails', label: 'Enterprise Intelligence', desc: 'Quarterly labor cost reports and platform policy updates.', icon: Bell }
                    ].map(item => {
                      const Icon = item.icon;
                      const isChecked = !!settings?.[item.id as keyof UserSettings];
                      return (
                        <div key={item.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#0066FF] shrink-0 mt-0.5">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <h3 className="text-xs font-bold text-[#0A1931]">{item.label}</h3>
                              <p className="text-[11px] text-slate-500 font-medium mt-0.5">{item.desc}</p>
                            </div>
                          </div>
                          
                          <button 
                            type="button"
                            onClick={() => handleUpdateSettings({ [item.id]: !isChecked })}
                            className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors cursor-pointer focus:outline-hidden ${
                              isChecked ? 'bg-[#0066FF]' : 'bg-slate-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                                isChecked ? 'translate-x-4' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

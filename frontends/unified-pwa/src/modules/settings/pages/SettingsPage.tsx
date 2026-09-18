import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/apiClient';
import { useAuth } from '../../../providers/AuthContext';
import { queryKeys } from '../../../lib/queryKeys';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  ArrowUpRight, 
  Loader2,
  Mail,
  Smartphone,
  ShieldCheck,
  MapPin,
  Phone,
  Briefcase,
  Zap,
  Copy,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserAvatar } from '../../../components/common/UserAvatar';
import { AppLoader } from '../../../components/common/AppLoader';

interface UserSettings {
  email_notifications?: boolean;
  emailNotifications?: boolean;
  push_notifications?: boolean;
  pushNotifications?: boolean;
  marketing_emails?: boolean;
  marketingEmails?: boolean;
  language?: string;
}

export const SettingsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'account' | 'notifications'>('account');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  const isEmployer = user?.role === 'EMPLOYER';

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
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.settings.user, data);
      showFeedback('success', 'Notification preferences saved');
    },
    onError: () => {
      showFeedback('error', 'Failed to update preferences');
    }
  });

  const handleToggle = (key: string, currentValue: boolean) => {
    updateSettingsMutation.mutate({ [key]: !currentValue });
  };

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleCopyId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  if (isLoading) {
    return <AppLoader variant="page" message="Loading Settings..." />;
  }

  const emailNotifs = settings?.email_notifications ?? settings?.emailNotifications ?? true;
  const pushNotifs = settings?.push_notifications ?? settings?.pushNotifications ?? true;
  const marketingNotifs = settings?.marketing_emails ?? settings?.marketingEmails ?? false;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 pt-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Page Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-[#0A1931] tracking-tight">Settings & Preferences</h1>
            <p className="text-slate-500 font-medium text-xs sm:text-sm mt-0.5">
              Manage your {isEmployer ? 'company account' : 'worker account'} and notification channels.
            </p>
          </div>

          {/* Quick Segmented Switcher */}
          <div className="flex items-center p-1 bg-slate-200/80 rounded-xl shrink-0 self-start sm:self-auto border border-slate-200">
            <button
              onClick={() => setActiveTab('account')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'account'
                  ? 'bg-white text-[#0066FF] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isEmployer ? <Building2 className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              <span>{isEmployer ? 'Company Account' : 'Worker Account'}</span>
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'notifications'
                  ? 'bg-white text-[#0066FF] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Notifications</span>
            </button>
          </div>
        </header>

        {/* Feedback Alert Toast */}
        <AnimatePresence>
          {message && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-3.5 rounded-xl flex items-center gap-2.5 text-xs font-bold border shadow-xs ${
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

        {/* Main Content View */}
        <AnimatePresence mode="wait">
          {activeTab === 'account' ? (
            <motion.div 
              key="account"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              {/* Profile Card Summary */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4 min-w-0">
                  <UserAvatar
                    src={user?.profileImageUrl}
                    name={user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.email}
                    size="lg"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-black text-[#0A1931] truncate">
                        {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (user?.email || 'Account User')}
                      </h2>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-full border border-emerald-200 flex items-center gap-1 uppercase tracking-wider shrink-0">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-2">
                      <span className="font-bold text-[#0066FF] uppercase tracking-wide">
                        {isEmployer ? 'Verified Hiring Partner' : 'Certified Specialist Worker'}
                      </span>
                      <span>•</span>
                      <span className="text-slate-400 font-mono text-[11px] truncate max-w-[160px]">
                        ID: {user?.id?.slice(0, 8)}...
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    onClick={handleCopyId}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Copy User ID"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId ? 'Copied' : 'Copy ID'}</span>
                  </button>
                  <button
                    onClick={() => navigate('/profile')}
                    className="flex-1 sm:flex-none px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <span>View Live Profile</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Account Parameters Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Mail className="w-4 h-4 text-[#0066FF]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Primary Email Address</span>
                  </div>
                  <p className="text-sm font-black text-[#0A1931] truncate">{user?.email || 'Not configured'}</p>
                  <p className="text-[11px] text-slate-400 font-medium">Used for critical shift notifications and auth receipts.</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Phone className="w-4 h-4 text-[#0066FF]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Contact Phone</span>
                  </div>
                  <p className="text-sm font-black text-[#0A1931]">
                    {user?.phoneNumber || (user as any)?.phone_number || '+91 • Not specified'}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium">Direct dispatch and emergency supervisor coordination.</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin className="w-4 h-4 text-[#0066FF]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Base Operating Hub</span>
                  </div>
                  <p className="text-sm font-black text-[#0A1931]">{user?.location || 'Chennai, Tamil Nadu'}</p>
                  <p className="text-[11px] text-slate-400 font-medium">Radius center for hyper-local trade dispatch.</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Briefcase className="w-4 h-4 text-[#0066FF]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      {isEmployer ? 'Enterprise Tier' : 'Trade Level'}
                    </span>
                  </div>
                  <p className="text-sm font-black text-[#0A1931]">
                    {isEmployer ? 'STARTER • Standard Escrow' : 'Level 2 Certified Specialist'}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium">Platform guarantee and escrow limit tier.</p>
                </div>
              </div>

              {/* Verified Trust & Compliance Banner */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0066FF] shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-[#0A1931]">Identity & Trade Verification</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Your {isEmployer ? 'corporate registration' : 'Aadhaar & trade verification'} is authenticated with TrustHyre Escrow guarantee. To update official legal names or certificates, visit your live profile dossier.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="notifications"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              {/* Notification Toggles */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
                <div className="pb-4 border-b border-slate-100">
                  <h2 className="text-base font-bold text-[#0A1931]">Notification Channels & Alerts</h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Customize how and when you receive critical alerts regarding shifts, applications, and payouts.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Email Notifications */}
                  <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#0066FF] shrink-0 mt-0.5 shadow-2xs">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-[#0A1931]">Email Notifications</h3>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                          Receive shift offer dispatches, application confirmations, and payment release receipts.
                        </p>
                      </div>
                    </div>
                    
                    <button 
                      type="button"
                      onClick={() => handleToggle('email_notifications', emailNotifs)}
                      disabled={updateSettingsMutation.isPending}
                      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer focus:outline-hidden ${
                        emailNotifs ? 'bg-[#0066FF]' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-xs ${
                          emailNotifs ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Push Notifications */}
                  <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#0066FF] shrink-0 mt-0.5 shadow-2xs">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-[#0A1931]">Real-time Push Alerts</h3>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                          Instant browser and mobile alerts when an employer dispatches an offer or status changes.
                        </p>
                      </div>
                    </div>
                    
                    <button 
                      type="button"
                      onClick={() => handleToggle('push_notifications', pushNotifs)}
                      disabled={updateSettingsMutation.isPending}
                      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer focus:outline-hidden ${
                        pushNotifs ? 'bg-[#0066FF]' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-xs ${
                          pushNotifs ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Market & Intelligence Updates */}
                  <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#0066FF] shrink-0 mt-0.5 shadow-2xs">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-[#0A1931]">Platform Updates & Digest</h3>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                          Weekly wage trends, local market demand insights, and feature announcements.
                        </p>
                      </div>
                    </div>
                    
                    <button 
                      type="button"
                      onClick={() => handleToggle('marketing_emails', marketingNotifs)}
                      disabled={updateSettingsMutation.isPending}
                      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer focus:outline-hidden ${
                        marketingNotifs ? 'bg-[#0066FF]' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-xs ${
                          marketingNotifs ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

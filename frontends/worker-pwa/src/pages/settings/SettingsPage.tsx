import React, { useState, useEffect } from 'react';
import apiClient from '../../../api/apiClient';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateUser } from '../../store/slices/authSlice';
import { motion, AnimatePresence } from 'framer-motion';

export const SettingsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<'account' | 'notifications' | 'security'>('account');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    language: 'English',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        language: 'English',
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await apiClient.put('/api/auth/profile', {
        first_name: formData.firstName,
        last_name: formData.lastName,
      });
      dispatch(updateUser({
        first_name: formData.firstName,
        last_name: formData.lastName,
      }));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update settings:', error);
      alert('Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-8 pr-8 lg:pr-16 w-full max-w-5xl selection:bg-[#FACD15] selection:text-[#1F3F34]">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-[#1F3F34] tracking-tight leading-none bricolage">Settings</h1>
        <p className="text-[#1F3F34]/60 font-medium mt-2">Manage your account preferences and security protocols.</p>
      </header>

      <div className="flex gap-4 mb-10 overflow-x-auto pb-2 no-scrollbar">
        {(['account', 'notifications', 'security'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab 
                ? 'bg-[#1F3F34] text-[#FACD15]' 
                : 'bg-white text-[#1F3F34]/40 hover:text-[#1F3F34]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-[#1F3F34]/5 shadow-sm">
        <AnimatePresence mode="wait">
          {activeTab === 'account' && (
            <motion.div
              key="account"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#1F3F34]/40 uppercase tracking-widest">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full bg-[#F5F4EF] border-none rounded-2xl px-6 py-4 text-[#1F3F34] font-black placeholder:text-[#1F3F34]/20 focus:ring-2 focus:ring-[#FACD15] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#1F3F34]/40 uppercase tracking-widest">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full bg-[#F5F4EF] border-none rounded-2xl px-6 py-4 text-[#1F3F34] font-black placeholder:text-[#1F3F34]/20 focus:ring-2 focus:ring-[#FACD15] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#1F3F34]/40 uppercase tracking-widest">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  className="w-full bg-[#F5F4EF] border-none rounded-2xl px-6 py-4 text-[#1F3F34]/40 font-black cursor-not-allowed"
                />
              </div>

              <div className="pt-4 border-t border-[#F5F4EF]">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-[#1F3F34] text-[#FACD15] px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#1F3F34]/10 disabled:opacity-50"
                >
                  {isSaving ? 'Syncing...' : 'Save Preferences'}
                </button>
                {saveSuccess && (
                  <span className="ml-6 text-emerald-600 font-black text-[10px] uppercase tracking-widest animate-pulse">Changes Saved Successfully</span>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between p-6 bg-[#F5F4EF] rounded-3xl">
                <div>
                  <h4 className="font-black text-[#1F3F34]">Push Notifications</h4>
                  <p className="text-[10px] font-bold text-[#1F3F34]/40 uppercase tracking-widest">Receive alerts for new missions</p>
                </div>
                <div className="w-12 h-6 bg-[#1F3F34] rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-[#FACD15] rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-6 bg-[#F5F4EF] rounded-3xl opacity-50">
                <div>
                  <h4 className="font-black text-[#1F3F34]">SMS Alerts</h4>
                  <p className="text-[10px] font-bold text-[#1F3F34]/40 uppercase tracking-widest">Critical operational updates via text</p>
                </div>
                <div className="w-12 h-6 bg-[#1F3F34]/20 rounded-full relative">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              key="security"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <button className="w-full text-left p-6 bg-[#F5F4EF] rounded-3xl hover:bg-[#FACD15]/10 transition-colors group">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-black text-[#1F3F34]">Change Password</h4>
                    <p className="text-[10px] font-bold text-[#1F3F34]/40 uppercase tracking-widest">Last updated 3 months ago</p>
                  </div>
                  <span className="material-symbols-outlined text-[#1F3F34]/20 group-hover:text-[#1F3F34] transition-colors">chevron_right</span>
                </div>
              </button>
              <button className="w-full text-left p-6 bg-[#F5F4EF] rounded-3xl hover:bg-[#FACD15]/10 transition-colors group">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-black text-[#1F3F34]">Two-Factor Authentication</h4>
                    <p className="text-[10px] font-bold text-[#1F3F34]/40 uppercase tracking-widest">Highly Recommended</p>
                  </div>
                  <span className="text-[10px] font-black text-emerald-600 uppercase">Enabled</span>
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <style>{`
        .bricolage { font-family: 'Bricolage Grotesque', sans-serif; }
      `}</style>
    </div>
  );
};

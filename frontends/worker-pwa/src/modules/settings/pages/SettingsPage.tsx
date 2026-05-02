import React, { useState, useEffect } from 'react';
import apiClient from '../../../api/apiClient';
import { useAuth } from '../../../providers/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface UserSettings {
    emailNotifications: boolean;
    pushNotifications: boolean;
    marketingEmails: boolean;
    theme: string;
    language: string;
}

export const SettingsPage = () => {
    const { user } = useAuth();
    const [settings, setSettings] = useState<UserSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'account' | 'security' | 'notifications'>('account');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Password change state
    const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await apiClient.get('/api/settings');
            setSettings(response.data);
        } catch (err) {
            console.error("Failed to fetch settings", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateSettings = async (updates: Partial<UserSettings>) => {
        if (!settings) return;
        setIsSaving(true);
        try {
            const newSettings = { ...settings, ...updates };
            const response = await apiClient.put('/api/settings', newSettings);
            setSettings(response.data);
            showFeedback('success', 'Settings updated successfully');
        } catch (err) {
            showFeedback('error', 'Failed to update settings');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            showFeedback('error', 'New passwords do not match');
            return;
        }
        setIsSaving(true);
        try {
            await apiClient.post('/api/settings/password', {
                oldPassword: passwords.old,
                newPassword: passwords.new
            });
            showFeedback('success', 'Password changed successfully');
            setPasswords({ old: '', new: '', confirm: '' });
        } catch (err) {
            showFeedback('error', 'Failed to change password. Check your old password.');
        } finally {
            setIsSaving(false);
        }
    };

    const showFeedback = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 3000);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F5F4EF]">
                <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F4EF] pb-20 pt-8 px-4 md:px-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-headline font-extrabold text-[#1F3F34]">Settings</h1>
                    <p className="text-[#1F3F34]/60">Manage your account preferences and security</p>
                </header>

                {/* Feedback Message */}
                <AnimatePresence>
                    {message && (
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                                message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}
                        >
                            <span className="material-symbols-outlined">
                                {message.type === 'success' ? 'check_circle' : 'error'}
                            </span>
                            {message.text}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Nav */}
                    <nav className="w-full md:w-64 space-y-2">
                        {[
                            { id: 'account', label: 'Account', icon: 'person' },
                            { id: 'security', label: 'Security', icon: 'shield' },
                            { id: 'notifications', label: 'Notifications', icon: 'notifications' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                    activeTab === tab.id 
                                    ? 'bg-[#FACD15] text-[#1F3F34] font-bold shadow-sm' 
                                    : 'hover:bg-white/50 text-[#1F3F34]/70'
                                }`}
                            >
                                <span className="material-symbols-outlined">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </nav>

                    {/* Content Area */}
                    <div className="flex-1 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#1F3F34]/5">
                        <AnimatePresence mode="wait">
                            {activeTab === 'account' && (
                                <motion.section 
                                    key="account"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-xl font-headline font-bold mb-4">Account Information</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-[#1F3F34]/40 uppercase tracking-widest">Email Address</p>
                                            <p className="text-[#1F3F34] font-medium">{user?.email}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-[#1F3F34]/40 uppercase tracking-widest">Account Role</p>
                                            <p className="text-[#1F3F34] font-medium capitalize">{user?.role}</p>
                                        </div>
                                    </div>
                                    <div className="pt-6 border-t border-gray-100">
                                        <p className="text-sm text-[#1F3F34]/60 italic">To change your email or phone number, please contact support.</p>
                                    </div>
                                </motion.section>
                            )}

                            {activeTab === 'security' && (
                                <motion.section 
                                    key="security"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                >
                                    <h2 className="text-xl font-headline font-bold mb-6">Security Settings</h2>
                                    <form onSubmit={handlePasswordChange} className="space-y-4 max-w-sm">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#1F3F34]/60 uppercase tracking-widest">Current Password</label>
                                            <input 
                                                type="password" 
                                                required
                                                value={passwords.old}
                                                onChange={e => setPasswords({...passwords, old: e.target.value})}
                                                className="w-full bg-[#F5F4EF] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#FACD15] outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#1F3F34]/60 uppercase tracking-widest">New Password</label>
                                            <input 
                                                type="password" 
                                                required
                                                value={passwords.new}
                                                onChange={e => setPasswords({...passwords, new: e.target.value})}
                                                className="w-full bg-[#F5F4EF] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#FACD15] outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#1F3F34]/60 uppercase tracking-widest">Confirm New Password</label>
                                            <input 
                                                type="password" 
                                                required
                                                value={passwords.confirm}
                                                onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                                                className="w-full bg-[#F5F4EF] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#FACD15] outline-none"
                                            />
                                        </div>
                                        <button 
                                            disabled={isSaving}
                                            className="mt-4 w-full bg-[#1F3F34] text-white font-bold py-3 rounded-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center"
                                        >
                                            {isSaving ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : 'Update Password'}
                                        </button>
                                    </form>
                                </motion.section>
                            )}

                            {activeTab === 'notifications' && (
                                <motion.section 
                                    key="notifications"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="space-y-8"
                                >
                                    <h2 className="text-xl font-headline font-bold mb-6">Notification Preferences</h2>
                                    
                                    <div className="space-y-6">
                                        {[
                                            { id: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates about jobs and account activity via email.' },
                                            { id: 'pushNotifications', label: 'Push Notifications', desc: 'Get real-time alerts on your mobile device.' },
                                            { id: 'marketingEmails', label: 'Marketing Communications', desc: 'Receive news, offers, and platform updates.' }
                                        ].map(item => (
                                            <div key={item.id} className="flex items-center justify-between gap-4">
                                                <div>
                                                    <h3 className="font-bold text-[#1F3F34]">{item.label}</h3>
                                                    <p className="text-sm text-[#1F3F34]/60">{item.desc}</p>
                                                </div>
                                                <button 
                                                    onClick={() => handleUpdateSettings({ [item.id]: !settings?.[item.id as keyof UserSettings] })}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                                                        settings?.[item.id as keyof UserSettings] ? 'bg-[#FACD15]' : 'bg-gray-200'
                                                    }`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                            settings?.[item.id as keyof UserSettings] ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                    />
                                                </button>
                                            </div>
                                        ))}
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

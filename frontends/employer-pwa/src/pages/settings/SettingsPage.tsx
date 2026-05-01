import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import { useAppSelector } from '../../store';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Shield, 
    Bell, 
    Building2, 
    Lock, 
    CheckCircle2, 
    AlertCircle, 
    ChevronRight,
    Loader2
} from 'lucide-react';

interface UserSettings {
    emailNotifications: boolean;
    pushNotifications: boolean;
    marketingEmails: boolean;
    theme: string;
    language: string;
}

export const SettingsPage = () => {
    const { user } = useAppSelector((state) => state.auth);
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
            showFeedback('success', 'Tactical preferences synchronized');
        } catch (err) {
            showFeedback('error', 'Failed to synchronize preferences');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            showFeedback('error', 'New credentials do not match');
            return;
        }
        setIsSaving(true);
        try {
            await apiClient.post('/api/settings/password', {
                oldPassword: passwords.old,
                newPassword: passwords.new
            });
            showFeedback('success', 'Security protocols updated');
            setPasswords({ old: '', new: '', confirm: '' });
        } catch (err) {
            showFeedback('error', 'Authorization failure. Verify current credentials.');
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
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F4EF] gap-6">
                <Loader2 className="w-16 h-16 text-[#1F3F34] animate-spin opacity-20" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1F3F34]/30 animate-pulse">Initializing Control Panel...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F4EF] selection:bg-[#FACD15] selection:text-[#1F3F34]">
            <div className="max-w-[1400px] mx-auto p-4 lg:p-12 text-left">
                <header className="mb-16 space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black bricolage text-[#1F3F34] tracking-tighter uppercase leading-[0.9]">
                        Operational<br/>
                        <span className="text-[#1F3F34]/30">Configurations</span>
                    </h1>
                    <p className="text-[#1F3F34]/60 font-black text-[10px] uppercase tracking-[0.4em]">Calibrating Enterprise Protocol & Security Matrix.</p>
                </header>

                {/* Feedback Message */}
                <AnimatePresence>
                    {message && (
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`mb-10 p-6 rounded-2xl flex items-center gap-4 border-2 shadow-2xl ${
                                message.type === 'success' 
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                                    : 'bg-rose-50 text-rose-800 border-rose-100'
                            }`}
                        >
                            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{message.text}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Nav */}
                    <nav className="w-full lg:w-80 space-y-4">
                        {[
                            { id: 'account', label: 'ENTERPRISE IDENTITY', icon: <Building2 className="w-5 h-5" /> },
                            { id: 'security', label: 'SECURITY PROTOCOLS', icon: <Shield className="w-5 h-5" /> },
                            { id: 'notifications', label: 'SIGNAL PREFERENCES', icon: <Bell className="w-5 h-5" /> }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`w-full flex items-center justify-between px-8 py-5 rounded-2xl transition-all border-2 ${
                                    activeTab === tab.id 
                                    ? 'bg-[#1F3F34] text-[#FACD15] border-[#1F3F34] shadow-2xl shadow-[#1F3F34]/20' 
                                    : 'bg-white text-[#1F3F34]/40 border-[#EFEEE9] hover:border-[#FACD15]'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    {tab.icon}
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{tab.label}</span>
                                </div>
                                <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === tab.id ? 'translate-x-1 opacity-100' : 'opacity-0'}`} />
                            </button>
                        ))}
                    </nav>

                    {/* Content Area */}
                    <div className="flex-1 bg-white rounded-[3.5rem] p-10 lg:p-16 shadow-2xl shadow-[#1F3F34]/5 border border-[#EFEEE9] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FACD15] opacity-[0.03] rounded-full blur-[100px]"></div>
                        
                        <AnimatePresence mode="wait">
                            {activeTab === 'account' && (
                                <motion.section 
                                    key="account"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-12 relative z-10"
                                >
                                    <div className="space-y-4">
                                        <h2 className="text-3xl font-black text-[#1F3F34] uppercase bricolage tracking-tight">Business Intelligence</h2>
                                        <p className="text-[#1F3F34]/40 text-[10px] font-black uppercase tracking-[0.3em]">Core identity parameters for your enterprise cluster.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <SettingField label="PROTOCOL EMAIL" value={user?.email || "NOT SET"} />
                                        <SettingField label="DEPLOYMENT TIER" value="ENTERPRISE STRATEGIST" />
                                        <SettingField label="VALIDATION STATUS" value="VERIFIED" isVerified />
                                        <SettingField label="OPERATIONAL REGION" value="BHARAT CENTRAL" />
                                    </div>

                                    <div className="pt-10 border-t border-[#F5F4EF] flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-[#FACD15]/10 flex items-center justify-center shrink-0">
                                            <AlertCircle className="w-5 h-5 text-[#FACD15]" />
                                        </div>
                                        <p className="text-[10px] text-[#1F3F34]/40 font-black uppercase tracking-[0.2em] leading-relaxed max-w-lg">
                                            Official enterprise credential updates require physical validation documents. Contact regional command for support.
                                        </p>
                                    </div>
                                </motion.section>
                            )}

                            {activeTab === 'security' && (
                                <motion.section 
                                    key="security"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-12 relative z-10"
                                >
                                    <div className="space-y-4">
                                        <h2 className="text-3xl font-black text-[#1F3F34] uppercase bricolage tracking-tight">Access Control</h2>
                                        <p className="text-[#1F3F34]/40 text-[10px] font-black uppercase tracking-[0.3em]">Rotate authorization credentials to maintain perimeter security.</p>
                                    </div>

                                    <form onSubmit={handlePasswordChange} className="space-y-8 max-w-md">
                                        <FormInput label="CURRENT PROTOCOL" type="password" value={passwords.old} onChange={val => setPasswords({...passwords, old: val})} />
                                        <FormInput label="NEW PROTOCOL" type="password" value={passwords.new} onChange={val => setPasswords({...passwords, new: val})} />
                                        <FormInput label="CONFIRM NEW PROTOCOL" type="password" value={passwords.confirm} onChange={val => setPasswords({...passwords, confirm: val})} />
                                        
                                        <button 
                                            disabled={isSaving}
                                            className="w-full bg-[#1F3F34] text-[#FACD15] font-black py-5 rounded-2xl shadow-2xl shadow-[#1F3F34]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 group uppercase text-[10px] tracking-[0.3em]"
                                        >
                                            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                                <>
                                                    <Lock className="w-4 h-4" />
                                                    ROTATE CREDENTIALS
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </motion.section>
                            )}

                            {activeTab === 'notifications' && (
                                <motion.section 
                                    key="notifications"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-12 relative z-10"
                                >
                                    <div className="space-y-4">
                                        <h2 className="text-3xl font-black text-[#1F3F34] uppercase bricolage tracking-tight">Signal Matrix</h2>
                                        <p className="text-[#1F3F34]/40 text-[10px] font-black uppercase tracking-[0.3em]">Configure telemetry and intelligence flow protocols.</p>
                                    </div>
                                    
                                    <div className="space-y-10">
                                        <ToggleSwitch 
                                            label="EMAIL INTELLIGENCE" 
                                            desc="Receive mission reports, applicant dossier, and billing telemetry via email." 
                                            active={settings?.emailNotifications || false} 
                                            onToggle={() => handleUpdateSettings({ emailNotifications: !settings?.emailNotifications })} 
                                        />
                                        <ToggleSwitch 
                                            label="PUSH TELEMETRY" 
                                            desc="Get real-time tactical alerts for operative engagement and status changes." 
                                            active={settings?.pushNotifications || false} 
                                            onToggle={() => handleUpdateSettings({ pushNotifications: !settings?.pushNotifications })} 
                                        />
                                        <ToggleSwitch 
                                            label="NETWORK UPDATES" 
                                            desc="Receive briefings on new platform capabilities and hiring market insights." 
                                            active={settings?.marketingEmails || false} 
                                            onToggle={() => handleUpdateSettings({ marketingEmails: !settings?.marketingEmails })} 
                                        />
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

function SettingField({ label, value, isVerified }: { label: string, value: string, isVerified?: boolean }) {
    return (
        <div className="space-y-3 p-8 bg-[#F5F4EF] rounded-[2.5rem] border border-transparent hover:border-[#FACD15]/20 transition-all shadow-inner">
            <p className="text-[9px] font-black text-[#1F3F34]/30 uppercase tracking-[0.3em]">{label}</p>
            <div className="flex items-center gap-3">
                <p className="text-xl font-black text-[#1F3F34] bricolage uppercase truncate">{value}</p>
                {isVerified && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            </div>
        </div>
    );
}

function FormInput({ label, type, value, onChange }: { label: string, type: string, value: string, onChange: (val: string) => void }) {
    return (
        <div className="space-y-3">
            <label className="text-[9px] font-black text-[#1F3F34]/40 uppercase tracking-[0.3em] ml-4">{label}</label>
            <input 
                type={type} 
                required
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full bg-[#F5F4EF] border-2 border-transparent focus:border-[#FACD15] rounded-full px-8 py-5 text-sm font-black text-[#1F3F34] outline-none transition-all shadow-inner"
            />
        </div>
    );
}

function ToggleSwitch({ label, desc, active, onToggle }: { label: string, desc: string, active: boolean, onToggle: () => void }) {
    return (
        <div className="flex items-center justify-between gap-10 p-8 bg-[#F5F4EF]/50 rounded-[2.5rem] border border-[#EFEEE9] hover:bg-white hover:shadow-2xl hover:shadow-[#1F3F34]/5 transition-all">
            <div className="space-y-2">
                <h3 className="text-sm font-black text-[#1F3F34] uppercase tracking-widest">{label}</h3>
                <p className="text-[10px] text-[#1F3F34]/40 font-bold uppercase tracking-widest leading-relaxed max-w-sm">{desc}</p>
            </div>
            <button 
                onClick={onToggle}
                className={`relative inline-flex h-10 w-20 items-center rounded-full transition-all border-2 ${
                    active ? 'bg-[#1F3F34] border-[#1F3F34]' : 'bg-[#EFEEE9] border-[#EFEEE9]'
                }`}
            >
                <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-2xl transition-transform ${
                        active ? 'translate-x-11' : 'translate-x-1'
                    }`}
                />
                {active && <div className="absolute left-3 w-1 h-1 bg-[#FACD15] rounded-full shadow-[0_0_10px_#FACD15]"></div>}
            </button>
        </div>
    );
}

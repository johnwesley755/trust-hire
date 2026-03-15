import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthContext';
import apiClient from '../api/apiClient';
import { Mail, Lock, Loader2, ArrowRight, User, Building2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { ImageUpload } from '../components/ImageUpload';

interface ApiError {
    response?: {
        data?: {
            message?: string;
        } | string;
    };
}

export const SignUpPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        profile_image_url: '',
        role: 'EMPLOYER'
    });
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const isFormValid = formData.firstName && formData.lastName && formData.email && formData.phone && formData.password;

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await apiClient.post('/api/auth/send-otp', { email: formData.email });
            setOtpSent(true);
        } catch (err) {
            console.error('OTP Send Error:', err);
            setError('Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyAndRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await apiClient.post('/api/auth/register', {
                ...formData,
                otp
            });
            login(response.data.token, response.data.user);
            navigate('/onboarding');
        } catch (err: unknown) {
            const apiError = err as ApiError;
            setError(apiError.response?.data && typeof apiError.response.data === 'object' ? apiError.response.data.message || 'Registration failed' : 'Registration failed. Please check your details.');
        } finally {
            setIsLoading(false);
        }
    };

    if (otpSent) {
        return (
            <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4 font-sans">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md bg-brand-surface rounded-[2.5rem] shadow-2xl border border-brand-border p-10 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-brand-primary to-amber-600" />
                    
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center p-4 bg-brand-primary/10 rounded-2xl mb-6">
                            <ShieldCheck className="w-10 h-10 text-brand-primary" />
                        </div>
                        <h1 className="text-4xl font-black text-brand-secondary tracking-tighter mb-2 italic">Verify Identity</h1>
                        <p className="text-brand-muted font-bold">Secure OTP sent to <span className="text-brand-secondary">{formData.email}</span></p>
                    </div>

                    <form onSubmit={handleVerifyAndRegister} className="space-y-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-muted ml-1">Authentication Code</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full bg-brand-bg border border-brand-border rounded-2xl py-5 text-center text-4xl font-black tracking-[0.5em] text-brand-secondary focus:outline-none focus:ring-4 focus:ring-brand-primary/20 focus:border-brand-primary transition-all placeholder:text-brand-muted/20"
                                placeholder="000000"
                                maxLength={6}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-brand-secondary text-brand-primary font-black py-5 rounded-3xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 transition-all disabled:opacity-70 text-lg uppercase tracking-widest"
                        >
                            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Complete Registration'}
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-brand-bg font-sans selection:bg-brand-primary selection:text-brand-secondary">
            {/* Left Column: Form Section */}
            <div className="flex flex-col justify-start px-8 lg:px-20 py-12 relative overflow-y-auto max-h-screen custom-scrollbar">
                <div className="mb-12">
                     <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-12 h-12 bg-brand-secondary rounded-2xl flex items-center justify-center group-hover:bg-brand-primary/10 transition-all shadow-sm">
                            <Building2 className="w-7 h-7 text-brand-primary" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold tracking-tight text-brand-secondary uppercase leading-none">TrustHire</span>
                            <span className="text-[10px] font-black text-brand-muted uppercase tracking-[0.2em] mt-1">Enterprise Solution</span>
                        </div>
                    </Link>
                </div>

                <div className="max-w-xl w-full mx-auto lg:mx-0">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-10"
                    >
                        <h1 className="text-5xl font-black text-brand-secondary tracking-tighter leading-tight mb-4">
                            Build Your Team <br />
                            <span className="text-brand-primary text-4xl">With Confidence.</span>
                        </h1>
                        <p className="text-brand-muted font-bold text-lg max-w-md leading-relaxed">
                            The trusted talent infrastructure for modern enterprises to scale and secure operations.
                        </p>
                    </motion.div>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 p-4 bg-brand-accent/5 border border-brand-accent/20 text-brand-accent font-bold text-sm rounded-2xl flex items-center gap-3"
                        >
                            <div className="w-5 h-5 rounded-full bg-brand-accent/20 flex items-center justify-center shrink-0">
                                <span className="text-[10px]">!</span>
                            </div>
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSendOtp} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-brand-muted ml-1">First Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="w-5 h-5 text-brand-muted/30 group-focus-within:text-brand-primary transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                        className="w-full bg-brand-surface border border-brand-border rounded-xl py-4 pl-12 pr-4 text-brand-secondary font-bold focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all placeholder:text-brand-muted/20"
                                        placeholder="Enter first name"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-brand-muted ml-1">Last Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="w-5 h-5 text-brand-muted/30 group-focus-within:text-brand-primary transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                        className="w-full bg-brand-surface border border-brand-border rounded-xl py-4 pl-12 pr-4 text-brand-secondary font-bold focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all placeholder:text-brand-muted/20"
                                        placeholder="Enter last name"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-brand-muted ml-1">Professional Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="w-5 h-5 text-brand-muted/30 group-focus-within:text-brand-primary transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full bg-brand-surface border border-brand-border rounded-xl py-4 pl-12 pr-4 text-brand-secondary font-bold focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all placeholder:text-brand-muted/20"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-brand-muted ml-1">Phone Number</label>
                                <div className="relative phone-input-container group">
                                    <PhoneInput
                                        country={'in'}
                                        value={formData.phone}
                                        onChange={(value: string, data: { dialCode?: string }) => {
                                            const digits = value.replace(/\D/g, '');
                                            const dialCode = data.dialCode || '';
                                            const subscriber = digits.slice(dialCode.length);
                                            if (subscriber.length <= 10) {
                                                setFormData({...formData, phone: value});
                                            }
                                        }}
                                        inputProps={{ name: 'phone', required: true }}
                                        containerClass="!w-full"
                                        inputClass="!w-full !h-[3.75rem] !bg-brand-surface !border-brand-border !rounded-xl !pl-14 !pr-4 !text-brand-secondary !font-bold !text-base focus:!ring-4 focus:!ring-brand-primary/5 focus:!border-brand-primary !transition-all"
                                        buttonClass="!bg-transparent !border-none !rounded-l-xl !pl-4"
                                        dropdownClass="!rounded-xl !shadow-2xl !border-brand-border !bg-brand-surface"
                                        searchClass="!rounded-lg !bg-brand-bg !border-brand-border"
                                        enableSearch={true}
                                        disableDropdown={false}
                                        countryCodeEditable={false}
                                    />
                                    <style>{`
                                        .phone-input-container .react-tel-input .form-control { font-family: inherit; }
                                        .phone-input-container .react-tel-input .flag-dropdown { background: transparent; border: none; }
                                        .phone-input-container .react-tel-input .selected-flag { background: transparent !important; padding: 0 0 0 16px; transition: all 0.3s; }
                                        .phone-input-container .react-tel-input .selected-flag.open,
                                        .phone-input-container .react-tel-input .selected-flag:hover { background: rgba(250, 204, 21, 0.05) !important; }
                                    `}</style>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-brand-muted ml-1">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="w-5 h-5 text-brand-muted/30 group-focus-within:text-brand-primary transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        className="w-full bg-brand-surface border border-brand-border rounded-xl py-4 pl-12 pr-4 text-brand-secondary font-bold focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all placeholder:text-brand-muted/20"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                             <ImageUpload 
                                onUploadSuccess={(url) => setFormData({...formData, profile_image_url: url})}
                                currentImage={formData.profile_image_url}
                             />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !isFormValid}
                            className="w-full bg-brand-secondary text-brand-primary font-black py-5 rounded-2xl shadow-lg hover:shadow-brand-secondary/20 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg uppercase tracking-wide mt-4"
                        >
                            {isLoading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>Get Started <ArrowRight className="w-6 h-6" /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-brand-border/50 text-center lg:text-left">
                        <p className="text-brand-muted font-bold text-sm">
                            Already have an account?{' '}
                            <Link to="/sign-in" className="text-brand-secondary hover:text-brand-primary transition-colors ml-1 border-b border-brand-primary/20 hover:border-brand-primary">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Column: Hero Section */}
            <div className="hidden lg:block relative bg-brand-secondary overflow-hidden">
                <div className="absolute inset-0">
                    <img 
                        src="/images/auth_hero.png" 
                        alt="Join the Network" 
                        className="w-full h-full object-cover brightness-[0.5] grayscale-30"
                    />
                </div>
                
                {/* Decorative overlay */}
                <div className="absolute inset-0 bg-linear-to-b from-brand-secondary/20 via-brand-secondary/40 to-brand-secondary/80" />
                <div className="absolute inset-0 cloud-grid opacity-20" />

                <div className="relative h-full flex flex-col justify-center p-20 z-10">
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-10"
                    >
                        <div className="space-y-4 max-w-lg">
                            <h3 className="text-6xl font-black text-white tracking-tighter leading-[1.1]">
                                Empower Your <br />
                                <span className="text-brand-primary">Workforce.</span>
                            </h3>
                            <p className="text-xl text-white/60 font-medium leading-relaxed">
                                Join over 15,000 top-tier organizations using India's most advanced verified talent network.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6 pt-10">
                            <div className="glass-card p-8 rounded-3xl border-white/5 bg-white/5">
                                <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center mb-4">
                                    <ShieldCheck className="w-6 h-6 text-brand-primary" />
                                </div>
                                <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Security</div>
                                <div className="text-xl font-bold text-white">Full Verification</div>
                            </div>
                            <div className="glass-card p-8 rounded-3xl border-white/5 bg-white/5">
                                <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center mb-4">
                                    <Building2 className="w-6 h-6 text-brand-primary" />
                                </div>
                                <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Scale</div>
                                <div className="text-xl font-bold text-white">Global Reach</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

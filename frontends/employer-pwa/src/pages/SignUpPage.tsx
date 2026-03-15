import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthContext';
import apiClient from '../api/apiClient';
import { Mail, Lock, Loader2, ArrowRight, User, Building2, ShieldCheck, ChevronRight } from 'lucide-react';
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
            <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6 selection:bg-brand-primary selection:text-brand-secondary">
                <div className="absolute inset-0 cloud-grid opacity-[0.05] pointer-events-none" />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-lg bg-brand-surface rounded-[3rem] shadow-2xl border border-brand-border p-12 relative overflow-hidden z-10"
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-brand-primary" />
                    
                    <div className="flex flex-col items-center text-center mb-12">
                        <div className="w-20 h-20 bg-brand-secondary text-brand-primary rounded-[2.5rem] flex items-center justify-center shadow-2xl mb-8">
                            <ShieldCheck className="w-10 h-10" />
                        </div>
                        <h1 className="text-5xl font-bold text-brand-secondary tracking-tight mb-3">Verify</h1>
                        <p className="text-brand-muted font-medium tracking-tight">Security verification in progress. Verification code sent to:</p>
                        <p className="text-brand-primary font-semibold uppercase tracking-widest text-xs mt-2">{formData.email}</p>
                    </div>

                    <form onSubmit={handleVerifyAndRegister} className="space-y-10">
                        <div className="space-y-3">
                            <label className="text-[10px] font-medium uppercase tracking-[0.3em] text-brand-muted ml-1 block text-center">Verification Code</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full bg-white border-2 border-brand-border rounded-3xl py-8 text-center text-5xl font-semibold tracking-[0.4em] text-brand-secondary focus:outline-none focus:border-brand-primary transition-all placeholder:text-brand-muted/10 shadow-inner"
                                    placeholder="******"
                                    maxLength={6}
                                    required
                                />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-brand-secondary text-brand-primary font-semibold py-6 rounded-4xl shadow-2xl hover:bg-neutral-800 active:scale-[0.98] flex items-center justify-center gap-4 transition-all disabled:opacity-70 text-xl uppercase tracking-widest"
                        >
                            {isLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : (
                                <>Verify OTP <ChevronRight className="w-6 h-6" /></>
                            )}
                        </button>
                    </form>
                    
                    <button 
                        onClick={() => setOtpSent(false)}
                        className="w-full mt-8 text-brand-muted font-black text-[10px] uppercase tracking-widest hover:text-brand-primary transition-colors italic"
                    >
                        Back to secure entry
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-brand-bg font-sans selection:bg-brand-primary selection:text-brand-secondary overflow-hidden">
            {/* Left Column: Form Section */}
            <div className="flex flex-col justify-start px-8 lg:px-24 py-16 relative overflow-y-auto max-h-screen custom-scrollbar z-10">
                <div className="absolute inset-0 cloud-grid opacity-[0.03] pointer-events-none" />
                
                <div className="mb-16 relative">
                     <Link to="/" className="flex items-center gap-4 group">
                        <div className="w-14 h-14 bg-brand-secondary rounded-[1.5rem] flex items-center justify-center group-hover:bg-brand-primary group-hover:text-brand-secondary transition-all shadow-xl">
                            <Building2 className="w-8 h-8 text-brand-primary group-hover:text-brand-secondary transition-colors" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-3xl font-bold tracking-tight text-neutral-900 uppercase leading-none">TrustHire</span>
                            <span className="text-[10px] font-medium text-brand-primary uppercase tracking-[0.3em] mt-1.5">Business Network</span>
                        </div>
                    </Link>
                </div>

                <div className="max-w-xl w-full mx-auto lg:mx-0 relative">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-12"
                    >
                        <h1 className="text-6xl font-bold text-neural-900 tracking-tight leading-[1.1] mb-6">
                            Hire your next <br />
                            <span className="text-brand-primary font-bold">professional.</span>
                        </h1>
                        <p className="text-brand-muted font-medium text-lg max-w-sm leading-relaxed">
                            Access the most verified talent network in the region.
                        </p>
                    </motion.div>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 p-5 bg-brand-accent/5 border-l-4 border-brand-accent text-brand-accent font-black text-xs rounded-r-2xl flex items-center gap-4 uppercase tracking-widest"
                        >
                            <ShieldCheck className="w-5 h-5 shrink-0" />
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSendOtp} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-brand-muted ml-1">First Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                        <User className="w-5 h-5 text-brand-muted/30 group-focus-within:text-brand-primary transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                        className="w-full bg-white border border-brand-border rounded-2xl py-5 pl-14 pr-5 text-brand-secondary font-medium focus:outline-none focus:border-brand-primary transition-all placeholder:text-brand-muted/20 text-sm"
                                        placeholder="Enter first name"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-brand-muted ml-1">Last Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                        <User className="w-5 h-5 text-brand-muted/30 group-focus-within:text-brand-primary transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                        className="w-full bg-white border border-brand-border rounded-2xl py-5 pl-14 pr-5 text-brand-secondary font-medium focus:outline-none focus:border-brand-primary transition-all placeholder:text-brand-muted/20 text-sm"
                                        placeholder="Enter last name"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-brand-muted ml-1">Work Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Mail className="w-5 h-5 text-brand-muted/30 group-focus-within:text-brand-primary transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full bg-white border border-brand-border rounded-2xl py-5 pl-14 pr-5 text-brand-secondary font-medium focus:outline-none focus:border-brand-primary transition-all placeholder:text-brand-muted/20 text-sm"
                                    placeholder="your@company.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                            <div className="space-y-2">
                                <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-brand-muted ml-1">Phone Number</label>
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
                                        inputClass="!w-full !h-[3.75rem] !bg-white !border-brand-border !rounded-2xl !pl-14 !pr-5 !text-brand-secondary !font-medium !text-sm focus:!border-brand-primary !transition-all"
                                        buttonClass="!bg-transparent !border-none !rounded-l-2xl !pl-4"
                                        dropdownClass="!rounded-2xl !shadow-2xl !border-brand-border !bg-white"
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
                                <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-brand-muted ml-1">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                        <Lock className="w-5 h-5 text-brand-muted/30 group-focus-within:text-brand-primary transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        className="w-full bg-white border border-brand-border rounded-2xl py-5 pl-14 pr-5 text-brand-secondary font-medium focus:outline-none focus:border-brand-primary transition-all placeholder:text-brand-muted/20 text-sm"
                                        placeholder="Min. 8 characters"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                             <ImageUpload 
                                onUploadSuccess={(url) => setFormData({...formData, profile_image_url: url})}
                                currentImage={formData.profile_image_url}
                             />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !isFormValid}
                            className="w-full bg-brand-secondary text-brand-primary font-semibold py-6 rounded-4xl shadow-2xl hover:bg-neutral-800 active:scale-[0.99] flex items-center justify-center gap-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xl uppercase tracking-widest mt-6"
                        >
                            {isLoading ? (
                                <Loader2 className="w-8 h-8 animate-spin" />
                            ) : (
                                <>Create Account <ArrowRight className="w-6 h-6" /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-brand-border/30 text-center lg:text-left">
                        <p className="text-brand-muted font-black text-xs uppercase tracking-widest">
                            Authorized personnel already?{' '}
                            <Link to="/sign-in" className="text-brand-secondary hover:text-brand-primary transition-colors ml-2 border-b-2 border-brand-primary">
                                Secure Login
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
                        alt="Security Infrastructure" 
                        className="w-full h-full object-cover brightness-[0.4] grayscale-[0.2] scale-105"
                    />
                </div>
                
                {/* Decorative overlay */}
                <div className="absolute inset-0 bg-linear-to-b from-brand-secondary/0 via-brand-secondary/20 to-brand-secondary/90" />
                <div className="absolute inset-0 cloud-grid opacity-30" />
                
                {/* Premium Amber Glow */}
                <div className="absolute -top-[20%] -right-[20%] w-[80%] h-[80%] bg-brand-primary/10 blur-[150px] rounded-full" />

                <div className="relative h-full flex flex-col justify-end p-24 z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-12"
                    >
                        <div className="space-y-6 max-w-xl">
                            <div className="w-24 h-1 bg-brand-primary rounded-full mb-8" />
                            <h3 className="text-7xl font-bold text-white tracking-tight leading-[1] mb-6">
                                Verified <br />
                                <span className="text-brand-primary">Talent.</span>
                            </h3>
                            <p className="text-xl text-white/50 font-medium leading-relaxed">
                                Connect with billions of verified data points and professional insights with ease.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-8 pt-6">
                            <div className="p-8 rounded-[2.5rem] bg-white/5 backdrop-blur-3xl border border-white/10 group hover:border-brand-primary/30 transition-all">
                                <div className="w-14 h-14 bg-brand-primary rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-brand-primary/10 group-hover:scale-110 transition-transform">
                                    <ShieldCheck className="w-7 h-7 text-brand-secondary" />
                                </div>
                                 <div className="text-[10px] font-medium text-brand-primary uppercase tracking-[0.3em] mb-2">Verification</div>
                                <div className="text-2xl font-bold text-white uppercase tracking-tight">Verified</div>
                            </div>
                            <div className="p-8 rounded-[2.5rem] bg-white/5 backdrop-blur-3xl border border-white/10 group hover:border-brand-primary/30 transition-all">
                                <div className="w-14 h-14 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform">
                                    <Building2 className="w-7 h-7 text-brand-primary" />
                                </div>
                                <div className="text-[10px] font-medium text-brand-primary uppercase tracking-[0.3em] mb-2">Reach</div>
                                <div className="text-2xl font-bold text-white uppercase tracking-tight">Global</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthContext';
import { authService } from '../api/auth.service';
import { Mail, Lock, Loader2, ArrowRight, User, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { AdvancedFileUpload } from '../components/AdvancedFileUpload';

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
            await authService.sendOtp(formData.email);
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
            const data = await authService.register({
                ...formData,
                otp
            });
            login(data.token, data.user);
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
            <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6 selection:bg-brand-primary selection:text-brand-secondary relative">
                <div className="absolute inset-0 cloud-grid opacity-[0.05] pointer-events-none" />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-brand-border/30 p-10 relative overflow-hidden z-10"
                >
                    <div className="flex flex-col items-center text-center mb-10">
                        <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center mb-6">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-bold text-brand-secondary tracking-tight mb-2">Verify Identity</h1>
                        <p className="text-brand-muted font-medium text-sm">Verification code sent to:</p>
                        <p className="text-brand-primary font-bold text-sm mt-1">{formData.email}</p>
                    </div>

                    <form onSubmit={handleVerifyAndRegister} className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-brand-muted ml-1 block text-center">Enter 6-digit Code</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full bg-brand-bg/30 border border-brand-border/50 rounded-2xl py-6 text-center text-4xl font-bold tracking-[0.4em] text-brand-secondary focus:outline-none focus:border-brand-primary transition-all placeholder:text-brand-muted/10 shadow-inner"
                                    placeholder="******"
                                    maxLength={6}
                                    required
                                />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-brand-secondary text-brand-primary font-bold py-4.5 rounded-xl shadow-lg hover:bg-neutral-800 active:scale-[0.98] flex items-center justify-center gap-3 transition-all disabled:opacity-70 group"
                        >
                            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                <>
                                    <span>Verify Account</span>
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                    
                    <button 
                        onClick={() => setOtpSent(false)}
                        className="w-full mt-6 text-brand-muted font-bold text-xs hover:text-brand-primary transition-colors"
                    >
                        Go back & edit details
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center selection:bg-brand-primary selection:text-brand-secondary relative">
            <div className="absolute inset-0 cloud-grid opacity-[0.05] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 translate-y-1/2" />
            
            <div className="w-full max-w-xl relative z-10 px-6 py-16">
                {/* Branding */}
                <div className="flex justify-center mb-10">
                     <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-brand-secondary rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform border border-white/10">
                            <ShieldCheck className="w-6 h-6 text-brand-primary" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-brand-secondary">TrustHire</span>
                    </Link>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-xl border border-brand-border/30"
                >
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-brand-secondary tracking-tight mb-3">
                            Create Company Account
                        </h1>
                        <p className="text-brand-muted font-medium">
                            Join the India's most verified talent network.
                        </p>
                    </div>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 font-bold text-sm rounded-xl flex items-center gap-3"
                        >
                            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                <span className="text-[10px]">!</span>
                            </div>
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSendOtp} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-brand-muted ml-1">First Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r border-brand-border/30 mr-4 pr-3">
                                        <User className="w-4 h-4 text-brand-muted/40 group-focus-within:text-brand-primary transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                        className="w-full bg-brand-bg/30 border border-brand-border/50 rounded-xl py-4 pl-14 pr-4 text-brand-secondary font-bold focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all placeholder:text-brand-muted/20 text-sm"
                                        placeholder="First name"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-brand-muted ml-1">Last Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r border-brand-border/30 mr-4 pr-3">
                                        <User className="w-4 h-4 text-brand-muted/40 group-focus-within:text-brand-primary transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                        className="w-full bg-brand-bg/30 border border-brand-border/50 rounded-xl py-4 pl-14 pr-4 text-brand-secondary font-bold focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all placeholder:text-brand-muted/20 text-sm"
                                        placeholder="Last name"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-brand-muted ml-1">Work Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r border-brand-border/30 mr-4 pr-3">
                                    <Mail className="w-4 h-4 text-brand-muted/40 group-focus-within:text-brand-primary transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full bg-brand-bg/30 border border-brand-border/50 rounded-xl py-4 pl-14 pr-4 text-brand-secondary font-bold focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all placeholder:text-brand-muted/20 text-sm"
                                    placeholder="your@company.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-brand-muted ml-1">Phone Number</label>
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
                                        inputClass="!w-full !h-[3.375rem] !bg-brand-bg/30 !border-brand-border/50 !rounded-xl !pl-14 !pr-5 !text-brand-secondary !font-bold !text-sm focus:!border-brand-primary !transition-all"
                                        buttonClass="!bg-transparent !border-none !rounded-l-xl !pl-4"
                                        dropdownClass="!rounded-xl !shadow-2xl !border-brand-border !bg-white"
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
                                <label className="text-xs font-bold text-brand-muted ml-1">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r border-brand-border/30 mr-4 pr-3">
                                        <Lock className="w-4 h-4 text-brand-muted/40 group-focus-within:text-brand-primary transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        className="w-full bg-brand-bg/30 border border-brand-border/50 rounded-xl py-4 pl-14 pr-4 text-brand-secondary font-bold focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all placeholder:text-brand-muted/20 text-sm"
                                        placeholder="Min. 8 characters"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                             <AdvancedFileUpload 
                                onUploadSuccess={(urls) => setFormData({...formData, profile_image_url: urls[0] || ''})}
                                maxFiles={1}
                                label="Profile Photo"
                             />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !isFormValid}
                            className="w-full bg-brand-secondary text-brand-primary font-bold py-4.5 rounded-xl shadow-lg hover:bg-neutral-900 active:scale-[0.99] flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed group mt-4"
                        >
                            {isLoading ? (
                                <Loader2 className="w-6 h-6 animate-spin text-brand-primary" />
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-brand-border/30 text-center">
                        <p className="text-brand-muted font-medium text-sm">
                            Already have a business account?{' '}
                            <Link to="/sign-in" className="text-brand-secondary font-bold hover:text-brand-primary transition-colors ml-1">
                                Secure Login
                            </Link>
                        </p>
                    </div>
                </motion.div>

                <p className="text-center mt-12 text-xs text-brand-muted/50 font-medium">
                    By joining, you agree to our Terms of Service and Risk Policies.
                </p>
            </div>
        </div>
    );
};

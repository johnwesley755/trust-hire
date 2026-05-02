import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../providers/AuthContext';
import { authService } from '../../../services/auth.service';
import { AdvancedFileUpload } from '../../profile/components/AdvancedFileUpload';
import { signUpSchema } from '../../../validations/zodSchema';
import { AuthHeader } from '../components/AuthHeader';
import { AuthFooter } from '../components/AuthFooter';

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
        phoneNumber: '',
        firstName: '',
        lastName: '',
        profile_image_url: '',
        role: 'WORKER'
    });
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpSent, setOtpSent] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(45);
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        let timer: any;
        if (otpSent && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [otpSent, timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSendOtp = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        const validationResult = signUpSchema.safeParse({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            phoneNumber: formData.phoneNumber
        });

        if (!validationResult.success) {
            setError(validationResult.error.issues[0].message);
            return;
        }

        setIsLoading(true);
        setError('');
        try {
            await authService.sendOtp(formData.email);
            setOtpSent(true);
            setTimeLeft(45);
        } catch (err: unknown) {
            const apiError = err as ApiError;
            setError(apiError.response?.data && typeof apiError.response.data === 'object' ? apiError.response.data.message || 'Failed to send OTP' : 'Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (value: string, index: number) => {
        if (value.length > 1) {
            // Handle paste
            if (value.length === 6) {
                const newOtp = value.split('');
                setOtp(newOtp);
                return;
            }
            value = value.slice(-1);
        }
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (!pasteData) return;
        
        const newOtp = [...otp];
        const chars = pasteData.split('');
        chars.forEach((char, idx) => {
            if (idx < 6) newOtp[idx] = char;
        });
        setOtp(newOtp);
        
        // Focus last filled box
        const lastIdx = Math.min(chars.length - 1, 5);
        document.getElementById(`otp-${lastIdx}`)?.focus();
    };

    const handleVerifyAndRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const data = await authService.register({
                ...formData,
                phoneNumber: `+91${formData.phoneNumber}`,
                otp: otp.join('')
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

    const isFormValid = formData.firstName && formData.lastName && formData.email && formData.phoneNumber && formData.password;

    if (otpSent) {
        return (
            <div className="bg-[#FAF9F4] text-[#1F3F34] font-body min-h-screen flex flex-col antialiased">
                <main className="flex-grow flex flex-col md:flex-row h-full">
                    {/* Left Column: OTP Content */}
                    <section className="w-full md:w-1/2 flex items-start justify-center p-8 md:p-16 lg:p-24 bg-[#F5F4EF] pt-12 md:pt-16 lg:pt-20">
                        <div className="max-w-md w-full">
                            {/* Brand Anchor */}
                            <div className="mb-12">
                                <span className="text-2xl font-black text-[#1F3F34] font-headline tracking-tighter">TrustHire</span>
                            </div>
                            
                            <header className="space-y-2 mb-10">
                                <h1 className="text-4xl md:text-5xl font-extrabold text-[#1F3F34] font-headline leading-tight tracking-tight">
                                    Verify Identity
                                </h1>
                                <p className="text-[#1F3F34]/60 text-lg leading-relaxed font-medium">
                                    We've sent a 6-digit code to <span className="font-bold text-[#1F3F34]">{formData.email}</span>
                                </p>
                            </header>

                            {error && (
                                <div className="mb-6 p-4 bg-error-container border border-error/10 text-error font-bold text-sm rounded-xl flex items-center gap-3">
                                    <span className="material-symbols-outlined">error</span>
                                    {error}
                                </div>
                            )}

                            {/* OTP Input Area */}
                            <div className="mb-8">
                                <div className="flex gap-3 justify-between">
                                    {otp.map((digit, idx) => (
                                        <input 
                                            key={idx}
                                            id={`otp-${idx}`}
                                            className="w-full h-16 text-center text-2xl font-bold bg-[#E9E8E3] border border-gray-200 rounded-xl focus:border-[#FACD15] focus:ring-4 focus:ring-[#FACD15]/10 transition-all outline-none" 
                                            maxLength={1} 
                                            type="text" 
                                            value={digit}
                                            onChange={(e) => handleOtpChange(e.target.value, idx)}
                                            onKeyDown={(e) => handleKeyDown(e, idx)}
                                            onPaste={handlePaste}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-6">
                                <button 
                                    onClick={handleVerifyAndRegister}
                                    disabled={isLoading || otp.join('').length < 6}
                                    className="w-full bg-[#FACD15] text-[#002117] py-5 rounded-xl font-extrabold text-sm tracking-widest flex items-center justify-center gap-3 shadow-[inset_0_-2px_0_rgba(0,0,0,0.15)] hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100"
                                >
                                    {isLoading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : (
                                        <>
                                            VERIFY ACCOUNT
                                            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
                                        </>
                                    )}
                                </button>
                                
                                <div className="flex flex-col items-center gap-4">
                                    <button 
                                        onClick={() => setOtpSent(false)}
                                        className="text-[#1F3F34]/60 hover:text-[#FACD15] font-bold text-sm transition-colors border-b-2 border-transparent hover:border-[#FACD15] pb-0.5"
                                    >
                                        Go back and edit details
                                    </button>
                                    
                                    <button 
                                        onClick={handleSendOtp}
                                        disabled={timeLeft > 0 || isLoading}
                                        className="text-[#1F3F34]/40 text-xs font-bold uppercase tracking-wider hover:text-[#1F3F34] transition-colors disabled:opacity-50"
                                    >
                                        {timeLeft > 0 ? (
                                            <>Resend code in <span className="text-[#1F3F34]">{formatTime(timeLeft)}</span></>
                                        ) : (
                                            "Resend Code Now"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Right Column: Visual Anchor */}
                    <section className="hidden md:flex w-1/2 bg-[#FAF9F4] flex-col items-center justify-center p-12 relative overflow-hidden">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#FACD15]/5 rounded-full blur-3xl"></div>
                        <div className="relative z-10 w-full max-w-lg">
                            {/* Photo Container with Organic Blob Mask */}
                            <div className="aspect-square w-full bg-[#1F3F34] blob-mask relative overflow-hidden shadow-2xl">
                                <img 
                                    alt="Confident Indian male professional smiling" 
                                    className="w-full h-full object-cover scale-110" 
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAk7jFT3v3L52SZMUDlod-YxmK1Mos92VrWyd7XTbEoN5wS06Nfhv66B2gkCDVHLlWMpamgrTuCKMrOSCHeptO3mzh9eVA9ElgIN2hZxuCmelsJtdHvp8M5HEno4_s1VsZ-UQ5ijumQZjUsR3UKrcHRe_H6psnVxzrBlBbGvauV67YRxAWWW3DAy13JUKI8gtO3JHO3WDxwzo2DvC7-sTMuWGZ4MVYTqaidjNR_DYXJ6Bs4-BkaAUYjNlNx2-geCX6MtJ0PFxoi7Cs" 
                                />
                            </div>

                            {/* Floating Verification Card */}
                            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-[0_20px_40px_-10px_rgba(31,63,52,0.08)] border border-white/20 flex items-start gap-4 max-w-xs transition-transform hover:scale-105 duration-300">
                                <div className="w-12 h-12 bg-[#FACD15]/10 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="material-symbols-outlined text-[#FACD15]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-[#1F3F34] text-lg leading-none mb-1">Secure & Verified</h3>
                                    <p className="text-sm text-[#1F3F34]/60 leading-snug font-medium">We take your identity safety seriously with bank-grade encryption.</p>
                                </div>
                            </div>
                            
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#FACD15] rounded-full mix-blend-multiply opacity-10 animate-pulse"></div>
                        </div>
                    </section>
                </main>

                <footer className="bg-[#EFEEE9] py-8 px-8 flex flex-col md:flex-row justify-between items-center w-full border-t border-[#1F3F34]/5 mt-auto">
                    <div className="text-[#1F3F34] font-black text-xl mb-4 md:mb-0 font-headline tracking-tighter">TrustHire</div>
                    <div className="flex gap-8 text-sm font-bold text-[#1F3F34]/70">
                        <Link className="hover:text-[#FACD15] transition-all" to="/privacy">Privacy Policy</Link>
                        <Link className="hover:text-[#FACD15] transition-all" to="/terms">Terms of Service</Link>
                        <Link className="hover:text-[#FACD15] transition-all" to="/support">Help Center</Link>
                    </div>
                    <div className="text-sm text-[#1F3F34]/50 font-medium mt-4 md:mt-0">
                        © 2024 TrustHire. Built for human connection.
                    </div>
                </footer>

                <style>{`
                    .blob-mask {
                        mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23FF0066' d='M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-46.2C87.4,-33.4,90.1,-17.7,89.2,-2.1C88.3,13.5,83.8,29,75.2,42.5C66.6,56,53.8,67.5,39.4,75.1C25,82.7,8.9,86.4,-6.4,85.1C-21.7,83.7,-36.2,77.2,-48.8,68.4C-61.4,59.6,-72,48.5,-79.1,35.5C-86.2,22.5,-89.7,7.7,-88.4,-6.8C-87.1,-21.3,-81,-35.4,-71.5,-46.9C-62,-58.4,-49.1,-67.3,-35.7,-74.8C-22.3,-82.3,-8.4,-88.4,5.4,-89.1C19.2,-89.8,30.6,-83.6,44.7,-76.4Z' transform='translate(100 100)' /%3E%3C/svg%3E");
                        -webkit-mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23FF0066' d='M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-46.2C87.4,-33.4,90.1,-17.7,89.2,-2.1C88.3,13.5,83.8,29,75.2,42.5C66.6,56,53.8,67.5,39.4,75.1C25,82.7,8.9,86.4,-6.4,85.1C-21.7,83.7,-36.2,77.2,-48.8,68.4C-61.4,59.6,-72,48.5,-79.1,35.5C-86.2,22.5,-89.7,7.7,-88.4,-6.8C-87.1,-21.3,-81,-35.4,-71.5,-46.9C-62,-58.4,-49.1,-67.3,-35.7,-74.8C-22.3,-82.3,-8.4,-88.4,5.4,-89.1C19.2,-89.8,30.6,-83.6,44.7,-76.4Z' transform='translate(100 100)' /%3E%3C/svg%3E");
                        mask-size: contain;
                        -webkit-mask-size: contain;
                        mask-repeat: no-repeat;
                        -webkit-mask-repeat: no-repeat;
                        mask-position: center;
                        -webkit-mask-position: center;
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="bg-surface text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed">
            <AuthHeader />

            <main className="min-h-screen flex flex-col md:flex-row pt-24 md:pt-16">
                <section className="flex-1 bg-surface-container-lowest flex items-center justify-center p-8 md:p-16 lg:p-24 relative overflow-hidden">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-fixed opacity-10 rounded-full blur-3xl"></div>
                    <div className="w-full max-w-md z-10">
                        <div className="mb-10">
                            <h1 className="font-headline font-extrabold text-3xl md:text-4xl text-[#1F3F34] leading-tight tracking-tight mb-3">Create Worker Profile</h1>
                            <p className="text-[#1F3F34]/70 text-lg leading-relaxed font-medium">Join India's most trusted network and earn more.</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-error-container border border-error/10 text-error font-bold text-sm rounded-xl flex items-center gap-3">
                                <span className="material-symbols-outlined">error</span>
                                {error}
                            </div>
                        )}

                        <p className="text-xs text-[#1F3F34]/60 mb-6 font-medium">Fields marked with <span className="text-red-500">*</span> are mandatory</p>

                        <form onSubmit={handleSendOtp} noValidate className="space-y-6">
                            <div className="flex flex-col items-center mb-8">
                                <label className="text-xs font-bold uppercase tracking-wider text-[#1F3F34]/60 mb-3 self-start">Profile Photo</label>
                                <AdvancedFileUpload 
                                    onUploadSuccess={(urls) => setFormData({...formData, profile_image_url: urls[0] || ''})}
                                    initialUrls={formData.profile_image_url ? [formData.profile_image_url] : []}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-[#1F3F34]">First Name <span className="text-red-500">*</span></label>
                                    <input 
                                        className="w-full px-4 py-3.5 bg-surface-container-high border border-gray-200 rounded-xl focus:border-[#FACD15] focus:ring-4 focus:ring-[#FACD15]/10 placeholder:text-[#1F3F34]/30 font-medium transition-all outline-none" 
                                        placeholder="e.g. Rajesh" 
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-[#1F3F34]">Last Name <span className="text-red-500">*</span></label>
                                    <input 
                                        className="w-full px-4 py-3.5 bg-surface-container-high border border-gray-200 rounded-xl focus:border-[#FACD15] focus:ring-4 focus:ring-[#FACD15]/10 placeholder:text-[#1F3F34]/30 font-medium transition-all outline-none" 
                                        placeholder="e.g. Kumar" 
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-[#1F3F34]">Mobile Number <span className="text-red-500">*</span></label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-4 font-bold text-[#1F3F34]/60">+91</span>
                                    <input 
                                        className="w-full pl-14 pr-4 py-3.5 bg-surface-container-high border border-gray-200 rounded-xl focus:border-[#FACD15] focus:ring-4 focus:ring-[#FACD15]/10 placeholder:text-[#1F3F34]/30 font-medium transition-all outline-none" 
                                        placeholder="98765 43210" 
                                        type="tel"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value.replace(/\D/g, '')})}
                                        maxLength={10}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-[#1F3F34]">Email Address <span className="text-red-500">*</span></label>
                                <input 
                                    className="w-full px-4 py-3.5 bg-surface-container-high border border-gray-200 rounded-xl focus:border-[#FACD15] focus:ring-4 focus:ring-[#FACD15]/10 placeholder:text-[#1F3F34]/30 font-medium transition-all outline-none" 
                                    placeholder="rajesh@example.com" 
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-[#1F3F34]">Password <span className="text-red-500">*</span></label>
                                <input 
                                    className="w-full px-4 py-3.5 bg-surface-container-high border border-gray-200 rounded-xl focus:border-[#FACD15] focus:ring-4 focus:ring-[#FACD15]/10 placeholder:text-[#1F3F34]/30 font-medium transition-all outline-none" 
                                    placeholder="Min. 8 characters" 
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    required
                                />
                            </div>

                            <button 
                                disabled={isLoading}
                                className="w-full py-4 bg-[#FACD15] text-[#002117] font-headline font-extrabold uppercase tracking-widest rounded-xl shadow-[0_4px_0_0_#C39F00] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2" 
                                type="submit"
                            >
                                {isLoading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : (
                                    <>
                                        <span>Join TrustHire</span>
                                        <span className="material-symbols-outlined font-bold">arrow_forward</span>
                                    </>
                                )}
                            </button>

                            <p className="text-center text-sm text-[#1F3F34]/60 pt-4 font-medium">
                                By signing up, you agree to our <Link className="underline font-bold text-[#1F3F34]" to="/terms">Terms</Link> and <Link className="underline font-bold text-[#1F3F34]" to="/privacy">Privacy Policy</Link>.
                            </p>

                            <p className="text-center text-sm text-[#1F3F34]/60 pt-4 font-medium">
                                Already have an account? <Link className="underline font-bold text-[#1F3F34]" to="/sign-in">Sign in</Link>
                            </p>
                        </form>
                    </div>
                </section>

                <section className="flex-1 bg-[#F5F4EF] relative hidden md:flex items-start justify-center pt-24 px-12 pb-12 overflow-hidden">
                    <div className="absolute top-20 right-20 w-64 h-64 bg-primary-fixed opacity-20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 left-10 w-48 h-48 bg-secondary-fixed opacity-15 rounded-full blur-2xl"></div>
                    <div className="relative z-10 w-full max-w-xl text-center">
                        <div className="relative mb-12">
                            <div className="w-full aspect-square max-w-[480px] mx-auto overflow-hidden mask-blob bg-surface-container-high shadow-2xl">
                                <img 
                                    alt="Confident Indian professional in uniform" 
                                    className="w-full h-full object-cover" 
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB50LNmVVz6c5pa7r8XYPaaEVYW1r55XOt3XP5JkqtRbBykxnGAq1-1VLpJpXUTPkGP0_FlQnOvDdgBDt0bIWmJsgd1JDGjJAbZe7SqI5g1LGZ-DaSrN9sULCt0rl6OaMtuYw8wNdQb1KzJy5UUNpZk2nPGETAVGulcWbdqQhmMMQk3UVDMhUVEMYqwsyQJVz-zHBzOCNd_fMhGU1TDiwBsgTwdN0dZRaBolnMmhJGscyvDFr7Bz_rDbMfpVLOvoEl-nNohJyJBmTU" 
                                />
                            </div>
                            <div className="absolute bottom-12 right-0 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-surface-container-high transform rotate-3">
                                <div className="w-10 h-10 rounded-full bg-[#FACD15] flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[#1F3F34] font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                                </div>
                                <div className="text-left">
                                    <p className="text-xs font-bold uppercase text-[#1F3F34]/60 leading-none mb-1">Status</p>
                                    <p className="font-bold text-[#1F3F34] leading-none">Verified Partner</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h2 className="font-headline font-black text-5xl text-[#1F3F34] leading-tight tracking-tighter">
                                Earn more.<br/>
                                <span className="text-[#FACD15]">Work near home.</span>
                            </h2>
                            <div className="flex justify-center gap-6 pt-4">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#1F3F34]">local_shipping</span>
                                    <span className="font-bold text-[#1F3F34]">Daily Payouts</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#1F3F34]">health_and_safety</span>
                                    <span className="font-bold text-[#1F3F34]">Insurance</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[#1F3F34]">support_agent</span>
                                    <span className="font-bold text-[#1F3F34]">24/7 Help</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <AuthFooter />

            <style>{`
                .mask-blob {
                    mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23FF0066' d='M44.7,-76.4C58.1,-69.2,69.2,-58.1,77.4,-44.7C85.6,-31.3,91,-15.7,90.5,-0.3C90,15.1,83.6,30.2,74.4,43.3C65.2,56.4,53.2,67.5,39.4,75.3C25.6,83.1,10,87.6,-4.8,95.9C-19.6,104.2,-33.5,116.3,-45.8,114.3C-58.1,112.3,-68.8,96.2,-77.3,81.4C-85.8,66.6,-92.1,53.1,-95.5,38.9C-98.9,24.7,-99.3,9.8,-96.2,-4.3C-93.1,-18.4,-86.5,-31.7,-77.6,-43.3C-68.7,-54.9,-57.5,-64.8,-45.1,-72.6C-32.7,-80.4,-19.1,-86.1,-2.7,-81.4C13.7,-76.7,27.4,-61.6,44.7,-76.4Z' transform='translate(100 100)' /%3E%3C/svg%3E");
                    mask-size: contain;
                    mask-repeat: no-repeat;
                    mask-position: center;
                }
            `}</style>
        </div>
    );
};

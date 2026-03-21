import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/providers/AuthContext';
import { authService } from '../api/auth.service';

import { motion } from 'framer-motion';
import { AdvancedFileUpload } from '../../profile/components/AdvancedFileUpload';

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

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await authService.sendOtp(formData.email);
            setOtpSent(true);
            setTimeLeft(45);
        } catch (err) {
            console.error('OTP Send Error:', err);
            setError('Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (value: string, index: number) => {
        if (value.length > 1) {
            if (value.length === 6) {
                setOtp(value.split(''));
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

    const handleVerifyAndRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const data = await authService.register({
                ...formData,
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

    const isFormValid = formData.firstName && formData.lastName && formData.email && formData.phone && formData.password;

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
                                    alt="Confident Indian Business Owner" 
                                    className="w-full h-full object-cover scale-110" 
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXu Ak7jFT3v3L52SZMUDlod-YxmK1Mos92VrWyd7XTbEoN5wS06Nfhv66B2gkCDVHLlWMpamgrTuCKMrOSCHeptO3mzh9eVA9ElgIN2hZxuCmelsJtdHvp8M5HEno4_s1VsZ-UQ5ijumQZjUsR3UKrcHRe_H6psnVxzrBlBbGvauV67YRxAWWW3DAy13JUKI8gtO3JHO3WDxwzo2DvC7-sTMuWGZ4MVYTqaidjNR_DYXJ6Bs4-BkaAUYjNlNx2-geCX6MtJ0PFxoi7Cs" 
                                />
                            </div>

                            {/* Floating Verification Card */}
                            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-[0_20px_40px_-10px_rgba(31,63,52,0.08)] border border-white/20 flex items-start gap-4 max-w-xs transition-transform hover:scale-105 duration-300">
                                <div className="w-12 h-12 bg-[#FACD15]/10 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="material-symbols-outlined text-[#FACD15]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-[#1F3F34] text-lg leading-none mb-1">Secure & Verified</h3>
                                    <p className="text-sm text-[#1F3F34]/60 leading-snug font-medium">We take your data security seriously with enterprise-grade encryption.</p>
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
        <div className="min-h-screen bg-surface font-body text-on-surface antialiased selection:bg-primary-fixed selection:text-primary">
            {/* Minimal Header */}
            <header className="fixed top-0 left-0 w-full z-50 px-6 py-6 md:px-12 pointer-events-none">
                <div className="max-w-[1440px] mx-auto flex justify-between items-center pointer-events-auto">
                    <div className="flex items-center gap-2">
                        <Link to="/" className="text-2xl font-black text-primary font-headline tracking-tighter">TrustHire</Link>
                    </div>
                    <Link className="flex items-center gap-2 text-primary/70 hover:text-primary transition-colors font-bold text-sm" to="/">
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                        Home
                    </Link>
                </div>
            </header>

            <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
                {/* Left Side: Registration Form */}
                <section className="bg-surface-container-lowest flex items-center justify-center px-6 py-24 md:px-12 lg:px-24">
                    <div className="w-full max-w-md">
                        <div className="mb-10">
                            <h1 className="font-headline text-4xl font-extrabold text-primary tracking-tight mb-3">Create Employer Account</h1>
                            <p className="text-primary/70 text-lg leading-relaxed font-medium">Hire the India's most verified workers.</p>
                        </div>

                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-8 p-4 bg-error-container border border-error/10 text-error font-bold text-sm rounded-xl flex items-center gap-3"
                            >
                                <span className="material-symbols-outlined text-xl">error</span>
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSendOtp} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block font-label text-xs font-bold text-primary uppercase tracking-wider">First Name</label>
                                    <input 
                                        className="w-full bg-surface-container-high border border-gray-200 rounded-[4px] px-4 py-3 focus:border-[#FACD15] focus:ring-4 focus:ring-[#FACD15]/10 transition-all outline-none placeholder:text-primary/30" 
                                        placeholder="Rahul" 
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block font-label text-xs font-bold text-primary uppercase tracking-wider">Last Name</label>
                                    <input 
                                        className="w-full bg-surface-container-high border border-gray-200 rounded-[4px] px-4 py-3 focus:border-[#FACD15] focus:ring-4 focus:ring-[#FACD15]/10 transition-all outline-none placeholder:text-primary/30" 
                                        placeholder="Sharma" 
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block font-label text-xs font-bold text-primary uppercase tracking-wider">Work Email</label>
                                <input 
                                    className="w-full bg-surface-container-high border border-gray-200 rounded-[4px] px-4 py-3 focus:border-[#FACD15] focus:ring-4 focus:ring-[#FACD15]/10 transition-all outline-none placeholder:text-primary/30" 
                                    placeholder="rahul@company.com" 
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block font-label text-xs font-bold text-primary uppercase tracking-wider">Phone Number</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 font-bold">+91</span>
                                    <input 
                                        className="w-full bg-surface-container-high border border-gray-200 rounded-[4px] pl-14 pr-4 py-3 focus:border-[#FACD15] focus:ring-4 focus:ring-[#FACD15]/10 transition-all outline-none placeholder:text-primary/30 font-bold" 
                                        placeholder="98765 43210" 
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                                        maxLength={10}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block font-label text-xs font-bold text-primary uppercase tracking-wider">Password</label>
                                <input 
                                    className="w-full bg-surface-container-high border border-gray-200 rounded-[4px] px-4 py-3 focus:border-[#FACD15] focus:ring-4 focus:ring-[#FACD15]/10 transition-all outline-none placeholder:text-primary/30" 
                                    placeholder="min 8 chars" 
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <AdvancedFileUpload 
                                    onUploadSuccess={(urls) => setFormData({...formData, profile_image_url: urls[0] || ''})}
                                    maxFiles={1}
                                    label="Profile Photo"
                                />
                            </div>

                            <div className="pt-4">
                                <button 
                                    disabled={isLoading || !isFormValid}
                                    className="w-full bg-[#FACD15] text-[#002117] font-headline font-extrabold py-5 rounded-[4px] shadow-[inset_0_-2px_0_rgba(0,0,0,0.1)] hover:brightness-105 active:scale-[0.98] transition-all uppercase tracking-wider flex items-center justify-center gap-2" 
                                    type="submit"
                                >
                                    {isLoading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : (
                                        <>
                                            <span>Create Account</span>
                                            <span className="material-symbols-outlined font-bold">arrow_forward</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            <p className="text-center text-xs text-primary/50 leading-relaxed px-4 font-medium">
                                By signing up, you agree to TrustHire's <Link className="text-primary font-bold hover:underline" to="/terms">Terms of Service</Link> and <Link className="text-primary font-bold hover:underline" to="/privacy">Privacy Policy</Link>.
                            </p>
                        </form>

                        <div className="mt-8 pt-8 border-t border-primary/5 text-center">
                            <p className="text-primary/70 font-bold">Already have an account? <Link className="text-primary font-black uppercase tracking-tight underline decoration-primary-fixed decoration-2 hover:bg-primary-fixed transition-colors ml-1" to="/sign-in">Sign In</Link></p>
                        </div>
                    </div>
                </section>

                {/* Right Side: Brand Imagery & Social Proof */}
                <section className="hidden lg:flex relative bg-surface-container overflow-hidden items-start justify-center pt-24 px-12 pb-12">
                    {/* Decorative Organic Blobs */}
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-fixed opacity-10 organic-blob"></div>
                    <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-secondary opacity-5 organic-blob"></div>
                    
                    <div className="relative z-10 w-full max-w-xl">
                        {/* Main Image Container with Asymmetric Radius */}
                        <div className="relative rounded-t-[100px] rounded-bl-[100px] rounded-br-[24px] overflow-hidden shadow-2xl">
                            <img 
                                alt="Smiling Indian Business Owner" 
                                className="w-full h-[600px] object-cover" 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiddZFjInZgXifqIiKmNkpyYgOHfgloc1dW2CyknxU-Qm_qXKpYEmhnQSYfCQrIdS2QaWjicdomzaGRxlN4BD_G6yDuaEhyQ5fk4G4v0aAHHMrQ0XwCMulCb4t31HihgdFAH-akZdNMGeJr1KJkIpMRRvl587QU_9_C-WJizFmJPfN8cZ2rLQs9RBbnnmc7XKibRh9uL7z7dyfA3PijjTDCU4Ab1pr0wby8Phit1IxgTwgqyOSeOJR1KsbZR1XZK-XZbmqgk8B85Y" 
                            />
                            {/* Overlay Glass Card */}
                            <div className="absolute bottom-8 left-8 right-8 bg-white/80 backdrop-blur-xl p-6 rounded-[24px] border border-white/20 shadow-xl">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex -space-x-2">
                                        <img className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="User avatar 1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAT7ARiV7Xs__Vgtzs97iRFV6A_XjZIOWim_T9pwiAxpAsDA5AZdSTXbXmyJ72q6KLk6RIxcX0sA6EIUrcLzGGxxhNssuFBZ72rz9aGOePLQbJTNS4v9uVd5cnry6k0TBNYuX-6kruTNQj2_m1GoWt8zucIXLKNUJfoU97gqZoad3TuJULkiHQtPBNq_WpYG-NSPhuigq4JdiXr1Fkui0xqXhVOX_oS6fQzMpzjgPd4fL9mGymmthoTATLI5EE694JdtIET-UrG-mE"/>
                                        <img className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="User avatar 2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgw3vzF1BJTDmK67s8sxe6cV6Z-DFJIHhzrN2ar1-VxLFEtWdCwgWePn1QpjAASXo_E8BT3uEHt-ChBCgql8PoFElNVQ9T5Jq63E5EA4aCKNFBsbIlrqzTp5RqMY7zer_vbnNn_Vi3tI5gMc7F2oiZrhN14lTKEViKrG0W35BhPdwAr72-PYDm9rf87DTsQgYT7K7v6nqcOm2sueRTZK0pu9wm1rzaRpqtnOk_K7pLOJbxD8Djq9hq_u41BHZeBbbdPCnaFYG73Is"/>
                                        <img className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="User avatar 3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJxwsFm2fBG57o0j6rPuIvEUY3lRnjA6yU_VRtLvjxK1W3rfS6cxyAyaaaFGhxwgw5hg39mwZXZ2jD9jNtuDLY68COvjwFihh8TZy6WsYRwYbMe18xCsPGY7JYc89RYKIIyK1UJWz2rCRIQNfZh8bYCIA1gBbJMnutlKYyhocKOhLsWB2pMHhsS83srFQ6a4is3mX9KdtmBN_dxc7hrqbYW4JM-PM4igOW166dBA15KLvtiB594icvRGUxiaCdf33arcx8ONKYKB4"/>
                                    </div>
                                    <span className="text-sm font-headline font-extrabold text-[#1F3F34]">3,200+ Businesses Trusted</span>
                                </div>
                                <p className="italic text-[#1F3F34]/80 text-lg leading-snug font-body">
                                    "TrustHire transformed our staffing process. We found verified, reliable talent within 48 hours. It's truly a neighborhood-first approach."
                                </p>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-xs font-bold text-[#1F3F34] uppercase tracking-widest">— Ananya K., Founder at Bloom</span>
                                    <div className="flex gap-1 text-[#FACD15]">
                                        <span className="material-symbols-outlined fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Subtle Brand Pillars */}
                        <div className="grid grid-cols-3 gap-6 mt-12">
                            <div className="space-y-2 group">
                                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">verified_user</span>
                                <h4 className="font-black text-sm text-primary uppercase tracking-tight">Verified Only</h4>
                                <p className="text-xs text-primary/60">100% background-checked workers.</p>
                            </div>
                            <div className="space-y-2 group">
                                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">bolt</span>
                                <h4 className="font-black text-sm text-primary uppercase tracking-tight">Fast Hiring</h4>
                                <p className="text-xs text-primary/60">Average hire time: 24 hours.</p>
                            </div>
                            <div className="space-y-2 group">
                                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">handshake</span>
                                <h4 className="font-black text-sm text-primary uppercase tracking-tight">Local Focus</h4>
                                <p className="text-xs text-primary/60">Find talent right in your area.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer minimized for signup flow */}
            <footer className="bg-surface py-12 px-6 text-center lg:text-left border-t border-primary/5">
                <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-primary/40 text-[10px] font-bold uppercase tracking-widest font-headline">
                    <p>© 2024 TrustHire. Human-centric recruitment.</p>
                    <div className="flex gap-8">
                        <Link className="hover:text-primary transition-colors" to="/privacy">Privacy</Link>
                        <Link className="hover:text-primary transition-colors" to="/terms">Terms</Link>
                        <Link className="hover:text-primary transition-colors" to="/support">Support</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

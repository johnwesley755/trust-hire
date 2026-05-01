import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { sendOtp, registerUser } from '../../store/slices/authSlice';
import { motion } from 'framer-motion';
import { AdvancedFileUpload } from '../../components/profile/AdvancedFileUpload';

export default function SignUpPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        profile_image_url: '',
        role: 'EMPLOYER' as 'EMPLOYER'
    });
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpSent, setOtpSent] = useState(false);
    const [timeLeft, setTimeLeft] = useState(45);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading: isLoading, error } = useAppSelector((state) => state.auth);

    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
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
        
        if (!formData.email || !formData.phoneNumber || !formData.firstName || !formData.lastName || !formData.password) {
            alert('Please fill in all mandatory fields before requesting an OTP.');
            return;
        }

        if (formData.phoneNumber.length < 10) {
            alert('Please enter a valid 10-digit phone number.');
            return;
        }

        dispatch(sendOtp(formData.email)).unwrap().then(() => {
            setOtpSent(true);
            setTimeLeft(45);
        });
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
        
        const lastIdx = Math.min(chars.length - 1, 5);
        document.getElementById(`otp-${lastIdx}`)?.focus();
    };

    const handleVerifyAndRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(registerUser({
            ...formData,
            phoneNumber: `+91${formData.phoneNumber}`,
            otp: otp.join('')
        })).unwrap().then(() => {
            navigate('/onboarding');
        });
    };

    const isFormValid = formData.firstName && formData.lastName && formData.email && formData.phoneNumber && formData.password;

    if (otpSent) {
        return (
            <div className="bg-[#FAF9F4] text-[#1F3F34] font-body min-h-screen flex flex-col antialiased selection:bg-[#FACD15] selection:text-[#1F3F34]">
                <main className="flex-grow flex flex-col md:flex-row h-full">
                    {/* Left Column: OTP Content */}
                    <section className="w-full md:w-1/2 flex items-start justify-center p-8 md:p-16 lg:p-24 bg-[#F5F4EF] pt-12 md:pt-16 lg:pt-20">
                        <div className="max-w-md w-full text-left">
                            {/* Brand Anchor */}
                            <div className="mb-12">
                                <span className="text-2xl font-black text-[#1F3F34] tracking-tighter uppercase bricolage">TrustHire</span>
                            </div>
                            
                            <header className="space-y-2 mb-10">
                                <h1 className="text-4xl md:text-5xl font-black text-[#1F3F34] leading-tight tracking-tight uppercase bricolage">
                                    Verify Identity
                                </h1>
                                <p className="text-[#1F3F34]/60 text-lg leading-relaxed font-medium">
                                    We've sent a 6-digit code to <span className="font-bold text-[#1F3F34]">{formData.email}</span>
                                </p>
                            </header>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 font-bold text-sm rounded-xl flex items-center gap-3">
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
                                            className="w-full h-16 text-center text-2xl font-black bg-white border-2 border-transparent focus:border-[#FACD15] rounded-2xl transition-all outline-none shadow-sm" 
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
                                    className="w-full bg-[#FACD15] text-[#1F3F34] py-5 rounded-2xl font-black text-sm tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-[#FACD15]/10 hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 uppercase"
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
                                        className="text-[#1F3F34]/60 hover:text-[#1F3F34] font-black text-sm transition-colors border-b-2 border-transparent hover:border-[#FACD15] pb-0.5 uppercase tracking-tighter"
                                    >
                                        Go back and edit details
                                    </button>
                                    
                                    <button 
                                        onClick={handleSendOtp}
                                        disabled={timeLeft > 0 || isLoading}
                                        className="text-[#1F3F34]/40 text-xs font-black uppercase tracking-widest hover:text-[#1F3F34] transition-colors disabled:opacity-50"
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
                            <div className="aspect-square w-full bg-[#1F3F34] organic-blob relative overflow-hidden shadow-2xl">
                                <img 
                                    alt="Professional operative" 
                                    className="w-full h-full object-cover scale-110" 
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAk7jFT3v3L52SZMUDlod-YxmK1Mos92VrWyd7XTbEoN5wS06Nfhv66B2gkCDVHLlWMpamgrTuCKMrOSCHeptO3mzh9eVA9ElgIN2hZxuCmelsJtdHvp8M5HEno4_s1VsZ-UQ5ijumQZjUsR3UKrcHRe_H6psnVxzrBlBbGvauV67YRxAWWW3DAy13JUKI8gtO3JHO3WDxwzo2DvC7-sTMuWGZ4MVYTqaidjNR_DYXJ6Bs4-BkaAUYjNlNx2-geCX6MtJ0PFxoi7Cs" 
                                />
                            </div>

                            <div className="absolute -bottom-6 -left-6 bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-[#1F3F34]/5 border border-white/20 flex items-start gap-4 max-w-xs transition-transform hover:scale-105 duration-300 text-left">
                                <div className="w-12 h-12 bg-[#FACD15]/10 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="material-symbols-outlined text-[#FACD15]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                                </div>
                                <div>
                                    <h3 className="font-black text-[#1F3F34] text-lg leading-none mb-1 uppercase bricolage">Secure & Verified</h3>
                                    <p className="text-sm text-[#1F3F34]/60 leading-snug font-medium">Enterprise-grade encryption for all human capital data.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="bg-[#F5F4EF] py-8 px-8 flex flex-col md:flex-row justify-between items-center w-full border-t border-[#1F3F34]/5 mt-auto">
                    <div className="text-[#1F3F34] font-black text-xl mb-4 md:mb-0 tracking-tighter uppercase bricolage">TrustHire</div>
                    <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-[#1F3F34]/40">
                        <Link className="hover:text-[#FACD15] transition-all" to="/privacy">Privacy Policy</Link>
                        <Link className="hover:text-[#FACD15] transition-all" to="/terms">Terms of Service</Link>
                        <Link className="hover:text-[#FACD15] transition-all" to="/support">Help Center</Link>
                    </div>
                </footer>

                <style>{`
                    .organic-blob {
                        border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-body text-[#1F3F34] antialiased selection:bg-[#FACD15] selection:text-[#1F3F34]">
            <header className="fixed top-0 left-0 w-full z-50 px-6 py-6 md:px-12 pointer-events-none">
                <div className="max-w-[1440px] mx-auto flex justify-between items-center pointer-events-auto">
                    <Link to="/" className="text-2xl font-black text-[#1F3F34] tracking-tighter uppercase bricolage">TrustHire</Link>
                    <Link className="flex items-center gap-2 text-[#1F3F34]/60 hover:text-[#1F3F34] transition-colors font-black text-xs uppercase tracking-widest" to="/">
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                        Home
                    </Link>
                </div>
            </header>

            <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
                {/* Left Side: Registration Form */}
                <section className="bg-white flex items-center justify-center px-6 py-24 md:px-12 lg:px-24">
                    <div className="w-full max-w-md text-left">
                        <div className="mb-10">
                            <h1 className="text-4xl font-black text-[#1F3F34] tracking-tight mb-3 uppercase bricolage">Create Employer Account</h1>
                            <p className="text-[#1F3F34]/60 text-lg leading-relaxed font-medium">Hire the India's most verified workers.</p>
                        </div>

                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 font-bold text-sm rounded-xl flex items-center gap-3"
                            >
                                <span className="material-symbols-outlined text-xl">error</span>
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSendOtp} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-[#1F3F34] uppercase tracking-wider">First Name</label>
                                    <input 
                                        className="w-full bg-[#F5F4EF] border-2 border-transparent focus:border-[#FACD15] rounded-2xl px-4 py-3 transition-all outline-none placeholder:text-[#1F3F34]/30 font-bold" 
                                        placeholder="Rahul" 
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-[#1F3F34] uppercase tracking-wider">Last Name</label>
                                    <input 
                                        className="w-full bg-[#F5F4EF] border-2 border-transparent focus:border-[#FACD15] rounded-2xl px-4 py-3 transition-all outline-none placeholder:text-[#1F3F34]/30 font-bold" 
                                        placeholder="Sharma" 
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-[#1F3F34] uppercase tracking-wider">Work Email</label>
                                <input 
                                    className="w-full bg-[#F5F4EF] border-2 border-transparent focus:border-[#FACD15] rounded-2xl px-4 py-3 transition-all outline-none placeholder:text-[#1F3F34]/30 font-bold" 
                                    placeholder="rahul@company.com" 
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-[#1F3F34] uppercase tracking-wider">Phone Number</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1F3F34]/60 font-black">+91</span>
                                    <input 
                                        className="w-full bg-[#F5F4EF] border-2 border-transparent focus:border-[#FACD15] rounded-2xl pl-14 pr-4 py-3 transition-all outline-none placeholder:text-[#1F3F34]/30 font-black" 
                                        placeholder="98765 43210" 
                                        type="tel"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value.replace(/\D/g, '')})}
                                        maxLength={10}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-[#1F3F34] uppercase tracking-wider">Password</label>
                                <input 
                                    className="w-full bg-[#F5F4EF] border-2 border-transparent focus:border-[#FACD15] rounded-2xl px-4 py-3 transition-all outline-none placeholder:text-[#1F3F34]/30 font-bold" 
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
                                    className="w-full bg-[#FACD15] text-[#1F3F34] font-black py-5 rounded-2xl shadow-xl shadow-[#FACD15]/10 hover:brightness-105 active:scale-[0.98] transition-all uppercase tracking-widest flex items-center justify-center gap-2" 
                                    type="submit"
                                >
                                    {isLoading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : (
                                        <>
                                            <span>Create Account</span>
                                            <span className="material-symbols-outlined font-black">arrow_forward</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            <p className="text-center text-[10px] text-[#1F3F34]/30 font-black uppercase tracking-widest leading-relaxed px-4">
                                By signing up, you agree to TrustHire's <Link className="text-[#1F3F34] hover:underline" to="/terms">Terms</Link> & <Link className="text-[#1F3F34] hover:underline" to="/privacy">Privacy</Link>.
                            </p>
                        </form>

                        <div className="mt-8 pt-8 border-t border-[#1F3F34]/5 text-center">
                            <p className="text-[#1F3F34]/60 font-bold">Already have an account? <Link className="text-[#1F3F34] font-black uppercase tracking-tight underline decoration-[#FACD15] decoration-2 hover:bg-[#FACD15] transition-colors ml-1" to="/sign-in">Sign In</Link></p>
                        </div>
                    </div>
                </section>

                {/* Right Side */}
                <section className="hidden lg:flex relative bg-[#F5F4EF] overflow-hidden items-start justify-center pt-24 px-12 pb-12">
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#FACD15] opacity-10 organic-blob"></div>
                    <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-[#1F3F34] opacity-5 organic-blob"></div>
                    
                    <div className="relative z-10 w-full max-w-xl">
                        <div className="relative rounded-[5rem] overflow-hidden shadow-2xl bg-[#1F3F34]">
                            <img 
                                alt="Professional environment" 
                                className="w-full h-[600px] object-cover grayscale-[0.2]" 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiddZFjInZgXifqIiKmNkpyYgOHfgloc1dW2CyknxU-Qm_qXKpYEmhnQSYfCQrIdS2QaWjicdomzaGRxlN4BD_G6yDuaEhyQ5fk4G4v0aAHHMrQ0XwCMulCb4t31HihgdFAH-akZdNMGeJr1KJkIpMRRvl587QU_9_C-WJizFmJPfN8cZ2rLQs9RBbnnmc7XKibRh9uL7z7dyfA3PijjTDCU4Ab1pr0wby8Phit1IxgTwgqyOSeOJR1KsbZR1XZK-XZbmqgk8B85Y" 
                            />
                            <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-xl p-8 rounded-[3rem] border border-white/20 shadow-xl text-left">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => (
                                            <img key={i} className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="User" src={`https://i.pravatar.cc/100?u=${i+20}`} />
                                        ))}
                                    </div>
                                    <span className="text-sm font-black text-[#1F3F34] uppercase tracking-tighter bricolage">3,200+ Businesses Trusted</span>
                                </div>
                                <p className="italic text-[#1F3F34]/80 text-lg leading-snug font-medium">
                                    "TrustHire transformed our staffing process. We found verified, reliable talent within 48 hours."
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6 mt-12 text-left">
                            <div className="space-y-2">
                                <span className="material-symbols-outlined text-[#FACD15] text-3xl font-black">verified_user</span>
                                <h4 className="font-black text-sm text-[#1F3F34] uppercase tracking-tight">Verified Only</h4>
                                <p className="text-xs text-[#1F3F34]/40 font-medium">100% background-checked workers.</p>
                            </div>
                            <div className="space-y-2">
                                <span className="material-symbols-outlined text-[#FACD15] text-3xl font-black">bolt</span>
                                <h4 className="font-black text-sm text-[#1F3F34] uppercase tracking-tight">Fast Hiring</h4>
                                <p className="text-xs text-[#1F3F34]/40 font-medium">Average hire time: 24 hours.</p>
                            </div>
                            <div className="space-y-2">
                                <span className="material-symbols-outlined text-[#FACD15] text-3xl font-black">handshake</span>
                                <h4 className="font-black text-sm text-[#1F3F34] uppercase tracking-tight">Local Focus</h4>
                                <p className="text-xs text-[#1F3F34]/40 font-medium">Find talent right in your area.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

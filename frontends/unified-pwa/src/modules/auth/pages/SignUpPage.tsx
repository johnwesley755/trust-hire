import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../providers/AuthContext';
import apiClient from '../../../api/apiClient';
import { AuthHeader } from '../components/AuthHeader';
import { AuthFooter } from '../components/AuthFooter';
import { motion } from 'framer-motion';

export const SignUpPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const queryRole = searchParams.get('role')?.toUpperCase();
    const [activeRole, setActiveRole] = useState<'WORKER' | 'EMPLOYER'>(queryRole === 'EMPLOYER' ? 'EMPLOYER' : 'WORKER');
    
    // Worker / Standard Form States
    const [workerForm, setWorkerForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
    });

    // Employer OTP States
    const [employerEmail, setEmployerEmail] = useState('');
    const [employerPassword, setEmployerPassword] = useState('');
    const [employerOtp, setEmployerOtp] = useState(['', '', '', '', '', '']);
    const [otpSent, setOtpSent] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { user, isSignedIn, login, signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    // Auto redirect when user becomes signed in
    React.useEffect(() => {
        if (isSignedIn && user) {
            const target = user.role === 'EMPLOYER' ? '/dashboard' : '/search';
            navigate(target, { replace: true });
        }
    }, [isSignedIn, user, navigate]);

    const handleRoleToggle = (role: 'WORKER' | 'EMPLOYER') => {
        setActiveRole(role);
        setSearchParams({ role });
        setError('');
        setOtpSent(false);
    };

    // Worker Registration Submit
    const handleWorkerSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await apiClient.post('/api/auth/register', {
                email: workerForm.email,
                password: workerForm.password,
                firstName: workerForm.firstName,
                lastName: workerForm.lastName,
                phoneNumber: workerForm.phoneNumber,
                role: 'WORKER'
            });

            login(res.data.token, res.data.user);
            // Navigate worker directly to jobs portal
            navigate('/search');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please check your details.');
        } finally {
            setIsLoading(false);
        }
    };

    // Employer Send OTP
    const handleSendEmployerOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!employerEmail) {
            setError('Please enter your business email');
            return;
        }
        setIsLoading(true);
        setError('');

        try {
            await apiClient.post('/api/auth/send-otp', { email: employerEmail });
            setOtpSent(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send OTP.');
        } finally {
            setIsLoading(false);
        }
    };

    // Employer Verify OTP and Complete
    const handleVerifyEmployerOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await apiClient.post('/api/auth/register', {
                email: employerEmail,
                firstName: 'Business',
                lastName: 'Employer',
                role: 'EMPLOYER',
                password: employerPassword
            });

            const userData = res.data.user || res.data.data?.user;
            const token = res.data.token || res.data.data?.token;
            login(token, userData);
            // Navigate to employer onboarding for business details verification
            navigate('/onboarding');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid OTP code or Email already in use.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (value: string, index: number) => {
        if (value.length > 1) value = value.slice(-1);
        const newOtp = [...employerOtp];
        newOtp[index] = value;
        setEmployerOtp(newOtp);

        if (value && index < 5) {
            document.getElementById(`signup-otp-${index + 1}`)?.focus();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain').trim().replace(/\D/g, '').slice(0, 6);
        if (pastedData) {
            const newOtp = [...employerOtp];
            for (let i = 0; i < pastedData.length; i++) {
                newOtp[i] = pastedData[i];
            }
            setEmployerOtp(newOtp);
            // Focus the next empty input or the last input
            const nextIndex = Math.min(pastedData.length, 5);
            document.getElementById(`signup-otp-${nextIndex}`)?.focus();
        }
    };

    return (
        <div className="bg-slate-50 text-slate-900 font-body min-h-screen flex flex-col selection:bg-brand-500 selection:text-[#002117] antialiased">
            <AuthHeader />

            <main className="w-full max-w-5xl mx-auto px-4 pt-24 pb-12 flex-1 flex items-center justify-center">
                <div className="w-full bg-white rounded-2xl border border-slate-900/10 shadow-xl overflow-hidden grid md:grid-cols-2">
                    
                    {/* Left Column: Form Content */}
                    <div className="p-6 md:p-10 flex flex-col justify-center">
                        
                        {/* Role Switcher Pill */}
                        <div className="flex bg-slate-50 p-1 rounded-xl mb-6 border border-slate-900/10">
                            <button
                                type="button"
                                onClick={() => handleRoleToggle('WORKER')}
                                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                                    activeRole === 'WORKER' 
                                    ? 'bg-slate-900 text-brand-500 shadow-sm' 
                                    : 'text-slate-900/60 hover:text-slate-900'
                                }`}
                            >
                                <span className="material-symbols-outlined text-sm">badge</span>
                                Skilled Worker
                            </button>
                            <button
                                type="button"
                                onClick={() => handleRoleToggle('EMPLOYER')}
                                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                                    activeRole === 'EMPLOYER' 
                                    ? 'bg-slate-900 text-brand-500 shadow-sm' 
                                    : 'text-slate-900/60 hover:text-slate-900'
                                }`}
                            >
                                <span className="material-symbols-outlined text-sm">business</span>
                                Employer / Business
                            </button>
                        </div>

                        <div className="mb-6">
                            <h1 className="font-headline text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                                {activeRole === 'WORKER' ? 'Join as Verified Worker' : 'Register Employer Account'}
                            </h1>
                            <p className="text-slate-900/60 text-xs md:text-sm mt-1 font-medium">
                                {activeRole === 'WORKER' 
                                    ? 'Sign up with Google or Email and start receiving verified job offers.' 
                                    : 'Enter your business email for instant OTP verification.'}
                            </p>
                        </div>

                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-lg flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-base">error</span>
                                <span>{error}</span>
                            </motion.div>
                        )}

                        {activeRole === 'WORKER' ? (
                            /* Worker Registration: 1-Click Google OAuth & Email */
                            <div className="space-y-4">
                                <button
                                    type="button"
                                    onClick={() => signInWithGoogle()}
                                    className="w-full bg-white border-2 border-slate-900/15 hover:border-brand-500 text-slate-900 py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-3 transition-all hover:bg-neutral-50 shadow-sm active:scale-98"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                                    </svg>
                                    Sign Up with Google
                                </button>

                                <div className="flex items-center gap-3 my-2">
                                    <div className="flex-1 h-px bg-slate-900/10"></div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900/40">or fill details</span>
                                    <div className="flex-1 h-px bg-slate-900/10"></div>
                                </div>

                                <form onSubmit={handleWorkerSignUp} className="space-y-3">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">First Name</label>
                                            <input
                                                type="text"
                                                value={workerForm.firstName}
                                                onChange={(e) => setWorkerForm({...workerForm, firstName: e.target.value})}
                                                placeholder="Ravi"
                                                required
                                                className="w-full bg-slate-50 border border-slate-900/10 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Last Name</label>
                                            <input
                                                type="text"
                                                value={workerForm.lastName}
                                                onChange={(e) => setWorkerForm({...workerForm, lastName: e.target.value})}
                                                placeholder="Kumar"
                                                required
                                                className="w-full bg-slate-50 border border-slate-900/10 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Email Address</label>
                                        <input
                                            type="email"
                                            value={workerForm.email}
                                            onChange={(e) => setWorkerForm({...workerForm, email: e.target.value})}
                                            placeholder="ravi@gmail.com"
                                            required
                                            className="w-full bg-slate-50 border border-slate-900/10 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Phone Number</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-900/60">+91</span>
                                            <input
                                                type="tel"
                                                maxLength={10}
                                                value={workerForm.phoneNumber}
                                                onChange={(e) => setWorkerForm({...workerForm, phoneNumber: e.target.value.replace(/\D/g, '')})}
                                                placeholder="9876543210"
                                                required
                                                className="w-full pl-12 bg-slate-50 border border-slate-900/10 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Password</label>
                                        <input
                                            type="password"
                                            value={workerForm.password}
                                            onChange={(e) => setWorkerForm({...workerForm, password: e.target.value})}
                                            placeholder="min 8 characters"
                                            required
                                            className="w-full bg-slate-50 border border-slate-900/10 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full mt-3 bg-brand-500 text-slate-900 py-3 rounded-lg font-bold text-xs uppercase tracking-wider shadow-sm hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> : 'Create Worker Profile'}
                                    </button>
                                </form>
                            </div>
                        ) : (
                            /* Employer Registration: OTP Flow */
                            <div className="space-y-4">
                                {!otpSent ? (
                                    <form onSubmit={handleSendEmployerOtp} className="space-y-3">
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Business Email Address</label>
                                            <input
                                                type="email"
                                                value={employerEmail}
                                                onChange={(e) => setEmployerEmail(e.target.value)}
                                                placeholder="talent@yourcompany.com"
                                                required
                                                className="w-full bg-slate-50 border border-slate-900/10 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Password</label>
                                            <input
                                                type="password"
                                                value={employerPassword}
                                                onChange={(e) => setEmployerPassword(e.target.value)}
                                                placeholder="min 8 characters"
                                                required
                                                className="w-full bg-slate-50 border border-slate-900/10 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isLoading || !employerEmail || !employerPassword}
                                            className="w-full mt-2 bg-brand-500 text-slate-900 py-3 rounded-lg font-bold text-xs uppercase tracking-wider shadow-sm hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2"
                                        >
                                            {isLoading ? <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> : 'Send OTP to Verify'}
                                        </button>
                                    </form>
                                ) : (
                                    <form onSubmit={handleVerifyEmployerOtp} className="space-y-4">
                                        <p className="text-xs text-slate-900/70">
                                            Enter the 6-digit code sent to <strong className="text-slate-900">{employerEmail}</strong>
                                        </p>

                                        <div className="flex gap-2 justify-between">
                                            {employerOtp.map((digit, idx) => (
                                                <input
                                                    key={idx}
                                                    id={`signup-otp-${idx}`}
                                                    type="text"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange(e.target.value, idx)}
                                                    onPaste={handleOtpPaste}
                                                    className="w-10 h-12 text-center text-lg font-black bg-slate-50 border border-slate-900/15 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                                                />
                                            ))}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isLoading || employerOtp.join('').length < 6}
                                            className="w-full bg-brand-500 text-slate-900 py-3 rounded-lg font-bold text-xs uppercase tracking-wider shadow-sm hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2"
                                        >
                                            {isLoading ? <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> : 'Verify & Continue to Setup'}
                                        </button>

                                        <div className="text-center">
                                            <button
                                                type="button"
                                                onClick={() => setOtpSent(false)}
                                                className="text-[11px] font-bold text-slate-900/60 hover:text-slate-900"
                                            >
                                                Change Email
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}

                        <div className="mt-6 pt-4 border-t border-slate-900/5 text-center">
                            <p className="text-xs text-slate-900/60 font-medium">
                                Already registered?{' '}
                                <Link to={`/sign-in?role=${activeRole}`} className="text-slate-900 font-bold underline hover:text-brand-500">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Visual Brand Card */}
                    <div className="hidden md:flex bg-slate-900 p-8 flex-col justify-between text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
                        
                        <div>
                            <span className="inline-block bg-brand-500 text-[#002117] text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider mb-4">
                                {activeRole === 'WORKER' ? 'Job Preferences & AI Match' : 'Direct Hiring Solution'}
                            </span>
                            <h2 className="font-headline text-2xl font-black text-white leading-tight">
                                {activeRole === 'WORKER' 
                                    ? 'Set Your Work Preferences'
                                    : 'Verify Once, Hire Anytime'}
                            </h2>
                            <p className="text-white/70 text-xs mt-2 leading-relaxed">
                                {activeRole === 'WORKER'
                                    ? 'Select your skills, desired rate, preferred travel radius, and get curated high-paying jobs directly.'
                                    : 'Complete your business profile in 2 minutes and gain instant access to 12,000+ verified workers in your city.'}
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 mt-6 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-brand-500 text-[#002117] flex items-center justify-center font-bold">
                                    <span className="material-symbols-outlined text-base">recommend</span>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white">Smart Match Recommendations</p>
                                    <p className="text-[10px] text-white/60">Automated job matching calibrated to your hourly rate & location</p>
                                </div>
                            </div>
                        </div>

                        <div className="text-[10px] text-white/40 mt-4 font-mono">
                            TrustHire Protocol v2.4 • Supabase Integrated
                        </div>
                    </div>
                </div>
            </main>

            <AuthFooter />
        </div>
    );
};

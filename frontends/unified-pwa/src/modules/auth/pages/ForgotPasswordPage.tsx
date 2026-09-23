import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../../services/auth.service';
import { forgotPasswordSchema } from '../../../validations/zodSchema';
import { AuthVisualHero } from '../components/AuthVisualHero';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Loader2, ArrowLeft, MailCheck, Mail, Building2, User } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const queryRole = searchParams.get('role')?.toUpperCase();
    const [activeRole, setActiveRole] = useState<'WORKER' | 'EMPLOYER'>(queryRole === 'EMPLOYER' ? 'EMPLOYER' : 'WORKER');

    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const handleRoleToggle = (newRole: 'WORKER' | 'EMPLOYER') => {
        setActiveRole(newRole);
        setSearchParams({ role: newRole.toLowerCase() });
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const validationResult = forgotPasswordSchema.safeParse({ email });
        if (!validationResult.success) {
            setError(validationResult.error.issues[0].message);
            setIsLoading(false);
            return;
        }

        try {
            await authService.forgotPassword(email, activeRole);
            setIsSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || err.response?.data?.error || 'Failed to send reset email. Please check the email address.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F2F6] flex items-center justify-center p-3 sm:p-6 md:p-10 font-sans">
            
            {/* Main Card Container */}
            <div className="w-full max-w-5xl bg-white rounded-3xl md:rounded-[32px] shadow-2xl shadow-slate-300/40 border border-slate-100 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px] transition-all">
                
                {/* Left Side: Brand Visual Hero */}
                <div className="md:col-span-5 lg:col-span-5 hidden md:block">
                    <AuthVisualHero role={activeRole} />
                </div>

                {/* Right Side: Clean Modern Form */}
                <div className="md:col-span-7 lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between relative bg-white">
                    
                    {/* Top Back Link & Role Switcher */}
                    <div className="flex items-center justify-between gap-3 mb-6">
                        <Link 
                            to={`/sign-in?role=${activeRole.toLowerCase()}`} 
                            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#0066FF] transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to Sign In</span>
                        </Link>

                        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/80">
                            <button
                                type="button"
                                onClick={() => handleRoleToggle('WORKER')}
                                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    activeRole === 'WORKER'
                                        ? 'bg-white text-[#0A1931] shadow-xs'
                                        : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                <User className="w-3.5 h-3.5" />
                                <span>Candidate</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleRoleToggle('EMPLOYER')}
                                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    activeRole === 'EMPLOYER'
                                        ? 'bg-white text-[#0A1931] shadow-xs'
                                        : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                <Building2 className="w-3.5 h-3.5" />
                                <span>Employer</span>
                            </button>
                        </div>
                    </div>

                    {/* Centered Area */}
                    <div className="max-w-md w-full mx-auto my-auto py-4">
                        
                        {isSuccess ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-4"
                            >
                                <div className="w-16 h-16 bg-blue-50 text-[#0066FF] rounded-2xl flex items-center justify-center mx-auto shadow-xs border border-blue-100">
                                    <MailCheck className="w-8 h-8" />
                                </div>
                                <h1 className="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-extrabold text-[#0A1931] tracking-tight">
                                    Check your email
                                </h1>
                                <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
                                    We sent a reset code to <strong className="text-slate-800">{email}</strong>. Please check your inbox and spam folder.
                                </p>
                                <button
                                    onClick={() => navigate('/reset-password')}
                                    className="w-full mt-4 bg-[#0066FF] hover:bg-[#0052CC] text-white py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm tracking-wide shadow-md shadow-[#0066FF]/25 hover:shadow-lg transition-all cursor-pointer font-['Outfit',sans-serif]"
                                >
                                    Enter 6-Digit Reset Code
                                </button>
                            </motion.div>
                        ) : (
                            <div>
                                <div className="mb-6">
                                    <h1 className="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-extrabold text-[#0A1931] tracking-tight">
                                        Forgot Password?
                                    </h1>
                                    <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
                                        Enter your registered email and we'll send you a password recovery code.
                                    </p>
                                </div>

                                <AnimatePresence>
                                    {error && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: -8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl flex items-center gap-2.5 shadow-2xs"
                                        >
                                            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                                            <span>{error}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-bold text-slate-700 font-['Outfit',sans-serif]">
                                            Account Email
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Enter your registered email"
                                                required
                                                className="w-full bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#0066FF] rounded-xl px-4 py-3 pl-10 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 font-medium transition-all outline-none focus:ring-3 focus:ring-[#0066FF]/15"
                                            />
                                            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading || !email}
                                        className="w-full mt-2 bg-[#0066FF] hover:bg-[#0052CC] active:scale-[0.99] disabled:opacity-50 text-white py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm tracking-wide shadow-md shadow-[#0066FF]/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer font-['Outfit',sans-serif]"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span>Sending Code...</span>
                                            </>
                                        ) : (
                                            <span>Send Recovery Code</span>
                                        )}
                                    </button>
                                </form>
                            </div>
                        )}

                    </div>

                    {/* Bottom Help */}
                    <div className="pt-4 text-center text-xs text-slate-400 font-medium">
                        Remember your credentials?{' '}
                        <Link to="/sign-in" className="font-bold text-[#0A1931] hover:text-[#0066FF] transition-colors">
                            Sign In
                        </Link>
                    </div>

                </div>

            </div>

        </div>
    );
}

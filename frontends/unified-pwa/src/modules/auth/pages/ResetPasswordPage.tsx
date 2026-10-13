import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../../services/auth.service';
import { resetPasswordSchema } from '../../../validations/zodSchema';
import { AuthVisualHero } from '../components/AuthVisualHero';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Loader2, ArrowLeft, CheckCircle2, Eye, EyeOff, KeyRound } from 'lucide-react';

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const [tokenFromUrl] = useState(searchParams.get('token') || '');
    const [token, setToken] = useState(tokenFromUrl);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!token || token.length < 6) {
            setError('Please enter the 6-digit reset code sent to your email.');
            return;
        }

        const validationResult = resetPasswordSchema.safeParse({ password, confirmPassword });
        if (!validationResult.success) {
            setError(validationResult.error.issues[0].message);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await authService.resetPassword({ token, password });
            setIsSuccess(true);
        } catch (err: any) {
            setError(err.message || err.response?.data?.message || 'Failed to reset password. The code may be invalid or expired.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F2F6] flex items-center justify-center p-3 sm:p-6 md:p-10 font-sans">
            
            {/* Main Card Container */}
            <div className="w-full max-w-5xl bg-white rounded-3xl md:rounded-[32px] shadow-2xl shadow-slate-300/40 border border-slate-100 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[600px] transition-all">
                
                {/* Left Side: Brand Visual Hero */}
                <div className="md:col-span-5 lg:col-span-5 hidden md:block">
                    <AuthVisualHero role="WORKER" />
                </div>

                {/* Right Side: Clean Modern Form */}
                <div className="md:col-span-7 lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between relative bg-white">
                    
                    {/* Top Back Link */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                        <Link 
                            to="/sign-in" 
                            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#0066FF] transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to Sign In</span>
                        </Link>
                    </div>

                    {/* Centered Area */}
                    <div className="max-w-md w-full mx-auto my-auto py-2">
                        
                        {isSuccess ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-4"
                            >
                                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs border border-emerald-100">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <h1 className="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-extrabold text-[#0A1931] tracking-tight">
                                    Password Reset Complete
                                </h1>
                                <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
                                    Your password has been successfully updated. You can now securely log in with your new credentials.
                                </p>
                                <button
                                    onClick={() => navigate('/sign-in')}
                                    className="w-full mt-4 bg-[#0066FF] hover:bg-[#0052CC] text-white py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm tracking-wide shadow-md shadow-[#0066FF]/25 hover:shadow-lg transition-all cursor-pointer font-['Outfit',sans-serif]"
                                >
                                    Log In Now
                                </button>
                            </motion.div>
                        ) : (
                            <div>
                                <div className="mb-5">
                                    <h1 className="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-extrabold text-[#0A1931] tracking-tight">
                                        Create New Password
                                    </h1>
                                    <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
                                        Enter your verification code and choose a new secure password.
                                    </p>
                                </div>

                                <AnimatePresence>
                                    {error && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: -8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl flex items-center gap-2.5 shadow-2xs"
                                        >
                                            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                                            <span>{error}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <form onSubmit={handleSubmit} className="space-y-3.5">
                                    <div className="space-y-1">
                                        <label className="block text-[11px] font-bold text-slate-700 font-['Outfit',sans-serif]">
                                            6-Digit Reset Code
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={token}
                                                onChange={(e) => setToken(e.target.value.trim())}
                                                placeholder="e.g. 123456"
                                                required
                                                className="w-full bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#0066FF] rounded-xl px-3.5 py-2.5 pl-9 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 font-mono tracking-widest transition-all outline-none focus:ring-3 focus:ring-[#0066FF]/15"
                                            />
                                            <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-[11px] font-bold text-slate-700 font-['Outfit',sans-serif]">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="At least 8 characters (letters & numbers)"
                                                required
                                                minLength={8}
                                                className="w-full bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#0066FF] rounded-xl px-3.5 py-2.5 pr-10 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 font-medium transition-all outline-none focus:ring-3 focus:ring-[#0066FF]/15"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                            >
                                                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-[11px] font-bold text-slate-700 font-['Outfit',sans-serif]">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Re-enter your password"
                                            required
                                            className="w-full bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#0066FF] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 font-medium transition-all outline-none focus:ring-3 focus:ring-[#0066FF]/15"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading || !token || !password || !confirmPassword}
                                        className="w-full mt-2 bg-[#0066FF] hover:bg-[#0052CC] active:scale-[0.99] disabled:opacity-50 text-white py-3 px-4 rounded-xl font-bold text-xs sm:text-sm tracking-wide shadow-md shadow-[#0066FF]/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer font-['Outfit',sans-serif]"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span>Updating Password...</span>
                                            </>
                                        ) : (
                                            <span>Save New Password</span>
                                        )}
                                    </button>
                                </form>
                            </div>
                        )}

                    </div>

                    {/* Bottom Help */}
                    <div className="pt-4 text-center text-xs text-slate-400 font-medium">
                        Need help? Return to{' '}
                        <Link to="/sign-in" className="font-bold text-[#0A1931] hover:text-[#0066FF] transition-colors">
                            Sign In
                        </Link>
                    </div>

                </div>

            </div>

        </div>
    );
}

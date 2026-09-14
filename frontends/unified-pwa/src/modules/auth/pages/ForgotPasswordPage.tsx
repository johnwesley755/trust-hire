import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../../services/auth.service';
import { forgotPasswordSchema } from '../../../validations/zodSchema';
import { AuthHeader } from '../components/AuthHeader';
import { AuthFooter } from '../components/AuthFooter';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

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
            await authService.forgotPassword(email);
            setIsSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to send reset email. Please check the email address.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="bg-slate-50 text-slate-900 font-body min-h-screen flex flex-col selection:bg-brand-500 selection:text-[#002117] antialiased">
                <AuthHeader />
                <main className="w-full max-w-5xl mx-auto px-4 pt-24 pb-12 flex-1 flex items-center justify-center">
                    <div className="w-full bg-white rounded-2xl border border-slate-900/10 shadow-xl overflow-hidden grid md:grid-cols-2">
                        {/* Left Column: Form Content */}
                        <div className="p-6 md:p-10 flex flex-col justify-center text-center items-center">
                            <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-3xl text-brand-500">mail</span>
                            </div>
                            <h1 className="font-headline text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                                Check your Email
                            </h1>
                            <p className="text-slate-900/60 text-xs md:text-sm font-medium mb-8">
                                We've sent a 6-digit reset code to <strong className="text-slate-900">{email}</strong>. Use the code on the next page to securely reset your password.
                            </p>
                            
                            <button 
                                onClick={() => navigate('/reset-password')}
                                className="w-full bg-brand-500 text-slate-900 py-3 rounded-lg font-bold text-xs uppercase tracking-wider shadow-sm hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2"
                            >
                                Enter Reset Code
                            </button>
                        </div>

                        {/* Right Column: Visual Brand Card */}
                        <div className="hidden md:flex bg-slate-900 p-8 flex-col justify-between text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
                            
                            <div>
                                <span className="inline-block bg-brand-500 text-[#002117] text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider mb-4">
                                    Secure Recovery
                                </span>
                                <h2 className="font-headline text-2xl font-black text-white leading-tight">
                                    Fast & Secure Account Recovery
                                </h2>
                                <p className="text-white/70 text-xs mt-2 leading-relaxed">
                                    Your account security is our priority. We use 256-bit encryption for all reset operations.
                                </p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 mt-6 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-brand-500 text-[#002117] flex items-center justify-center font-bold">
                                        <span className="material-symbols-outlined text-base">verified_user</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white">Safe & Secure</p>
                                        <p className="text-[10px] text-white/60">We'll help you back in safely.</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="text-[10px] text-white/40 mt-4 font-mono">
                                TrustHire Protocol v2.4 • Supabase Verified
                            </div>
                        </div>
                    </div>
                </main>
                <AuthFooter />
            </div>
        );
    }

    return (
        <div className="bg-slate-50 text-slate-900 font-body min-h-screen flex flex-col selection:bg-brand-500 selection:text-[#002117] antialiased">
            <AuthHeader />
            
            <main className="w-full max-w-5xl mx-auto px-4 pt-24 pb-12 flex-1 flex items-center justify-center">
                <div className="w-full bg-white rounded-2xl border border-slate-900/10 shadow-xl overflow-hidden grid md:grid-cols-2">
                    
                    {/* Left Column: Form Content */}
                    <div className="p-6 md:p-10 flex flex-col justify-center">
                        <div className="mb-6 text-left">
                            <h1 className="font-headline text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                                Forgot Password?
                            </h1>
                            <p className="text-slate-900/60 text-xs md:text-sm mt-1 font-medium">
                                Don’t worry, it happens. Enter your email and we’ll send you a reset link.
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

                        <form onSubmit={handleSubmit} noValidate className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">
                                    Email Address
                                </label>
                                <input 
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="e.g. name@email.com"
                                    required
                                    className="w-full bg-slate-50 border border-slate-900/10 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                            </div>
                            <button 
                                disabled={isLoading || !email}
                                className="w-full mt-2 bg-brand-500 text-slate-900 py-3 rounded-lg font-bold text-xs uppercase tracking-wider shadow-sm hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2"
                                type="submit"
                            >
                                {isLoading ? (
                                    <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                                ) : (
                                    <span>Send Reset Link</span>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 flex justify-start border-t border-slate-900/5 pt-4">
                            <Link className="flex items-center gap-2 text-slate-900/60 font-bold hover:text-brand-500 transition-all text-xs uppercase tracking-wider" to="/sign-in">
                                <span className="material-symbols-outlined text-sm">arrow_back</span>
                                Back to Login
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Visual Brand Card */}
                    <div className="hidden md:flex bg-slate-900 p-8 flex-col justify-between text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
                        
                        <div>
                            <span className="inline-block bg-brand-500 text-[#002117] text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider mb-4">
                                Password Recovery
                            </span>
                            <h2 className="font-headline text-2xl font-black text-white leading-tight">
                                Get Back to Work Safely
                            </h2>
                            <p className="text-white/70 text-xs mt-2 leading-relaxed">
                                Our password recovery process ensures your account stays secure while getting you back into the platform quickly.
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 mt-6 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-brand-500 text-[#002117] flex items-center justify-center font-bold">
                                    <span className="material-symbols-outlined text-base">shield_lock</span>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white">Encrypted Links</p>
                                    <p className="text-[10px] text-white/60">Your reset links are time-limited and single-use.</p>
                                </div>
                            </div>
                        </div>

                        <div className="text-[10px] text-white/40 mt-4 font-mono">
                            TrustHire Protocol v2.4 • Supabase Verified
                        </div>
                    </div>
                </div>
            </main>

            <AuthFooter />
        </div>
    );
}

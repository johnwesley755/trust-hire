import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../../services/auth.service';
import { resetPasswordSchema } from '../../../validations/zodSchema';
import { AuthHeader } from '../components/AuthHeader';
import { AuthFooter } from '../components/AuthFooter';

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!token) {
            setError('Missing reset token. Please use the link from your email.');
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
            setError(err.response?.data?.error || 'Failed to reset password. The link may have expired.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!token && !isSuccess) {
        return (
            <div className="min-h-screen bg-brand-bg flex flex-col antialiased">
                <AuthHeader />
                <div className="flex-1 flex items-center justify-center p-6 text-center pt-24">
                <div className="bg-white p-10 rounded-4xl border border-brand-border space-y-6 max-w-md shadow-xl">
                    <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto text-red-500">
                         <ShieldCheck className="w-8 h-8 opacity-20" />
                    </div>
                    <h2 className="text-2xl font-black text-brand-secondary">Invalid Link</h2>
                    <p className="text-brand-muted font-bold text-sm">This password reset link is invalid or has expired. Please request a new one.</p>
                    <Link to="/forgot-password" className="w-full py-4 bg-brand-secondary text-brand-primary rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-neutral-800 transition-all border-none flex items-center justify-center">
                        Request New Link
                    </Link>
                </div>
                </div>
                <AuthFooter />
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-brand-bg flex flex-col antialiased relative overflow-hidden">
                <AuthHeader />
                <div className="flex-1 flex items-center justify-center p-6 pt-24 relative overflow-hidden">
                <div className="absolute inset-0 cloud-grid opacity-[0.05] pointer-events-none" />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md bg-white rounded-4xl border border-brand-border p-10 text-center space-y-8 shadow-2xl relative z-10"
                >
                    <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto border-2 border-emerald-100">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-3xl font-black text-brand-secondary tracking-tight">Success!</h2>
                        <p className="text-brand-muted font-bold text-sm leading-relaxed">
                            Your password has been updated. You can now log in with your new credentials.
                        </p>
                    </div>
                    <button 
                        onClick={() => navigate('/sign-in')}
                        className="w-full py-4 bg-brand-secondary text-brand-primary rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-neutral-800 transition-all shadow-lg flex items-center justify-center gap-2 group"
                    >
                        Login Now
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>
                </div>
                <AuthFooter />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-bg flex flex-col antialiased relative overflow-hidden">
            <AuthHeader />
            <div className="flex-1 flex items-center justify-center p-6 pt-24 relative overflow-hidden">
            <div className="absolute inset-0 cloud-grid opacity-[0.05] pointer-events-none" />
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/80 backdrop-blur-2xl rounded-4xl border border-brand-border p-10 md:p-12 shadow-2xl relative z-10"
            >
                <div className="space-y-10">
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-16 h-16 bg-brand-primary rounded-3xl flex items-center justify-center shadow-xl">
                            <ShieldCheck className="w-9 h-9 text-brand-secondary" />
                        </div>
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-black text-brand-secondary tracking-tight">New Password</h2>
                            <p className="text-brand-muted font-bold text-sm">Please enter and confirm your new password below.</p>
                        </div>
                    </div>

                    <p className="text-[10px] font-bold text-brand-muted/70 mb-4 uppercase tracking-widest text-center">Fields marked with <span className="text-red-500">*</span> are mandatory</p>

                    <form onSubmit={handleSubmit} noValidate className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-brand-muted uppercase tracking-widest ml-1">New Password <span className="text-red-500">*</span></label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-secondary/30 group-focus-within:text-brand-primary transition-colors" />
                                <input 
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white border border-brand-border/50 rounded-2xl py-5 pl-14 pr-12 text-brand-secondary font-bold focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all placeholder:text-brand-muted/20 text-sm shadow-sm"
                                    placeholder="Minimum 8 characters"
                                    required
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-secondary transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-brand-muted uppercase tracking-widest ml-1">Confirm Password <span className="text-red-500">*</span></label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-secondary/30 group-focus-within:text-brand-primary transition-colors" />
                                <input 
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-white border border-brand-border/50 rounded-2xl py-5 pl-14 pr-12 text-brand-secondary font-bold focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all placeholder:text-brand-muted/20 text-sm shadow-sm"
                                    placeholder="Repeat new password"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-red-50 text-red-500 p-4 rounded-xl text-xs font-bold border border-red-100 flex items-center gap-2"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                {error}
                            </motion.div>
                        )}

                        <button 
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-5 bg-brand-secondary text-brand-primary rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-neutral-800 transition-all shadow-xl shadow-brand-secondary/10 active:scale-[0.98] ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Resetting...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </motion.div>
            </div>
            <AuthFooter />
        </div>
    );
}

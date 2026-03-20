import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../api/auth.service';

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
            <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute inset-0 cloud-grid opacity-[0.05] pointer-events-none" />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md bg-white rounded-4xl border border-brand-border p-10 text-center space-y-8 shadow-2xl relative z-10"
                >
                    <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto border-2 border-emerald-100 animate-bounce">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-3xl font-black text-brand-secondary tracking-tight">Email Sent!</h2>
                        <p className="text-brand-muted font-bold text-sm leading-relaxed">
                            We've sent a password reset link to <span className="text-brand-secondary underline underline-offset-4">{email}</span>. Please check your inbox.
                        </p>
                    </div>
                    <button 
                        onClick={() => navigate('/sign-in')}
                        className="w-full py-4 bg-brand-secondary text-brand-primary rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-neutral-800 transition-all shadow-lg flex items-center justify-center gap-2 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Login
                    </button>
                    <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest opacity-40">
                        Didn't get the email? Check your spam folder or try again.
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 cloud-grid opacity-[0.05] pointer-events-none" />
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none animate-pulse" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/80 backdrop-blur-2xl rounded-4xl border border-brand-border p-10 md:p-12 shadow-2xl shadow-brand-primary/5 relative z-10"
            >
                <div className="space-y-10">
                    <div className="flex flex-col items-center gap-6">
                        <Link to="/" className="w-16 h-16 bg-brand-primary rounded-3xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform active:scale-95 group">
                            <ShieldCheck className="w-9 h-9 text-brand-secondary" />
                        </Link>
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-black text-brand-secondary tracking-tight">Reset Password</h2>
                            <p className="text-brand-muted font-bold text-sm">Enter your email and we'll send you a recovery link.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-[10px] font-bold text-brand-muted uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-secondary/30 group-focus-within:text-brand-primary transition-colors" />
                                <input 
                                    id="email"
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white border border-brand-border/50 rounded-2xl py-5 pl-14 pr-4 text-brand-secondary font-bold focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all placeholder:text-brand-muted/20 text-sm shadow-sm"
                                    placeholder="Enter your registration email"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
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
                            {isLoading ? 'Processing...' : 'Send Recovery Link'}
                        </button>
                    </form>

                    <div className="text-center">
                        <Link to="/sign-in" className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-secondary transition-colors font-bold text-xs group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Login
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

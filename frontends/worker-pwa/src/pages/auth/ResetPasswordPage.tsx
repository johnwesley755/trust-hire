import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '../../store';
import { resetPassword } from '../../store/slices/authSlice';
import { resetPasswordSchema, ResetPasswordInput } from '../../validations/zodSchema';

export default function ResetPasswordPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    
    const { loading: isLoading, error } = useAppSelector((state) => state.auth);
    const [showPassword, setShowPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
        mode: 'onChange',
    });

    const onSubmit = async (data: ResetPasswordInput) => {
        if (!token) return;
        const resultAction = await dispatch(resetPassword({ token, password: data.password }));
        if (resetPassword.fulfilled.match(resultAction)) {
            setIsSuccess(true);
        }
    };

    if (!token && !isSuccess) {
        return (
            <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6 text-center">
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
        );
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6 relative overflow-hidden">
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
        );
    }

    return (
        <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6 relative overflow-hidden">
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

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-brand-muted uppercase tracking-widest ml-1">New Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-secondary/30 group-focus-within:text-brand-primary transition-colors" />
                                <input 
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password')}
                                    className={`w-full bg-white border ${errors.password ? 'border-red-500' : 'border-brand-border/50'} rounded-2xl py-5 pl-14 pr-12 text-brand-secondary font-bold focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all placeholder:text-brand-muted/20 text-sm shadow-sm`}
                                    placeholder="Minimum 8 characters"
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-secondary transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-[10px] text-red-500 font-bold uppercase ml-1">{errors.password.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-brand-muted uppercase tracking-widest ml-1">Confirm Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-secondary/30 group-focus-within:text-brand-primary transition-colors" />
                                <input 
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('confirmPassword')}
                                    className={`w-full bg-white border ${errors.confirmPassword ? 'border-red-500' : 'border-brand-border/50'} rounded-2xl py-5 pl-14 pr-12 text-brand-secondary font-bold focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all placeholder:text-brand-muted/20 text-sm shadow-sm`}
                                    placeholder="Repeat new password"
                                />
                            </div>
                            {errors.confirmPassword && <p className="text-[10px] text-red-500 font-bold uppercase ml-1">{errors.confirmPassword.message}</p>}
                        </div>
 
                        <button 
                            type="submit"
                            disabled={isLoading || !isValid}
                            className={`w-full py-5 bg-brand-secondary text-brand-primary rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-neutral-800 transition-all shadow-xl shadow-brand-secondary/10 active:scale-[0.98] ${isLoading || !isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Resetting...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}

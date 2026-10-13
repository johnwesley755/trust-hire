import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../../services/auth.service';
import { forgotPasswordSchema } from '../../../validations/zodSchema';
import { AuthVisualHero } from '../components/AuthVisualHero';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Loader2, ArrowLeft, MailCheck, ArrowRight } from 'lucide-react';

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

    const isCandidate = activeRole === 'WORKER';

    return (
        <div className="w-full min-h-screen p-2 sm:p-3 bg-white font-['Onest',system-ui,sans-serif] selection:bg-[#2563c9] selection:text-white flex flex-col">
            
            {/* Framed Full-Screen Canvas matching Landing Page Architecture */}
            <div className="relative w-full flex-1 min-h-[calc(100svh-1rem)] sm:min-h-[calc(100svh-1.5rem)] lg:h-[calc(100svh-1.5rem)] rounded-[2rem] overflow-hidden border border-[#e6e8ec] bg-white shadow-xl grid grid-cols-1 lg:grid-cols-12 transition-all">
                
                {/* Left Side: Full-Bleed Brand Visual Hero */}
                <div className="lg:col-span-5 xl:col-span-5 hidden lg:block h-full">
                    <AuthVisualHero role={activeRole} />
                </div>

                {/* Right Side: Clean Modern Form with Independent Smooth Scroll */}
                <div className="lg:col-span-7 xl:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between relative bg-white h-full overflow-y-auto">
                    
                    {/* Top Navigation Row: Back Link + Role Segmented Switcher */}
                    <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8">
                        <Link 
                            to={`/sign-in?role=${activeRole.toLowerCase()}`} 
                            className="inline-flex items-center gap-2 text-xs font-medium uppercase text-[#717784] hover:text-[#0a0a0a] transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Back to Sign In</span>
                        </Link>

                        {/* Segmented Pill Role Switcher */}
                        <div className="inline-flex p-1 rounded-full bg-[#f4f4f4] border border-[#e6e8ec]">
                            <button
                                type="button"
                                onClick={() => handleRoleToggle('WORKER')}
                                className={`px-3.5 py-1.5 rounded-full text-xs font-medium uppercase transition-all cursor-pointer ${
                                    isCandidate 
                                        ? 'bg-[#0f2f63] text-white shadow-xs' 
                                        : 'text-[#717784] hover:text-[#0a0a0a]'
                                }`}
                            >
                                Job Seeker
                            </button>
                            <button
                                type="button"
                                onClick={() => handleRoleToggle('EMPLOYER')}
                                className={`px-3.5 py-1.5 rounded-full text-xs font-medium uppercase transition-all cursor-pointer ${
                                    !isCandidate 
                                        ? 'bg-[#0f2f63] text-white shadow-xs' 
                                        : 'text-[#717784] hover:text-[#0a0a0a]'
                                }`}
                            >
                                Employer
                            </button>
                        </div>
                    </div>

                    {/* Mobile Only: Ambient Hero Banner */}
                    <div className="block lg:hidden mb-6">
                        <AuthVisualHero role={activeRole} isMobileBanner={true} />
                    </div>

                    {/* Centered Area */}
                    <div className="max-w-md w-full mx-auto my-auto py-4">
                        {isSuccess ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-4"
                            >
                                <div className="w-16 h-16 bg-blue-50 text-[#0f2f63] rounded-2xl flex items-center justify-center mx-auto shadow-xs border border-[#e6e8ec]">
                                    <MailCheck className="w-8 h-8 text-[#2563c9]" />
                                </div>
                                <h1 className="text-3xl font-medium text-[#0a0a0a]">
                                    Check your email
                                </h1>
                                <p className="text-xs sm:text-sm text-[#717784] leading-relaxed">
                                    We sent a recovery code to <strong className="text-[#0a0a0a] font-medium">{email}</strong>. Please check your inbox and spam folder.
                                </p>
                                <button
                                    onClick={() => navigate('/reset-password')}
                                    className="w-full mt-4 bg-[#0f2f63] hover:bg-[#2563c9] text-white py-3.5 px-5 rounded-full font-medium text-xs sm:text-sm uppercase transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <span>Enter 6-Digit Reset Code</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ) : (
                            <div>
                                <div className="mb-6">
                                    <div className="inline-flex items-center gap-2 text-xs font-medium uppercase text-[#717784] mb-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#2563c9]" />
                                        <span>Account Recovery</span>
                                    </div>
                                    <h1 className="text-3xl sm:text-4xl font-medium text-[#0a0a0a] leading-[1.05]">
                                        Reset your password
                                    </h1>
                                    <p className="text-xs sm:text-sm text-[#717784] mt-2 leading-relaxed">
                                        Enter your registered email address and we'll dispatch a 6-digit verification code.
                                    </p>
                                </div>

                                <AnimatePresence>
                                    {error && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: -8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium rounded-xl flex items-center gap-2.5 shadow-2xs"
                                        >
                                            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                                            <span>{error}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-medium uppercase text-[#0a0a0a]">
                                            {isCandidate ? 'Candidate Email Address' : 'Official Work Email'}
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder={isCandidate ? 'name@example.com' : 'contact@company.com'}
                                            required
                                            className="w-full bg-[#f4f4f4]/60 hover:bg-[#f4f4f4] focus:bg-white border border-[#e6e8ec] focus:border-[#0f2f63] rounded-xl px-4 py-3 text-sm text-[#0a0a0a] placeholder:text-[#9ea3ae] font-normal transition-all outline-hidden focus:ring-2 focus:ring-[#0f2f63]/10"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading || !email}
                                        className="w-full mt-2 bg-[#0f2f63] hover:bg-[#2563c9] active:scale-[0.99] disabled:opacity-50 text-white py-3.5 px-5 rounded-full font-medium text-xs sm:text-sm uppercase transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span>Sending Code...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Send Recovery Code</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>

                    {/* Bottom Footer Note */}
                    <div className="pt-4 text-center text-xs text-[#717784]">
                        Need urgent assistance? Contact{' '}
                        <a href="mailto:support@trusthyre.com" className="underline hover:text-[#0a0a0a] transition-colors">
                            support@trusthyre.com
                        </a>
                    </div>
                </div>

            </div>

        </div>
    );
}

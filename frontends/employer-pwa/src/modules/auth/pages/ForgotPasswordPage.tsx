import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../../services/auth.service';
import { forgotPasswordSchema } from '../../../validations/zodSchema';
import { AuthHeader } from '../components/AuthHeader';
import { AuthFooter } from '../components/AuthFooter';

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
            <div className="bg-[#F5F4EF] text-[#1F3F34] font-headline min-h-screen flex flex-col antialiased">
                <AuthHeader />

                <main className="flex-1 flex flex-col md:flex-row pt-20">
                    <section className="w-full md:w-1/2 flex items-start justify-center p-8 md:p-16 lg:p-24 bg-[#F5F4EF] pt-12 md:pt-24 lg:pt-32">
                        <div className="max-w-md w-full space-y-8">
                            <div>
                                <div className="w-16 h-16 bg-secondary-fixed rounded-2xl flex items-center justify-center mb-8">
                                    <span className="material-symbols-outlined text-3xl text-on-secondary-fixed">mail</span>
                                </div>
                                <h1 className="text-[3.5rem] font-extrabold leading-[1.1] tracking-[-0.02em] mb-4 text-[#1F3F34]">
                                    Check your Email
                                </h1>
                                <p className="text-[1rem] leading-[1.6] text-[#1F3F34]/70">
                                    We've sent a password reset link to <span className="font-bold text-[#1F3F34]">{email}</span>. Click the link in the email to securely reset your password.
                                </p>
                            </div>
                            <button 
                                onClick={() => navigate('/sign-in')}
                                className="w-full bg-[#FACD15] text-[#1F3F34] font-extrabold rounded-[12px] py-4 text-center shadow-[inset_0_-2px_0_rgba(0,0,0,0.1)] active:scale-[0.98] transition-all hover:bg-[#eac012]"
                            >
                                BACK TO LOGIN
                            </button>
                        </div>
                    </section>
                    <section className="w-full md:w-1/2 bg-[#EFEEE9] relative overflow-hidden flex items-center justify-center min-h-[400px]">
                        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#FACD15] opacity-10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#1F3F34] opacity-5 rounded-full blur-3xl"></div>
                        <div className="relative z-10 w-full h-full flex items-center justify-center p-12">
                            <div className="relative w-full max-w-lg aspect-square">
                                <div className="absolute inset-0 bg-[#FACD15] organic-blob-mask scale-110"></div>
                                <div className="absolute inset-0 organic-blob-mask overflow-hidden shadow-2xl">
                                    <img 
                                        alt="Friendly Indian professional" 
                                        className="w-full h-full object-cover grayscale-[0.1]" 
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuApyBwsWFOE6Cox730L6i7EVXzLYuTNcZ7dflJJG1QrukKlW2Jih6seS1E6ARIOx2V5C_t15jG7ZUaVpYAb--jKo_aPvsuYW1pFcRqyOPeW9MgSnwhMXl5nrXkTuxTnJjt2fDKlSynxS9FWdAo3sJY8FwwEd7V5eAescZKuY7MY92YSbMpYnyiuxOhPTn-7ydU0gMgpOa4yk3J4pUkIk2Zl_OSSFfW_BSikXnXEjSkPiFedITbxHGJkwD3xuMR29RFFbNmCBmHJimc" 
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                <AuthFooter />

                <style>{`
                    .organic-blob-mask {
                        mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23FF0066' d='M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-46.2C87.4,-33.4,90.1,-17.7,88.5,-2.6C86.9,12.5,81,26.9,72.6,39.8C64.2,52.7,53.3,64.1,40.4,72.4C27.5,80.7,12.7,85.8,-2.1,89.5C-17,93.2,-34,95.4,-48.2,89.4C-62.4,83.4,-73.8,69.2,-81.4,54.1C-89,39,-92.8,23,-93.2,7.1C-93.5,-8.8,-90.4,-24.5,-83,-38.4C-75.6,-52.3,-63.9,-64.4,-50.2,-71.8C-36.5,-79.2,-20.8,-81.8,-5.1,-73.1C10.7,-64.3,26.4,-83.5,44.7,-76.4Z' transform='translate(100 100)' /%3E%3C/svg%3E");
                        mask-size: contain;
                        mask-repeat: no-repeat;
                        mask-position: center;
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="bg-[#F5F4EF] text-[#1F3F34] font-headline min-h-screen flex flex-col antialiased">
            <AuthHeader />

            <main className="flex-1 flex flex-col md:flex-row pt-20">
                {/* Left Side: Forgot Password Form */}
                <section className="w-full md:w-1/2 flex items-start justify-center p-8 md:p-16 lg:p-24 bg-[#F5F4EF] pt-12 md:pt-8 lg:pt-4">
                    <div className="max-w-lg w-full">
                        <div className="mb-10 text-left">
                            <h1 className="text-[3.5rem] font-extrabold leading-[1.1] tracking-[-0.02em] mb-4 text-[#1F3F34]">
                                Forgot Password?
                            </h1>
                            <p className="text-[1.125rem] leading-[1.6] text-[#1F3F34]/70">
                                Don’t worry, it happens. Enter your email and we’ll send you a reset link.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-error-container border border-error/10 text-error font-bold text-sm rounded-xl flex items-center gap-3">
                                <span className="material-symbols-outlined">error</span>
                                {error}
                            </div>
                        )}

                        <p className="text-xs text-[#1F3F34]/60 mb-6 font-medium">Fields marked with <span className="text-red-500">*</span> are mandatory</p>

                        <form onSubmit={handleSubmit} noValidate className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[0.75rem] font-bold text-[#1F3F34] uppercase tracking-wider" htmlFor="identifier">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    className="w-full bg-[#E9E8E3] border-none rounded-[12px] px-4 py-5 text-[#1F3F34] focus:ring-2 focus:ring-[#FACD15] placeholder:text-[#1F3F34]/40" 
                                    id="identifier" 
                                    placeholder="e.g. name@email.com" 
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <button 
                                disabled={isLoading}
                                className="w-full bg-[#FACD15] text-[#1F3F34] font-extrabold rounded-[12px] py-5 text-center shadow-[inset_0_-2px_0_rgba(0,0,0,0.1)] active:scale-[0.98] transition-all hover:bg-[#eac012] flex items-center justify-center gap-2 text-lg tracking-wider" 
                                type="submit"
                            >
                                {isLoading ? (
                                    <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                                ) : (
                                    <span>SEND RESET LINK</span>
                                )}
                            </button>
                        </form>

                        <div className="mt-12 flex justify-start">
                            <Link className="flex items-center gap-2 text-[#1F3F34] font-bold hover:underline transition-all" to="/sign-in">
                                <span className="material-symbols-outlined">arrow_back</span>
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Right Side: Visual & Brand Assets */}
                <section className="w-full md:w-1/2 bg-[#EFEEE9] relative overflow-hidden flex items-center justify-center min-h-[400px]">
                    {/* Background Decorative Blobs */}
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FACD15] opacity-10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-[#1F3F34] opacity-5 rounded-full blur-3xl"></div>
                    
                    {/* Small Decorative Floating Blobs */}
                    <div className="absolute top-20 right-20 w-16 h-16 bg-[#1F3F34] opacity-20 organic-blob-mask"></div>
                    <div className="absolute bottom-40 left-10 w-24 h-24 bg-[#FACD15] opacity-40 organic-blob-mask"></div>
                    
                    <div className="relative z-10 w-full h-full flex items-center justify-center p-12">
                        <div className="relative w-full max-w-lg aspect-square">
                            {/* Large Amber Blob Shape */}
                            <div className="absolute inset-0 bg-[#FACD15] organic-blob-mask scale-110"></div>
                            {/* Hero Image */}
                            <div className="absolute inset-0 organic-blob-mask overflow-hidden shadow-2xl">
                                <img 
                                    alt="Friendly Indian professional" 
                                    className="w-full h-full object-cover grayscale-[0.1]" 
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuApyBwsWFOE6Cox730L6i7EVXzLYuTNcZ7dflJJG1QrukKlW2Jih6seS1E6ARIOx2V5C_t15jG7ZUaVpYAb--jKo_aPvsuYW1pFcRqyOPeW9MgSnwhMXl5nrXkTuxTnJjt2fDKlSynxS9FWdAo3sJY8FwwEd7V5eAescZKuY7MY92YSbMpYnyiuxOhPTn-7ydU0gMgpOa4yk3J4pUkIk2Zl_OSSFfW_BSikXnXEjSkPiFedITbxHGJkwD3xuMR29RFFbNmCBmHJimc" 
                                />
                            </div>
                            {/* Floating Badge */}
                            <div className="absolute bottom-10 right-0 bg-[#FFFFFF] p-6 rounded-[24px] shadow-[0_20px_40px_-10px_rgba(31,63,52,0.08)] max-w-[200px] hidden lg:block">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-[#FACD15] flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[18px]">verified_user</span>
                                    </div>
                                    <span className="text-[0.75rem] font-bold">Safe & Secure</span>
                                </div>
                                <p className="text-[0.85rem] leading-relaxed text-[#1F3F34]/60">Your trust is our priority. We’ll help you back in safely.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <AuthFooter />

            <style>{`
                .organic-blob-mask {
                    mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23FF0066' d='M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-46.2C87.4,-33.4,90.1,-17.7,88.5,-2.6C86.9,12.5,81,26.9,72.6,39.8C64.2,52.7,53.3,64.1,40.4,72.4C27.5,80.7,12.7,85.8,-2.1,89.5C-17,93.2,-34,95.4,-48.2,89.4C-62.4,83.4,-73.8,69.2,-81.4,54.1C-89,39,-92.8,23,-93.2,7.1C-93.5,-8.8,-90.4,-24.5,-83,-38.4C-75.6,-52.3,-63.9,-64.4,-50.2,-71.8C-36.5,-79.2,-20.8,-81.8,-5.1,-73.1C10.7,-64.3,26.4,-83.5,44.7,-76.4Z' transform='translate(100 100)' /%3E%3C/svg%3E");
                    mask-size: contain;
                    mask-repeat: no-repeat;
                    mask-position: center;
                }
            `}</style>
        </div>
    );
}

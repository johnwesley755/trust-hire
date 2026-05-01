import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store';
import { forgotPassword } from '../../store/slices/authSlice';
import { Mail, ArrowLeft, ShieldCheck, Loader2, HelpCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await dispatch(forgotPassword(email)).unwrap();
            setIsSuccess(true);
        } catch (err: any) {
            setError(err || 'Failed to initialize recovery sequence. Verify target email.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="bg-[#F5F4EF] text-[#1F3F34] min-h-screen flex flex-col selection:bg-[#FACD15] selection:text-[#1F3F34]">
                <header className="fixed top-0 w-full z-50 bg-[#F5F4EF]/80 backdrop-blur-xl px-8 py-6 flex justify-between items-center max-w-[1600px] mx-auto left-0 right-0">
                    <div className="text-3xl font-black text-[#1F3F34] tracking-tighter uppercase bricolage">TrustHire</div>
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#1F3F34]/40">
                        <HelpCircle className="w-4 h-4" />
                        STRATEGIC SUPPORT
                    </div>
                </header>

                <main className="flex-1 flex flex-col lg:flex-row pt-24">
                    <section className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-[#F5F4EF]">
                        <div className="max-w-xl w-full space-y-12">
                            <div className="space-y-8">
                                <div className="w-24 h-24 bg-[#FACD15] rounded-[2rem] flex items-center justify-center shadow-2xl shadow-[#FACD15]/30">
                                    <Mail className="w-10 h-10 text-[#1F3F34]" />
                                </div>
                                <h1 className="text-5xl lg:text-7xl font-black leading-[0.9] tracking-tighter text-[#1F3F34] uppercase bricolage">
                                    Check your<br/>
                                    <span className="text-[#1F3F34]/30">Intelligence Hub</span>
                                </h1>
                                <p className="text-xl leading-relaxed text-[#1F3F34]/60 font-medium italic border-l-8 border-[#FACD15] pl-10">
                                    "A recovery uplink has been dispatched to <span className="font-black text-[#1F3F34] not-italic">{email}</span>. Authorize the reset through your secure terminal."
                                </p>
                            </div>
                            <button 
                                onClick={() => navigate('/sign-in')}
                                className="w-full bg-[#1F3F34] text-[#FACD15] font-black rounded-2xl py-6 text-center shadow-2xl shadow-[#1F3F34]/20 active:scale-[0.98] transition-all hover:bg-[#FACD15] hover:text-[#1F3F34] uppercase text-[11px] tracking-[0.4em]"
                            >
                                RETURN TO LOGIN PORTAL
                            </button>
                        </div>
                    </section>
                    <section className="w-full lg:w-1/2 bg-[#EFEEE9] relative overflow-hidden flex items-center justify-center min-h-[500px]">
                        <div className="absolute top-0 right-0 w-full h-full opacity-40">
                            <img 
                                alt="Tactical Professional" 
                                className="w-full h-full object-cover grayscale brightness-110" 
                                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=2000" 
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#EFEEE9]/80 to-[#EFEEE9]"></div>
                        <div className="relative z-10 w-full flex items-center justify-center p-12 lg:p-24">
                            <div className="bg-white/80 backdrop-blur-2xl p-12 rounded-[3.5rem] border border-white shadow-2xl space-y-8 max-w-md">
                                <div className="w-16 h-16 rounded-2xl bg-[#1F3F34] flex items-center justify-center">
                                    <ShieldCheck className="w-8 h-8 text-[#FACD15]" />
                                </div>
                                <h3 className="text-2xl font-black uppercase bricolage tracking-tight text-[#1F3F34]">Secure Recovery</h3>
                                <p className="text-sm font-bold text-[#1F3F34]/60 leading-relaxed uppercase tracking-widest">Your security is our absolute priority. We maintain end-to-end encryption for all credential rotations.</p>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        );
    }

    return (
        <div className="bg-[#F5F4EF] text-[#1F3F34] min-h-screen flex flex-col selection:bg-[#FACD15] selection:text-[#1F3F34]">
            <header className="fixed top-0 w-full z-50 bg-[#F5F4EF]/80 backdrop-blur-xl px-8 py-6 flex justify-between items-center max-w-[1600px] mx-auto left-0 right-0">
                <div className="text-3xl font-black text-[#1F3F34] tracking-tighter uppercase bricolage">TrustHire</div>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#1F3F34]/40">
                    <HelpCircle className="w-4 h-4" />
                    STRATEGIC SUPPORT
                </div>
            </header>

            <main className="flex-1 flex flex-col lg:flex-row pt-24">
                <section className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-[#F5F4EF]">
                    <div className="max-w-xl w-full">
                        <div className="mb-16 space-y-6">
                            <h1 className="text-5xl lg:text-7xl font-black leading-[0.9] tracking-tighter mb-4 text-[#1F3F34] uppercase bricolage">
                                Access<br/>
                                <span className="text-[#1F3F34]/30">Restoration</span>
                            </h1>
                            <p className="text-xl leading-relaxed text-[#1F3F34]/60 font-medium italic border-l-8 border-[#FACD15] pl-10">
                                "Unauthorized access lock? Enter your tactical email and we’ll dispatch a recovery uplink immediately."
                            </p>
                        </div>

                        {error && (
                            <div className="mb-10 p-6 bg-rose-50 border-2 border-rose-100 text-rose-800 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl flex items-center gap-4 shadow-2xl">
                                <AlertCircle className="w-5 h-5" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-[#1F3F34]/30 uppercase tracking-[0.4em] ml-6" htmlFor="email">
                                    TACTICAL EMAIL
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-[#FACD15] group-focus-within:scale-125 transition-transform" />
                                    <input 
                                        className="w-full bg-[#E9E8E3] border-2 border-transparent focus:border-[#FACD15] rounded-full pl-20 pr-8 py-6 text-[#1F3F34] font-black placeholder:text-[#1F3F34]/10 focus:outline-none transition-all uppercase text-sm tracking-widest shadow-inner" 
                                        id="email" 
                                        placeholder="OPERATIVE@EMAIL.COM" 
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value.toUpperCase())}
                                        required
                                    />
                                </div>
                            </div>
                            <button 
                                disabled={isLoading}
                                className="w-full bg-[#1F3F34] text-[#FACD15] font-black rounded-2xl py-6 text-center shadow-2xl shadow-[#1F3F34]/20 active:scale-[0.98] transition-all hover:bg-[#FACD15] hover:text-[#1F3F34] flex items-center justify-center gap-4 text-[11px] tracking-[0.4em] uppercase" 
                                type="submit"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-6 h-6 animate-spin font-black" />
                                ) : (
                                    <>
                                        <Mail className="w-5 h-5" />
                                        DISPATCH RECOVERY UPLINK
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-16">
                            <Link className="flex items-center gap-4 text-[#1F3F34]/40 font-black uppercase tracking-[0.4em] hover:text-[#FACD15] transition-all text-[10px] group" to="/sign-in">
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-3 transition-transform" />
                                RETURN TO LOGIN PORTAL
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="w-full lg:w-1/2 bg-[#EFEEE9] relative overflow-hidden flex items-center justify-center min-h-[500px]">
                    <div className="absolute top-0 right-0 w-full h-full">
                        <img 
                            alt="Security Matrix" 
                            className="w-full h-full object-cover grayscale brightness-125 opacity-40" 
                            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000" 
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#EFEEE9]/80 to-[#EFEEE9]"></div>
                    <div className="relative z-10 w-full flex items-center justify-center p-12 lg:p-24">
                        <div className="bg-white/80 backdrop-blur-2xl p-16 rounded-[4rem] border border-white shadow-2xl space-y-10 max-w-lg">
                            <div className="w-20 h-20 rounded-[2.5rem] bg-[#FACD15] flex items-center justify-center shadow-2xl shadow-[#FACD15]/20">
                                <ShieldCheck className="w-10 h-10 text-[#1F3F34]" />
                            </div>
                            <h3 className="text-3xl font-black uppercase bricolage tracking-tight text-[#1F3F34]">Zero Compromise</h3>
                            <p className="text-[10px] font-black text-[#1F3F34]/40 leading-relaxed uppercase tracking-[0.3em]">We employ military-grade encryption for all credential restoration sequences. Your data remains protected within the Hearth network.</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

function AlertCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

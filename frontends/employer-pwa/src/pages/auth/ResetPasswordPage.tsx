import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Eye, EyeOff, CheckCircle2, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../../store';
import { resetPassword } from '../../store/slices/authSlice';

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
    const dispatch = useAppDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!token) {
            setError('Missing reset token. Please use the link from your tactical email.');
            return;
        }

        if (password !== confirmPassword) {
            setError('New credentials do not match.');
            return;
        }

        if (password.length < 8) {
            setError('Credential must be at least 8 characters for tactical security.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await dispatch(resetPassword({ token, password })).unwrap();
            setIsSuccess(true);
        } catch (err: any) {
            setError(err || 'Failed to rotate credentials. The uplink may have expired.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!token && !isSuccess) {
        return (
            <div className="min-h-screen bg-[#F5F4EF] flex items-center justify-center p-8 text-left selection:bg-[#FACD15] selection:text-[#1F3F34]">
                <div className="bg-white p-14 rounded-[3.5rem] border border-[#EFEEE9] space-y-10 max-w-xl shadow-2xl shadow-[#1F3F34]/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500 opacity-[0.03] rounded-full -mr-16 -mt-16 blur-[60px]"></div>
                    <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center border-2 border-rose-100 shadow-xl shadow-rose-500/10">
                         <ShieldCheck className="w-10 h-10 text-rose-500" />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-4xl font-black text-[#1F3F34] uppercase bricolage tracking-tight">Invalid Uplink</h2>
                        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#1F3F34]/30 leading-relaxed italic">
                            "This recovery uplink is invalid or has expired. Request a new synchronization sequence."
                        </p>
                    </div>
                    <button 
                        onClick={() => navigate('/forgot-password')}
                        className="w-full py-6 bg-[#1F3F34] text-[#FACD15] rounded-2xl font-black text-[11px] tracking-[0.4em] uppercase hover:bg-[#FACD15] hover:text-[#1F3F34] transition-all border-none flex items-center justify-center shadow-2xl shadow-[#1F3F34]/20"
                    >
                        REQUEST NEW UPLINK
                    </button>
                </div>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-[#F5F4EF] flex items-center justify-center p-8 relative overflow-hidden selection:bg-[#FACD15] selection:text-[#1F3F34]">
                <div className="absolute inset-0 bg-[radial-gradient(#FACD15_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.1] pointer-events-none" />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-xl bg-white rounded-[4rem] border border-[#EFEEE9] p-16 text-center space-y-12 shadow-2xl relative z-10"
                >
                    <div className="w-28 h-28 bg-[#C7EBDB]/30 rounded-[2.5rem] flex items-center justify-center mx-auto border-4 border-white shadow-2xl shadow-emerald-500/10">
                        <CheckCircle2 className="w-14 h-14 text-emerald-500" />
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-5xl font-black text-[#1F3F34] tracking-tighter uppercase bricolage leading-none">PROTOCOL<br/>AUTHORIZED</h2>
                        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#1F3F34]/30 leading-relaxed max-w-sm mx-auto italic">
                            "Credentials successfully rotated. You may now access the tactical network with your new identity parameters."
                        </p>
                    </div>
                    <button 
                        onClick={() => navigate('/sign-in')}
                        className="w-full py-7 bg-[#1F3F34] text-[#FACD15] rounded-[2rem] font-black text-[11px] tracking-[0.4em] uppercase hover:bg-[#FACD15] hover:text-[#1F3F34] transition-all shadow-[0_30px_60px_-15px_rgba(31,63,52,0.4)] flex items-center justify-center gap-6 group"
                    >
                        INITIALIZE LOGIN
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform" />
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F4EF] flex items-center justify-center p-8 relative overflow-hidden selection:bg-[#FACD15] selection:text-[#1F3F34]">
            <div className="absolute inset-0 bg-[radial-gradient(#1F3F34_1px,transparent_1px)] [background-size:60px_60px] opacity-[0.03] pointer-events-none" />
            
            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-xl bg-white/90 backdrop-blur-3xl rounded-[4rem] border border-[#EFEEE9] p-12 lg:p-20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] relative z-10"
            >
                <div className="space-y-16">
                    <div className="flex flex-col items-center gap-10">
                        <div className="w-24 h-24 bg-[#FACD15] rounded-[2rem] flex items-center justify-center shadow-2xl shadow-[#FACD15]/30 group hover:rotate-12 transition-all duration-500">
                            <ShieldCheck className="w-12 h-12 text-[#1F3F34]" />
                        </div>
                        <div className="text-center space-y-4">
                            <h2 className="text-5xl font-black text-[#1F3F34] tracking-tighter uppercase bricolage">NEW PROTOCOL</h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1F3F34]/20 italic leading-relaxed">"CALIBRATE YOUR SECURITY CREDENTIALS BELOW."</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-[#1F3F34]/30 uppercase tracking-[0.4em] ml-6">NEW CREDENTIAL</label>
                            <div className="relative group">
                                <Lock className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-[#FACD15] group-focus-within:scale-125 transition-transform" />
                                <input 
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#F5F4EF] border-2 border-transparent focus:border-[#FACD15] rounded-full py-6 pl-20 pr-16 text-[#1F3F34] font-black focus:outline-none transition-all placeholder:text-[#1F3F34]/10 text-sm tracking-widest shadow-inner uppercase"
                                    placeholder="MIN 8 CHARACTERS"
                                    required
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-8 top-1/2 -translate-y-1/2 text-[#1F3F34]/20 hover:text-[#FACD15] transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-[#1F3F34]/30 uppercase tracking-[0.4em] ml-6">CONFIRM CREDENTIAL</label>
                            <div className="relative group">
                                <Lock className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-[#FACD15] group-focus-within:scale-125 transition-transform" />
                                <input 
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-[#F5F4EF] border-2 border-transparent focus:border-[#FACD15] rounded-full py-6 pl-20 pr-8 text-[#1F3F34] font-black focus:outline-none transition-all placeholder:text-[#1F3F34]/10 text-sm tracking-widest shadow-inner uppercase"
                                    placeholder="REPEAT PROTOCOL"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-rose-50 text-rose-800 p-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border-2 border-rose-100 flex items-center gap-4 shadow-2xl shadow-rose-500/5"
                            >
                                <AlertCircle className="w-5 h-5" />
                                {error}
                            </motion.div>
                        )}

                        <button 
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-7 bg-[#1F3F34] text-[#FACD15] rounded-[2rem] font-black text-[11px] tracking-[0.4em] uppercase hover:bg-[#FACD15] hover:text-[#1F3F34] transition-all shadow-[0_30px_60px_-15px_rgba(31,63,52,0.4)] active:scale-[0.98] flex items-center justify-center gap-6 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? <Loader2 className="w-6 h-6 animate-spin font-black" /> : (
                                <>
                                    <ShieldCheck className="w-6 h-6" />
                                    AUTHORIZE ROTATION
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}

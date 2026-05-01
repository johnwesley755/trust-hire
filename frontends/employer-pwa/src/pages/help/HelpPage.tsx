import React, { useState } from 'react';
import apiClient from '../../api/apiClient';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    HelpCircle, 
    MessageSquare, 
    ChevronDown, 
    CheckCircle2, 
    Loader2, 
    Mail, 
    Phone,
    ShieldCheck as ShieldInfo
} from 'lucide-react';

const FAQS = [
    {
        question: "HOW DO I INITIALIZE A NEW MISSION?",
        answer: "Deploying a new job is streamlined through the 'POST JOB' portal. Specify tactical parameters including sector, description, hub location, and monthly stipend. Your briefing will immediately synchronize with all verified operatives in the target sector."
    },
    {
        question: "HOW DO I VALIDATE OPERATIVE CREDENTIALS?",
        answer: "Every operative in the Hearth Network is pre-validated. You can analyze their Trust Hire Score, Rank Level, and verified reputation logs on their dossier profile before authorizing a deployment."
    },
    {
        question: "EXPLAIN THE FINANCIAL ESCROW PROTOCOL.",
        answer: "Trust Hire utilizes a milestone-locked financial matrix. Funds are secured in escrow upon mission commencement and released to the operative only upon your digital authorization of successful completion."
    },
    {
        question: "WHAT IS THE ABORT POLICY FOR ACTIVE MISSIONS?",
        answer: "You may terminate a job posting at any time prior to operative authorization. If a mission is aborted after an operative is deployed, standardized cancellation protocols may apply depending on the tactical timeline."
    }
];

export const HelpPage = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [ticket, setTicket] = useState({ subject: '', message: '' });

    const handleSubmitTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await apiClient.post('/api/support/ticket', ticket);
            setFormStatus('success');
            setTicket({ subject: '', message: '' });
        } catch (err) {
            setFormStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F4EF] selection:bg-[#FACD15] selection:text-[#1F3F34]">
            <div className="max-w-[1400px] mx-auto p-4 lg:p-12 text-left">
                <header className="mb-20 space-y-6">
                    <h1 className="text-5xl md:text-7xl font-black bricolage text-[#1F3F34] tracking-tighter uppercase leading-[0.85]">
                        Tactical<br/>
                        <span className="text-[#1F3F34]/30">Support Intel</span>
                    </h1>
                    <p className="text-[#1F3F34]/60 font-black text-[11px] uppercase tracking-[0.4em] max-w-xl leading-relaxed italic border-l-4 border-[#FACD15] pl-8">
                        "Need assistance with your hiring protocol? Our enterprise specialists are online to maintain your operational edge."
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* FAQ Section */}
                    <div className="lg:col-span-7 space-y-10">
                        <div className="flex items-center gap-6 mb-12">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-[#1F3F34] flex items-center justify-center shadow-2xl shadow-[#1F3F34]/20">
                                <HelpCircle className="w-8 h-8 text-[#FACD15]" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black uppercase bricolage tracking-tight text-[#1F3F34]">Employer Knowledge Base</h2>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1F3F34]/20">Verified operational procedures.</p>
                            </div>
                        </div>
                        
                        <div className="space-y-6">
                            {FAQS.map((faq, index) => (
                                <div 
                                    key={index}
                                    className="bg-white rounded-[2.5rem] border border-[#EFEEE9] overflow-hidden transition-all hover:shadow-2xl hover:shadow-[#1F3F34]/5 group"
                                >
                                    <button 
                                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                        className="w-full px-10 py-8 text-left flex items-center justify-between gap-10"
                                    >
                                        <span className={`text-sm font-black uppercase tracking-[0.1em] transition-colors ${openFaq === index ? 'text-[#FACD15]' : 'text-[#1F3F34] group-hover:text-[#FACD15]'}`}>{faq.question}</span>
                                        <div className={`w-10 h-10 rounded-xl bg-[#F5F4EF] flex items-center justify-center transition-all duration-500 ${openFaq === index ? 'bg-[#1F3F34] text-[#FACD15] rotate-180' : 'text-[#1F3F34]/20'}`}>
                                            <ChevronDown className="w-6 h-6" />
                                        </div>
                                    </button>
                                    <AnimatePresence>
                                        {openFaq === index && (
                                            <motion.div 
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="px-10 pb-10 text-[#1F3F34]/60 text-md font-medium leading-relaxed italic border-t border-[#F5F4EF] pt-8"
                                            >
                                                {faq.answer}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-5">
                        <div className="bg-[#1F3F34] text-white rounded-[4rem] p-12 lg:p-16 shadow-[0_50px_100px_-20px_rgba(31,63,52,0.4)] relative overflow-hidden lg:sticky lg:top-12">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FACD15] opacity-[0.03] rounded-full -mr-32 -mt-32 blur-[80px]"></div>
                            
                            <div className="flex items-center gap-6 mb-16 relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                                    <ShieldInfo className="w-8 h-8 text-[#FACD15]" />
                                </div>
                                <h2 className="text-2xl font-black uppercase bricolage tracking-tight">Direct Comms</h2>
                            </div>
                            
                            {formStatus === 'success' ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-16 space-y-8"
                                >
                                    <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/40">
                                        <CheckCircle2 className="w-12 h-12 text-white" />
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-2xl font-black uppercase bricolage tracking-tight">Signal Received</p>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 max-w-xs mx-auto leading-relaxed">
                                            Your tactical inquiry has been logged. Our specialists will respond shortly.
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => setFormStatus('idle')}
                                        className="text-[#FACD15] text-[10px] font-black uppercase tracking-[0.3em] underline hover:text-white transition-colors"
                                    >
                                        SEND ANOTHER SIGNAL
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmitTicket} className="space-y-10 relative z-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-4">SUBJECT PARAMETER</label>
                                        <input 
                                            type="text" 
                                            required
                                            value={ticket.subject}
                                            onChange={e => setTicket({...ticket, subject: e.target.value.toUpperCase()})}
                                            placeholder="NATURE OF INQUIRY..."
                                            className="w-full bg-white/5 border border-white/10 rounded-full px-8 py-5 text-sm font-black focus:border-[#FACD15] outline-none transition-all placeholder:text-white/10 shadow-inner"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-4">MISSION DETAILS</label>
                                        <textarea 
                                            required
                                            rows={5}
                                            value={ticket.message}
                                            onChange={e => setTicket({...ticket, message: e.target.value})}
                                            placeholder="PROVIDE TACTICAL CONTEXT..."
                                            className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-8 text-sm font-black focus:border-[#FACD15] outline-none transition-all resize-none placeholder:text-white/10 shadow-inner italic"
                                        />
                                    </div>
                                    <button 
                                        disabled={isSubmitting}
                                        className="w-full bg-[#FACD15] text-[#1F3F34] font-black py-6 rounded-[2rem] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 group shadow-2xl shadow-[#FACD15]/20 uppercase text-[11px] tracking-[0.4em]"
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="w-6 h-6 animate-spin font-black" />
                                        ) : (
                                            <>
                                                <MessageSquare className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                                PRIORITY UPLINK
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}

                            <div className="mt-20 pt-10 border-t border-white/10 grid grid-cols-1 gap-6">
                                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] group">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-[#FACD15]/20 transition-all">
                                        <Mail className="w-5 h-5 text-[#FACD15]" />
                                    </div>
                                    <span className="opacity-40 hover:opacity-100 transition-opacity">STRATEGIC@TRUSTHIRE.COM</span>
                                </div>
                                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#FACD15] group">
                                    <div className="w-10 h-10 rounded-xl bg-[#FACD15]/10 flex items-center justify-center border border-[#FACD15]/20 group-hover:bg-[#FACD15] group-hover:text-[#1F3F34] transition-all">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <span className="tracking-[0.4em]">24/7 PRIORITY HOTLINE ACTIVE</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

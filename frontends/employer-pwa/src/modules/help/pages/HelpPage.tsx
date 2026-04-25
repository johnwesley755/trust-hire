import React, { useState } from 'react';
import apiClient from '../../../core/api/apiClient';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
    {
        question: "How do I post a new job?",
        answer: "Click on 'Post Job' in your dashboard. You will need to provide details like job category, description, location, and hourly rate. Your post will be visible to all verified workers in that region."
    },
    {
        question: "How do I verify a worker's credentials?",
        answer: "Every worker on TrustHire is pre-verified. You can view their trust score, level, and previous employer ratings on their profile before hiring."
    },
    {
        question: "How does the TrustHire billing system work?",
        answer: "We use a milestone-based payment system. Funds are held in escrow when a job starts and released to the worker once you confirm the work is completed."
    },
    {
        question: "Can I cancel a job after posting it?",
        answer: "Yes, you can cancel a job at any time before hiring. If you cancel after hiring a worker, a small cancellation fee may apply depending on the timing."
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
        <div className="min-h-screen bg-[#F5F4EF] pb-20 pt-8 px-4 md:px-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-headline font-extrabold text-[#1F3F34] mb-4">Enterprise Support</h1>
                    <p className="text-[#1F3F34]/60 max-w-xl mx-auto">Need assistance with your hiring protocol? Our enterprise specialists are here to help.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* FAQ Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-2xl font-headline font-bold text-[#1F3F34] mb-6 flex items-center gap-3">
                            <span className="material-symbols-outlined text-[#FACD15]">help_center</span>
                            Employer FAQs
                        </h2>
                        
                        <div className="space-y-4">
                            {FAQS.map((faq, index) => (
                                <div 
                                    key={index}
                                    className="bg-white rounded-2xl border border-[#1F3F34]/5 overflow-hidden transition-all hover:shadow-md"
                                >
                                    <button 
                                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                        className="w-full px-6 py-5 text-left flex items-center justify-between gap-4"
                                    >
                                        <span className="font-bold text-[#1F3F34]">{faq.question}</span>
                                        <span className={`material-symbols-outlined transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}>
                                            expand_more
                                        </span>
                                    </button>
                                    <AnimatePresence>
                                        {openFaq === index && (
                                            <motion.div 
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="px-6 pb-6 text-[#1F3F34]/70 text-sm leading-relaxed"
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
                    <div className="lg:col-span-1">
                        <div className="bg-[#1F3F34] text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden sticky top-8">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FACD15] opacity-5 rounded-full -mr-16 -mt-16"></div>
                            
                            <h2 className="text-xl font-headline font-bold mb-6 relative z-10">Direct Protocol</h2>
                            
                            {formStatus === 'success' ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-8 space-y-4"
                                >
                                    <span className="material-symbols-outlined text-5xl text-[#FACD15]">check_circle</span>
                                    <p className="font-bold">Protocol Received</p>
                                    <p className="text-sm text-white/60 text-center">Your support request has been logged. Expect a response shortly.</p>
                                    <button 
                                        onClick={() => setFormStatus('idle')}
                                        className="text-[#FACD15] text-sm font-bold underline"
                                    >
                                        Log another request
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmitTicket} className="space-y-4 relative z-10">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Subject</label>
                                        <input 
                                            type="text" 
                                            required
                                            value={ticket.subject}
                                            onChange={e => setTicket({...ticket, subject: e.target.value})}
                                            placeholder="Nature of inquiry..."
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#FACD15] outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Details</label>
                                        <textarea 
                                            required
                                            rows={5}
                                            value={ticket.message}
                                            onChange={e => setTicket({...ticket, message: e.target.value})}
                                            placeholder="Provide technical context..."
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#FACD15] outline-none transition-all resize-none"
                                        />
                                    </div>
                                    <button 
                                        disabled={isSubmitting}
                                        className="w-full bg-[#FACD15] text-[#1F3F34] font-black py-4 rounded-2xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
                                    >
                                        {isSubmitting ? (
                                            <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined">support_agent</span>
                                                Priority Support
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}

                            <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="material-symbols-outlined text-[#FACD15] text-lg">corporate_fare</span>
                                    <span>enterprise@trusthire.com</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm font-bold text-[#FACD15]">
                                    <span className="material-symbols-outlined text-lg">priority_high</span>
                                    <span>24/7 Priority Hotline</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

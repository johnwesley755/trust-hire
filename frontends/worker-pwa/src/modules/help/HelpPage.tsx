import React, { useState } from 'react';
import apiClient from '../../api/apiClient';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
    {
        question: "How do I increase my Worker Level?",
        answer: "Your level increases based on your work experience, skill certifications, and consistently high ratings from employers. Completing more jobs successfully and passing skill tests are the fastest ways to level up."
    },
    {
        question: "When do I get paid?",
        answer: "Payments are typically processed 24-48 hours after the employer confirms the completion of a job. You can track your earnings in the dashboard."
    },
    {
        question: "What should I do if an employer cancels a job?",
        answer: "If a job is cancelled within 2 hours of the start time, you may be eligible for a cancellation fee. Contact support if you believe you are entitled to compensation."
    },
    {
        question: "How do I verify my identity?",
        answer: "Go to Profile > Verify Identity. You will need to upload a valid government ID and take a live selfie for verification."
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
                    <h1 className="text-4xl font-headline font-extrabold text-[#1F3F34] mb-4">Support Center</h1>
                    <p className="text-[#1F3F34]/60 max-w-xl mx-auto">How can we help you today? Search our FAQs or contact our dedicated support team.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* FAQ Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-2xl font-headline font-bold text-[#1F3F34] mb-6 flex items-center gap-3">
                            <span className="material-symbols-outlined text-[#FACD15]">help_center</span>
                            Frequently Asked Questions
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
                            
                            <h2 className="text-xl font-headline font-bold mb-6 relative z-10">Contact Support</h2>
                            
                            {formStatus === 'success' ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-8 space-y-4"
                                >
                                    <span className="material-symbols-outlined text-5xl text-[#FACD15]">check_circle</span>
                                    <p className="font-bold">Message Sent!</p>
                                    <p className="text-sm text-white/60 text-center">Our team will get back to you within 24 hours.</p>
                                    <button 
                                        onClick={() => setFormStatus('idle')}
                                        className="text-[#FACD15] text-sm font-bold underline"
                                    >
                                        Send another message
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
                                            placeholder="What's the issue?"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#FACD15] outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Message</label>
                                        <textarea 
                                            required
                                            rows={5}
                                            value={ticket.message}
                                            onChange={e => setTicket({...ticket, message: e.target.value})}
                                            placeholder="Describe your problem in detail..."
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
                                                <span className="material-symbols-outlined">send</span>
                                                Submit Ticket
                                            </>
                                        )}
                                    </button>
                                    {formStatus === 'error' && (
                                        <p className="text-red-400 text-xs text-center">Failed to send. Please try again.</p>
                                    )}
                                </form>
                            )}

                            <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="material-symbols-outlined text-[#FACD15] text-lg">mail</span>
                                    <span>support@trusthire.com</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="material-symbols-outlined text-[#FACD15] text-lg">call</span>
                                    <span>+91 1800-TRUST-HIRE</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

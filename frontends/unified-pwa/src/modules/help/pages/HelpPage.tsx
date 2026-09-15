import React, { useState } from 'react';
import apiClient from '../../../api/apiClient';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  ChevronDown, 
  PhoneCall, 
  Mail, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  MessageSquare, 
  FileQuestion,
  Loader2,
  Clock
} from 'lucide-react';

const FAQS = [
  {
    question: "How do I post a new shift or job opening?",
    answer: "Navigate to 'Post a Job' or click '+ Post New Shift' in your Hiring Console. Fill in the trade specialization, location coordinates, shift duration, and proposed budget. The opening will instantly broadcast to verified workers in that vicinity."
  },
  {
    question: "How are worker credentials and identity verified?",
    answer: "Workers undergo biometric and Aadhaar verification alongside trade certifications before dispatch. You can review their verified credentials, ratings, and experience dossier directly from applicant management."
  },
  {
    question: "How does the milestone payout escrow operate?",
    answer: "TrustHyre utilizes an escrow release structure. Shift funds are earmarked at confirmation and released to the worker once shift completion is validated by the client supervisor."
  },
  {
    question: "What is the policy for cancellation or rescheduling?",
    answer: "You can reschedule or cancel an open requirement at any time prior to worker dispatch confirmation without incurring fees. Shifts cancelled post-dispatch are subject to standard transit compensation."
  }
];

export const HelpPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
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
    <div className="min-h-screen bg-[#F8FAFC] pb-24 pt-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <header className="pb-5 border-b border-slate-200">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0066FF] uppercase tracking-wider mb-1">
            <HelpCircle className="w-4 h-4" /> Help & Support Center
          </div>
          <h1 className="text-2xl font-black text-[#0A1931] tracking-tight">Enterprise Support & Documentation</h1>
          <p className="text-slate-500 font-medium text-xs sm:text-sm mt-0.5">
            Access operational documentation, FAQs, and reach our dedicated compliance and dispatch coordinators.
          </p>
        </header>

        {/* Quick Contact Banners */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#0066FF] flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Toll-Free Dispatch</p>
              <p className="text-xs font-bold text-[#0A1931]">1800-890-HIRE</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Direct Protocol</p>
              <p className="text-xs font-bold text-[#0A1931]">support@trusthyre.com</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Response Time</p>
              <p className="text-xs font-bold text-[#0A1931]">&lt; 15 Minutes SLA</p>
            </div>
          </div>
        </div>

        {/* Main Grid: FAQs & Direct Support Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* FAQ Accordion */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <FileQuestion className="w-4 h-4 text-[#0066FF]" />
              <h2 className="text-base font-bold text-[#0A1931]">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-2.5">
              {FAQS.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div 
                    key={index}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs transition-all"
                  >
                    <button 
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50"
                    >
                      <span className="font-bold text-xs sm:text-sm text-[#0A1931]">{faq.question}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-[#0066FF]' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-5 pb-4 text-slate-600 text-xs leading-relaxed border-t border-slate-100 pt-3"
                        >
                          {faq.answer}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Support Ticket Form */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#0A1931] text-white flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#0A1931]">Submit Support Ticket</h2>
                  <p className="text-[11px] text-slate-400">Direct escalation to dispatch desk</p>
                </div>
              </div>

              {formStatus === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6 space-y-3"
                >
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-sm text-[#0A1931]">Protocol Logged</h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Your inquiry has been assigned ticket ID #TK-{Math.floor(1000 + Math.random() * 9000)}. A coordinator will contact you shortly.
                  </p>
                  <button 
                    onClick={() => setFormStatus('idle')}
                    className="text-[#0066FF] text-xs font-bold hover:underline cursor-pointer pt-2 inline-block"
                  >
                    Submit another query
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmitTicket} className="space-y-3.5">
                  {formStatus === 'error' && (
                    <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-lg font-medium">
                      Failed to log ticket. Please try again or call toll-free dispatch.
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Subject / Category</label>
                    <input 
                      type="text" 
                      required
                      value={ticket.subject}
                      onChange={e => setTicket({...ticket, subject: e.target.value})}
                      placeholder="e.g. Escrow disbursement inquiry"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0066FF] focus:bg-white text-[#0A1931] font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Detailed Message</label>
                    <textarea 
                      required
                      rows={4}
                      value={ticket.message}
                      onChange={e => setTicket({...ticket, message: e.target.value})}
                      placeholder="Describe the issue, job ID, or worker ID involved..."
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0066FF] focus:bg-white text-[#0A1931] font-medium resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-[#0A1931] hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Transmitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" /> Dispatch Ticket
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

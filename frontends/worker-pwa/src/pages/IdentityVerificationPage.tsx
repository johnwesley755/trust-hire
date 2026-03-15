import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { verificationService } from '../api/verification.service';
import apiClient from '../api/apiClient';
import { ShieldCheck, Upload, Camera, CheckCircle2, AlertCircle, Loader2, Briefcase, ChevronRight, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const IdentityVerificationPage = () => {
  const [step, setStep] = useState(1);
  const [docPreview, setDocPreview] = useState<string | null>(null);
  const [livePreview, setLivePreview] = useState<string | null>(null);

  const { data: status, refetch } = useQuery({
    queryKey: ['verificationStatus'],
    queryFn: verificationService.getStatus
  });

  const docMutation = useMutation({
    mutationFn: (file: File) => verificationService.uploadAadhaar(file),
    onSuccess: () => {
      setStep(2);
      refetch();
    }
  });

  const liveMutation = useMutation({
    mutationFn: (file: File) => verificationService.uploadLiveCapture(file),
    onSuccess: () => {
      setStep(3);
      refetch();
    }
  });

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocPreview(URL.createObjectURL(file));
      docMutation.mutate(file);
    }
  };

  const handleLiveUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLivePreview(URL.createObjectURL(file));
      liveMutation.mutate(file);
    }
  };

  const handleSyncAndRedirect = async () => {
    try {
      await apiClient.post('/api/auth/sync', { onboarded: true });
      localStorage.setItem('onboarded', 'true');
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userObj = JSON.parse(storedUser);
        userObj.onboarded = true;
        localStorage.setItem('user', JSON.stringify(userObj));
      }
      window.location.href = '/dashboard';
    } catch (e) {
      console.error(e);
      alert("Synchronization failed. Please check your connection.");
    }
  };

  // If already verified or pending (and past upload steps), show status
  if (status?.status === 'VERIFIED' || (status?.status === 'PENDING' && step === 3)) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6 selection:bg-brand-primary selection:text-brand-secondary">
        <div className="absolute inset-0 cloud-grid opacity-[0.05] pointer-events-none" />
        
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg w-full bg-white border border-brand-border rounded-[3rem] p-12 text-center space-y-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-brand-primary" />
          
          {status.status === 'VERIFIED' ? (
            <>
              <div className="mx-auto w-24 h-24 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center border border-emerald-500/20 shadow-xl">
                <CheckCircle2 className="h-12 w-12 text-emerald-500" />
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-brand-secondary uppercase">Verified</h1>
                <p className="text-brand-muted font-medium text-lg leading-relaxed px-4">
                  Professional credentials authenticated. Your profile is now live in the global enterprise pool.
                </p>
              </div>
              <button 
                onClick={handleSyncAndRedirect}
                className="w-full bg-brand-secondary text-brand-primary font-bold py-6 rounded-4xl shadow-2xl hover:bg-neutral-800 active:scale-[0.98] transition-all flex items-center justify-center gap-4 text-xl uppercase tracking-widest"
              >
                Enter Repository <ChevronRight className="w-6 h-6" />
              </button>
            </>
          ) : (
            <>
              <div className="mx-auto w-24 h-24 bg-brand-primary/10 rounded-[2rem] flex items-center justify-center border border-brand-primary/20 shadow-xl">
                <Loader2 className="h-12 w-12 text-brand-primary animate-spin" />
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-brand-secondary uppercase">Processing</h1>
                <p className="text-brand-muted font-medium text-lg leading-relaxed px-4">
                  TrustHire AI is analyzing your documents. Most integrations complete in under 24 hours.
                </p>
              </div>
              <button 
                onClick={() => window.location.href = '/dashboard'} 
                className="w-full bg-brand-surface text-brand-muted font-bold py-6 rounded-4xl border border-brand-border hover:bg-white transition-all uppercase tracking-widest text-xs"
              >
                Return to Interface
              </button>
            </>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center p-8 lg:p-24 selection:bg-brand-primary selection:text-brand-secondary relative overflow-hidden">
      <div className="absolute inset-0 cloud-grid opacity-[0.03] pointer-events-none" />
      
      <div className="max-w-2xl w-full space-y-16 z-10">
        <div className="flex flex-col items-center gap-6">
             <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-brand-secondary rounded-xl flex items-center justify-center shadow-lg">
                    <ShieldCheck className="w-8 h-8 text-brand-primary" />
                </div>
                <div className="flex flex-col text-left">
                    <span className="text-2xl font-bold tracking-tight text-neutral-900 uppercase leading-none">TrustPro</span>
                    <span className="text-[10px] font-medium text-brand-primary uppercase tracking-[0.3em] mt-1">Identity Protocol</span>
                </div>
            </div>
            <div className="text-center space-y-3">
                <h1 className="text-6xl font-black text-neutral-900 tracking-tighter uppercase grayscale opacity-20">Authentication</h1>
                <p className="text-brand-muted font-bold uppercase tracking-[0.4em] text-[10px] italic">Securing the professional network</p>
            </div>
        </div>

        {/* Progress Stepper */}
        <div className="flex items-center justify-between px-8 max-w-md mx-auto">
            {[1, 2, 3].map((s_id) => (
                <div key={s_id} className="flex items-center flex-1 last:flex-none">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 ${
                        step >= s_id 
                        ? 'bg-brand-secondary border-brand-secondary text-brand-primary shadow-2xl rotate-3' 
                        : 'bg-white border-brand-border text-brand-muted/30'
                    }`}>
                        {s_id === 1 && <Upload className="w-6 h-6" />}
                        {s_id === 2 && <Camera className="w-6 h-6" />}
                        {s_id === 3 && <ShieldCheck className="w-6 h-6" />}
                    </div>
                    {s_id < 3 && (
                        <div className={`h-1.5 flex-1 mx-4 rounded-full transition-all duration-700 ${
                            step > s_id ? 'bg-brand-primary ring-4 ring-brand-primary/10' : 'bg-brand-border/30'
                        }`} />
                    )}
                </div>
            ))}
        </div>

        <AnimatePresence mode="wait">
            {step === 1 && (
            <motion.div 
                key="doc-upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white border border-brand-border rounded-[3rem] p-12 lg:p-16 space-y-12 shadow-2xl relative overflow-hidden"
            >
                <div className="space-y-4">
                    <div className="w-16 h-1 bg-brand-primary rounded-full" />
                    <h2 className="text-4xl font-bold tracking-tight text-neutral-900 uppercase">Credential Deposit</h2>
                    <p className="text-brand-muted font-medium text-lg">Upload official documentation (Aadhaar, PAN, or Passport) for AI verification.</p>
                </div>
                
                <div className="relative group border-2 border-dashed border-brand-border rounded-[2.5rem] p-16 text-center hover:border-brand-primary hover:bg-brand-surface transition-all cursor-pointer overflow-hidden shadow-inner bg-brand-surface/50">
                    <input type="file" onChange={handleDocUpload} className="absolute inset-0 opacity-0 cursor-pointer z-20" accept="image/*" />
                    {docPreview ? (
                        <div className="relative z-10">
                            <img src={docPreview} alt="ID Preview" className="mx-auto max-h-64 rounded-2xl shadow-2xl border-4 border-white grayscale-[0.2]" />
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-brand-secondary text-brand-primary px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl">Document Captured</div>
                        </div>
                    ) : (
                        <div className="space-y-6 relative z-10">
                             <div className="mx-auto w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform border border-brand-border">
                                <Upload className="w-10 h-10 text-brand-muted/30 group-hover:text-brand-primary transition-colors" />
                            </div>
                            <div className="text-xs font-bold uppercase tracking-[0.3em] text-brand-muted/60">Select ID Artifact</div>
                        </div>
                    )}
                </div>
                
                <button 
                    disabled={!docPreview || docMutation.isPending} 
                    className="w-full bg-brand-secondary text-brand-primary font-bold py-6 rounded-4xl shadow-2xl disabled:opacity-30 transition-all flex items-center justify-center gap-4 text-xl uppercase tracking-widest hover:bg-neutral-800"
                >
                    {docMutation.isPending ? <Loader2 className="animate-spin w-8 h-8" /> : (
                        <>Process Document <ChevronRight className="w-6 h-6" /></>
                    )}
                </button>
            </motion.div>
            )}

            {step === 2 && (
            <motion.div 
                key="live-capture"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white border border-brand-border rounded-[3rem] p-12 lg:p-16 space-y-12 shadow-2xl relative overflow-hidden"
            >
                <div className="space-y-4 text-left">
                    <div className="w-16 h-1 bg-brand-accent rounded-full" />
                    <h2 className="text-4xl font-bold tracking-tight text-neutral-900 uppercase">Face Match Protocol</h2>
                    <p className="text-brand-muted font-medium text-lg leading-relaxed">Our clinical AI will match your live biometric signature with the uploaded ID document.</p>
                </div>

                <div className="relative group border-2 border-dashed border-brand-border rounded-full w-80 h-80 mx-auto p-4 transition-all cursor-pointer overflow-hidden shadow-2xl bg-brand-surface/30">
                    <input type="file" accept="image/*" capture="user" onChange={handleLiveUpload} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                    {livePreview ? (
                        <div className="w-full h-full rounded-full overflow-hidden border-8 border-brand-primary shadow-2xl relative rotate-3">
                            <img src={livePreview} alt="Live Preview" className="w-full h-full object-cover grayscale-[0.5]" />
                            <div className="absolute inset-0 bg-brand-primary/10" />
                        </div>
                    ) : (
                        <div className="w-full h-full bg-white rounded-full flex flex-col items-center justify-center space-y-4 group-hover:scale-105 transition-transform border border-brand-border">
                            <Camera className="w-14 h-14 text-brand-muted/20 group-hover:text-brand-primary transition-colors" />
                            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-muted/40 px-8 text-center leading-relaxed">Biometric <br /> Capture</div>
                        </div>
                    )}
                    {/* Face guide */}
                    <div className="absolute inset-8 border border-white/20 rounded-full pointer-events-none border-dashed animate-pulse" />
                </div>

                <button 
                    disabled={!livePreview || liveMutation.isPending} 
                    className="w-full bg-brand-secondary text-brand-primary font-bold py-6 rounded-4xl shadow-2xl disabled:opacity-30 transition-all flex items-center justify-center gap-4 text-xl uppercase tracking-widest hover:bg-neutral-800"
                >
                    {liveMutation.isPending ? <Loader2 className="animate-spin w-8 h-8" /> : (
                        <>Authorize AI Match <ChevronRight className="w-6 h-6" /></>
                    )}
                </button>
            </motion.div>
            )}

            {step === 3 && (
            <motion.div 
                key="final-status"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-brand-border rounded-[3rem] p-12 lg:p-16 text-center space-y-10 shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-brand-primary" />
                
                <div className={`mx-auto w-24 h-24 rounded-[2rem] flex items-center justify-center border-2 ${status?.status === 'REJECTED' ? 'bg-brand-accent/5 border-brand-accent/20' : 'bg-brand-primary/10 border-brand-primary/20'} shadow-xl rotate-3`}>
                    {status?.status === 'REJECTED' ? <AlertCircle className="w-10 h-10 text-brand-accent" /> : <ShieldCheck className="w-10 h-10 text-brand-primary" />}
                </div>
                
                <div className="space-y-4">
                    <h2 className="text-4xl font-bold tracking-tight text-neutral-900 uppercase">
                        {status?.status === 'REJECTED' ? 'Protocol Failed' : 'Success'}
                    </h2>
                    <p className="text-brand-muted font-medium text-lg leading-relaxed px-8">
                        {status?.status === 'REJECTED' 
                            ? 'Identity mismatch detected. Please re-run the protocol with clear documentation and consistent lighting.' 
                            : 'Identity trust established. Your profile has been promoted to Verified status.'}
                    </p>
                </div>

                {status?.status === 'REJECTED' ? (
                    <button 
                        onClick={() => setStep(1)} 
                        className="w-full bg-brand-accent text-white font-bold py-6 rounded-4xl shadow-xl hover:bg-red-700 transition-all uppercase tracking-widest"
                    >
                        Reset Protocol
                    </button>
                ) : (
                    <button 
                        onClick={handleSyncAndRedirect}
                        className="w-full bg-brand-secondary text-brand-primary font-bold py-6 rounded-4xl shadow-2xl hover:bg-neutral-800 active:scale-[0.98] transition-all flex items-center justify-center gap-4 text-xl uppercase tracking-widest"
                    >
                        Go to Operations <ChevronRight className="w-6 h-6" />
                    </button>
                )}
            </motion.div>
            )}
        </AnimatePresence>

        <div className="flex justify-center gap-8 text-[9px] font-bold text-brand-muted/40 uppercase tracking-[0.2em]">
            <span className="flex items-center gap-1.5"><Globe className="w-3 h-3" /> Global Standard</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> Encrypted Protocol</span>
            <span className="flex items-center gap-1.5">© 2026 TrustPro</span>
        </div>
      </div>
    </div>
  );
};

import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { verificationService } from '../api/verification.service';
import { ShieldCheck, Upload, Camera, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

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

  // If already verified or pending, show status
  if (status?.status === 'VERIFIED' || status?.status === 'PENDING') {
    return (
      <div className="min-h-screen bg-primary-950 flex items-center justify-center p-6 text-white">
        <div className="max-w-md w-full bg-primary-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-10 text-center space-y-6 shadow-2xl">
          {status.status === 'VERIFIED' ? (
            <>
              <div className="mx-auto w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="h-10 w-10 text-emerald-400" />
              </div>
              <h1 className="text-3xl font-bold">Identity Verified</h1>
              <p className="text-white/60">Your identity has been successfully verified. You now have full access to premium jobs.</p>
            </>
          ) : (
            <>
              <div className="mx-auto w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30 animate-pulse">
                <Loader2 className="h-10 w-10 text-blue-400 animate-spin" />
              </div>
              <h1 className="text-3xl font-bold">Verification Pending</h1>
              <p className="text-white/60">We are currently processing your identity documents. This usually takes less than 24 hours.</p>
            </>
          )}
          <button onClick={() => window.history.back()} className="w-full bg-white/10 hover:bg-white/20 py-3 rounded-xl transition-all">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-950 flex flex-col items-center p-6 md:p-12 text-white">
      <div className="max-w-xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Identity Trust</h1>
          <p className="text-white/40 italic">Secure your career with professional verification</p>
        </div>

        {/* Progress Stepper */}
        <div className="flex items-center justify-between px-4 max-w-sm mx-auto mb-10">
          <div className={`p-3 rounded-2xl border transition-all ${step >= 1 ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/20' : 'bg-white/5 border-white/10'}`}>
            <Upload className="h-6 w-6" />
          </div>
          <div className={`h-1 flex-1 mx-2 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-white/10'}`} />
          <div className={`p-3 rounded-2xl border transition-all ${step >= 2 ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/20' : 'bg-white/5 border-white/10'}`}>
            <Camera className="h-6 w-6" />
          </div>
          <div className={`h-1 flex-1 mx-2 rounded-full ${step >= 3 ? 'bg-blue-600' : 'bg-white/10'}`} />
          <div className={`p-3 rounded-2xl border transition-all ${step >= 3 ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/20' : 'bg-white/5 border-white/10'}`}>
            <ShieldCheck className="h-6 w-6" />
          </div>
        </div>

        {step === 1 && (
          <div className="bg-primary-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-8 shadow-2xl">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">1. Upload Official ID</h2>
              <p className="text-white/60 text-sm">Please upload a clear photo of your Aadhaar Card, PAN Card, or Driver's License.</p>
            </div>
            
            <div className="relative group border-2 border-dashed border-white/10 rounded-2xl p-10 text-center hover:border-blue-500/50 hover:bg-white/5 transition-all cursor-pointer overflow-hidden">
              <input type="file" onChange={handleDocUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
              {docPreview ? (
                <img src={docPreview} alt="ID Preview" className="mx-auto max-h-48 rounded-lg shadow-xl" />
              ) : (
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                    <Upload className="h-8 w-8 text-white/40" />
                  </div>
                  <div className="text-sm font-medium">Click to upload or drag & drop</div>
                </div>
              )}
            </div>
            
            <button disabled={!docPreview || docMutation.isPending} className="w-full bg-linear-to-r from-blue-600 to-indigo-600 py-4 rounded-xl font-bold disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10">
              {docMutation.isPending && <Loader2 className="animate-spin h-5 w-5" />}
              {docMutation.isPending ? 'Uploading...' : 'Continue to Next Step'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-primary-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-8 shadow-2xl">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">2. Face Match Capture</h2>
              <p className="text-white/60 text-sm">Our AI will match your live photo with the uploaded ID. Ensure your face is clearly visible.</p>
            </div>

            <div className="relative group border-2 border-dashed border-white/10 rounded-2xl p-10 text-center hover:border-emerald-500/50 hover:bg-white/5 transition-all cursor-pointer overflow-hidden">
              <input type="file" accept="image/*" capture="user" onChange={handleLiveUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              {livePreview ? (
                <img src={livePreview} alt="Live Preview" className="mx-auto max-h-48 rounded-full border-4 border-emerald-500/30 shadow-xl aspect-square object-cover" />
              ) : (
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                    <Camera className="h-8 w-8 text-white/40" />
                  </div>
                  <div className="text-sm font-medium">Click to capture live photo</div>
                </div>
              )}
            </div>

            <button disabled={!livePreview || liveMutation.isPending} className="w-full bg-linear-to-r from-emerald-600 to-teal-600 py-4 rounded-xl font-bold disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10">
              {liveMutation.isPending && <Loader2 className="animate-spin h-5 w-5" />}
              {liveMutation.isPending ? 'Verifying with AI...' : 'Complete Verification'}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="bg-primary-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-10 text-center space-y-6 shadow-2xl">
            <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center border ${status?.status === 'FAILED' ? 'bg-red-500/20 border-red-500/30' : 'bg-emerald-500/20 border-emerald-500/30'}`}>
              {status?.status === 'FAILED' ? <AlertCircle className="h-10 w-10 text-red-500" /> : <CheckCircle2 className="h-10 w-10 text-emerald-400" />}
            </div>
            <h2 className="text-3xl font-bold">{status?.status === 'FAILED' ? 'Match Failed' : 'Verification Success'}</h2>
            <p className="text-white/60">
              {status?.status === 'FAILED' 
                ? 'Your face matching failed. Please try again with better lighting and a clearer ID photo.' 
                : 'TrustHire AI has verified your identity. Redirecting to dashboard...'}
            </p>
            {status?.status === 'FAILED' ? (
              <button onClick={() => setStep(1)} className="w-full bg-red-600 hover:bg-red-500 py-4 rounded-xl font-bold transition-all">Try Again</button>
            ) : (
              <button onClick={() => window.location.href = '/dashboard'} className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-xl font-bold transition-all">Go to Dashboard</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { verificationService } from '../api/verification.service';
import apiClient from '../../../core/api/apiClient';
import { HelpCircle, ArrowLeft } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/providers/AuthContext';

// Modular Components
import AadhaarStep from '../components/verification/AadhaarStep';
import BiometricStep from '../components/verification/BiometricStep';
import SuccessStep from '../components/verification/SuccessStep';

export const IdentityVerificationPage = () => {
  const [step, setStep] = useState(1);
  const [docPreview, setDocPreview] = useState<string | null>(null);
  const [livePreview, setLivePreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const { updateUser } = useAuth();

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
      updateUser({ identity_verified: true });
      refetch();
    }
  });

  const handleDocUpload = (file: File) => {
    setDocPreview(URL.createObjectURL(file));
    docMutation.mutate(file);
  };

  const handleLiveUpload = (file: File) => {
    setLivePreview(URL.createObjectURL(file));
    liveMutation.mutate(file);
  };

  const handleSyncAndRedirect = async () => {
    try {
      await apiClient.post('/api/auth/sync', { onboarded: true });
      updateUser({ onboarded: true });
      navigate('/dashboard');
    } catch (e) {
      console.error(e);
      alert("Synchronization failed. Please check your connection.");
    }
  };

  // If already verified or just finished step 2 and waiting/success
  const isFinalStatus = status?.status === 'VERIFIED' || (status?.status === 'PENDING' && step === 3);

  return (
    <div className="min-h-screen bg-[#faf9f4] font-body text-[#1b1c19] selection:bg-[#ffe081] selection:text-[#1b1c19] relative overflow-hidden flex flex-col antialiased">
      {/* Background Cloud Grid Overlay */}
      <div className="absolute inset-0 cloud-grid opacity-[0.05] pointer-events-none -z-10" />
      
      {/* TopAppBar - New High Fidelity Design */}
      <header className="bg-[#f5f4ef]/80 backdrop-blur-xl sticky top-0 z-50 border-b border-[#c1c8c3]/10">
        <div className="flex justify-between items-center w-full px-6 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
              className="p-2 hover:bg-[#c1c8c3]/20 rounded-full transition-all active:scale-95 group"
            >
              <ArrowLeft className="w-5 h-5 text-[#2d4d41] group-hover:text-[#1F3F34]" />
            </button>
            <span className="font-headline font-black tracking-tight text-xl text-[#2d4d41] tracking-tighter">TrustHire</span>
          </div>
          <div className="flex items-center gap-6">
            {!isFinalStatus && (
              <span className="hidden sm:block text-[#2d4d41]/60 font-headline font-bold text-sm tracking-tight">
                {step === 1 ? 'Step 1: Upload Aadhaar' : 'Step 2: Biometric Match'}
              </span>
            )}
            <button className="p-2 hover:bg-[#c1c8c3]/20 rounded-full transition-all text-[#2d4d41]">
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12">
        <AnimatePresence mode="wait">
          {isFinalStatus ? (
            <SuccessStep key="success" onDashboard={handleSyncAndRedirect} />
          ) : (
            <>
              {step === 1 && (
                <AadhaarStep 
                  key="aadhaar"
                  onUpload={handleDocUpload}
                  preview={docPreview}
                  isPending={docMutation.isPending}
                />
              )}
              {step === 2 && (
                <BiometricStep 
                  key="biometric"
                  onCapture={handleLiveUpload}
                  preview={livePreview}
                  isPending={liveMutation.isPending}
                />
              )}
            </>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-[#faf9f4] px-6 py-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-[#414845] opacity-60 font-bold uppercase tracking-widest border-t border-[#c1c8c3]/10 mt-auto">
        <p>© 2024 TrustHire Platforms. Secured by ISO 27001 Standards.</p>
        <div className="flex gap-10 mt-6 md:mt-0">
          <a className="hover:text-[#FACD15] transition-colors" href="#">Privacy Policy</a>
          <a className="hover:text-[#FACD15] transition-colors" href="#">Terms of Service</a>
          <a className="hover:text-[#FACD15] transition-colors" href="#">Support Protocol</a>
        </div>
      </footer>

      <style>{`
        .cloud-grid {
          background-image: 
            linear-gradient(rgba(31, 63, 52, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(31, 63, 52, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
};

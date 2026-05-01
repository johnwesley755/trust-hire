import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchVerificationStatus, uploadAadhaar, uploadLiveCapture } from '../../store/slices/verificationSlice';
import { updateUser } from '../../store/slices/authSlice';
import apiClient from '../../api/apiClient';
import { HelpCircle, ArrowLeft } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Modular Components
import AadhaarStep from '../../components/profile/verification/AadhaarStep';
import BiometricStep from '../../components/profile/verification/BiometricStep';
import SuccessStep from '../../components/profile/verification/SuccessStep';

export const IdentityVerificationPage = () => {
  const [step, setStep] = useState(1);
  const [docPreview, setDocPreview] = useState<string | null>(null);
  const [livePreview, setLivePreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { status, loading } = useAppSelector((state) => state.verification);

  useEffect(() => {
    dispatch(fetchVerificationStatus());
  }, [dispatch]);

  const handleDocUpload = async (file: File) => {
    setDocPreview(URL.createObjectURL(file));
    try {
      await dispatch(uploadAadhaar(file)).unwrap();
      setStep(2);
      dispatch(fetchVerificationStatus());
    } catch (err) {
      alert("Aadhaar upload failed.");
    }
  };

  const handleLiveUpload = async (file: File) => {
    setLivePreview(URL.createObjectURL(file));
    try {
      await dispatch(uploadLiveCapture(file)).unwrap();
      setStep(3);
      dispatch(updateUser({ identity_verified: true }));
      dispatch(fetchVerificationStatus());
    } catch (err) {
      alert("Live capture failed.");
    }
  };

  const handleSyncAndRedirect = async () => {
    try {
      await apiClient.post('/api/auth/sync', { onboarded: true });
      dispatch(updateUser({ onboarded: true }));
      navigate('/dashboard');
    } catch (e) {
      console.error(e);
      alert("Synchronization failed. Please check your connection.");
    }
  };

  const isFinalStatus = status?.status === 'VERIFIED' || (status?.status === 'PENDING' && step === 3);

  return (
    <div className="min-h-screen bg-[#faf9f4] font-body text-[#1b1c19] selection:bg-[#FACD15] selection:text-[#1F3F34] relative overflow-hidden flex flex-col antialiased">
      <div className="absolute inset-0 cloud-grid opacity-[0.05] pointer-events-none -z-10" />
      
      <header className="bg-[#f5f4ef]/80 backdrop-blur-xl sticky top-0 z-50 border-b border-[#c1c8c3]/10">
        <div className="flex justify-between items-center w-full px-6 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
              className="p-2 hover:bg-[#c1c8c3]/20 rounded-full transition-all active:scale-95 group"
            >
              <ArrowLeft className="w-5 h-5 text-[#1F3F34]" />
            </button>
            <span className="font-black text-xl text-[#1F3F34] tracking-tight bricolage">TrustHire</span>
          </div>
          <div className="flex items-center gap-6">
            {!isFinalStatus && (
              <span className="hidden sm:block text-[#1F3F34]/60 font-black text-sm uppercase tracking-widest">
                {step === 1 ? 'Step 1: Upload Aadhaar' : 'Step 2: Biometric Match'}
              </span>
            )}
            <button className="p-2 hover:bg-[#c1c8c3]/20 rounded-full transition-all text-[#1F3F34]">
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
                  isPending={loading}
                />
              )}
              {step === 2 && (
                <BiometricStep 
                  key="biometric"
                  onCapture={handleLiveUpload}
                  preview={livePreview}
                  isPending={loading}
                />
              )}
            </>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-[#faf9f4] px-6 py-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-[#414845] opacity-60 font-black uppercase tracking-widest border-t border-[#c1c8c3]/10 mt-auto">
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
        .bricolage { font-family: 'Bricolage Grotesque', sans-serif; }
      `}</style>
    </div>
  );
};

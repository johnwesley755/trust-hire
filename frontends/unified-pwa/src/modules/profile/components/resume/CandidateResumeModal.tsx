import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { CandidateResumeView } from './CandidateResumeView';
import type { ResumeData } from './CandidateResumeView';

interface CandidateResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ResumeData | null;
}

export const CandidateResumeModal: React.FC<CandidateResumeModalProps> = ({
  isOpen,
  onClose,
  data
}) => {
  if (!isOpen || !data) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-4xl bg-[#F8FAFC] rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-200 my-auto max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="no-print absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 rounded-full bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 shadow-sm border border-slate-200 flex items-center justify-center transition-all cursor-pointer z-20"
          >
            <X className="w-4 h-4" />
          </button>

          <CandidateResumeView data={data} />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

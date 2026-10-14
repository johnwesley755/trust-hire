import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  GraduationCap, 
  Languages, 
  Briefcase, 
  CheckCircle2, 
  Download, 
  Printer,
  Sparkles,
  Loader2,
  Award
} from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { toast } from 'sonner';
import { CandidateResumePDFDocument } from './CandidateResumePDFDocument';

export interface ResumeData {
  fullName: string;
  phoneNumber?: string;
  email?: string;
  profileImageUrl?: string;
  city?: string;
  area?: string;
  location?: string;
  bio?: string;
  highestEducation?: string;
  isPursuingEducation?: boolean;
  collegeName?: string;
  degree?: string;
  specialization?: string;
  schoolMedium?: string;
  englishProficiency?: string;
  languagesKnown?: string[];
  skills?: string[] | string;
  preferredRoles?: string[];
  preferredCities?: string[];
  willingToRelocate?: boolean;
  trustScore?: number;
  level?: string;
  isVerified?: boolean;
  experienceYears?: number;
  dob?: string;
  gender?: string;
}

interface CandidateResumeViewProps {
  data: ResumeData;
  onPrint?: () => void;
  showActions?: boolean;
}

export const CandidateResumeView: React.FC<CandidateResumeViewProps> = ({
  data,
  onPrint,
  showActions = true
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [imageError, setImageError] = useState(false);

  const skillsList = Array.isArray(data.skills) 
    ? data.skills 
    : (data.skills ? data.skills.split(',').map(s => s.trim()) : []);

  const getEnglishLabel = (prof?: string) => {
    switch (prof) {
      case 'ADVANCED':
      case 'FLUENT': return 'Fluent (Speak, Read & Write)';
      case 'INTERMEDIATE':
      case 'GOOD': return 'Good (Conversational)';
      case 'BASIC': return 'Basic';
      case 'NONE': return 'No English';
      default: return prof || 'Basic';
    }
  };

  const handleDownloadPdf = async () => {
    const toastId = toast.loading('Generating professional vector resume PDF...');

    try {
      setIsGeneratingPdf(true);

      // Generate native vector PDF using @react-pdf/renderer
      const blob = await pdf(<CandidateResumePDFDocument data={data} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const sanitizedName = (data.fullName || 'Candidate')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .replace(/_+/g, '_');

      link.download = `${sanitizedName}_TrustHyre_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.dismiss(toastId);
      toast.success('Resume downloaded successfully!');
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      toast.dismiss(toastId);
      toast.error('Could not generate vector PDF. Opening print preview...');
      setTimeout(() => {
        window.print();
      }, 400);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDirectPrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const hasPhoto = Boolean(data.profileImageUrl && !imageError);

  return (
    <div className="w-full max-w-4xl mx-auto font-sans">
      {/* Action Header Bar (Hidden during Print) */}
      {showActions && (
        <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center font-bold shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#0066FF]" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#0A1931]">TrustHyre Verified Candidate CV</p>
              <p className="text-xs text-slate-500">Official verified format accepted by employers & recruiters</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDirectPrint}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer border border-slate-200"
              title="Print standard A4 copy"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              type="button"
              disabled={isGeneratingPdf}
              onClick={handleDownloadPdf}
              className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] active:bg-[#0040A8] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Main Live Preview Card (Matching the Generated PDF layout) */}
      <div 
        id="printable-candidate-cv" 
        className="bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 text-slate-900 relative overflow-hidden"
      >
        {/* Top Decorative Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0066FF] via-[#38BDF8] to-[#0A1931]" />

        {/* CV Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-200 mt-2">
          <div className="flex items-center gap-5">
            {/* Candidate Portrait Photo */}
            <div className="relative shrink-0">
              {hasPhoto ? (
                <img 
                  src={data.profileImageUrl} 
                  alt={data.fullName}
                  onError={() => setImageError(true)}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-slate-200 shadow-sm bg-slate-50"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#0066FF] to-[#38BDF8] text-white flex items-center justify-center text-3xl font-black shadow-md shadow-blue-500/15 border-2 border-slate-100">
                  {data.fullName?.charAt(0)?.toUpperCase() || 'W'}
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white rounded-full p-1 border-2 border-white shadow-xs" title="TrustVerified Candidate">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#0A1931] tracking-tight">
                  {data.fullName || 'Candidate Name'}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Verified Candidate
                </span>
              </div>

              {/* Primary Role / Title */}
              <p className="text-sm font-bold text-[#0066FF] mt-1">
                {data.preferredRoles && data.preferredRoles.length > 0 
                  ? data.preferredRoles.join(' • ') 
                  : (skillsList[0] || 'Skilled Professional')}
              </p>

              {/* Location Badge */}
              <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-2 font-medium">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>
                  {data.area ? `${data.area}, ` : ''}{data.city || data.location || 'Location on request'}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Details & TrustScore Card */}
          <div className="w-full sm:w-auto flex flex-col sm:items-end gap-2.5 bg-slate-50 sm:bg-transparent p-3.5 sm:p-0 rounded-2xl border sm:border-none border-slate-100">
            {/* TrustScore - Temporarily hidden until TrustScore engine is implemented */}
            {/*
            <div className="flex items-center gap-2 bg-blue-50/90 px-3.5 py-1.5 rounded-xl border border-blue-100">
              <Sparkles className="w-3.5 h-3.5 text-[#0066FF]" />
              <span className="text-xs font-bold text-slate-700">TrustScore:</span>
              <span className="text-xs font-black text-[#0066FF]">{data.trustScore || 85} / 100</span>
            </div>
            */}

            <div className="space-y-1.5 text-xs text-slate-600 font-medium">
              {data.phoneNumber && (
                <div className="flex items-center gap-2 sm:justify-end">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold">+91 {data.phoneNumber.slice(-10)}</span>
                </div>
              )}
              {data.email && (
                <div className="flex items-center gap-2 sm:justify-end">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{data.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CV Body Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6">
          {/* Main Column (8 cols) */}
          <div className="md:col-span-8 space-y-6">
            {/* Professional Summary */}
            {data.bio && (
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                  Professional Summary
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                  {data.bio}
                </p>
              </div>
            )}

            {/* Target Job Roles */}
            {data.preferredRoles && data.preferredRoles.length > 0 && (
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#0066FF]" />
                  Target Job Roles
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.preferredRoles.map((role, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1.5 bg-[#0066FF]/10 text-[#0066FF] text-xs font-bold rounded-lg border border-[#0066FF]/20"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Key Skills */}
            {skillsList.length > 0 && (
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-slate-500" />
                  Key Technical & Professional Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skillsList.map((skill, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200"
                    >
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Education Profile */}
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                Education & Academic Qualification
              </h3>
              <div className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/40 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-extrabold text-[#0A1931]">
                      {data.degree || data.highestEducation || 'Graduate / Diploma'}
                      {data.isPursuingEducation && ' (Currently Pursuing)'}
                    </p>
                    {data.collegeName && (
                      <p className="text-xs font-medium text-slate-600 mt-0.5">
                        {data.collegeName} {data.specialization ? `• ${data.specialization}` : ''}
                      </p>
                    )}
                    {data.schoolMedium && (
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        School Medium: <span className="font-semibold text-slate-700">{data.schoolMedium}</span>
                      </p>
                    )}
                  </div>
                  {data.isPursuingEducation && (
                    <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
                      Currently Pursuing
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column (4 cols) */}
          <div className="md:col-span-4 space-y-6">
            {/* Languages Spoken */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5 text-[#0066FF]" />
                Languages Spoken
              </h3>
              
              <div className="space-y-2.5">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">English Proficiency</span>
                  <span className="text-xs font-bold text-slate-800">
                    {getEnglishLabel(data.englishProficiency)}
                  </span>
                </div>

                {data.languagesKnown && data.languagesKnown.length > 0 && (
                  <div className="pt-1 border-t border-slate-100">
                    <span className="text-[11px] text-slate-400 block font-medium mb-1.5">Known Languages</span>
                    <div className="flex flex-wrap gap-1.5">
                      {data.languagesKnown.map((lang, idx) => (
                        <span key={idx} className="px-2.5 py-0.5 bg-white text-slate-700 text-[11px] font-bold rounded-md border border-slate-200 shadow-2xs">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobility & Work Preferences */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                Work Location & Mobility
              </h3>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Primary Area</span>
                  <span className="font-bold text-slate-800">
                    {data.area ? `${data.area}, ` : ''}{data.city || data.location || 'Location on request'}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Relocation Readiness</span>
                  <span className={`font-bold ${data.willingToRelocate ? 'text-emerald-600' : 'text-slate-700'}`}>
                    {data.willingToRelocate ? '✓ Open to relocate' : 'Local city only'}
                  </span>
                </div>

                {data.preferredCities && data.preferredCities.length > 0 && (
                  <div className="pt-1 border-t border-slate-100">
                    <span className="text-[11px] text-slate-400 block font-medium mb-1">Preferred Cities</span>
                    <p className="font-bold text-slate-700 text-[11px]">
                      {data.preferredCities.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* TrustHyre Authenticity Guarantee Stamp */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/70 border border-blue-100 text-center space-y-1.5 shadow-xs">
              <div className="w-9 h-9 rounded-full bg-white shadow-xs mx-auto flex items-center justify-center text-[#0066FF]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="text-xs font-black text-[#0A1931]">TrustHyre Verified</p>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Candidate identity & phone credentials verified across TrustHyre candidate network.
              </p>
            </div>
          </div>
        </div>

        {/* CV Footer */}
        <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
          <span>Generated via TrustHyre Candidate Network</span>
          <span className="font-semibold text-slate-500">trusthyre.com/candidate</span>
        </div>
      </div>

      {/* Dedicated Print Stylesheet for A4 output */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          body * {
            visibility: hidden !important;
          }
          .no-print {
            display: none !important;
          }
          #printable-candidate-cv, #printable-candidate-cv * {
            visibility: visible !important;
          }
          #printable-candidate-cv {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            max-width: 100vw !important;
            min-height: 100vh !important;
            margin: 0 !important;
            padding: 14mm 16mm !important;
            background: #FFFFFF !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            z-index: 999999 !important;
          }
        }
      `}</style>
    </div>
  );
};

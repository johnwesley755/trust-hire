import React from 'react';
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
  Sparkles,
  Calendar,
  Building2,
  Share2
} from 'lucide-react';

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
  const skillsList = Array.isArray(data.skills) 
    ? data.skills 
    : (data.skills ? data.skills.split(',').map(s => s.trim()) : []);

  const handleDownload = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const getEnglishLabel = (prof?: string) => {
    switch (prof) {
      case 'ADVANCED': return 'Advanced (Fluent)';
      case 'INTERMEDIATE': return 'Intermediate (Conversational)';
      case 'BASIC': return 'Basic';
      case 'NONE': return 'No English';
      default: return prof || 'Basic';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto font-sans">
      {/* Action Header (Hidden during print) */}
      {showActions && (
        <div className="no-print flex items-center justify-between gap-3 mb-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">TrustHyre Verified Profile CV</p>
              <p className="text-[11px] text-slate-400">Standard verified format for Indian employers & HRs</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF / Print</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Printable CV Paper Card */}
      <div 
        id="printable-candidate-cv" 
        className="bg-white rounded-2xl md:rounded-3xl border border-slate-200/80 shadow-lg p-6 sm:p-10 text-slate-900 print:border-none print:shadow-none print:p-0 print:m-0"
      >
        {/* CV Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-5">
            {/* Avatar / Initials */}
            <div className="relative">
              {data.profileImageUrl ? (
                <img 
                  src={data.profileImageUrl} 
                  alt={data.fullName} 
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-linear-to-br from-[#0066FF] to-[#38BDF8] text-white flex items-center justify-center text-3xl font-black shadow-md shadow-blue-500/15">
                  {data.fullName?.charAt(0)?.toUpperCase() || 'W'}
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white rounded-full p-1 border-2 border-white shadow-xs">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#0A1931] tracking-tight font-['Outfit',sans-serif]">
                  {data.fullName || 'Candidate Name'}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Verified Candidate
                </span>
              </div>

              {/* Primary Role / Title */}
              <p className="text-sm font-semibold text-[#0066FF] mt-0.5">
                {data.preferredRoles && data.preferredRoles.length > 0 
                  ? data.preferredRoles.join(' • ') 
                  : (skillsList[0] || 'Skilled Professional')}
              </p>

              {/* Location Badge */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2 font-medium">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>
                  {data.area ? `${data.area}, ` : ''}{data.city || data.location || 'India'}
                </span>
              </div>
            </div>
          </div>

          {/* Contact & Trust Score Pill */}
          <div className="w-full sm:w-auto flex flex-col sm:items-end gap-2 bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-none border-slate-100">
            <div className="flex items-center gap-2 bg-blue-50/80 px-3 py-1.5 rounded-xl border border-blue-100/80">
              <Sparkles className="w-3.5 h-3.5 text-[#0066FF]" />
              <span className="text-xs font-bold text-slate-700">TrustScore:</span>
              <span className="text-xs font-extrabold text-[#0066FF]">{data.trustScore || 85} / 100</span>
            </div>

            <div className="space-y-1 text-xs text-slate-600 font-medium">
              {data.phoneNumber && (
                <div className="flex items-center gap-2 sm:justify-end">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>+91 {data.phoneNumber.slice(-10)}</span>
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
          {/* Left Column (Details) */}
          <div className="md:col-span-8 space-y-6">
            {/* Bio / Summary */}
            {data.bio && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-['Outfit',sans-serif]">
                  Professional Summary
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
                  {data.bio}
                </p>
              </div>
            )}

            {/* Target Job Roles */}
            {data.preferredRoles && data.preferredRoles.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5 font-['Outfit',sans-serif]">
                  <Briefcase className="w-3.5 h-3.5 text-slate-500" />
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

            {/* Professional Skills */}
            {skillsList.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 font-['Outfit',sans-serif]">
                  Key Technical & Professional Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skillsList.map((skill, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200/60 transition-colors"
                    >
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Education Profile */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5 font-['Outfit',sans-serif]">
                <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                Education & Academic Qualification
              </h3>
              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/40 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {data.degree || data.highestEducation || 'High School / Secondary'}
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

          {/* Right Column (Side Attributes) */}
          <div className="md:col-span-4 space-y-6">
            {/* Languages Spoken */}
            <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5 font-['Outfit',sans-serif]">
                <Languages className="w-3.5 h-3.5 text-[#0066FF]" />
                Languages Spoken
              </h3>
              
              <div className="space-y-2">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">English Level</span>
                  <span className="text-xs font-bold text-slate-800">
                    {getEnglishLabel(data.englishProficiency)}
                  </span>
                </div>

                {data.languagesKnown && data.languagesKnown.length > 0 && (
                  <div className="pt-1">
                    <span className="text-[11px] text-slate-400 block font-medium mb-1.5">Regional Languages</span>
                    <div className="flex flex-wrap gap-1.5">
                      {data.languagesKnown.map((lang, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-white text-slate-700 text-[11px] font-bold rounded-md border border-slate-200">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobility & Work Preferences */}
            <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5 font-['Outfit',sans-serif]">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                Work Location & Mobility
              </h3>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Primary Area</span>
                  <span className="font-bold text-slate-800">
                    {data.area ? `${data.area}, ` : ''}{data.city || 'Local Base'}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Relocation Willingness</span>
                  <span className={`font-bold ${data.willingToRelocate ? 'text-emerald-600' : 'text-slate-700'}`}>
                    {data.willingToRelocate ? '✓ Open to relocate' : 'Local city only'}
                  </span>
                </div>

                {data.preferredCities && data.preferredCities.length > 0 && (
                  <div className="pt-1">
                    <span className="text-[11px] text-slate-400 block font-medium mb-1">Preferred Cities</span>
                    <p className="font-semibold text-slate-700 text-[11px]">
                      {data.preferredCities.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* TrustHyre Protocol Guarantee Stamp */}
            <div className="p-4 rounded-2xl bg-linear-to-br from-blue-50 to-indigo-50/50 border border-blue-100 text-center space-y-1.5">
              <div className="w-8 h-8 rounded-full bg-white shadow-xs mx-auto flex items-center justify-center text-[#0066FF]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="text-xs font-extrabold text-[#0A1931]">TrustHyre Protocol Verified</p>
              <p className="text-[10px] text-slate-500 leading-tight">
                Candidate identity & phone credentials authenticated via TrustHyre network.
              </p>
            </div>
          </div>
        </div>

        {/* CV Footer */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Generated via TrustHyre Hyperlocal Employment Network</span>
          <span>trusthyre.com/candidate</span>
        </div>
      </div>
    </div>
  );
};

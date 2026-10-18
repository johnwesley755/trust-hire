import React from "react";

export interface ParsedPhone {
  countryCode: string;
  countryIso: string;
  countryName: string;
  nationalNumber: string;
  formattedNumber: string;
  raw: string;
}

const COUNTRY_PREFIXES: Array<{ prefix: string; iso: string; name: string }> = [
  { prefix: '971', iso: 'AE', name: 'United Arab Emirates' },
  { prefix: '966', iso: 'SA', name: 'Saudi Arabia' },
  { prefix: '880', iso: 'BD', name: 'Bangladesh' },
  { prefix: '977', iso: 'NP', name: 'Nepal' },
  { prefix: '974', iso: 'QA', name: 'Qatar' },
  { prefix: '968', iso: 'OM', name: 'Oman' },
  { prefix: '965', iso: 'KW', name: 'Kuwait' },
  { prefix: '973', iso: 'BH', name: 'Bahrain' },
  { prefix: '91',  iso: 'IN', name: 'India' },
  { prefix: '44',  iso: 'GB', name: 'United Kingdom' },
  { prefix: '65',  iso: 'SG', name: 'Singapore' },
  { prefix: '60',  iso: 'MY', name: 'Malaysia' },
  { prefix: '61',  iso: 'AU', name: 'Australia' },
  { prefix: '49',  iso: 'DE', name: 'Germany' },
  { prefix: '33',  iso: 'FR', name: 'France' },
  { prefix: '81',  iso: 'JP', name: 'Japan' },
  { prefix: '86',  iso: 'CN', name: 'China' },
  { prefix: '94',  iso: 'LK', name: 'Sri Lanka' },
  { prefix: '92',  iso: 'PK', name: 'Pakistan' },
  { prefix: '1',   iso: 'US', name: 'United States' },
];

export function parsePhoneNumber(phone: string | null | undefined): ParsedPhone | null {
  if (!phone || typeof phone !== 'string') return null;
  const trimmed = phone.trim();
  if (!trimmed || trimmed.toLowerCase() === 'not provided' || trimmed === '-') return null;

  const digits = trimmed.replace(/\D/g, '');
  if (!digits || digits.length < 5) return null;

  let countryCode = '+91';
  let countryIso = 'IN';
  let countryName = 'India';
  let nationalNumber = digits;

  // 1. If explicit '+' prefix in input:
  if (trimmed.startsWith('+')) {
    const matched = COUNTRY_PREFIXES.find(c => digits.startsWith(c.prefix));
    if (matched) {
      countryCode = `+${matched.prefix}`;
      countryIso = matched.iso;
      countryName = matched.name;
      nationalNumber = digits.slice(matched.prefix.length);
    }
  } 
  // 2. 12 digits starting with 91 (e.g. 919841958457)
  else if (digits.length === 12 && digits.startsWith('91')) {
    countryCode = '+91';
    countryIso = 'IN';
    countryName = 'India';
    nationalNumber = digits.slice(2);
  }
  // 3. 11 digits starting with 0 (e.g. 09841958457)
  else if (digits.length === 11 && digits.startsWith('0')) {
    countryCode = '+91';
    countryIso = 'IN';
    countryName = 'India';
    nationalNumber = digits.slice(1);
  }
  // 4. Standard 10 digits (default to India in TrustHire)
  else if (digits.length === 10) {
    countryCode = '+91';
    countryIso = 'IN';
    countryName = 'India';
    nationalNumber = digits;
  }
  // 5. Check if it starts with another known country prefix
  else {
    const matched = COUNTRY_PREFIXES.find(c => digits.startsWith(c.prefix) && digits.length - c.prefix.length >= 7);
    if (matched) {
      countryCode = `+${matched.prefix}`;
      countryIso = matched.iso;
      countryName = matched.name;
      nationalNumber = digits.slice(matched.prefix.length);
    }
  }

  // Format national number nicely
  let formattedNumber = nationalNumber;
  if (countryIso === 'IN' && nationalNumber.length === 10) {
    // Standard Indian 5-5 split: 98419 58457
    formattedNumber = `${nationalNumber.slice(0, 5)} ${nationalNumber.slice(5)}`;
  } else if ((countryIso === 'US' || countryIso === 'CA') && nationalNumber.length === 10) {
    formattedNumber = `${nationalNumber.slice(0, 3)} ${nationalNumber.slice(3, 6)} ${nationalNumber.slice(6)}`;
  } else if (countryIso === 'AE' && nationalNumber.length === 9) {
    formattedNumber = `${nationalNumber.slice(0, 2)} ${nationalNumber.slice(2, 5)} ${nationalNumber.slice(5)}`;
  } else if (countryIso === 'GB' && nationalNumber.length === 10) {
    formattedNumber = `${nationalNumber.slice(0, 4)} ${nationalNumber.slice(4)}`;
  } else if (nationalNumber.length === 10) {
    formattedNumber = `${nationalNumber.slice(0, 5)} ${nationalNumber.slice(5)}`;
  } else if (nationalNumber.length === 9) {
    formattedNumber = `${nationalNumber.slice(0, 3)} ${nationalNumber.slice(3, 6)} ${nationalNumber.slice(6)}`;
  } else if (nationalNumber.length > 6) {
    const half = Math.ceil(nationalNumber.length / 2);
    formattedNumber = `${nationalNumber.slice(0, half)} ${nationalNumber.slice(half)}`;
  }

  return {
    countryCode,
    countryIso,
    countryName,
    nationalNumber,
    formattedNumber,
    raw: trimmed,
  };
}

/**
 * High-definition, accurate India SVG Flag
 * Renders identically and crisply across Windows, macOS, iOS, Android, and Linux.
 */
export const IndiaFlag = ({ className = "w-4.5 h-3" }: { className?: string }) => (
  <svg 
    viewBox="0 0 900 600" 
    className={`${className} inline-block shrink-0 rounded-[2px] shadow-2xs border border-slate-300/80 overflow-hidden`}
    aria-label="Flag of India"
  >
    {/* Saffron Band */}
    <path fill="#FF9933" d="M0 0h900v200H0z"/>
    {/* White Band */}
    <path fill="#FFFFFF" d="M0 200h900v200H0z"/>
    {/* Green Band */}
    <path fill="#138808" d="M0 400h900v200H0z"/>
    {/* Ashoka Chakra */}
    <g transform="translate(450 300)">
      <circle r="80" fill="none" stroke="#000080" strokeWidth="8"/>
      <circle r="16" fill="#000080"/>
      {Array.from({ length: 24 }).map((_, i) => (
        <line
          key={i}
          x1="0"
          y1="0"
          x2="0"
          y2="-80"
          stroke="#000080"
          strokeWidth="4"
          transform={`rotate(${i * 15})`}
        />
      ))}
    </g>
  </svg>
);

export const USFlag = ({ className = "w-4.5 h-3" }: { className?: string }) => (
  <svg 
    viewBox="0 0 741 390" 
    className={`${className} inline-block shrink-0 rounded-[2px] shadow-2xs border border-slate-300/80 overflow-hidden`}
    aria-label="Flag of United States"
  >
    <rect width="741" height="390" fill="#B22234"/>
    <path d="M0,30H741 M0,90H741 M0,150H741 M0,210H741 M0,270H741 M0,330H741" stroke="#fff" strokeWidth="30"/>
    <rect width="296" height="210" fill="#3C3B6E"/>
    <g fill="#fff" transform="translate(20, 20) scale(0.7)">
      <circle cx="50" cy="40" r="14"/>
      <circle cx="120" cy="40" r="14"/>
      <circle cx="190" cy="40" r="14"/>
      <circle cx="260" cy="40" r="14"/>
      <circle cx="85" cy="80" r="14"/>
      <circle cx="155" cy="80" r="14"/>
      <circle cx="225" cy="80" r="14"/>
      <circle cx="50" cy="120" r="14"/>
      <circle cx="120" cy="120" r="14"/>
      <circle cx="190" cy="120" r="14"/>
      <circle cx="260" cy="120" r="14"/>
      <circle cx="85" cy="160" r="14"/>
      <circle cx="155" cy="160" r="14"/>
      <circle cx="225" cy="160" r="14"/>
    </g>
  </svg>
);

export const UKFlag = ({ className = "w-4.5 h-3" }: { className?: string }) => (
  <svg 
    viewBox="0 0 60 30" 
    className={`${className} inline-block shrink-0 rounded-[2px] shadow-2xs border border-slate-300/80 overflow-hidden`}
    aria-label="Flag of United Kingdom"
  >
    <clipPath id="uk-clip"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
    <g clipPath="url(#uk-clip)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="2.5"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
    </g>
  </svg>
);

export const UAEFlag = ({ className = "w-4.5 h-3" }: { className?: string }) => (
  <svg 
    viewBox="0 0 600 300" 
    className={`${className} inline-block shrink-0 rounded-[2px] shadow-2xs border border-slate-300/80 overflow-hidden`}
    aria-label="Flag of UAE"
  >
    <rect width="600" height="100" fill="#00732f"/>
    <rect y="100" width="600" height="100" fill="#fff"/>
    <rect y="200" width="600" height="100" fill="#000"/>
    <rect width="150" height="300" fill="#f00"/>
  </svg>
);

export const SingaporeFlag = ({ className = "w-4.5 h-3" }: { className?: string }) => (
  <svg 
    viewBox="0 0 600 400" 
    className={`${className} inline-block shrink-0 rounded-[2px] shadow-2xs border border-slate-300/80 overflow-hidden`}
    aria-label="Flag of Singapore"
  >
    <rect width="600" height="200" fill="#ED2939"/>
    <rect y="200" width="600" height="200" fill="#fff"/>
    <g fill="#fff" transform="translate(110, 100)">
      <circle cx="-30" cy="0" r="50"/>
      <circle cx="-15" cy="0" r="45" fill="#ED2939"/>
    </g>
  </svg>
);

export const SaudiArabiaFlag = ({ className = "w-4.5 h-3" }: { className?: string }) => (
  <svg 
    viewBox="0 0 600 400" 
    className={`${className} inline-block shrink-0 rounded-[2px] shadow-2xs border border-slate-300/80 overflow-hidden`}
    aria-label="Flag of Saudi Arabia"
  >
    <rect width="600" height="400" fill="#007A3D"/>
    <rect x="220" y="250" width="160" height="10" fill="#fff"/>
    <path d="M220 245 L200 255 L220 265 Z" fill="#fff"/>
  </svg>
);

export const GermanyFlag = ({ className = "w-4.5 h-3" }: { className?: string }) => (
  <svg 
    viewBox="0 0 500 300" 
    className={`${className} inline-block shrink-0 rounded-[2px] shadow-2xs border border-slate-300/80 overflow-hidden`}
    aria-label="Flag of Germany"
  >
    <rect width="500" height="100" fill="#000"/>
    <rect y="100" width="500" height="100" fill="#DD0000"/>
    <rect y="200" width="500" height="100" fill="#FFCE00"/>
  </svg>
);

export const FranceFlag = ({ className = "w-4.5 h-3" }: { className?: string }) => (
  <svg 
    viewBox="0 0 900 600" 
    className={`${className} inline-block shrink-0 rounded-[2px] shadow-2xs border border-slate-300/80 overflow-hidden`}
    aria-label="Flag of France"
  >
    <rect width="300" height="600" fill="#002654"/>
    <rect x="300" width="300" height="600" fill="#FFFFFF"/>
    <rect x="600" width="300" height="600" fill="#CE1126"/>
  </svg>
);

export const GenericFlag = ({ className = "w-4.5 h-3" }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={`${className} text-[#0f2f63] inline-block shrink-0`}
  >
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

export const CountryFlag = ({
  countryIso,
  countryCode,
  className = "w-4.5 h-3",
}: {
  countryIso?: string;
  countryCode?: string;
  className?: string;
}) => {
  const iso = countryIso?.toUpperCase();
  const code = countryCode?.replace('+', '');

  if (iso === 'IN' || code === '91') return <IndiaFlag className={className} />;
  if (iso === 'US' || iso === 'CA' || code === '1') return <USFlag className={className} />;
  if (iso === 'GB' || code === '44') return <UKFlag className={className} />;
  if (iso === 'AE' || code === '971') return <UAEFlag className={className} />;
  if (iso === 'SG' || code === '65') return <SingaporeFlag className={className} />;
  if (iso === 'SA' || code === '966') return <SaudiArabiaFlag className={className} />;
  if (iso === 'DE' || code === '49') return <GermanyFlag className={className} />;
  if (iso === 'FR' || code === '33') return <FranceFlag className={className} />;

  return <GenericFlag className={className} />;
};

interface PhoneDisplayProps {
  phone: string | null | undefined;
  className?: string;
  badgeClassName?: string;
  numberClassName?: string;
  clickable?: boolean;
}

export function PhoneDisplay({
  phone,
  className = "",
  badgeClassName = "",
  numberClassName = "",
  clickable = true,
}: PhoneDisplayProps) {
  const parsed = parsePhoneNumber(phone);

  if (!parsed) {
    return (
      <span className="text-slate-400 font-medium text-xs">
        {phone && phone !== '-' ? phone : 'Not provided'}
      </span>
    );
  }

  const content = (
    <div className={`inline-flex items-center gap-2 flex-wrap ${className}`}>
      {/* Country Flag & Country Code Badge */}
      <span 
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 shadow-2xs select-none ${badgeClassName}`}
        title={`${parsed.countryName} (${parsed.countryCode})`}
      >
        <CountryFlag 
          countryIso={parsed.countryIso} 
          countryCode={parsed.countryCode} 
          className="w-4.5 h-3" 
        />
        <span className="font-mono text-[11px] sm:text-xs text-slate-800 font-bold tracking-tight">
          {parsed.countryCode}
        </span>
      </span>

      {/* Separated Mobile Number */}
      <span
        className={`font-mono font-bold text-xs sm:text-sm text-[#0A1931] tracking-wider ${
          clickable ? "group-hover:text-[#0f2f63] transition-colors" : ""
        } ${numberClassName}`}
      >
        {parsed.formattedNumber}
      </span>
    </div>
  );

  if (!clickable) {
    return content;
  }

  return (
    <a
      href={`tel:${parsed.countryCode}${parsed.nationalNumber}`}
      className="group inline-flex items-center"
      title={`Call ${parsed.countryCode} ${parsed.formattedNumber}`}
    >
      {content}
    </a>
  );
}

export default PhoneDisplay;

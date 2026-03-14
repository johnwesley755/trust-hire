export type Language = 
  | 'en' | 'hi' | 'bn' | 'te' | 'mr' | 'ta' | 'gu' | 'kn' | 'ml' | 'or' 
  | 'pa' | 'as' | 'mai' | 'sat' | 'ks' | 'sd' | 'kok' | 'doi' | 'mni' | 'ne' 
  | 'brx' | 'sa';

export interface LanguageConfig {
  code: Language;
  name: string;
  nativeName: string;
}

export const LANGUAGES: LanguageConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীया' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली' },
  { code: 'sat', name: 'Santali', nativeName: 'संताली' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'كأशुर' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي' },
  { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी' },
  { code: 'mni', name: 'Manipuri', nativeName: 'ꯃꯩꯇꯩꯂꯣꯟ' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली' },
  { code: 'brx', name: 'Bodo', nativeName: 'बरो' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्' }
];

export const TRANSLATIONS: Partial<Record<Language, Record<string, string>>> = {};

import type { WorkerProfile } from '../api/profile.service';

const REQUIRED_FIELDS: Array<keyof WorkerProfile> = [
  'fullName',
  'bio',
  'skills',
  'address',
  'experienceYears',
  'hourlyRate',
];

export function getMissingProfileFields(profile?: WorkerProfile | null): string[] {
  if (!profile) {
    return [...REQUIRED_FIELDS];
  }

  const missingFields: string[] = [];

  if (!profile.fullName?.trim()) missingFields.push('fullName');
  if (!profile.bio?.trim()) missingFields.push('bio');
  if (!profile.skills?.trim()) missingFields.push('skills');
  if (!profile.address?.trim() && !profile.city?.trim()) missingFields.push('addressOrCity');
  if (profile.experienceYears === null || profile.experienceYears === undefined) missingFields.push('experienceYears');
  if (profile.hourlyRate === null || profile.hourlyRate === undefined || Number(profile.hourlyRate) <= 0) {
    missingFields.push('hourlyRate');
  }

  return missingFields;
}

export function isProfileComplete(profile?: WorkerProfile | null): boolean {
  return getMissingProfileFields(profile).length === 0;
}

export function formatMissingProfileFields(fields: string[]): string {
  const labels: Record<string, string> = {
    fullName: 'full name',
    bio: 'bio',
    skills: 'skills',
    addressOrCity: 'address or city',
    experienceYears: 'experience',
    hourlyRate: 'hourly rate',
  };

  return fields.map((field) => labels[field] ?? field).join(', ');
}

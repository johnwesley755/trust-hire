import type { WorkerProfile } from '../types';

export function getMissingProfileFields(profile?: WorkerProfile | null): string[] {
  if (!profile) {
    return ['fullName', 'bio', 'skills', 'location', 'experienceYears'];
  }

  const missingFields: string[] = [];

  if (!profile.fullName?.trim()) missingFields.push('fullName');
  if (!profile.bio?.trim()) missingFields.push('bio');
  if (!profile.skills || profile.skills.length === 0) missingFields.push('skills');
  if (!profile.location?.trim()) missingFields.push('location');
  if (profile.experienceYears === null || profile.experienceYears === undefined) missingFields.push('experienceYears');

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
    location: 'location',
    experienceYears: 'experience',
  };

  return fields.map((field) => labels[field] ?? field).join(', ');
}

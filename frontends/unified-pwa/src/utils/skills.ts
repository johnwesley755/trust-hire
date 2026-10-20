/**
 * Safely parses and normalizes worker skills whether provided as:
 * - A string array (e.g. ['Electrician', 'Plumber'])
 * - A comma-delimited string (e.g. 'Electrician, Plumber')
 * - null / undefined / other formats
 */
export function normalizeSkills(skills: unknown): string[] {
  if (!skills) return [];
  if (Array.isArray(skills)) {
    return skills.map((s) => String(s).trim()).filter(Boolean);
  }
  if (typeof skills === 'string') {
    return skills.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

/**
 * Returns a single formatted string representing the skills (comma-separated).
 */
export function formatSkills(skills: unknown): string {
  return normalizeSkills(skills).join(', ');
}

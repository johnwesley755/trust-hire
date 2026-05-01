import { z } from 'zod';

// AUTH SCHEMAS
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  firstName: z.string().min(2, 'First name is too short'),
  lastName: z.string().min(2, 'Last name is too short'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().regex(/^\+?[\d\s-]{10,}$/, 'Invalid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['WORKER', 'EMPLOYER']).default('EMPLOYER'),
});

// JOB SCHEMAS
export const postJobSchema = z.object({
  title: z.string().min(5, 'Job title must be at least 5 characters'),
  description: z.string().min(20, 'Please provide a detailed description (min 20 chars)'),
  industry: z.string().min(1, 'Industry is required'),
  location: z.string().min(2, 'Location is required'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  experienceYearsRequired: z.number().default(0),
  budget: z.number(),
  address: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  requiredSkills: z.array(z.string()),
  status: z.literal('OPEN').optional(),
});

// PROFILE SCHEMAS
export const employerProfileSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  industry: z.string().min(2, 'Industry is required'),
  bio: z.string().max(500, 'Bio is too long'),
  website: z.string().url().optional().or(z.literal('')),
  location: z.string().min(2, 'Location is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type PostJobInput = z.infer<typeof postJobSchema>;
export type EmployerProfileInput = z.infer<typeof employerProfileSchema>;

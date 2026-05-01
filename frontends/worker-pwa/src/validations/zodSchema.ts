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
  role: z.enum(['WORKER', 'EMPLOYER']).default('WORKER'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// PROFILE SCHEMAS
export const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  bio: z.string().max(500, 'Bio is too long (max 500 characters)'),
  skills: z.string().min(1, 'At least one skill is required'),
  experienceYears: z.number().min(0).max(50),
  hourlyRate: z.number().min(0),
  city: z.string().min(2, 'City is required'),
  address: z.string().optional(),
});

// JOB SCHEMAS
export const jobApplicationSchema = z.object({
  coverLetter: z.string().min(10, 'Please provide a short cover letter (min 10 chars)'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type JobApplicationInput = z.infer<typeof jobApplicationSchema>;

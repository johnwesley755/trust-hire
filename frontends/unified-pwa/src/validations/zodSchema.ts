import { z } from 'zod';

export const emailSchema = z.string()
  .min(1, "Please fill in your email address")
  .email("Please enter a valid email address.");

export const passwordSchema = z.string()
  .min(1, "Please fill in your password")
  .min(8, "Password must be at least 8 characters long.")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
  .regex(/[0-9]/, "Password must contain at least one number.");

export const phoneSchema = z.string()
  .min(1, "Please fill in your phone number")
  .min(10, "Please enter a valid phone number.")
  .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number format.");

export const nameSchema = z.string()
  .min(1, "Please fill in this field")
  .min(2, "Name must be at least 2 characters long.")
  .max(50, "Name must be less than 50 characters.");

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Please fill in your password")
});

export const signUpSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  phoneNumber: phoneSchema,
  role: z.enum(['WORKER', 'EMPLOYER']).optional(),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema
});

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string().min(1, "Please confirm your password")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const earlyAccessSchema = z.object({
  email: emailSchema
});

import { z } from 'zod';

const profileSchema = z.object({
    public_id: z.string(),
    url: z.string().url() // using .url() ensures the string is a valid URL
}).optional();

export const userRegistrationSchema = z.object({
    name: z.string().min(4).max(20).transform((val) => val.trim()),
    email: z.string().email().transform((val) => val.trim()),
    password: z.string().min(4).transform((val) => val.trim()),
    profile: profileSchema,
    role: z.string().optional()
});

export const updateUserSchema = z.object({
    name: z.string().min(4).max(20).transform((val) => val.trim()),
    email: z.string().email().transform((val) => val.trim()).optional(),
    role: z.string().optional()
});
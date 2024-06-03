import { z } from 'zod';


export const todoCreateSchema = z.object({
    title: z.string().min(3).max(20).transform((val) => val.trim()),
    description: z.string().min(10).max(300).transform((val) => val.trim()).optional(),
    priority: z.string().min(4).max(20).transform((val) => val.trim()).optional(),
    role: z.string().optional(),

});


import { z } from 'zod';

const createblogValidationSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title should not exceed 255 characters'),
  content: z.string().min(1, 'Content is required'),
  author: z.string().min(1, 'Author is required'),
  isPublished: z.boolean().optional().default(true),
});
const updateblogValidationSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title should not exceed 255 characters')
    .optional(),
  content: z.string().min(1, 'Content is required').optional(),
});

export const BlogValidationSchema = {
  createblogValidationSchema,
  updateblogValidationSchema,
};

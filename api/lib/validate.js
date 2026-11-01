import { z } from 'zod';

export function generateSlug(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || `item-${Date.now().toString().slice(-6)}`;
}

/**
 * Validates data against a Zod schema.
 * Returns { success: true, data } or { success: false, errors: { [field]: message } }
 */
export function validateSchema(schema, data) {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = {};
  const issues = result.error.issues || [];
  issues.forEach((err) => {
    const field = err.path.join('.') || 'general';
    if (!errors[field]) {
      errors[field] = err.message;
    }
  });

  return { success: false, errors };
}

// ==========================================
// ZOD SCHEMAS
// ==========================================

export const ProductSchemaZod = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  slug: z.string().optional(),
  category: z.string().min(2, 'Category is required'),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  originalPrice: z.coerce.number().optional().default(0),
  discount: z.string().optional().default(''),
  rating: z.coerce.number().min(1).max(5).optional().default(4.9),
  reviewCount: z.coerce.number().optional().default(0),
  isBestseller: z.boolean().optional().default(false),
  isNewItem: z.boolean().optional().default(false),
  badge: z.string().optional().default(''),
  shortDesc: z.string().optional().default(''),
  description: z.string().optional().default(''),
  image: z.string().min(1, 'Product image is required'),
  gallery: z.array(z.string()).optional().default([]),
  specifications: z.record(z.any()).optional().default({}),
  variants: z.array(z.any()).optional().default([]),
  active: z.boolean().optional().default(true),
  displayOrder: z.coerce.number().optional().default(0),
});

export const CategorySchemaZod = z.object({
  name: z.string().min(2, 'Category name is required'),
  slug: z.string().optional(),
  shortName: z.string().optional().default(''),
  description: z.string().optional().default(''),
  icon: z.string().optional().default('Sparkles'),
  badge: z.string().optional().default(''),
  image: z.string().optional().default(''),
  active: z.boolean().optional().default(true),
  displayOrder: z.coerce.number().optional().default(0),
});

export const OfferSchemaZod = z.object({
  title: z.string().min(2, 'Offer title is required'),
  subtitle: z.string().optional().default(''),
  badgeText: z.string().optional().default(''),
  image: z.string().optional().default(''),
  buttonText: z.string().optional().default('Claim Offer'),
  buttonLink: z.string().optional().default(''),
  styleVariant: z.enum(['strip', 'split', 'highlight']).default('strip'),
  startDate: z.string().nullable().optional().default(null),
  endDate: z.string().nullable().optional().default(null),
  active: z.boolean().optional().default(true),
  displayOrder: z.coerce.number().optional().default(0),
  placements: z.array(z.string()).min(1, 'Select at least one placement slot'),
});

export const BlogSchemaZod = z.object({
  title: z.string().min(3, 'Blog title must be at least 3 characters'),
  slug: z.string().optional(),
  excerpt: z.string().optional().default(''),
  content: z.string().min(10, 'Blog content is required'),
  coverImage: z.string().optional().default(''),
  author: z.string().optional().default('Looks Forever Specialist'),
  readTime: z.string().optional().default('4 min read'),
  tags: z.array(z.string()).optional().default([]),
  active: z.boolean().optional().default(true),
});

export const ContactSchemaZod = z.object({
  name: z.string().min(2, 'Please enter your full name'),
  phone: z.string().min(8, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  city: z.string().optional().default('Delhi NCR'),
  service: z.string().optional().default('Hair Patch Consultation'),
  requirement: z.string().optional().default(''),
  preferredTime: z.string().optional().default('Anytime'),
  source: z.string().optional().default('Website Contact Form'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional().default('HIGH'),
});

export const LoginSchemaZod = z.object({
  usernameOrEmail: z.string().min(3, 'Username or Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

import { z } from "zod";

export const authBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type AuthBody = z.infer<typeof authBodySchema>;

export const listingItemSchema = z.object({
  category: z.string().min(1),
  brand: z.string().optional(),
  size: z.string().optional(),
  condition: z.string().optional(),
});

export const listingCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  currency: z.string().optional(),
  priceCents: z.number().int(),
  status: z.string().optional(),
  items: z.array(listingItemSchema).optional(),
});

export const listingUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.union([z.string(), z.null()]).optional(),
  currency: z.string().optional(),
  priceCents: z.number().int().optional(),
  status: z.string().optional(),
});

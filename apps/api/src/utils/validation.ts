import { z } from "zod";

export const authBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type AuthBody = z.infer<typeof authBodySchema>;

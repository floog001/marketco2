import { FastifyReply, FastifyRequest } from "fastify";

type RateLimitOptions = {
  windowMs: number;
  max: number;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const createRateLimiter = ({ windowMs, max }: RateLimitOptions) => {
  const entries = new Map<string, RateLimitEntry>();

  return async (request: FastifyRequest, reply: FastifyReply) => {
    const now = Date.now();
    const ip = request.ip || "unknown";
    const entry = entries.get(ip);

    if (!entry || now > entry.resetAt) {
      entries.set(ip, { count: 1, resetAt: now + windowMs });
      return;
    }

    if (entry.count >= max) {
      const requestId = request.requestId;
      return reply.status(429).send({
        error: {
          code: "RATE_LIMITED",
          message: "Too many requests. Please try again later.",
        },
        requestId,
      });
    }

    entry.count += 1;
    entries.set(ip, entry);
  };
};

export const authRateLimit = createRateLimiter({
  windowMs: 5 * 60 * 1000,
  max: 20,
});

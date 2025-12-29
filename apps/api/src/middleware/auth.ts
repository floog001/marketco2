import { FastifyReply, FastifyRequest } from "fastify";
import { verifyJwt } from "../utils/jwt";

declare module "fastify" {
  interface FastifyRequest {
    user?: {
      id: string;
      email?: string;
    };
  }
}

const unauthorized = (reply: FastifyReply) => {
  return reply.status(401).send({ error: "UNAUTHORIZED" });
};

export const authGuard = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return unauthorized(reply);
  }

  const token = authHeader.slice("Bearer ".length).trim();
  if (!token) {
    return unauthorized(reply);
  }

  try {
    const payload = verifyJwt(token);
    request.user = {
      id: payload.sub,
      email: payload.email,
    };
  } catch (error) {
    return unauthorized(reply);
  }
};

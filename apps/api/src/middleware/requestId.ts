import { FastifyReply, FastifyRequest } from "fastify";
import { randomUUID } from "crypto";

declare module "fastify" {
  interface FastifyRequest {
    requestId: string;
  }
}

export const requestIdHook = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const requestId = randomUUID();
  request.requestId = requestId;
  reply.header("X-Request-Id", requestId);
};

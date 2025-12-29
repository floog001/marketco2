import { FastifyInstance } from "fastify";
import prisma from "../db/prisma";
import { authGuard } from "../middleware/auth";

export default async function meRoutes(fastify: FastifyInstance) {
  fastify.get("/me", { preHandler: authGuard }, async (request, reply) => {
    const userId = request.user?.id;
    if (!userId) {
      return reply.status(401).send({ error: "UNAUTHORIZED" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return reply.status(404).send({ error: "USER_NOT_FOUND" });
    }

    return reply.send(user);
  });
}

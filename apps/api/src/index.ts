import Fastify from "fastify";
import prisma from "./db/prisma";
import { requestIdHook } from "./middleware/requestId";
import authRoutes from "./routes/auth";
import meRoutes from "./routes/me";

const server = Fastify({
  logger: true
});

server.addHook("onRequest", requestIdHook);

server.get("/health", async () => ({ status: "ok" }));

server.get("/db/health", async (request, reply) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: "ok" };
  } catch (error) {
    request.log.error({ error }, "Database health check failed");
    return reply.status(500).send({ status: "error" });
  }
});

server.register(authRoutes);
server.register(meRoutes);

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? "0.0.0.0";

const start = async () => {
  try {
    await server.listen({ port, host });
  } catch (error) {
    server.log.error(error, "Failed to start server");
    process.exit(1);
  }

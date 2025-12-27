import Fastify from "fastify";

const server = Fastify({
  logger: true
});

server.get("/health", async () => ({ status: "ok" }));

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? "0.0.0.0";

const start = async () => {
  try {
    await server.listen({ port, host });
  } catch (error) {
    server.log.error(error, "Failed to start server");
    process.exit(1);
  }
};

start();

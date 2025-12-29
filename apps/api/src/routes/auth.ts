import { FastifyInstance } from "fastify";
import { loginUser, registerUser } from "../services/auth";

type AuthBody = {
  email: string;
  password: string;
};

const isValidBody = (body: Partial<AuthBody>): body is AuthBody => {
  return typeof body.email === "string" && typeof body.password === "string";
};

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/auth/register", async (request, reply) => {
    if (!isValidBody(request.body as Partial<AuthBody>)) {
      return reply.status(400).send({ error: "INVALID_BODY" });
    }

    const { email, password } = request.body as AuthBody;

    try {
      const user = await registerUser(email, password);
      return reply.status(201).send({ user });
    } catch (error) {
      if (error instanceof Error && error.message === "EMAIL_IN_USE") {
        return reply.status(409).send({ error: "EMAIL_IN_USE" });
      }
      request.log.error({ error }, "Failed to register user");
      return reply.status(500).send({ error: "SERVER_ERROR" });
    }
  });

  fastify.post("/auth/login", async (request, reply) => {
    if (!isValidBody(request.body as Partial<AuthBody>)) {
      return reply.status(400).send({ error: "INVALID_BODY" });
    }

    const { email, password } = request.body as AuthBody;

    try {
      const result = await loginUser(email, password);
      return reply.status(200).send(result);
    } catch (error) {
      if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
        return reply.status(401).send({ error: "INVALID_CREDENTIALS" });
      }
      request.log.error({ error }, "Failed to login user");
      return reply.status(500).send({ error: "SERVER_ERROR" });
    }
  });
}

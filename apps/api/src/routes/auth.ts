import { FastifyInstance } from "fastify";
import { authRateLimit } from "../middleware/rateLimit";
import { loginUser, registerUser } from "../services/auth";
import { authBodySchema } from "../utils/validation";

type AuthBody = {
  email: string;
  password: string;
};

const isValidBody = (body: Partial<AuthBody>): body is AuthBody => {
  return typeof body.email === "string" && typeof body.password === "string";
};
const errorResponse = (
  requestId: string,
  code: string,
  message: string
) => ({
  error: {
    code,
    message,
  },
  requestId,
});

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/auth/register", async (request, reply) => {
    if (!isValidBody(request.body as Partial<AuthBody>)) {
      return reply.status(400).send({ error: "INVALID_BODY" });
  fastify.post("/auth/register", { preHandler: authRateLimit }, async (request, reply) => {
    const parsed = authBodySchema.safeParse(request.body);
    if (!parsed.success) {
      return reply
        .status(400)
        .send(
          errorResponse(
            request.requestId,
            "INVALID_BODY",
            "Email or password is invalid."
          )
        );
    }

    const { email, password } = request.body as AuthBody;
    const { email, password } = parsed.data;

    try {
      const user = await registerUser(email, password);
      return reply.status(201).send({ user });
    } catch (error) {
      if (error instanceof Error && error.message === "EMAIL_IN_USE") {
        return reply.status(409).send({ error: "EMAIL_IN_USE" });
        return reply
          .status(409)
          .send(
            errorResponse(
              request.requestId,
              "EMAIL_IN_USE",
              "Email is already registered."
            )
          );
      }
      request.log.error({ error }, "Failed to register user");
      return reply.status(500).send({ error: "SERVER_ERROR" });
      return reply
        .status(500)
        .send(
          errorResponse(
            request.requestId,
            "SERVER_ERROR",
            "Unable to register right now."
          )
        );
    }
  });

  fastify.post("/auth/login", async (request, reply) => {
    if (!isValidBody(request.body as Partial<AuthBody>)) {
      return reply.status(400).send({ error: "INVALID_BODY" });
  fastify.post("/auth/login", { preHandler: authRateLimit }, async (request, reply) => {
    const parsed = authBodySchema.safeParse(request.body);
    if (!parsed.success) {
      return reply
        .status(400)
        .send(
          errorResponse(
            request.requestId,
            "INVALID_BODY",
            "Email or password is invalid."
          )
        );
    }

    const { email, password } = request.body as AuthBody;
    const { email, password } = parsed.data;

    try {
      const result = await loginUser(email, password);
      return reply.status(200).send(result);
    } catch (error) {
      if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
        return reply.status(401).send({ error: "INVALID_CREDENTIALS" });
        return reply
          .status(401)
          .send(
            errorResponse(
              request.requestId,
              "INVALID_CREDENTIALS",
              "Email or password is incorrect."
            )
          );
      }
      request.log.error({ error }, "Failed to login user");
      return reply.status(500).send({ error: "SERVER_ERROR" });
      return reply
        .status(500)
        .send(
          errorResponse(
            request.requestId,
            "SERVER_ERROR",
            "Unable to login right now."
          )
        );
    }
  });
}

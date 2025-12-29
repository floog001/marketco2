import { FastifyInstance } from "fastify";
import prisma from "../db/prisma";
import {
  listingCreateSchema,
  listingItemSchema,
  listingUpdateSchema,
} from "../utils/validation";

const errorResponse = (requestId: string, code: string, message: string) => ({
  error: {
    code,
    message,
  },
  requestId,
});

export default async function listingRoutes(fastify: FastifyInstance) {
  fastify.post("/listings", async (request, reply) => {
    const parsed = listingCreateSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply
        .status(400)
        .send(
          errorResponse(
            request.requestId,
            "INVALID_BODY",
            "Listing payload is invalid."
          )
        );
    }

    const { items, ...listingData } = parsed.data;
    const listing = await prisma.listing.create({
      data: {
        ...listingData,
        items: items?.length ? { create: items } : undefined,
      },
      include: { items: true },
    });

    return reply.status(201).send(listing);
  });

  fastify.get("/listings", async (_request, reply) => {
    const listings = await prisma.listing.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });

    return reply.send(listings);
  });

  fastify.get("/listings/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!listing) {
      return reply
        .status(404)
        .send(
          errorResponse(
            request.requestId,
            "LISTING_NOT_FOUND",
            "Listing not found."
          )
        );
    }

    return reply.send(listing);
  });

  fastify.patch("/listings/:id", async (request, reply) => {
    const parsed = listingUpdateSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply
        .status(400)
        .send(
          errorResponse(
            request.requestId,
            "INVALID_BODY",
            "Listing update payload is invalid."
          )
        );
    }

    const updateData = parsed.data;
    const hasUpdates = Object.values(updateData).some(
      (value) => value !== undefined
    );
    if (!hasUpdates) {
      return reply
        .status(400)
        .send(
          errorResponse(
            request.requestId,
            "INVALID_BODY",
            "At least one field must be provided."
          )
        );
    }

    const { id } = request.params as { id: string };
    const listing = await prisma.listing.findUnique({ where: { id } });
    if (!listing) {
      return reply
        .status(404)
        .send(
          errorResponse(
            request.requestId,
            "LISTING_NOT_FOUND",
            "Listing not found."
          )
        );
    }

    const updatedListing = await prisma.listing.update({
      where: { id },
      data: updateData,
      include: { items: true },
    });

    return reply.send(updatedListing);
  });

  fastify.post("/listings/:id/items", async (request, reply) => {
    const parsed = listingItemSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply
        .status(400)
        .send(
          errorResponse(
            request.requestId,
            "INVALID_BODY",
            "Listing item payload is invalid."
          )
        );
    }

    const { id } = request.params as { id: string };
    const listing = await prisma.listing.findUnique({ where: { id } });
    if (!listing) {
      return reply
        .status(404)
        .send(
          errorResponse(
            request.requestId,
            "LISTING_NOT_FOUND",
            "Listing not found."
          )
        );
    }

    const item = await prisma.item.create({
      data: {
        listingId: id,
        ...parsed.data,
      },
    });

    return reply.status(201).send(item);
  });
}

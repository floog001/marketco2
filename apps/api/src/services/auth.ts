import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import prisma from "../db/prisma";
import { signJwt } from "../utils/jwt";

const prisma = new PrismaClient();

export const registerUser = async (email: string, password: string) => {
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    throw new Error("EMAIL_IN_USE");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
    },
  });

  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
  };
};

export const loginUser = async (email: string, password: string) => {
    token,
  };
};

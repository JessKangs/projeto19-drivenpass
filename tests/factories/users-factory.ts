import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import { User } from "@prisma/client";
import { prisma } from "../../src/config";

export async function createUser(): Promise<User> {
  const incomingPassword =  faker.internet.password(6);
  const hashedPassword = await bcrypt.hash(incomingPassword, 10);

  return prisma.user.create({
    data: {
      email: faker.internet.email(),
      password: hashedPassword,
    },
  });
}

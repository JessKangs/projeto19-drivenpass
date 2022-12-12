import * as jwt from "jsonwebtoken";
import { prisma } from "../src/config"
import { User } from "@prisma/client";
import { createUser } from "./factories"

export async function cleanDb() {
    await prisma.credential.deleteMany({});
    await prisma.network.deleteMany({});  
}

export async function generateValidToken(user?: User) {
    const incomingUser = user || (await createUser());
    const token = jwt.sign({ userId: incomingUser.id }, process.env.JWT_SECRET as string);
  
    return token;
  }
  
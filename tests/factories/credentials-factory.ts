import Cryptr from "cryptr"
import { faker } from "@faker-js/faker";
import { User } from "@prisma/client";
import { prisma } from "../../src/config";

const cryptr = new Cryptr('secretKey')

export async function createCredential( body:any,
    userId:number){

  return prisma.credential.create({
    data: {
        title: body.title,
        url: body.url,
        username: body.username,
        password: body.password,
        userId
    },
  });
}

export async function createValidBody() {
    const incomingPassword = faker.internet.password(6);
    const hashedPassword = cryptr.encrypt(incomingPassword);

    const title = faker.random.word();
    const url = faker.internet.url();
    const username = faker.internet.userName();
    const password = hashedPassword;

    const body = {
        title,
        url,
        username,
        password
    }

    return body;
}

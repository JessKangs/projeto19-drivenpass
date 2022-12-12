import Cryptr from "cryptr"
import { faker } from "@faker-js/faker";
import { User } from "@prisma/client";
import { prisma } from "../../src/config";

const cryptr = new Cryptr('secretKey')

export async function createNetwork( body:any,
    userId:number){

  return prisma.network.create({
    data: {
        title: body.title,
        network: body.network,
        password: body.password,
        userId
    },
  });
}

export async function createValidNetworkBody() {
    const incomingPassword = faker.internet.password(6);
    const hashedPassword = cryptr.encrypt(incomingPassword);

    const title =  faker.lorem.word();  
    const network = faker.lorem.words(3);
    const password = hashedPassword;

    const body = {
        title,
        network,
        password
    }

    return body;
}
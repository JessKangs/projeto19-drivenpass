import { prisma } from "../config/database";

async function createNetwork(network:string, password:string, title:string, userId:number) {
    return prisma.network.create({
        data:{
            title,
            network,
            password,
            userId
        }
    })
}

const newtworksRepository = {
    createNetwork
}

export { newtworksRepository };
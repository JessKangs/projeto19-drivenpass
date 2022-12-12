import { prisma } from "../config/database";

async function createNetwork(title:string,network:string, password:string, userId:number) {
    return prisma.network.create({
        data:{
            title,
            network,
            password,
            userId
        }
    })
}

async function getAllNetworks(userId:number) {
    return prisma.network.findMany({
        where: {
            userId
        }
    })
}

async function getNetworkById(networkId:number, userId:number) {
    return prisma.network.findFirst({
        where:{
           id: networkId,
           userId
        }
    })
}

async function deleteNetworkById (id:number) {
    return prisma.network.delete({
        where: {
            id,
        }
    })
}


const networksRepository = {
    createNetwork,
    getAllNetworks,
    getNetworkById,
    deleteNetworkById
}

export { networksRepository };
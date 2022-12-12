import { prisma } from "../config/database";

async function titleExists(userId: number, title: string){

    return prisma.credential.findFirst({
        where: {
            userId,
            title
        }
    })
}

async function createCredential(title: string, url: string, username:string, password:string, userId:number){
    return prisma.credential.create({
        data: {
            title,
            url,
            username,
            password,
            userId
        }
    })
}

async function getAllCredentials(userId:number) {
    return prisma.credential.findMany({
        where: {
            userId
        }
    })
}

async function getCredentialById(credentialId:number, userId:number) {
    return prisma.credential.findFirst({
        where:{
           id: credentialId,
           userId
        }
    })
}

async function deleteCredentialById (id:number) {
    return prisma.credential.delete({
        where: {
            id,
        }
    })
}


const credentialsRepository = {
    deleteCredentialById,
    getCredentialById,
    getAllCredentials,
    createCredential,
    titleExists
}

export { credentialsRepository };
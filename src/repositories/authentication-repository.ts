import { prisma } from "../config/database";

async function findByEmail( email: string) {
    return prisma.user.findFirst({
        where: {
            email,
        }
    })
}

async function createUser( email: string, password: string) {
    return prisma.user.create({
        data: {
            email,
            password
        }
    })
}

const authenticationRepository = {
    findByEmail,
    createUser
}

export { authenticationRepository }
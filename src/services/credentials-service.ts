import Cryptr from "cryptr"
import { credentialsRepository } from "../repositories/credentials-repository";
import { conflictError } from "../errors/conflict-error"
import { notFoundError }  from "../errors/not-found-error";

async function createCredential(title: string, url: string, username:string, password:string, userId:number) {
    const cryptr = new Cryptr('secretKey')

    const titleExists = await credentialsRepository.titleExists(userId, title);

    if (titleExists) throw conflictError("Title already exists.")

    const criptedPassword = await cryptr.encrypt(password)

    const credential = await credentialsRepository.createCredential(title, url, username, criptedPassword, userId)

    return credential;
}

async function getAllCredentials(userId:number) {
    const credentials = await credentialsRepository.getAllCredentials(userId);

    if(credentials.length === 0) throw notFoundError();

    return credentials;
}

async function getCredentialById(credentialId:number, userId: number){

    const credential = await credentialsRepository.getCredentialById(credentialId, userId)

    return credential;
}

async function deleteCredential(id:number) {

   const delection = await credentialsRepository.deleteCredentialById(id)

   return delection;
}

const credentialsService = {
    getAllCredentials,
    getCredentialById,
    deleteCredential,
    createCredential
    
};

export default credentialsService;
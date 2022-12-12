import Cryptr from "cryptr"
import credentialsService from "../services/credentials-service";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { notFoundError, requestError } from "../errors";

const cryptr = new Cryptr('secretKey')

export async function createCredential(req: Request, res: Response) {
    const { title, url, username, password } = req.body;
    const { userId } = req.params;
    
    try {
        if(!title || !url || !username || !password) throw requestError(httpStatus.BAD_REQUEST, "cannot create credential with empty body")

        const result = await credentialsService.createCredential( title, url, username, password, Number(userId) )

        return res.status(httpStatus.CREATED).send(result)
    } catch(error:any) {
        if(error.name === "ConflictError") return res.status(httpStatus.CONFLICT).send(error.message)
    
        if(error.name === "RequestError") return res.status(httpStatus.BAD_REQUEST).send(error.message)
        
        return res.sendStatus(httpStatus.UNPROCESSABLE_ENTITY)
    }
}

export async function getAllCredentials(req: Request, res: Response) {
    const { userId } = req.params;
   
    try {
        const result = await credentialsService.getAllCredentials(Number(userId))
       
        const credentialsList:any = []
        result.map((value) => credentialsList.push({...value, password: cryptr.decrypt(value.password)}))
        
        return res.status(httpStatus.OK).send(credentialsList)
    } catch(error:any) {
        if(error.name === 'NotFoundError') return res.status(httpStatus.NOT_FOUND).send(error.message)
    }
}

export async function getCredentialById(req: Request, res: Response) {
    const { userId, credentialId } = req.params;

    try {
        const result = await credentialsService.getCredentialById(Number(credentialId), Number(userId))
        
        if(!result) throw notFoundError();

        const decryptedPassword = cryptr.decrypt(result.password);
        
        return res.status(httpStatus.OK).send({
            id: result.id,
            title: result.title,
            url: result.url,
            username: result.username,
            password: decryptedPassword,
            userId: result.userId
        })
    } catch(error) {
        res.sendStatus(httpStatus.NOT_FOUND)
    }
}

export async function deleteCredentialById(req: Request, res: Response) {
    const { userId, credentialId } = req.params;

    try {
        const checkCredentialOwner:any = await credentialsService.getCredentialById(Number(credentialId), Number(userId))
        
        if(!checkCredentialOwner) return res.status(httpStatus.FORBIDDEN).send("Access denied")
        ;     
        
        await credentialsService.deleteCredential(Number(credentialId))
        
        res.status(httpStatus.OK).send("Credential deleted with success!")
    } catch(error:any) {

        return res.status(httpStatus.NOT_FOUND)
    }
}
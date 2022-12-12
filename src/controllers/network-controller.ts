import Cryptr from "cryptr"
import { networkServices } from "../services/network-service";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { notFoundError, requestError } from "../errors";

const cryptr = new Cryptr('secretKey')

export async function createNetwork(req: Request, res: Response) {
    const { title, network, password } = req.body
    const { userId } = req.params;

    try {

        if(!title || !network || !password || !password) throw requestError(httpStatus.BAD_REQUEST, "cannot create credential with empty body")

        const result = await networkServices.createNetwork(title, network, password, Number(userId));

        return res.status(httpStatus.CREATED).send(result)
    } catch (error:any) {
        if(error.name === "ConflictError") return res.status(httpStatus.CONFLICT).send(error.message)
    
        if(error.name === "RequestError") return res.status(httpStatus.BAD_REQUEST).send(error.message)
        
        return res.sendStatus(httpStatus.UNPROCESSABLE_ENTITY)
    }
}

export async function getAllNetworks(req: Request, res: Response) {
    const { userId } = req.params;

    try {
        const result = await networkServices.getAllNetworks(Number(userId))

        const NetworksList:any = []
        result.map((value) => NetworksList.push({...value, password: cryptr.decrypt(value.password)}))

        return res.status(httpStatus.OK).send(NetworksList)
    } catch(error:any) {
        if(error.name === 'NotFoundError') return res.status(httpStatus.NOT_FOUND).send(error.message)
    }
}

export async function getNetworkById(req: Request, res: Response) {
    const { userId, networkId } = req.params;

    try {
        const result = await networkServices.getNetworkById(Number(networkId), Number(userId))
        
        if(!result) throw notFoundError();

        const decryptedPassword = cryptr.decrypt(result.password);

        return res.status(httpStatus.OK).send({
            id: result.id,
            title: result.title,
            network: result.network,
            password: decryptedPassword,
            userId: result.userId
        })
    } catch(error) {
        res.sendStatus(httpStatus.NOT_FOUND)
    }
}

export async function deleteNetworkById(req: Request, res: Response) {
    const { userId, networkId } = req.params;

    try {
        const checkNetworkOwner:any = await networkServices.getNetworkById(Number(networkId), Number(userId))
        
        if(!checkNetworkOwner) return res.status(httpStatus.FORBIDDEN).send("Access denied")
        ;     
        
        await networkServices.deleteNetwork(Number(networkId))
        
        res.status(httpStatus.OK).send("Network deleted with success!")
    } catch(error:any) {

        return res.status(httpStatus.NOT_FOUND)
    }
}


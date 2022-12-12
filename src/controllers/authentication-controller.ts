import { Request, Response } from "express";
import httpStatus, { BAD_REQUEST } from "http-status";
import { authenticationService } from "../services";

export async function createSignUp(req: Request, res: Response) {
    const { email, password } = req.body;
    
    try {
        const result = await authenticationService.signUp({ email, password });
        
        return res.status(httpStatus.CREATED).send(result);
    } catch(error) {
        return res.sendStatus(httpStatus.BAD_REQUEST)
    }
}

export async function createSignIn(req: Request, res: Response) {
    const { email, password } = req.body;
   
    try {
        
        const result = await authenticationService.signIn({ email, password });
        
        return res.status(httpStatus.OK).send(result);
        
    } catch(error:any) {
        
        if(error.name === "RequestError") return res.sendStatus(httpStatus.BAD_REQUEST)
        console.log(error)
        return res.sendStatus(httpStatus.NOT_FOUND)
    }
}
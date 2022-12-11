import { Request, Response } from "express";
import httpStatus from "http-status";
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
    } catch(error) {
        return res.sendStatus(httpStatus.BAD_REQUEST)
    }
}
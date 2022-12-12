import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import joi from 'joi';
import { requestError } from '../errors/request-error';

const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.required()
})

const signUpSchema = joi.object({
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: joi.string().min(10)
})

function signInIsValid(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    if(!email || !password) throw requestError(httpStatus.BAD_REQUEST, "cannot login with empty body")

    const validation = loginSchema.validate({email, password}, {abortEarly: true})
    
    if(validation.error) {
        
        res.status(httpStatus.UNPROCESSABLE_ENTITY).send(validation.error)
        
    } else {
        next()
    }
}

function signUpIsValid(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    const validation = signUpSchema.validate({ email, password }, { abortEarly: true })

    if (validation.error) {
        res.status(httpStatus.UNPROCESSABLE_ENTITY).send(validation.error)
    } else {
        next()
    }
}

export {signUpIsValid, signInIsValid}
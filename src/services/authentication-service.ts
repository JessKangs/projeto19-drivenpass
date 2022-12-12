import { User } from "@prisma/client";
import { authenticationRepository } from "../repositories/authentication-repository";
import bcrypt from "bcrypt";
import { notFoundError, invalidCredentialsError, conflictError, requestError } from "../errors";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";

async function signUp (params: SignInParams) {
    const { email, password } = params;

    const userExists = await authenticationRepository.findByEmail(email);
    
    if(userExists) throw conflictError("conflict error");

    const hashedPassword = await bcrypt.hash(password, 12)

    await authenticationRepository.createUser(
            email,
            hashedPassword,
    );
}

async function signIn (params: SignInParams) {
    const { email, password } = params;

    if(!email || !password) throw requestError(httpStatus.BAD_REQUEST, "cannot login with empty body")

    const user = await authenticationRepository.findByEmail(email);

    if(!user) throw notFoundError();

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid) throw invalidCredentialsError();

    const token = jwt.sign( {userId: user.id}, process.env.JWT_SECRET as string);

    return { 
        id: user.id,
        email: user.email,
        token
    };
}


export type SignInParams = Pick<User, "email" | "password">;

const authenticationService = {
    signUp,
    signIn,
}

export { authenticationService };
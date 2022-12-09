import { User } from "@prisma/client";
import { conflictError } from "../errors/conflict-error";
import { authenticationRepository } from "../repositories";
import bcrypt from "bcrypt";
import { notFoundError } from "../errors/not-found-error";
import { invalidCredentialsError } from "../errors/invalid-credentials-error";
import jwt from "jsonwebtoken";

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

    const user = await authenticationRepository.findByEmail(email);

    if(!user) throw notFoundError();

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid) throw invalidCredentialsError();

    const token = jwt.sign( {userId: user.id}, process.env.JWT_SECRET);

    return {
        user: {
            id: user.id,
            email: user.email
        },
        token
    };
}


export type SignInParams = Pick<User, "email" | "password">;

const authenticationService = {
    signUp,
    signIn,
}

export { authenticationService };
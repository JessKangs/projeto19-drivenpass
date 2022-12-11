import { Router } from "express";
import { signInIsValid, signUpIsValid } from "../middlewares/auth-joi-middleware";
import { createSignIn, createSignUp } from "../controllers/authentication-controller"


const authenticationRouter = Router();

authenticationRouter.post("/signup", signUpIsValid, createSignUp)

authenticationRouter.post("/signin", signInIsValid, createSignIn)

export { authenticationRouter };
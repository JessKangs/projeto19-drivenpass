import { Router } from "express";
import { signInIsValid, singUpIsValid } from "../middlewares/auth-joi-middleware";


const authenticationRouter = Router();

authenticationRouter.post("", singUpIsValid, )

authenticationRouter.post("", signInIsValid,)

export { authenticationRouter };
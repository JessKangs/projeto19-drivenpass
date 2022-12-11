import { authenticateToken } from "../middlewares/authorization-token-middleware";
import { Router } from "express";
import { 
    createCredential, 
    getAllCredentials, 
    getCredentialById, 
    deleteCredentialById 
} from "../controllers/credentials-controller"

const credentialsRouter = Router();

credentialsRouter
.all("/*", authenticateToken) 
.post("/:userId", createCredential)
.get("/:userId", getAllCredentials)
.get("/:userId/:credentialId", getCredentialById)
.delete("/:userId/:credentialId", deleteCredentialById)

export { credentialsRouter };
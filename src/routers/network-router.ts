import { authenticateToken } from "../middlewares/authorization-token-middleware";
import { Router } from "express";
import { createNetwork, getAllNetworks, getNetworkById, deleteNetworkById } from "../controllers/network-controller";

const networksRouter = Router();

networksRouter
.all("/*", authenticateToken)
.post("/:userId", createNetwork)
.get("/:userId", getAllNetworks)
.get("/:userId/:networkId", getNetworkById)
.delete("/:userId/:networkId", deleteNetworkById)

export { networksRouter };

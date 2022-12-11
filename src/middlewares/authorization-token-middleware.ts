import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config()

import { unauthorizedError } from "../errors/unauthorized-error";

export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(httpStatus.UNAUTHORIZED).send(unauthorizedError());

  const token = authHeader.replace("Bearer ", "");
  if (!token) return res.status(httpStatus.UNAUTHORIZED).send(unauthorizedError());

  try {
    jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;
   
    return next();
  } catch (err) {
    return res.status(httpStatus.UNAUTHORIZED).send(unauthorizedError());
  }
}

type JWTPayload = {
  userId: number;
};

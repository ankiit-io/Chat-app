import type { NextFunction,Request,Response } from "express";
import type { IUser } from "../model/User.js";
import tryCatch from "../config/tryCatch.js";
import { generateToken } from "../config/generateToken.js";
import jwt, { type JwtPayload } from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

export const isAuth = async(req:AuthenticatedRequest,res:Response,next:NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Please login- no auth header" });
        return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Please login- invalid token" });
      return;
    }

    const decodedValue = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    if (!decodedValue || !decodedValue.user) {
      res.status(401).json({ message: "Please login- invalid token" });
      return;
    }

    req.user = decodedValue.user as IUser;
    next();

  } catch (error) {
    res.status(500).json({ message: "JWT error" });
  }
}


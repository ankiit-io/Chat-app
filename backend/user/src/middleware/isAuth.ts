import type { NextFunction, Request, Response } from "express";
import { User, type IUser } from "../model/User.js";
import tryCatch from "../config/tryCatch.js";
import { generateToken } from "../config/generateToken.js";
import jwt, { type JwtPayload } from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log("AUTH HEADER:", req.headers.authorization);
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No auth header" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;

    if (!decoded || !decoded.user) {
      return res.status(401).json({ message: "Invalid token" });
    }

   const user = await User.findById(decoded.user).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error: any) {
    console.log("JWT ERROR:", error.message);
    return res.status(401).json({ message: "JWT error" });
  }
};
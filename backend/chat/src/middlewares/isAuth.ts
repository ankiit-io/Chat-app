import type { Request, Response, NextFunction } from "express";
import  jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
}

export interface AuthenticatedRequest extends Request {
    user?: IUser | null;
}

export const isAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ 
                message: "Please login- no auth header" 
            });
            return;
        }
         const token = authHeader.split(" ")[1];

         if (!token) {
           res.status(401).json({ message: "Please login- invalid token" });
           return;
         }

         const decodedValue = jwt.verify(
           token,
           process.env.JWT_SECRET as string,
         ) as JwtPayload;

         if (!decodedValue || !decodedValue.user) {
           res.status(401).json({ message: "Please login- invalid token" });
           return;
         }

         req.user = decodedValue.user as IUser;
         next();
         
    } catch (error) {
        res.status(401).json({
             message: "please login jwt error"
            });
    }
}

export default isAuth;

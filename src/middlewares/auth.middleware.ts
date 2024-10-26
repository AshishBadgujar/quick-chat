import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthUser } from '../@types/express';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    if (authHeader === null || authHeader === undefined) {
        res.status(401).json({ message: "UnAuthorized" })
    }
    const token = authHeader?.split(" ")[1]
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) res.status(401).json({ message: "UnAuthorized" })
        req.user = user as AuthUser
        next()
    })
}
export default authMiddleware;
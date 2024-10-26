import { NextFunction, Request, Response } from "express";
import prisma from "../config/db.config";
import jwt from 'jsonwebtoken';

interface LoginPayloadType {
    nickname: string,
    oauth_id: string,
    image?: string
}
class AuthController {
    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("body", req.body)
            const body: LoginPayloadType = req.body
            let foundUser = await prisma.user.findUnique({
                where: {
                    nickname: body.nickname
                }
            })

            if (!foundUser) {
                foundUser = await prisma.user.create({
                    data: body
                })
            }
            let JWTPayload = {
                nickname: body.nickname,
                id: foundUser.id
            }
            // Ensure JWT_SECRET is defined
            if (!process.env.JWT_SECRET) {
                res.status(500).json({ message: "JWT_SECRET is not set" });
                return;
            }
            const token = jwt.sign(JWTPayload, process.env.JWT_SECRET, {
                expiresIn: "365d"
            })
            res.json({
                message: "Logged in successfully",
                user: {
                    ...foundUser,
                },
                token: `Bearer ${token}`
            })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
}
export default AuthController;
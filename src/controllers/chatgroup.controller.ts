import { Request, Response } from "express";
import prisma from "../config/db.config";

class ChatGroupController {
    static async index(req: Request, res: Response) {
        try {
            const user = req.user;
            const groups = await prisma.chatGroup.findMany({
                where: {
                    user_id: user.id,
                },
                orderBy: {
                    created_at: "desc",
                },
            });
            res.json({ data: groups });
        } catch (error) {
            res
                .status(500)
                .json({ message: error.message });
        }
    }

    static async show(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (id) {
                const group = await prisma.chatGroup.findUnique({
                    where: {
                        id: id,
                    },
                });
                res.json({ data: group });
            } else {
                res.status(404).json({ message: "No groups found" });
            }
        } catch (error) {
            res
                .status(500)
                .json({ message: error.message });
        }
    }
    static async store(req: Request, res: Response) {
        try {
            const body = req.body
            const user = req.user
            await prisma.chatGroup.create({
                data: {
                    title: body.title,
                    passcode: body.passcode,
                    user_id: user.id
                }
            })
            res.json({ message: "chat group created successfully!" })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const body = req.body;
            if (id) {
                await prisma.chatGroup.update({
                    data: body,
                    where: {
                        id: id,
                    },
                });
                res.json({ message: "Group updated successfully!" });
            }

            res.status(404).json({ message: "No groups found" });
        } catch (error) {
            res
                .status(500)
                .json({ message: error.message });
        }
    }

    static async destroy(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await prisma.chatGroup.delete({
                where: {
                    id: id,
                },
            });
            res.json({ message: "Chat Deleted successfully!" });
        } catch (error) {
            res
                .status(500)
                .json({ message: error.message });
        }
    }
}
export default ChatGroupController
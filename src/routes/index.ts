import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";
import ChatGroupController from "../controllers/chatgroup.controller";
import GroupUserController from "../controllers/groupusers.controller";
import ChatsController from "../controllers/chats.controller";

const router = Router()

router.post("/auth/login", AuthController.login);
router.get("/chat-group/:id", ChatGroupController.show);
router.get("/chat-group", authMiddleware, ChatGroupController.index);
router.post("/chat-group", authMiddleware, ChatGroupController.store);
router.put("/chat-group/:id", authMiddleware, ChatGroupController.update);
router.delete("/chat-group/:id", authMiddleware, ChatGroupController.destroy);

// * Chat group user
router.get("/chat-group-user", GroupUserController.index);
router.post("/chat-group-user", GroupUserController.store);

// * Chats
router.get("/chats/:groupId", ChatsController.index);

export default router

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
var auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
var chatgroup_controller_1 = __importDefault(require("../controllers/chatgroup.controller"));
var router = (0, express_1.Router)();
router.post("/auth/login", auth_controller_1.default.login);
router.post("/chat-group", auth_middleware_1.default, chatgroup_controller_1.default.store);
exports.default = router;

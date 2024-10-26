"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var authMiddleware = function (req, res, next) {
    var authHeader = req.headers.authorization;
    if (authHeader === null || authHeader === undefined) {
        res.status(401).json({ message: "UnAuthorized" });
    }
    var token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1];
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, function (err, user) {
        if (err)
            res.status(401).json({ message: "UnAuthorized" });
        req.user = user;
        next();
    });
};
exports.default = authMiddleware;

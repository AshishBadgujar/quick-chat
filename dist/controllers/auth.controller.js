"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var db_config_1 = __importDefault(require("../config/db.config"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var AuthController = /** @class */ (function () {
    function AuthController() {
    }
    AuthController.login = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var body, foundUser, JWTPayload, token, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        body = req.body;
                        return [4 /*yield*/, db_config_1.default.user.findUnique({
                                where: {
                                    email: body.email
                                }
                            })];
                    case 1:
                        foundUser = _a.sent();
                        if (!!foundUser) return [3 /*break*/, 3];
                        return [4 /*yield*/, db_config_1.default.user.create({
                                data: body
                            })];
                    case 2:
                        foundUser = _a.sent();
                        _a.label = 3;
                    case 3:
                        JWTPayload = {
                            name: body.name,
                            email: body.email,
                            id: foundUser.id
                        };
                        // Ensure JWT_SECRET is defined
                        if (!process.env.JWT_SECRET) {
                            res.status(500).json({ message: "JWT_SECRET is not set" });
                            return [2 /*return*/];
                        }
                        token = jsonwebtoken_1.default.sign(JWTPayload, process.env.JWT_SECRET, {
                            expiresIn: "365d"
                        });
                        res.json({
                            message: "Logged in successfully",
                            user: __assign(__assign({}, foundUser), { token: "Bearer ".concat(token) })
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        res.status(500).json({ message: "something went wrong" });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return AuthController;
}());
exports.default = AuthController;

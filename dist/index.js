"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var index_1 = __importDefault(require("./routes/index"));
/*
 * Load up and parse configuration details from
 * the `.env` file to the `process.env`
 * object of Node.js
 */
dotenv_1.default.config();
/*
 * Create an Express application and get the
 * value of the PORT environment variable
 * from the `process.env`
 */
var app = (0, express_1.default)();
var port = process.env.PORT || 3000;
app.use("/api", index_1.default);
/* Define a route for the root path ("/")
 using the HTTP GET method */
app.get("/", function (req, res) {
    res.send("Express + TypeScript Server");
});
/* Start the Express app and listen
 for incoming requests on the specified port */
app.listen(port, function () {
    console.log("[server]: Server is running at http://localhost:".concat(port));
});

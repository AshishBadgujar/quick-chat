// src/index.ts
import express, { Express, Request, Response } from "express";
import dotenv from 'dotenv'
import Routes from './routes/index'
import { Server } from "socket.io";
import { createServer } from "http";
import { setupSocket } from "./socket";
import path from "path";
import { createAdapter } from "@socket.io/redis-streams-adapter";
import redis from "./config/redis.config";
import { instrument } from "@socket.io/admin-ui";

dotenv.config()

const app: Express = express();
const port = process.env.PORT || 3000;

const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: ["https://admin.socket.io"],
        credentials: true
    },
    adapter: createAdapter(redis)
})

instrument(io, {
    auth: false,
    mode: "development",
});
setupSocket(io)
export { io }

app.use(express.json())
// app.use(cors())
app.use("/api", Routes);
app.use(express.static(path.join(__dirname, '..', 'client')));

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});


server.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
// src/@types/express.d.ts

import * as express from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: AuthUser; // Optional user property
        }
    }
}

export interface AuthUser {
    id: number;
    nickname: string;
    image?: string;
    // Add other relevant user properties here
}

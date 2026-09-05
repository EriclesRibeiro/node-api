import { NextFunction, Request, Response } from "express";
import { verify, JwtPayload } from "jsonwebtoken";
import db from "../../../database/models";

declare global {
    namespace Express {
        interface Request {
            user?: string | JwtPayload;
        }
    }
}

export async function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
    const authToken = request.headers.authorization;

    if (!authToken) {
        return response.status(401).json({
            error: {
                message: "Não autorizado!"
            },
            body: null
        });
    }

    const [scheme, token] = authToken.split(" ");

    if (scheme !== "Bearer" || !token) {
        return response.status(401).json({
            error: {
                message: "Não autorizado!"
            },
            body: null
        });
    }

    const secret = process.env.SECRET as string;

    try {
        const payload = verify(token, secret);

        if (typeof payload === 'string') {
            return response.status(401).json({
                error: {
                    message: "Token inválido!"
                },
                body: null
            });
        }

        const user = await db.user.findById(payload.sub);

        if (!user) {
            return response.status(401).json({
                error: {
                    message: "Não autorizado!"
                },
                body: null
            });
        }

        request.user = payload;
        return next();
    } catch (error) {
        return response.status(401).json({
            error: {
                message: "Token inválido!"
            },
            body: null
        });
    }
}
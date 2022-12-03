import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
    const authToken = request.headers.authorization;

    if(!authToken) {
        return response.status(401).json({
            error: {
                message: "Não autorizado!"
            },
            body: null
        });
    }

    const [, token] = authToken.split(" ");
    const secret = process.env.SECRET || '';

    try {
        verify(token, secret);
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
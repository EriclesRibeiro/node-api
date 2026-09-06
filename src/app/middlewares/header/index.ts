import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import indexRoute from '../../routes';
import { errorHandler } from '../errorHandler';
import { AppError } from '../../../utils/error';
import Constant from '../../../utils/constants';

const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
    : [];

function isLocalhost(origin: string): boolean {
    return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}

const corsOptions: cors.CorsOptions = {
    origin(origin: string | undefined, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.length === 0 && isLocalhost(origin)) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new AppError('Origem não permitida pelo CORS', Constant.FORBIDDEN));
    },
    credentials: true
};

function securityHeaders(_request: Request, response: Response, next: NextFunction): void {
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('X-Frame-Options', 'DENY');
    response.setHeader('Referrer-Policy', 'no-referrer');
    response.setHeader('X-DNS-Prefetch-Control', 'off');
    response.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    next();
}

export default function appMiddleware(app: Express): void {
    const trustProxy = process.env.TRUST_PROXY;

    if (trustProxy) {
        // Permite que o rate limiter e o CORS identificarem o IP de origem real
        // quando a API está atrás de um proxy reverso (ex.: "1", "loopback").
        app.set('trust proxy', trustProxy.trim());
    }

    app.use(cors(corsOptions));
    app.use(securityHeaders);
    app.use(express.json({ limit: '100kb' }));
    app.use(indexRoute);

    // Padronização de erros
    app.use(errorHandler);
}
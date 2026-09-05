import express, { Express } from 'express';
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

export default function appMiddleware(app: Express): void {
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(indexRoute);

    // Padronização de erros
    app.use(errorHandler);
}
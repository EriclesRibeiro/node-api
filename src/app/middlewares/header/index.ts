import express, { Express } from 'express';
import cors from 'cors';
import indexRoute from '../../routes';
import { errorHandler } from '../errorHandler';

const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
    : [];

const corsOptions: cors.CorsOptions = {
    origin(origin: string | undefined, callback) {
        if (allowedOrigins.length === 0) {
            return callback(null, true);
        }
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Origem não permitida pelo CORS'));
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
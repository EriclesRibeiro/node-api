import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import indexRoute from '../../routes';
import { errorHandler } from '../errorHandler';

export default function appMiddleware(app: Express): void {
    app.use(cors());
    app.use(express.json());
    app.use('*', function(req: Request, res: Response, next: NextFunction) {
        res.setHeader('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        next();
    });
    app.use(indexRoute);

    // Padronização de erros
    app.use( errorHandler );
}
import express, { Express } from 'express';

import cors from 'cors';
import routes from '../../routes';

export default function appMiddleware(app: Express): void {
    app.use(cors());
    app.use(express.json());
    app.use('*', function(req, res, next) {
        res.setHeader('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        next();
    });
    app.use(routes);
}
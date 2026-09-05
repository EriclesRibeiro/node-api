import { Express } from 'express';
import connectMongoose from '../../database';
import appMiddleware from '../middlewares/header';

export default function appConfig(app: Express): void {
    connectMongoose().catch((error) => {
        console.error('Falha ao conectar ao MongoDB:', error);
    });
    appMiddleware(app);
}
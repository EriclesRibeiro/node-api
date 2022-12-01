import { Express } from 'express';
import connectMongoose from '../../database';
import appMiddleware from '../middlewares/header';

export default function appConfig(app: Express): void {
    connectMongoose();
    appMiddleware(app);
}
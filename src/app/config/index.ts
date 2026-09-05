import { Express } from 'express';
import appMiddleware from '../middlewares/header';

export default function appConfig(app: Express): void {
    appMiddleware(app);
}
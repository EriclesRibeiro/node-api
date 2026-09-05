import { Router } from 'express';
import authRoutes from './auth';

const indexRoute = Router();

indexRoute.use("/api/auth", authRoutes);

export default indexRoute;
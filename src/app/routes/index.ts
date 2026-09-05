import { Router } from 'express';

const indexRoute = Router();
const authRoutes = require('./auth');

indexRoute.use("/api/auth", authRoutes);

export default indexRoute;

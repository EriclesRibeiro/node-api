import express from 'express';

const indexRoute = express();
const authRoutes = require('./auth');

indexRoute.use("/api/auth", authRoutes);

export default indexRoute;

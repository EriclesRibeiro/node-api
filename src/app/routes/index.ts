// import { Router } from 'express';

// const router = Router();
// const AuthController = require('../controllers/auth.controller');

// router.get("/api/auth/verifyEmail", AuthController.verifyEmail);
// router.get("/api/auth/signup", AuthController.signup);

// export default router;
import express from 'express';

const indexRoute = express();
const authRoutes = require('./auth');

indexRoute.use("/api/auth", authRoutes);

export default indexRoute;

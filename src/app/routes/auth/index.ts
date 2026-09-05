import { Router } from 'express';
import { AuthenticateController } from '../../controllers/AuthenticateController';
import { Verifier } from '../../middlewares/verifiers';
import { ensureAuthenticated } from '../../middlewares/ensureAuthenticated';
import { authLimiter } from '../../middlewares/rateLimiter';

const router = Router();
const authenticateController = new AuthenticateController();
const verifier = new Verifier();

router.post("/signup", authLimiter, verifier.verifyEmail, authenticateController.signUp);
router.post("/signin", authLimiter, authenticateController.signIn);
router.get("/me", ensureAuthenticated, authenticateController.me);

export default router;
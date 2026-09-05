import { Router } from 'express';
import { AuthenticateController } from '../../controllers/AuthenticateController';
import { Verifier } from '../../middlewares/verifiers';
import { authLimiter } from '../../middlewares/rateLimiter';
import tryCatch from '../../../utils/tryCatch';

const router = Router();
const authenticateController = new AuthenticateController();
const verifier = new Verifier();

router.post("/signup", authLimiter, verifier.verifyEmail, tryCatch(authenticateController.signUp));
router.get("/verifyEmail", authLimiter, tryCatch(authenticateController.verifyEmail));
router.post("/signin", authLimiter, tryCatch(authenticateController.signIn));

module.exports = router;
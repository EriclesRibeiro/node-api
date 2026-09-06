import { Router } from 'express';
import { AuthenticateController } from '../../controllers/AuthenticateController';
import { Verifier } from '../../middlewares/verifiers';
import { ensureAuthenticated } from '../../middlewares/ensureAuthenticated';
import { authLimiter } from '../../middlewares/rateLimiter';

const router = Router();
const authenticateController = new AuthenticateController();
const verifier = new Verifier();

// Respostas de autenticação contêm token/cookies sensíveis: não armazenar em cache.
router.use((_request, response, next) => {
    response.setHeader('Cache-Control', 'no-store');
    next();
});

router.post("/signup", authLimiter, verifier.verifyEmail, authenticateController.signUp);
router.post("/signin", authLimiter, authenticateController.signIn);
router.get("/me", ensureAuthenticated, authenticateController.me);

export default router;
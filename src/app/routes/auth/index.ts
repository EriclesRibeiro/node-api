import { Router } from 'express';
import { AuthenticateController } from '../../controllers/AuthenticateController';
import { ensureAuthenticated } from '../../middlewares/ensureAuthenticated';
import { Verifier } from '../../middlewares/verifiers';

const router = Router();
const authenticateController = new AuthenticateController();
const verifier = new Verifier();

router.post("/signup", verifier.verifyEmail, authenticateController.signUp);
router.get("/verifyEmail", authenticateController.verifyEmail);
router.post("/signin", authenticateController.signIn);

module.exports = router;
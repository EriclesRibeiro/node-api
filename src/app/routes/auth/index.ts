import { Router } from 'express';
import { AuthenticateController } from '../../controllers/AuthenticateController';
import { ensureAuthenticated } from '../../middlewares/ensureAuthenticated';
import { Verifier } from '../../middlewares/verifiers';
import tryCatch from '../../../utils/tryCatch';

const router = Router();
const authenticateController = new AuthenticateController();
const verifier = new Verifier();



router.post("/signup", verifier.verifyEmail, tryCatch(authenticateController.signUp));
router.get("/verifyEmail", tryCatch(authenticateController.verifyEmail));
router.post("/signin", authenticateController.signIn);

module.exports = router;
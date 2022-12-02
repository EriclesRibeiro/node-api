import { Router } from 'express';

const router = Router();
const AuthController = require('../../controllers/auth.controller');
const verifiers = require('../../middlewares/verifiers');

router.get("/verifyEmail", AuthController.verifyEmail);
router.post("/signup", [ verifiers.verifyEmail ], AuthController.signup);

module.exports = router
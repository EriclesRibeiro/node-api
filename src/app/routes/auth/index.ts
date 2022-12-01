import { Router, Express } from 'express';
import express from 'express'

const router = Router();
const AuthController = require('../../controllers/auth.controller');

router.get("/verifyEmail", AuthController.verifyEmail);
router.post("/signup", AuthController.signup);

module.exports = router
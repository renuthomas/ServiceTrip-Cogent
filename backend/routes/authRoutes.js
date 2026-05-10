import express from "express";
import { customerSignup,verifyOTP,login } from "../controllers/authController.js";
import { signupSchema,validate } from "../middlewares/validators.js";
const router = express.Router();

router.post('/signup',validate(signupSchema),customerSignup);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);

export {router as authRouter};
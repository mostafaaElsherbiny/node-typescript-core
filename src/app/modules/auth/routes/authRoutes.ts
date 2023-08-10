import express from 'express';
import AuthController from '../controllers/AuthController';
import verifyToken from '../middlewares/auth';
import validateRequest from '../../core/middlewares/validateRequest';
import { loginValidationSchema } from '../validations/auth/loginValidationSchema';
import { changePasswordValidationSchema } from '../validations/auth/changePasswordValidationSchema';
const router = express.Router();

router.post('/login', validateRequest(loginValidationSchema), AuthController.login);
router.post('/change-password', verifyToken, validateRequest(changePasswordValidationSchema), AuthController.changePassword);
router.post('/reset-password', verifyToken, AuthController.resetPassword);

export { router as authRoutes };

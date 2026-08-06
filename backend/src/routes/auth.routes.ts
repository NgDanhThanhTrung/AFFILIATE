import { Router } from 'express'
import authController from '../controllers/auth.controller'
import { authenticate } from '../middleware/auth.middleware'
import { validate } from '../middleware/validation.middleware'
import {
  registerSchema,
  loginSchema,
  verifyPinSchema,
  changePasswordSchema,
  changePinSchema,
  refreshTokenSchema,
} from '../validators/auth.validator'

const router = Router()

// Public routes
router.post('/register', validate(registerSchema), authController.register)
router.post('/login', validate(loginSchema), authController.login)
router.post('/refresh-token', validate(refreshTokenSchema), authController.refreshToken)

// Protected routes
router.post('/logout', authenticate, authController.logout)
router.post('/verify-pin', authenticate, validate(verifyPinSchema), authController.verifyPin)
router.post('/setup-pin', authenticate, authController.setupPin)
router.post('/change-password', authenticate, validate(changePasswordSchema), authController.changePassword)
router.post('/change-pin', authenticate, validate(changePinSchema), authController.changePin)

export default router

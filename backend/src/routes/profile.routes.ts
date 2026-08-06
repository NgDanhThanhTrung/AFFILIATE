import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware'
import { validate } from '../middleware/validation.middleware'
import { updateProfileSchema, resetPinSchema } from '../validators/profile.validator'
import * as profileController from '../controllers/profile.controller'

const router = Router()

// All routes require authentication
router.use(authenticate)

// Deactivate account
router.post('/deactivate', validate(resetPinSchema), profileController.deactivateAccount)

// Update profile
router.patch('/', validate(updateProfileSchema), profileController.updateProfile)

// Get user statistics
router.get('/stats', profileController.getUserStats)

// Get profile (must be last)
router.get('/', profileController.getProfile)

export default router
import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware'
import { validate } from '../middleware/validation.middleware'
import { createPinSchema, updatePinSchema, resetPinSchema } from '../validators/profile.validator'
import * as pinController from '../controllers/pin.controller'

const router = Router()

// All routes require authentication
router.use(authenticate)

// Check PIN status
router.get('/status', pinController.checkPinStatus)

// Create PIN
router.post('/create', validate(createPinSchema), pinController.createPin)

// Update PIN
router.post('/update', validate(updatePinSchema), pinController.updatePin)

// Reset PIN
router.post('/reset', validate(resetPinSchema), pinController.resetPin)

export default router
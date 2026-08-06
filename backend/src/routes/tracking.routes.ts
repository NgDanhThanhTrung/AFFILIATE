import { Router } from 'express'
import { authenticate, optionalAuth } from '../middleware/auth.middleware'
import * as trackingController from '../controllers/tracking.controller'
import * as redirectController from '../controllers/redirect.controller'

const router = Router()

// Public redirect endpoint - this is what users actually click on
router.get('/r/:subId', redirectController.redirectWithTracking)

// Public endpoint for tracking clicks (API endpoint)
router.get('/click/:subId', optionalAuth, trackingController.trackClick)

// Protected endpoints for analytics
router.get('/link/:linkId', authenticate, trackingController.getLinkClicks)
router.get('/analytics', authenticate, trackingController.getUserClickAnalytics)

export default router
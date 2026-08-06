import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware'
import { validate } from '../middleware/validation.middleware'
import { convertLinkSchema, getLinkHistorySchema, getLinkStatsSchema } from '../validators/affiliate.validator'
import * as affiliateController from '../controllers/affiliate.controller'

const router = Router()

// All routes require authentication
router.use(authenticate)

// Convert link to affiliate link
router.post('/convert', validate(convertLinkSchema), affiliateController.convertLink)

// Get link history
router.get('/history', validate(getLinkHistorySchema), affiliateController.getLinkHistory)

// Get link statistics
router.get('/stats', validate(getLinkStatsSchema), affiliateController.getLinkStats)

// Delete link
router.delete('/:linkId', affiliateController.deleteLink)

// Update link status
router.patch('/:linkId/status', affiliateController.updateLinkStatus)

export default router
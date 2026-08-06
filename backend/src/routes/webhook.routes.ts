import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware'
import * as webhookController from '../controllers/webhook.controller'
import config from '../config'

const router = Router()

// Admin endpoints require authentication
const adminRouter = Router()
adminRouter.use(authenticate)

// Get webhook logs
adminRouter.get('/logs', webhookController.getWebhookLogs)

// Get webhook statistics
adminRouter.get('/stats', webhookController.getWebhookStats)

// Reprocess failed webhooks
adminRouter.post('/reprocess', webhookController.reprocessFailedWebhooks)

// Mount admin routes
router.use('/admin', adminRouter)

// Public webhook endpoints (for platform notifications)
// Using environment variable paths
router.post(config.webhook.shopee.path, webhookController.processWebhook)
router.post(config.webhook.tiktok.path, webhookController.processWebhook)

export default router
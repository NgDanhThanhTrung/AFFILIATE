import { Router } from 'express'
import * as healthController from '../controllers/health.controller'

const router = Router()

// Health check endpoints (no authentication required)
router.get('/health', healthController.healthCheck)
router.get('/ready', healthController.readinessCheck)

export default router
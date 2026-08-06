import { Router } from 'express'

const router = Router()

// Import route modules
import authRoutes from './auth.routes'
import userRoutes from './user.routes'
import affiliateRoutes from './affiliate.routes'
import trackingRoutes from './tracking.routes'
import walletRoutes from './wallet.routes'
import transactionRoutes from './transaction.routes'
import withdrawalRoutes from './withdrawal.routes'
import orderRoutes from './order.routes'
import webhookRoutes from './webhook.routes'
import profileRoutes from './profile.routes'
import pinRoutes from './pin.routes'
import adminRoutes from './admin.routes'
import healthRoutes from './health.routes'

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Register routes
router.use('/auth', authRoutes)
router.use('/user', userRoutes)
router.use('/affiliate', affiliateRoutes)
router.use('/tracking', trackingRoutes)
router.use('/wallet', walletRoutes)
router.use('/transactions', transactionRoutes)
router.use('/withdrawal', withdrawalRoutes)
router.use('/orders', orderRoutes)
router.use('/webhook', webhookRoutes)
router.use('/profile', profileRoutes)
router.use('/pin', pinRoutes)
router.use('/admin', adminRoutes)
router.use('/', healthRoutes)

export default router

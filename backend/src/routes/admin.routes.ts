import { Router } from 'express'
import { authenticate, requireAdmin } from '../middleware/auth.middleware'
import * as adminController from '../controllers/admin.controller'

const router = Router()

// Development-only endpoint to setup admin without authentication
// REMOVE THIS IN PRODUCTION
if (process.env.NODE_ENV !== 'production') {
  router.post('/dev-setup', async (req, res) => {
    try {
      const { ensureSuperAdmin } = await import('../utils/admin.util')
      await ensureSuperAdmin()
      res.json({
        success: true,
        message: 'Super admin setup completed',
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Setup failed',
      })
    }
  })
}

// All other routes require authentication and admin role
router.use(authenticate)
router.use(requireAdmin)

// User management
router.get('/users', adminController.getAllUsers)
router.get('/users/:userId', adminController.getUserById)
router.patch('/users/:userId/role', adminController.updateUserRole)
router.patch('/users/:userId/status', adminController.toggleUserStatus)
router.post('/users/:userId/reset-password', adminController.resetUserPassword)

// System statistics
router.get('/stats', adminController.getSystemStats)

// Recent activity
router.get('/activity', adminController.getRecentActivity)

export default router
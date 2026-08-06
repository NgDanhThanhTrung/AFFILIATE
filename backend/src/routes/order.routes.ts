import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware'
import * as orderController from '../controllers/order.controller'

const router = Router()

// All routes require authentication
router.use(authenticate)

// Create order (manual entry)
router.post('/', orderController.createOrder)

// Get user's orders
router.get('/', orderController.getUserOrders)

// Get order statistics
router.get('/stats/summary', orderController.getOrderStats)

// Reconcile orders (admin function)
router.post('/reconcile', orderController.reconcileOrders)

// Get order by ID (must be last)
router.get('/:orderId', orderController.getOrderById)

// Update order status (admin function in production)
router.patch('/:orderId/status', orderController.updateOrderStatus)

export default router
import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware'
import { validate } from '../middleware/validation.middleware'
import { getTransactionHistorySchema } from '../validators/wallet.validator'
import * as transactionController from '../controllers/transaction.controller'

const router = Router()

// All routes require authentication
router.use(authenticate)

// Get transaction history
router.get('/history', validate(getTransactionHistorySchema), transactionController.getTransactionHistory)

// Get transaction statistics
router.get('/stats/summary', transactionController.getTransactionStats)

// Get recent transactions
router.get('/recent/list', transactionController.getRecentTransactions)

// Get transaction by ID (must be last)
router.get('/:transactionId', transactionController.getTransactionById)

export default router
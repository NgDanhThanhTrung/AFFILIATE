import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware'
import { validate } from '../middleware/validation.middleware'
import {
  createBankAccountSchema,
  updateBankAccountSchema,
  createWithdrawalSchema,
  getWithdrawalHistorySchema,
} from '../validators/wallet.validator'
import * as withdrawalController from '../controllers/withdrawal.controller'

const router = Router()

// All routes require authentication
router.use(authenticate)

// Bank account routes
router.post('/bank-accounts', validate(createBankAccountSchema), withdrawalController.createBankAccount)
router.get('/bank-accounts', withdrawalController.getBankAccounts)
router.get('/bank-accounts/:accountId', withdrawalController.getBankAccountById)
router.patch('/bank-accounts/:accountId', validate(updateBankAccountSchema), withdrawalController.updateBankAccount)
router.delete('/bank-accounts/:accountId', withdrawalController.deleteBankAccount)

// Withdrawal request routes
router.post('/requests', validate(createWithdrawalSchema), withdrawalController.createWithdrawalRequest)
router.get('/requests', validate(getWithdrawalHistorySchema), withdrawalController.getWithdrawalRequests)
router.delete('/requests/:withdrawalId', withdrawalController.cancelWithdrawalRequest)

// Withdrawal statistics
router.get('/stats', withdrawalController.getWithdrawalStats)

export default router
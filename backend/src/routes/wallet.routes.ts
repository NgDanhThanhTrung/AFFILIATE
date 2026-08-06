import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware'
import * as walletController from '../controllers/wallet.controller'

const router = Router()

// All routes require authentication
router.use(authenticate)

// Get wallet details
router.get('/', walletController.getWallet)

// Get balance only
router.get('/balance', walletController.getBalance)

// Get wallet statistics
router.get('/stats', walletController.getWalletStats)

export default router
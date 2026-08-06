import { Router } from 'express'
import userController from '../controllers/user.controller'
import { authenticate } from '../middleware/auth.middleware'
import { validate } from '../middleware/validation.middleware'
import { updateProfileSchema, bankAccountSchema, updateBankAccountSchema } from '../validators/user.validator'

const router = Router()

// All user routes require authentication
router.use(authenticate)

// Profile routes
router.get('/profile', userController.getProfile)
router.put('/profile', validate(updateProfileSchema), userController.updateProfile)

// Bank account routes
router.get('/bank-accounts', userController.getBankAccounts)
router.post('/bank-accounts', validate(bankAccountSchema), userController.addBankAccount)
router.put('/bank-accounts/:id', validate(updateBankAccountSchema), userController.updateBankAccount)
router.delete('/bank-accounts/:id', userController.deleteBankAccount)
router.put('/bank-accounts/:id/default', userController.setDefaultBankAccount)

export default router

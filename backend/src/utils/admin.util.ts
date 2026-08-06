import { UserRole } from '@prisma/client'
import prisma from '../config/database'

/**
 * Create or update super admin based on environment variable
 */
export async function ensureSuperAdmin() {
  const superAdminPhone = process.env.SUPER_ADMIN_PHONE_NUMBER

  if (!superAdminPhone) {
    console.log('SUPER_ADMIN_PHONE_NUMBER not set, skipping super admin creation')
    return
  }

  const existingUser = await prisma.user.findUnique({
    where: { phoneNumber: superAdminPhone },
  })

  if (existingUser) {
    // Update role to SUPER_ADMIN if not already
    if (existingUser.role !== 'SUPER_ADMIN') {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { role: 'SUPER_ADMIN' },
      })
      console.log(`Updated user ${superAdminPhone} to SUPER_ADMIN`)
    } else {
      console.log(`User ${superAdminPhone} is already SUPER_ADMIN`)
    }
  } else {
    // Create new super admin with default password
    const bcrypt = require('bcryptjs')
    const isProduction = process.env.NODE_ENV === 'production'
    const defaultPassword = process.env.SUPER_ADMIN_DEFAULT_PASSWORD || (isProduction ? undefined : 'admin123456')
    
    if (!defaultPassword) {
      throw new Error('SUPER_ADMIN_DEFAULT_PASSWORD must be set in environment variables for production')
    }
    
    const passwordHash = await bcrypt.hash(defaultPassword, 10)

    const user = await prisma.user.create({
      data: {
        phoneNumber: superAdminPhone,
        passwordHash,
        name: 'Super Admin',
        role: 'SUPER_ADMIN',
        isPhoneVerified: true,
        isActive: true,
      },
    })

    // Create wallet for super admin
    await prisma.wallet.create({
      data: {
        userId: user.id,
        balance: 0,
        totalEarned: 0,
        totalWithdrawn: 0,
        currency: 'VND',
      },
    })

    console.log(`Created SUPER_ADMIN user: ${superAdminPhone}`)
    console.log(`Default password: ${defaultPassword}`)
    console.log('Please change the default password after first login!')
  }
}

/**
 * Promote user to admin by phone number
 */
export async function promoteToAdmin(phoneNumber: string) {
  const user = await prisma.user.findUnique({
    where: { phoneNumber },
  })

  if (!user) {
    throw new Error('User not found')
  }

  if (user.role === 'SUPER_ADMIN') {
    throw new Error('Cannot change SUPER_ADMIN role')
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { role: 'ADMIN' },
  })

  console.log(`Promoted user ${phoneNumber} to ADMIN`)
}

/**
 * Demote admin to user
 */
export async function demoteToUser(phoneNumber: string) {
  const user = await prisma.user.findUnique({
    where: { phoneNumber },
  })

  if (!user) {
    throw new Error('User not found')
  }

  if (user.role === 'SUPER_ADMIN') {
    throw new Error('Cannot change SUPER_ADMIN role')
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { role: 'USER' },
  })

  console.log(`Demoted user ${phoneNumber} to USER`)
}
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import config from '../config'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create a test user
  const hashedPassword = await bcrypt.hash('password123', 10)
  const hashedPin = await bcrypt.hash('123456', 10)

  const user = await prisma.user.upsert({
    where: { phoneNumber: '0123456789' },
    update: {},
    create: {
      phoneNumber: '0123456789',
      passwordHash: hashedPassword,
      pinHash: hashedPin,
      name: 'Test User',
      email: 'test@example.com',
      role: 'USER',
      isPhoneVerified: true,
    },
  })

  console.log('✅ Created test user:', user.phoneNumber)

  // Create wallet for user
  const wallet = await prisma.wallet.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      balance: 100000, // 100,000 VND
      totalEarned: 100000,
      totalWithdrawn: 0,
      currency: 'VND',
    },
  })

  console.log('✅ Created wallet for user')

  // Create a bank account
  const bankAccount = await prisma.bankAccount.create({
    data: {
      userId: user.id,
      bankName: 'Vietcombank',
      bankCode: 'VCB',
      accountNumber: '1234567890',
      accountName: 'TEST USER',
      isDefault: true,
    },
  })

  console.log('✅ Created bank account')

  // Create some system config
  await prisma.systemConfig.createMany({
    data: [
      {
        key: 'SHOPEE_COMMISSION_RATE',
        value: config.affiliate.shopeeCommissionRate.toString(),
        description: 'Shopee commission rate percentage',
      },
      {
        key: 'TIKTOK_COMMISSION_RATE',
        value: config.affiliate.tiktokCommissionRate.toString(),
        description: 'TikTok commission rate percentage',
      },
      {
        key: 'MIN_WITHDRAWAL_AMOUNT',
        value: config.withdrawal.minAmount.toString(),
        description: 'Minimum withdrawal amount in VND',
      },
      {
        key: 'WITHDRAWAL_FEE_PERCENT',
        value: config.withdrawal.feePercent.toString(),
        description: 'Withdrawal fee percentage',
      },
    ],
  })

  console.log('✅ Created system configs')

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

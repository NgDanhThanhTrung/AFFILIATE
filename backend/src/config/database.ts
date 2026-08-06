import { PrismaClient } from '@prisma/client'
import { logger } from './logger'
import config from './'

const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'stdout' },
    { level: 'warn', emit: 'stdout' },
  ],
})

// Log queries in development
if (config.api.nodeEnv === 'development') {
  prisma.$on('query', (e) => {
    logger.debug(`Query: ${e.query}`)
    logger.debug(`Duration: ${e.duration}ms`)
  })
}

export async function connectDatabase() {
  try {
    await prisma.$connect()
    logger.info('Database connected successfully')
  } catch (error) {
    logger.error('Failed to connect to database:', error)
    throw error
  }
}

export async function disconnectDatabase() {
  await prisma.$disconnect()
  logger.info('Database disconnected')
}

export default prisma

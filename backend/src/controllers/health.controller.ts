import { Request, Response } from 'express'
import prisma from '../config/database'

export const healthCheck = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`

    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: 'connected',
        api: 'running',
      },
    })
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed',
    })
  }
}

export const readinessCheck = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if application is ready to receive traffic
    await prisma.$queryRaw`SELECT 1`

    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      timestamp: new Date().toISOString(),
      error: 'Database not ready',
    })
  }
}
import { Request, Response, NextFunction } from 'express'
import { logger } from '../config/logger'

export class AppError extends Error {
  statusCode: number
  isOperational: boolean

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    logger.error(`Operational Error: ${err.message}`, {
      statusCode: err.statusCode,
      path: req.path,
    })

    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    })
  }

  // Programming or unknown errors
  logger.error(`Unexpected Error: ${err.message}`, {
    stack: err.stack,
    path: req.path,
  })

  return res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
  })
}

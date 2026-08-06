import { Request, Response, NextFunction } from 'express'
import { ZodError, ZodSchema } from 'zod'
import { AppError } from './errorHandler.middleware'

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate request body
      await schema.parseAsync(req.body)

      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.errors.map((err) => err.message).join(', ')
        throw new AppError(errorMessage, 400)
      }

      next(error)
    }
  }
}

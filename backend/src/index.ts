import dotenv from 'dotenv'
import app from './app'
import { logger } from './config/logger'
import { connectDatabase } from './config/database'
import config from './config'

dotenv.config()

const PORT = config.api.port

async function startServer() {
  try {
    // Connect to database
    await connectDatabase()
    logger.info('Database connected successfully')

    // Start server
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`)
      logger.info(`Environment: ${config.api.nodeEnv}`)
      logger.info(`API URL: ${config.api.baseUrl}`)
    })
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

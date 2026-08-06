import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const BACKUP_DIR = path.join(__dirname, '../../backups')
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
const BACKUP_FILE = path.join(BACKUP_DIR, `affiliate-backup-${TIMESTAMP}.sql`)

/**
 * Create database backup using pg_dump
 */
async function backupDatabase() {
  console.log('🗄️ Starting database backup...')

  // Create backups directory if it doesn't exist
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true })
    console.log('✅ Created backups directory')
  }

  // Get database URL from environment
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  // Parse database URL
  const url = new URL(databaseUrl)
  const dbUser = url.username
  const dbHost = url.hostname
  const dbName = url.pathname.slice(1)
  const dbPort = url.port || '5432'

  const pgPassword = url.password

  // Use PGPASSWORD to avoid password prompt
  process.env.PGPASSWORD = pgPassword

  try {
    // Run pg_dump
    const command = `pg_dump -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} -f "${BACKUP_FILE}" --clean`
    console.log(`Executing: ${command}`)

    execSync(command, { stdio: 'inherit' })

    console.log(`✅ Backup created: ${BACKUP_FILE}`)

    // Compress the backup file
    const gzipCommand = `gzip "${BACKUP_FILE}"`
    execSync(gzipCommand, { stdio: 'inherit' })

    const compressedFile = `${BACKUP_FILE}.gz`
    console.log(`✅ Backup compressed: ${compressedFile}`)

    // Clean up old backups (keep last 7 days)
    const files = fs.readdirSync(BACKUP_DIR)
    const now = Date.now()
    const sevenDays = 7 * 24 * 60 * 60 * 1000

    files.forEach((file) => {
      const filePath = path.join(BACKUP_DIR, file)
      const stats = fs.statSync(filePath)
      const fileAge = now - stats.mtimeMs

      if (fileAge > sevenDays) {
        fs.unlinkSync(filePath)
        console.log(`🗑️  Deleted old backup: ${file}`)
      }
    })

    console.log('🎉 Backup completed successfully!')
  } catch (error) {
    console.error('❌ Backup failed:', error)
    throw error
  } finally {
    // Clean up environment variable
    delete process.env.PGPASSWORD
  }
}

/**
 * Restore database from backup
 */
async function restoreDatabase(backupFile: string) {
  console.log('🔄 Starting database restore...')

  if (!fs.existsSync(backupFile)) {
    throw new Error(`Backup file not found: ${backupFile}`)
  }

  // Get database URL from environment
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  // Parse database URL
  const url = new URL(databaseUrl)
  const dbUser = url.username
  const dbHost = url.hostname
  const dbName = url.pathname.slice(1)
  const dbPort = url.port || '5432'

  const pgPassword = url.password

  // Use PGPASSWORD to avoid password prompt
  process.env.PGPASSWORD = pgPassword

  try {
    // Decompress if needed
    let sqlFile = backupFile
    if (backupFile.endsWith('.gz')) {
      console.log('📦 Decompressing backup file...')
      const decompressCommand = `gunzip -k "${backupFile}"`
      execSync(decompressCommand, { stdio: 'inherit' })
      sqlFile = backupFile.slice(0, -3)
      console.log(`✅ Decompressed to: ${sqlFile}`)
    }

    // Drop existing database
    console.log('🗑️  Dropping existing database...')
    const dropCommand = `psql -h ${dbHost} -p ${dbPort} -U ${dbUser} -c "DROP DATABASE IF EXISTS ${dbName}"`
    execSync(dropCommand, { stdio: 'inherit' })

    // Create new database
    console.log('🆕 Creating new database...')
    const createCommand = `psql -h ${dbHost} -p ${dbPort} -U ${dbUser} -c "CREATE DATABASE ${dbName}"`
    execSync(createCommand, { stdio: 'inherit' })

    // Restore from backup
    console.log('📥 Restoring database from backup...')
    const restoreCommand = `psql -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} -f "${sqlFile}"`
    execSync(restoreCommand, { stdio: 'inherit' })

    console.log('✅ Database restored successfully!')
    console.log('🎉 Restore completed successfully!')

    // Clean up decompressed file
    if (backupFile.endsWith('.gz')) {
      fs.unlinkSync(sqlFile)
      console.log(`🗑️  Cleaned up temporary file: ${sqlFile}`)
    }
  } catch (error) {
    console.error('❌ Restore failed:', error)
    throw error
  } finally {
    // Clean up environment variable
    delete process.env.PGPASSWORD
  }
}

// Command line interface
const args = process.argv.slice(2)
const command = args[0]

if (command === 'backup') {
  backupDatabase()
} else if (command === 'restore' && args[1]) {
  restoreDatabase(args[1])
} else {
  console.log('Usage:')
  console.log('  npm run db:backup   - Create database backup')
  console.log('  npm run db:restore <file> - Restore database from backup file')
  process.exit(1)
}
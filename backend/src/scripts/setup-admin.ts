import { ensureSuperAdmin } from '../utils/admin.util'

/**
 * Setup script to create/update super admin based on environment variable
 * Run this after database setup: npx ts-node src/scripts/setup-admin.ts
 */
async function setupAdmin() {
  try {
    console.log('Setting up super admin...')
    await ensureSuperAdmin()
    console.log('Super admin setup completed!')
    process.exit(0)
  } catch (error) {
    console.error('Error setting up super admin:', error)
    process.exit(1)
  }
}

setupAdmin()
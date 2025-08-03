/**
 * Import songs from the main spotify-song-recommender project database
 * Run this script to populate the web app with real song data
 */

import { PrismaClient } from '@prisma/client'
import path from 'path'
import fs from 'fs'

const prisma = new PrismaClient()

// Path to your main project's database
const MAIN_PROJECT_DB_PATH = '../spotify-song-recommender/data/playlist_ai.db'

interface MainProjectTrack {
  id: string
  spotify_id: string
  name: string
  artist: string
  album?: string
  duration_ms?: number
  popularity?: number
  preview_url?: string
}

async function importFromMainProject() {
  console.log('🔄 Importing songs from main project database...')

  // Check if main project database exists
  const dbPath = path.resolve(__dirname, MAIN_PROJECT_DB_PATH)
  if (!fs.existsSync(dbPath)) {
    console.log('❌ Main project database not found at:', dbPath)
    console.log('💡 Make sure your main project is in the parent directory')
    console.log('💡 Or update MAIN_PROJECT_DB_PATH in this script')
    return
  }

  try {
    // You would need to connect to the SQLite database here
    // For now, we'll show how to structure the import
    
    console.log('📊 This is a template for importing from your main project')
    console.log('🔧 To complete the import:')
    console.log('   1. Install sqlite3: npm install sqlite3')
    console.log('   2. Connect to main database')
    console.log('   3. Query tracks table')
    console.log('   4. Transform and insert into web app database')
    
    console.log('\n💡 Example query for your main database:')
    console.log('   SELECT id, spotify_id, name, artist, album, duration_ms, popularity')
    console.log('   FROM tracks')
    console.log('   WHERE spotify_id IS NOT NULL')
    console.log('   LIMIT 100;')

    console.log('\n🎯 For now, use the seed script with sample data:')
    console.log('   npm run db:seed')

  } catch (error) {
    console.error('❌ Error importing songs:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the import
importFromMainProject()
  .catch((error) => {
    console.error('❌ Import script failed:', error)
    process.exit(1)
  })

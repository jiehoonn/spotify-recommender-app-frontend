#!/usr/bin/env node
/**
 * Sync script to connect frontend ratings with main ML project
 * 
 * This script:
 * 1. Exports ratings from frontend database
 * 2. Appends them to main project's human_ratings.json
 * 3. Optionally clears synced ratings from frontend
 */

import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

// Configuration
const MAIN_PROJECT_PATH = '../spotify-song-recommender'
const HUMAN_RATINGS_FILE = path.join(MAIN_PROJECT_PATH, 'data/human_ratings.json')

interface MainProjectRating {
  id: string
  track1_spotify_id: string
  track1_name: string
  track1_artist: string
  track2_spotify_id: string
  track2_name: string
  track2_artist: string
  human_rating: number
  rating_scale: string
  source: string
  session_id?: string
  created_at: string
  ip_address?: string
  user_agent?: string
}

async function syncRatingsToMainProject() {
  console.log('🔄 Starting sync to main project...')

  try {
    // 1. Get all ratings from frontend database
    const frontendRatings = await prisma.rating.findMany({
      include: {
        track1: true,
        track2: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    if (frontendRatings.length === 0) {
      console.log('ℹ️  No ratings to sync')
      return
    }

    console.log(`📊 Found ${frontendRatings.length} ratings to sync`)

    // 2. Transform to main project format
    const mainProjectRatings: MainProjectRating[] = frontendRatings.map((rating) => ({
      id: rating.id,
      track1_spotify_id: rating.track1.spotifyId,
      track1_name: rating.track1.name,
      track1_artist: rating.track1.artist,
      track2_spotify_id: rating.track2.spotifyId,
      track2_name: rating.track2.name,
      track2_artist: rating.track2.artist,
      human_rating: rating.rating,
      rating_scale: '1-10',
      source: 'public_web_interface',
      session_id: rating.sessionId || undefined,
      created_at: rating.createdAt.toISOString(),
      ip_address: rating.ipAddress || undefined,
      user_agent: rating.userAgent || undefined,
    }))

    // 3. Read existing ratings from main project
    let existingRatings: MainProjectRating[] = []
    if (fs.existsSync(HUMAN_RATINGS_FILE)) {
      const fileContent = fs.readFileSync(HUMAN_RATINGS_FILE, 'utf8')
      try {
        existingRatings = JSON.parse(fileContent)
        console.log(`📁 Found ${existingRatings.length} existing ratings in main project`)
      } catch {
        console.log('⚠️  Could not parse existing ratings file, starting fresh')
        existingRatings = []
      }
    } else {
      console.log('📁 Creating new human_ratings.json file')
      // Create the data directory if it doesn't exist
      const dataDir = path.dirname(HUMAN_RATINGS_FILE)
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true })
      }
    }

    // 4. Filter out duplicates (by ID)
    const existingIds = new Set(existingRatings.map(r => r.id))
    const newRatings = mainProjectRatings.filter(r => !existingIds.has(r.id))

    if (newRatings.length === 0) {
      console.log('ℹ️  No new ratings to sync (all already exist)')
      return
    }

    console.log(`✨ Adding ${newRatings.length} new ratings to main project`)

    // 5. Append new ratings
    const allRatings = [...existingRatings, ...newRatings]

    // 6. Write back to main project
    fs.writeFileSync(HUMAN_RATINGS_FILE, JSON.stringify(allRatings, null, 2))

    console.log(`✅ Successfully synced ${newRatings.length} ratings to main project`)
    console.log(`📊 Total ratings in main project: ${allRatings.length}`)

    // 7. Optionally mark as synced (you could add a 'synced' field to your schema)
    // For now, we'll just log success

    // 8. Create summary
    const ratingDistribution: Record<number, number> = {}
    const summary = {
      sync_timestamp: new Date().toISOString(),
      frontend_ratings_count: frontendRatings.length,
      new_ratings_synced: newRatings.length,
      total_ratings_in_main: allRatings.length,
      rating_distribution: ratingDistribution,
    }

    // Calculate rating distribution
    for (let i = 1; i <= 10; i++) {
      summary.rating_distribution[i] = allRatings.filter(r => r.human_rating === i).length
    }

    console.log('\n📈 Sync Summary:')
    console.log(JSON.stringify(summary, null, 2))

    // Save sync log
    const syncLogFile = path.join(MAIN_PROJECT_PATH, 'data/sync_log.json')
    let syncLogs = []
    if (fs.existsSync(syncLogFile)) {
      syncLogs = JSON.parse(fs.readFileSync(syncLogFile, 'utf8'))
    }
    syncLogs.push(summary)
    fs.writeFileSync(syncLogFile, JSON.stringify(syncLogs, null, 2))

  } catch (error) {
    console.error('❌ Sync failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Command line usage
if (require.main === module) {
  syncRatingsToMainProject()
    .then(() => {
      console.log('\n🎉 Sync completed successfully!')
      console.log('💡 You can now use the updated human_ratings.json in your ML model training')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n💥 Sync failed:', error)
      process.exit(1)
    })
}

export { syncRatingsToMainProject }

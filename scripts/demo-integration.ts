#!/usr/bin/env node
/**
 * Demo script showing complete integration workflow
 * 
 * This demonstrates:
 * 1. How to collect ratings in the frontend
 * 2. How to sync them to the main project
 * 3. How they can be used for model training
 */

import { PrismaClient } from '@prisma/client'
import { syncRatingsToMainProject } from './sync-to-main'

const prisma = new PrismaClient()

async function createDemoRatings() {
  console.log('🎭 Creating demo ratings for integration test...')

  // Get some sample songs
  const songs = await prisma.song.findMany({ take: 4 })
  
  if (songs.length < 2) {
    console.log('❌ Need at least 2 songs in database. Run: npm run db:seed')
    return false
  }

  // Create demo ratings
  const demoRatings = [
    {
      track1Id: songs[0].id,
      track2Id: songs[1].id,
      rating: 8,
      sessionId: 'demo_session_1',
      userAgent: 'Demo Browser 1.0',
      ipAddress: '127.0.0.1',
    },
    {
      track1Id: songs[2] ? songs[2].id : songs[0].id,
      track2Id: songs[3] ? songs[3].id : songs[1].id,
      rating: 3,
      sessionId: 'demo_session_2', 
      userAgent: 'Demo Browser 1.0',
      ipAddress: '127.0.0.1',
    },
  ]

  for (const rating of demoRatings) {
    try {
      await prisma.rating.create({ data: rating })
      console.log(`✅ Created demo rating: ${rating.rating}/10`)
    } catch {
      console.log(`⚠️  Demo rating already exists, skipping...`)
    }
  }

  return true
}

async function demonstrateIntegration() {
  console.log('🎯 Starting Integration Demonstration')
  console.log('='.repeat(50))

  try {
    // Step 1: Create demo data
    console.log('\n📝 Step 1: Creating demo ratings...')
    const success = await createDemoRatings()
    
    if (!success) {
      return
    }

    // Step 2: Show current state
    console.log('\n📊 Step 2: Current state...')
    const ratingCount = await prisma.rating.count()
    console.log(`Frontend database has ${ratingCount} ratings`)

    // Step 3: Sync to main project
    console.log('\n🔄 Step 3: Syncing to main project...')
    await syncRatingsToMainProject()

    // Step 4: Show integration complete
    console.log('\n🎉 Integration Demo Complete!')
    console.log('')
    console.log('✅ What happened:')
    console.log('   1. Demo ratings created in frontend database')
    console.log('   2. Ratings exported to main project format')
    console.log('   3. Data ready for ML model training')
    console.log('')
    console.log('🚀 Next steps:')
    console.log('   1. Deploy frontend to collect real user ratings')
    console.log('   2. Set up periodic sync (cron job, GitHub Actions)')
    console.log('   3. Use ratings to retrain your ML model')
    console.log('')
    console.log('📁 Check these files:')
    console.log('   - ../spotify-song-recommender/data/human_ratings.json')
    console.log('   - ../spotify-song-recommender/data/sync_log.json')

  } catch (error) {
    console.error('❌ Demo failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run demo
if (require.main === module) {
  demonstrateIntegration()
}

export { demonstrateIntegration }

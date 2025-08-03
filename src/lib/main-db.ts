/**
 * Connect to the main project's SQLite database
 * This allows direct access to songs and storage of ratings
 */

import Database from 'better-sqlite3'
import path from 'path'

// Path to your main project's database
const MAIN_DB_PATH = '../spotify-song-recommender/data/playlist_ai.db'

interface MainProjectTrack {
  id: string
  spotify_id: string
  name: string
  artist: string
  album?: string
  popularity?: number
  duration_ms?: number
}

class MainProjectDatabase {
  private db: Database.Database

  constructor() {
    const dbPath = path.resolve(__dirname, MAIN_DB_PATH)
    this.db = new Database(dbPath)
    console.log('📊 Connected to main project database:', dbPath)
  }

  // Fetch random songs from main database
  getRandomSongs(count: number = 2): MainProjectTrack[] {
    const query = `
      SELECT id, spotify_id, name, artist, album, popularity, duration_ms
      FROM tracks 
      WHERE spotify_id IS NOT NULL 
      ORDER BY RANDOM() 
      LIMIT ?
    `
    return this.db.prepare(query).all(count) as MainProjectTrack[]
  }

  // Store rating directly in main project format
  storeRating(rating: {
    track1_spotify_id: string
    track1_name: string
    track1_artist: string
    track2_spotify_id: string
    track2_name: string
    track2_artist: string
    human_rating: number
    session_id?: string
  }) {
    // Store in format compatible with human_ratings.json
    const ratingData = {
      id: `web_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...rating,
      rating_scale: '1-10',
      source: 'public_web_interface',
      created_at: new Date().toISOString(),
    }

    // You could store in a ratings table or append to JSON file
    console.log('💾 Storing rating:', ratingData)
    return ratingData
  }

  close() {
    this.db.close()
  }
}

export { MainProjectDatabase }

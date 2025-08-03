/**
 * Integration Guide: Connecting Frontend to ML Model Repository
 * 
 * This file demonstrates 3 different approaches to connect your frontend
 * to the main spotify-song-recommender ML model repository.
 */

// APPROACH 1: SHARED DATABASE (RECOMMENDED FOR DEVELOPMENT)
// ========================================================

/**
 * Update your environment to point to the main project database:
 * 
 * .env.local:
 * DATABASE_URL="file:../spotify-song-recommender/data/playlist_ai.db"
 * 
 * This makes both projects use the same SQLite database.
 */

// APPROACH 2: API INTEGRATION (RECOMMENDED FOR PRODUCTION)
// ========================================================

/**
 * Create an API endpoint in your main project to serve data:
 * 
 * In spotify-song-recommender, create: src/api_server.py
 */

const MAIN_PROJECT_API_INTEGRATION = `
# In your main project: src/api_server.py
from fastapi import FastAPI, HTTPException
from src.database import Database
import json
import random

app = FastAPI()
db = Database()

@app.get("/api/songs/random")
async def get_random_songs():
    """Get two random songs for rating"""
    tracks = db.get_all_tracks()
    if len(tracks) < 2:
        raise HTTPException(status_code=400, detail="Not enough songs")
    
    selected = random.sample(tracks, 2)
    return {
        "song1": {
            "id": selected[0].id,
            "spotifyId": selected[0].spotify_id,
            "name": selected[0].name,
            "artist": selected[0].artist,
            "album": selected[0].album,
        },
        "song2": {
            "id": selected[1].id,
            "spotifyId": selected[1].spotify_id,
            "name": selected[1].name,
            "artist": selected[1].artist,
            "album": selected[1].album,
        }
    }

@app.post("/api/ratings")
async def store_rating(rating_data: dict):
    """Store human rating for model training"""
    # Store in human_ratings.json or database
    rating = {
        "id": f"web_{datetime.now().isoformat()}",
        "track1_spotify_id": rating_data["track1Id"],
        "track2_spotify_id": rating_data["track2Id"], 
        "human_rating": rating_data["rating"],
        "source": "public_web_interface",
        "created_at": datetime.now().isoformat()
    }
    
    # Append to human_ratings.json
    try:
        with open("data/human_ratings.json", "r") as f:
            ratings = json.load(f)
    except FileNotFoundError:
        ratings = []
    
    ratings.append(rating)
    
    with open("data/human_ratings.json", "w") as f:
        json.dump(ratings, f, indent=2)
    
    return {"success": True, "rating_id": rating["id"]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
`

// APPROACH 3: FILE-BASED SYNC (SIMPLE DEPLOYMENT)
// ===============================================

/**
 * Create a sync script that periodically copies data between projects:
 */

export interface SyncConfig {
  mainProjectPath: string
  frontendProjectPath: string
  syncInterval: number // minutes
}

export class ProjectSync {
  constructor(private config: SyncConfig) {}

  async syncSongsToFrontend() {
    // 1. Read songs from main project database
    // 2. Insert into frontend database
    // 3. Handle duplicates gracefully
    console.log('🔄 Syncing songs from main to frontend...')
  }

  async syncRatingsToMain() {
    // 1. Read ratings from frontend database
    // 2. Append to main project's human_ratings.json
    // 3. Clear synced ratings from frontend
    console.log('📤 Syncing ratings from frontend to main...')
  }

  startAutoSync() {
    setInterval(() => {
      this.syncSongsToFrontend()
      this.syncRatingsToMain()
    }, this.config.syncInterval * 60 * 1000)
  }
}

// IMPLEMENTATION RECOMMENDATIONS
// =============================

export const integrationRecommendations = {
  development: {
    approach: "Shared Database",
    setup: [
      "1. Update frontend DATABASE_URL to point to main project DB",
      "2. Modify Prisma schema to match main project schema", 
      "3. Use direct database queries for songs",
      "4. Store ratings in same database or append to JSON file"
    ],
    pros: ["Simple setup", "Real-time data", "No API complexity"],
    cons: ["Tight coupling", "File system dependencies"]
  },
  
  production: {
    approach: "API Integration", 
    setup: [
      "1. Create FastAPI server in main project",
      "2. Deploy main project API (Railway, Render, etc.)",
      "3. Update frontend to call main project API",
      "4. Handle API failures gracefully with fallbacks"
    ],
    pros: ["Loose coupling", "Scalable", "Independent deployments"],
    cons: ["More complex", "Network latency", "API maintenance"]
  },
  
  hybrid: {
    approach: "Shared Database + Periodic Sync",
    setup: [
      "1. Use shared DB for development",
      "2. Create sync scripts for production",
      "3. Deploy with file-based data exchange",
      "4. Schedule periodic synchronization"
    ],
    pros: ["Best of both worlds", "Deployment flexibility"],
    cons: ["Complex deployment", "Sync timing issues"]
  }
}

export default integrationRecommendations

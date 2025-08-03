# 🔗 Database Integration Guide

This guide explains how to connect your song rating frontend with the main ML model repository for seamless data flow.

## 🎯 Integration Goals

1. **Song Source**: Get songs from main project's database
2. **Rating Storage**: Store public ratings in main project format
3. **Model Training**: Feed ratings back to improve ML model
4. **Data Sync**: Keep both projects synchronized

## 🚀 Quick Setup (Recommended)

### Option 1: Shared Database (Development)

**Use the same SQLite database for both projects:**

```bash
# 1. Update environment to point to main project
echo 'DATABASE_URL="file:../spotify-song-recommender/data/playlist_ai.db"' > .env.local

# 2. Update Prisma to use main database
npx prisma db pull
npx prisma generate

# 3. Test connection
npm run dev
```

**Pros**: Simple, real-time data, no API complexity  
**Cons**: Tight coupling, requires file system access

### Option 2: Sync Scripts (Production)

**Use separate databases with periodic synchronization:**

```bash
# 1. Collect ratings in frontend database
npm run dev  # Users submit ratings

# 2. Sync ratings to main project
npm run sync:to-main

# 3. Check main project's human_ratings.json
cat ../spotify-song-recommender/data/human_ratings.json
```

**Pros**: Loose coupling, deployment flexibility  
**Cons**: Not real-time, requires periodic sync

## 📋 Step-by-Step Implementation

### Step 1: Choose Your Integration Strategy

```bash
# For development (shared database)
npm run setup:shared-db

# For production (sync-based)
npm run setup:sync-mode
```

### Step 2: Configure Song Source

**Option A: Direct Database Access**

```typescript
// Update src/app/api/songs/random/route.ts
import { MainProjectDatabase } from "@/lib/main-db";

const mainDb = new MainProjectDatabase();
const songs = mainDb.getRandomSongs(2);
```

**Option B: API Integration**

```typescript
// Call main project API
const response = await fetch("http://localhost:8001/api/songs/random");
const songs = await response.json();
```

### Step 3: Set Up Rating Storage

**Option A: Direct Storage in Main Project**

```bash
# Ratings go directly to main project's human_ratings.json
DATABASE_URL="file:../spotify-song-recommender/data/playlist_ai.db"
```

**Option B: Sync-Based Storage**

```bash
# Ratings stored locally, then synced
npm run sync:to-main  # Run this periodically
```

### Step 4: Test the Integration

```bash
# 1. Start the frontend
npm run dev

# 2. Submit a test rating
# Visit http://localhost:3000 and rate a song pair

# 3. Verify data reaches main project
npm run sync:to-main
cat ../spotify-song-recommender/data/human_ratings.json
```

## 🔄 Data Flow Diagrams

### Shared Database Flow

```
User Rating → Frontend API → Main Project DB ← ML Model Training
```

### Sync-Based Flow

```
User Rating → Frontend DB → Sync Script → Main Project JSON → ML Model Training
```

## 🛠️ Available Scripts

| Script                    | Purpose                        | When to Use              |
| ------------------------- | ------------------------------ | ------------------------ |
| `npm run sync:to-main`    | Export ratings to main project | After collecting ratings |
| `npm run sync:from-main`  | Import songs from main project | To refresh song database |
| `npm run db:seed`         | Add sample songs for testing   | Development setup        |
| `npm run setup:shared-db` | Configure shared database      | Development mode         |

## 📊 Monitoring Integration

### Check Sync Status

```bash
# View sync logs
cat ../spotify-song-recommender/data/sync_log.json

# Check rating counts
npm run sync:to-main --dry-run
```

### Verify Data Quality

```bash
# Count ratings in each project
echo "Frontend:" && npx prisma client query rating.count
echo "Main project:" && wc -l ../spotify-song-recommender/data/human_ratings.json
```

## 🚨 Troubleshooting

### Common Issues

**Database not found**

```bash
# Check main project path
ls -la ../spotify-song-recommender/data/playlist_ai.db

# Update path in scripts if needed
```

**Sync conflicts**

```bash
# Reset and re-sync
npm run db:reset
npm run sync:from-main
```

**Schema mismatches**

```bash
# Update Prisma schema to match main project
npx prisma db pull --schema=../spotify-song-recommender/prisma/schema.prisma
```

## 🎯 Production Deployment

### Environment Variables

```bash
# Vercel deployment
DATABASE_URL="postgresql://..."  # Use PostgreSQL for production
MAIN_PROJECT_API_URL="https://your-ml-api.railway.app"
SYNC_WEBHOOK_URL="https://your-sync-service.com/sync"
```

### Automated Sync

```bash
# Set up GitHub Actions for periodic sync
# See .github/workflows/sync-data.yml
```

### API Mode (Recommended for Production)

```python
# Add to main project: src/api_server.py
from fastapi import FastAPI
app = FastAPI()

@app.get("/api/songs/random")
async def get_random_songs():
    # Return random songs from main database

@app.post("/api/ratings")
async def store_rating(rating_data: dict):
    # Store rating in human_ratings.json
```

## 💡 Best Practices

1. **Start Simple**: Use shared database for development
2. **Monitor Data**: Set up logging for all sync operations
3. **Backup Data**: Regular backups of human_ratings.json
4. **Test Integration**: Verify end-to-end flow regularly
5. **Handle Failures**: Graceful fallbacks when sync fails

## 🔮 Advanced Features

### Real-time Updates

```typescript
// WebSocket integration for live rating updates
import { io } from "socket.io-client";
const socket = io("http://localhost:8001");
socket.on("new_rating", (rating) => {
  // Update ML model in real-time
});
```

### Batch Processing

```bash
# Process ratings in batches
npm run sync:to-main --batch-size=100
```

### Data Validation

```typescript
// Validate ratings before sync
const validRatings = ratings.filter(
  (r) =>
    r.rating >= 1 &&
    r.rating <= 10 &&
    r.track1_spotify_id &&
    r.track2_spotify_id
);
```

---

🎉 **You're all set!** Your frontend now collects public ratings that directly improve your ML model.

For questions or issues, check the troubleshooting section or create an issue in the repository.

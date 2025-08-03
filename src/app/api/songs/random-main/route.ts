import { NextRequest, NextResponse } from 'next/server'
import { MainProjectDatabase } from '@/lib/main-db'

export async function GET(request: NextRequest) {
  let mainDb: MainProjectDatabase | null = null
  
  try {
    // Connect to main project database
    mainDb = new MainProjectDatabase()
    
    // Get two random songs from main database
    const songs = mainDb.getRandomSongs(2)
    
    if (songs.length < 2) {
      return NextResponse.json(
        { error: 'Not enough songs in main database' },
        { status: 400 }
      )
    }

    // Transform to frontend format
    const [song1Data, song2Data] = songs
    
    const response = {
      song1: {
        id: song1Data.id,
        spotifyId: song1Data.spotify_id,
        name: song1Data.name,
        artist: song1Data.artist,
        album: song1Data.album || undefined,
        popularity: song1Data.popularity || undefined,
        previewUrl: null, // Will be fetched from Spotify API if needed
      },
      song2: {
        id: song2Data.id,
        spotifyId: song2Data.spotify_id,
        name: song2Data.name,
        artist: song2Data.artist,
        album: song2Data.album || undefined,
        popularity: song2Data.popularity || undefined,
        previewUrl: null, // Will be fetched from Spotify API if needed
      },
    }

    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Error fetching songs from main database:', error)
    
    // Fallback to local database if main DB fails
    try {
      const fallbackResponse = await fetch(new URL('/api/songs/random-local', request.url))
      if (fallbackResponse.ok) {
        return fallbackResponse
      }
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError)
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch songs from both main and local databases' },
      { status: 500 }
    )
  } finally {
    if (mainDb) {
      mainDb.close()
    }
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get two random songs that haven't been rated together recently
    const songCount = await prisma.song.count()
    
    if (songCount < 2) {
      return NextResponse.json(
        { error: 'Not enough songs in database' },
        { status: 400 }
      )
    }

    // Get two random songs
    const skip1 = Math.floor(Math.random() * songCount)
    let skip2 = Math.floor(Math.random() * songCount)
    
    // Ensure different songs
    while (skip2 === skip1) {
      skip2 = Math.floor(Math.random() * songCount)
    }

    const [song1] = await prisma.song.findMany({
      take: 1,
      skip: skip1,
    })

    const [song2] = await prisma.song.findMany({
      take: 1,
      skip: skip2,
    })

    if (!song1 || !song2) {
      return NextResponse.json(
        { error: 'Could not find songs' },
        { status: 400 }
      )
    }

    // Check if this pair has been rated recently (optional optimization)
    const sessionId = request.headers.get('x-session-id')
    if (sessionId) {
      const existingRating = await prisma.rating.findFirst({
        where: {
          OR: [
            { track1Id: song1.id, track2Id: song2.id, sessionId },
            { track1Id: song2.id, track2Id: song1.id, sessionId },
          ],
        },
      })

      // If already rated by this session, try again (recursive with limit)
      if (existingRating) {
        const retryCount = parseInt(request.headers.get('x-retry-count') || '0')
        if (retryCount < 3) {
          const newRequest = new NextRequest(request.url, {
            headers: {
              ...Object.fromEntries(request.headers.entries()),
              'x-retry-count': (retryCount + 1).toString(),
            },
          })
          return GET(newRequest)
        }
      }
    }

    return NextResponse.json({
      song1: {
        id: song1.id,
        spotifyId: song1.spotifyId,
        name: song1.name,
        artist: song1.artist,
        album: song1.album,
        previewUrl: song1.previewUrl,
      },
      song2: {
        id: song2.id,
        spotifyId: song2.spotifyId,
        name: song2.name,
        artist: song2.artist,
        album: song2.album,
        previewUrl: song2.previewUrl,
      },
    })
  } catch (error) {
    console.error('Error fetching random songs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch songs' },
      { status: 500 }
    )
  }
}

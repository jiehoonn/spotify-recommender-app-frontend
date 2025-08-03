import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RatingRequest {
  track1Id: string
  track2Id: string
  rating: number
  sessionId?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: RatingRequest = await request.json()
    const { track1Id, track2Id, rating, sessionId } = body

    // Validate input
    if (!track1Id || !track2Id || typeof rating !== 'number') {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 10) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 10' },
        { status: 400 }
      )
    }

    if (track1Id === track2Id) {
      return NextResponse.json(
        { error: 'Cannot rate the same song with itself' },
        { status: 400 }
      )
    }

    // Get user info for tracking (optional)
    const userAgent = request.headers.get('user-agent') || undefined
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ipAddress = forwarded?.split(',')[0] || realIp || 'unknown'

    // Check if songs exist
    const [song1, song2] = await Promise.all([
      prisma.song.findUnique({ where: { id: track1Id } }),
      prisma.song.findUnique({ where: { id: track2Id } }),
    ])

    if (!song1 || !song2) {
      return NextResponse.json(
        { error: 'One or both songs not found' },
        { status: 404 }
      )
    }

    // Store the rating
    const newRating = await prisma.rating.create({
      data: {
        track1Id,
        track2Id,
        rating,
        sessionId,
        userAgent,
        ipAddress: ipAddress.substring(0, 50), // Limit length
      },
      include: {
        track1: true,
        track2: true,
      },
    })

    return NextResponse.json({
      success: true,
      rating: {
        id: newRating.id,
        rating: newRating.rating,
        createdAt: newRating.createdAt,
        track1: {
          name: newRating.track1.name,
          artist: newRating.track1.artist,
        },
        track2: {
          name: newRating.track2.name,
          artist: newRating.track2.artist,
        },
      },
    })
  } catch (error) {
    console.error('Error storing rating:', error)
    
    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'Rating already exists for this song pair' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to store rating' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get all ratings with song details
    const ratings = await prisma.rating.findMany({
      include: {
        track1: true,
        track2: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Transform to match your main project's human_ratings.json format
    const exportData = ratings.map((rating) => ({
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
      session_id: rating.sessionId || null,
      created_at: rating.createdAt.toISOString(),
      ip_address: rating.ipAddress,
      user_agent: rating.userAgent,
    }))

    // Get summary statistics
    const ratingDistribution: Record<number, number> = {}
    const stats = {
      total_ratings: ratings.length,
      unique_sessions: new Set(ratings.map(r => r.sessionId).filter(Boolean)).size,
      unique_song_pairs: new Set(ratings.map(r => `${r.track1Id}-${r.track2Id}`)).size,
      rating_distribution: ratingDistribution,
      created_at: new Date().toISOString(),
    }

    // Calculate rating distribution
    for (let i = 1; i <= 10; i++) {
      stats.rating_distribution[i] = ratings.filter(r => r.rating === i).length
    }

    return NextResponse.json({
      metadata: stats,
      ratings: exportData,
    })
  } catch (error) {
    console.error('Error exporting ratings:', error)
    return NextResponse.json(
      { error: 'Failed to export ratings' },
      { status: 500 }
    )
  }
}

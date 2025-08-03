'use client'

import { useState, useEffect } from 'react'
import { useRandomSongs, useSubmitRating } from '@/hooks/useApi'
import { RatingScale } from './RatingScale'
import StatsDashboard from './StatsDashboard'
import toast from 'react-hot-toast'

interface Props {
  sessionId: string
}

export function SongRatingInterface({ sessionId }: Props) {
  const {
    songs,
    loading,
    error,
    refetch: fetchNewSongs,
  } = useRandomSongs()
  
  const {
    submitRating,
    loading: submitting,
    error: submitError,
  } = useSubmitRating()

  const [rating, setRating] = useState<number | null>(null)
  const [ratingsCount, setRatingsCount] = useState(0)
  const [debugMode, setDebugMode] = useState(false)
  const [apiBaseUrl, setApiBaseUrl] = useState('')

  // Set API base URL on client side to avoid hydration mismatch
  useEffect(() => {
    setApiBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000')
  }, [])

  // Debug component
  const DebugPanel = () => (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-md z-50">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold">🐛 Debug Panel</h4>
        <button
          onClick={() => setDebugMode(false)}
          className="text-red-400 hover:text-red-300"
        >
          ✕
        </button>
      </div>
      <div className="space-y-1">
        <div>API Base URL: {apiBaseUrl}</div>
        <div>Loading: {loading ? '✅' : '❌'}</div>
        <div>Songs: {songs ? '✅' : '❌'}</div>
        <div>Error: {error || 'None'}</div>
        <div>Submit Error: {submitError || 'None'}</div>
        <div>Session ID: {sessionId}</div>
        <button
          onClick={() => {
            console.log('🔄 Manual refetch triggered');
            fetchNewSongs();
          }}
          className="bg-blue-600 px-2 py-1 rounded text-xs mt-2"
        >
          Refetch Songs
        </button>
      </div>
    </div>
  )

  const handleSubmitRating = async () => {
    if (!songs || rating === null) return

    const ratingData = {
      song_a_id: songs.song_a.id,
      song_b_id: songs.song_b.id,
      user_rating: rating,
      session_id: songs.session_id || sessionId,
    }

    const response = await submitRating(ratingData)

    if (response?.success) {
      toast.success(`Rating ${rating}/10 submitted! 🎉${response.model_prediction ? ` Model: ${response.model_prediction.toFixed(3)}` : ''}`)
      setRatingsCount(prev => prev + 1)
      
      // Auto-load next pair after short delay
      setTimeout(() => {
        setRating(null)
        fetchNewSongs()
      }, 1500)
    } else {
      toast.error('Failed to submit rating. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading songs from ML repository...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="bg-red-900/50 backdrop-blur-sm rounded-xl p-6 border border-red-500/50 max-w-md mx-auto">
          <h3 className="text-white text-lg font-semibold mb-2">API Connection Error</h3>
          <p className="text-red-200 mb-4">{error}</p>
          <div className="space-y-2">
            <p className="text-sm text-red-300">Make sure your ML repository API is running:</p>
            <code className="block bg-black/30 px-3 py-2 rounded text-xs text-green-300">
              cd ../spotify-song-recommender && python api_server.py
            </code>
          </div>
          <button
            onClick={fetchNewSongs}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors mt-4"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!songs) {
    return (
      <div className="text-center py-20">
        <p className="text-white text-lg mb-4">No songs available from ML repository</p>
        <button
          onClick={fetchNewSongs}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Debug Mode Toggle */}
      <div className="fixed top-4 right-4 z-40">
        <button
          onClick={() => setDebugMode(!debugMode)}
          className="bg-gray-800/80 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700/80 transition-colors"
        >
          🐛 Debug
        </button>
      </div>

      {/* Debug Panel */}
      {debugMode && <DebugPanel />}

      {/* Statistics Dashboard */}
      <StatsDashboard />
      
      <div className="max-w-6xl mx-auto">
        {/* Progress indicator */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-2">
            <span className="text-white font-medium">
              Ratings submitted: {ratingsCount} • Connected to ML Repository ✅
            </span>
          </div>
        </div>

        {/* Song cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <div className="text-center">
              <span className="inline-block bg-purple-600 text-white text-sm font-medium px-3 py-1 rounded-full">
                Song A
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  {songs.song_a.name}
                </h3>
                <p className="text-gray-300 text-lg">
                  {songs.song_a.artist}
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-3 justify-center">
                  <a
                    href={songs.song_a.spotify_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
                  >
                    🎵 Open in Spotify
                  </a>
                  {songs.song_a.preview_url && (
                    <a
                      href={songs.song_a.preview_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
                    >
                      🎧 Preview
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-center">
              <span className="inline-block bg-purple-600 text-white text-sm font-medium px-3 py-1 rounded-full">
                Song B
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  {songs.song_b.name}
                </h3>
                <p className="text-gray-300 text-lg">
                  {songs.song_b.artist}
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-3 justify-center">
                  <a
                    href={songs.song_b.spotify_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
                  >
                    🎵 Open in Spotify
                  </a>
                  {songs.song_b.preview_url && (
                    <a
                      href={songs.song_b.preview_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
                    >
                      🎧 Preview
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rating question */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            How likely would you put these songs in the same playlist?
          </h2>
          <p className="text-gray-300">
            Consider the vibe, energy, genre, and how well they flow together
          </p>
        </div>

        {/* Rating scale */}
        <RatingScale
          value={rating}
          onChange={setRating}
          disabled={submitting}
        />

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={handleSubmitRating}
            disabled={rating === null || submitting}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg transition-colors text-lg"
          >
            {submitting ? 'Submitting to ML Repository...' : `Submit Rating ${rating ? `(${rating}/10)` : ''}`}
          </button>
          
          <button
            onClick={fetchNewSongs}
            disabled={submitting}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg transition-colors text-lg"
          >
            Skip & Get New Songs
          </button>
        </div>

        {/* Helper text */}
        <div className="text-center mt-6 text-gray-400 text-sm">
          <p>💡 Tip: A rating of 1 means &ldquo;never&rdquo;, 10 means &ldquo;perfect together&rdquo;</p>
          <p className="mt-2">🤖 Your ratings train the ML model in real-time</p>
        </div>

        {/* Error display */}
        {submitError && (
          <div className="text-center mt-4">
            <p className="text-red-300">❌ {submitError}</p>
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { SongRatingInterface } from '@/components/SongRatingInterface'
import ApiDebugger from '@/components/ApiDebugger'
import { Toaster } from 'react-hot-toast'

export default function Home() {
  const [sessionId, setSessionId] = useState<string>('')
  const [showDebugger, setShowDebugger] = useState(false)

  // Generate session ID only on client side to avoid hydration mismatch
  useEffect(() => {
    setSessionId(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Toaster position="top-center" />
      
      {/* Debug Toggle */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => setShowDebugger(!showDebugger)}
          className="bg-red-600/80 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
        >
          {showDebugger ? '🔧 Hide Debugger' : '🐛 Show Debugger'}
        </button>
      </div>

      {/* Debug Panel */}
      {showDebugger && (
        <div className="container mx-auto px-4 py-20 pt-16">
          <ApiDebugger />
        </div>
      )}

      {/* Main Content */}
      {!showDebugger && (
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              🎵 Song Compatibility Rater
            </h1>
            <p className="text-xl text-gray-300 mb-2">
              Help improve music recommendations by rating song compatibility
            </p>
            <p className="text-lg text-gray-400">
              Rate how likely you&apos;d put these two songs in the same playlist (1-10)
            </p>
          </div>

          {/* Main Rating Interface - only render when sessionId is ready */}
          {sessionId ? (
            <SongRatingInterface sessionId={sessionId} />
          ) : (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-white text-lg">Initializing session...</p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center mt-16 text-gray-400">
            <p className="mb-2">
              Your ratings help train an AI model to create better playlists
            </p>
            <p className="text-sm">
              Data is collected anonymously • No personal information stored
            </p>
          </div>
        </div>
      )}
    </main>
  )
}

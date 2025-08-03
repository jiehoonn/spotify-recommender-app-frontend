'use client'

import { useState, useRef } from 'react'
import { Song } from '@/types/song'

interface Props {
  song: Song
  label: string
}

export function SongCard({ song, label }: Props) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleEnded = () => {
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      {/* Header */}
      <div className="text-center mb-4">
        <span className="inline-block bg-purple-600 text-white text-sm font-medium px-3 py-1 rounded-full">
          {label}
        </span>
      </div>

      {/* Song Info */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
          {song.name}
        </h3>
        <p className="text-gray-300 text-lg mb-1">
          {song.artist}
        </p>
        {song.album && (
          <p className="text-gray-400 text-sm">
            {song.album}
          </p>
        )}
      </div>

      {/* Audio Player */}
      {song.previewUrl ? (
        <div className="space-y-4">
          <audio
            ref={audioRef}
            src={song.previewUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
            preload="metadata"
          />
          
          {/* Play Button */}
          <div className="text-center">
            <button
              onClick={togglePlay}
              className="bg-green-500 hover:bg-green-600 text-white rounded-full p-3 transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-100"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>
          <p className="text-gray-400 text-sm">
            Preview not available
          </p>
        </div>
      )}

      {/* Additional Info */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex justify-between text-xs text-gray-400">
          <span>Spotify ID: {song.spotifyId.slice(0, 8)}...</span>
          {song.popularity && (
            <span>Popularity: {song.popularity}%</span>
          )}
        </div>
      </div>
    </div>
  )
}

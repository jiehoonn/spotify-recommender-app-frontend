'use client'

import { useApiStats, useHealthCheck } from '@/hooks/useApi'

export default function StatsDashboard() {
  const { stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useApiStats()
  const { isHealthy, loading: healthLoading, error: healthError, refetch: refetchHealth } = useHealthCheck()

  if (statsLoading || healthLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-white/20 rounded w-1/2"></div>
            <div className="h-3 bg-white/20 rounded w-1/3"></div>
            <div className="h-3 bg-white/20 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (statsError || healthError) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <p className="text-red-300 mb-4">
          API Connection Error: {statsError || healthError}
        </p>
        <div className="flex gap-2">
          <button
            onClick={refetchStats}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            Retry Stats
          </button>
          <button
            onClick={refetchHealth}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            Check Health
          </button>
        </div>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">
          🎵 Collection Statistics
        </h2>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isHealthy ? 'bg-green-400' : 'bg-red-400'}`}></div>
          <span className="text-sm text-gray-300">
            {isHealthy ? 'API Online' : 'API Offline'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-400">
            {stats.total_ratings_combined.toLocaleString()}
          </div>
          <div className="text-sm text-gray-300">Total Ratings</div>
        </div>

        <div className="text-center">
          <div className="text-3xl font-bold text-green-400">
            {stats.total_tracks.toLocaleString()}
          </div>
          <div className="text-sm text-gray-300">Songs Available</div>
        </div>

        <div className="text-center">
          <div className="text-3xl font-bold text-purple-400">
            {stats.total_ratings_database.toLocaleString()}
          </div>
          <div className="text-sm text-gray-300">Web Ratings</div>
        </div>

        <div className="text-center">
          <div
            className={`text-3xl font-bold ${
              stats.model_loaded ? "text-green-400" : "text-orange-400"
            }`}
          >
            {stats.model_loaded ? "🤖" : "⚠️"}
          </div>
          <div className="text-sm text-gray-300">ML Model</div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/20">
        <div className="flex justify-between text-xs text-gray-400">
          <span>API Version: {stats.api_version}</span>
          <span>Updated: {new Date(stats.timestamp).toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  )
}

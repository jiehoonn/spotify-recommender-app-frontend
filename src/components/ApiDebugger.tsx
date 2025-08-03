'use client'

import { useState } from 'react'
import { apiClient } from '@/lib/api-client'

interface TestResult {
  success: boolean
  data?: unknown
  error?: string
  duration?: number
  timestamp: string
}

export default function ApiDebugger() {
  const [results, setResults] = useState<Record<string, TestResult>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  const testEndpoint = async (name: string, testFn: () => Promise<unknown>) => {
    setLoading(prev => ({ ...prev, [name]: true }))
    
    try {
      const startTime = Date.now()
      const result = await testFn()
      const endTime = Date.now()
      
      setResults(prev => ({
        ...prev,
        [name]: {
          success: true,
          data: result,
          duration: endTime - startTime,
          timestamp: new Date().toISOString()
        }
      }))
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [name]: {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        }
      }))
    } finally {
      setLoading(prev => ({ ...prev, [name]: false }))
    }
  }

  const tests = [
    {
      name: 'Health Check',
      test: () => apiClient.healthCheck(),
      description: 'Test if the API server is running'
    },
    {
      name: 'Random Songs',
      test: () => apiClient.getRandomSongs(),
      description: 'Fetch two random songs for rating'
    },
    {
      name: 'Statistics',
      test: () => apiClient.getStats(),
      description: 'Get API and database statistics'
    },
    {
      name: 'Submit Rating',
      test: () => apiClient.submitRating({
        song_a_id: 'test_song_a',
        song_b_id: 'test_song_b',
        user_rating: 5,
        session_id: 'debug_session_' + Date.now()
      }),
      description: 'Test rating submission (with dummy data)'
    }
  ]

  const runAllTests = async () => {
    for (const test of tests) {
      await testEndpoint(test.name, test.test)
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">🧪 API Endpoint Debugger</h2>
        <button
          onClick={runAllTests}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Run All Tests
        </button>
      </div>

      <div className="space-y-4">
        {tests.map((test) => (
          <div key={test.name} className="border border-white/10 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-white">{test.name}</h3>
                <p className="text-sm text-gray-400">{test.description}</p>
              </div>
              <button
                onClick={() => testEndpoint(test.name, test.test)}
                disabled={loading[test.name]}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                {loading[test.name] ? '⏳' : '▶️'} Test
              </button>
            </div>

            {results[test.name] && (
              <div className="mt-3 p-3 bg-black/30 rounded border">
                <div className="flex items-center gap-2 mb-2">
                  <span className={results[test.name].success ? 'text-green-400' : 'text-red-400'}>
                    {results[test.name].success ? '✅' : '❌'}
                  </span>
                  <span className="text-sm text-gray-400">
                    {results[test.name].timestamp} 
                    {results[test.name].duration && ` (${results[test.name].duration}ms)`}
                  </span>
                </div>
                
                <pre className="text-xs text-gray-300 overflow-x-auto">
                  {JSON.stringify(
                    results[test.name].success 
                      ? results[test.name].data 
                      : { error: results[test.name].error },
                    null,
                    2
                  )}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-yellow-900/30 border border-yellow-600/50 rounded-lg">
        <h4 className="font-semibold text-yellow-200 mb-2">🔧 Debugging Tips</h4>
        <ul className="text-sm text-yellow-100 space-y-1">
          <li>• Check browser console for detailed logs</li>
          <li>• Ensure ML repository API is running on correct port</li>
          <li>• Verify CORS settings in your API server</li>
          <li>• Check environment variables (NEXT_PUBLIC_API_BASE_URL)</li>
        </ul>
      </div>
    </div>
  )
}

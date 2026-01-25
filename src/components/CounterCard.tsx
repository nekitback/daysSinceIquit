import { useState, useEffect } from 'react'
import { Pause, Play, RotateCcw, Trash2, Loader2, ExternalLink } from 'lucide-react'
import type { Counter } from '../types'

interface Props {
  counter: Counter
  isLoading: boolean
  onReset: (id: number) => void
  onPause: (id: number) => void
  onResume: (id: number) => void
  onDelete: (id: number) => void
}

export default function CounterCard({ 
  counter, 
  isLoading,
  onReset, 
  onPause, 
  onResume, 
  onDelete 
}: Props) {
  const [currentTime, setCurrentTime] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${secs}s`
    }
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    }
    return `${minutes}m ${secs}s`
  }

  const calculateCurrentStreak = () => {
    const now = Math.floor(currentTime / 1000)
    const startedAt = counter.startedAt
    const pausedAt = counter.pausedAt
    const totalPausedTime = counter.totalPausedTime

    if (pausedAt > 0) {
      return pausedAt - startedAt - totalPausedTime
    } else {
      return now - startedAt - totalPausedTime
    }
  }

  const currentStreak = calculateCurrentStreak()
  const isPaused = counter.pausedAt > 0

  return (
    <div 
      className={`relative bg-white rounded-2xl shadow-lg border-2 overflow-hidden transition-all ${
        isLoading ? 'opacity-50 pointer-events-none' : 'border-gray-200'
      }`}
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-900">Processing...</p>
          </div>
        </div>
      )}

      <div 
        className="p-6 border-l-4 transition-colors"
        style={{ 
          borderLeftColor: counter.color,
          background: `linear-gradient(to right, ${counter.color}08, transparent)`
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-gray-900">
                {counter.category}
              </h3>
              {isPaused && (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                  Paused
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500">
                Started {new Date(counter.startedAt * 1000).toLocaleDateString()}
              </p>
              <span className="text-gray-300">•</span>
              <a
                href={`https://sepolia.basescan.org/address/0xF6016fCb6653e4D351b976c0574C0359d5D209f4`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium"
              >
                View onchain
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: counter.color }}
          />
        </div>

        {/* Current Time */}
        <div className="mb-6">
          <div className="text-4xl font-bold text-gray-900 mb-1">
            {formatTime(currentStreak)}
          </div>
          <p className="text-sm text-gray-500">Since you quit</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div>
            <p className="text-xs text-gray-500 mb-1">Longest Streak</p>
            <p className="text-lg font-bold text-gray-900">
              {Math.floor(counter.longestStreak / 86400)}d
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Total Resets</p>
            <p className="text-lg font-bold text-gray-900">{counter.totalResets}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Status</p>
            <p className={`text-lg font-bold ${isPaused ? 'text-amber-600' : 'text-green-600'}`}>
              {isPaused ? 'Paused' : 'Active'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-6">
          <button
            onClick={() => isPaused ? onResume(counter.id) : onPause(counter.id)}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPaused ? (
              <>
                <Play className="w-4 h-4" />
                Resume
              </>
            ) : (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            )}
          </button>

          <button
            onClick={() => onReset(counter.id)}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>

          <button
            onClick={() => onDelete(counter.id)}
            disabled={isLoading} 
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div> 
    </div>
  )
}

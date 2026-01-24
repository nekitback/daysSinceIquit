import { useEffect, useState } from 'react'
import { Trash2, Pause, Play, RotateCcw, Award, TrendingUp } from 'lucide-react'
import { formatTimeSince } from '../utils/formatTime'
import type { CounterCardProps } from '../types'

export default function CounterCard({ 
    counter,
    isLoading = false,
    onReset, 
    onPause, 
    onResume, 
    onDelete 
  }: CounterCardProps) {
  const [timeDisplay, setTimeDisplay] = useState('')
  const isPaused = counter.pausedAt > 0

  useEffect(() => {
    const updateTime = () => {
      setTimeDisplay(formatTimeSince(counter.startedAt, counter.totalPausedTime, counter.pausedAt))
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [counter.startedAt, counter.totalPausedTime, counter.pausedAt])

  const categoryLabel = counter.customName || counter.category

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow relative">
      {/* Color Bar */}
      <div className="h-2" style={{ backgroundColor: counter.color }} />

      {/* Paused Overlay */}
{isPaused && (
  <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
    <div className="text-white text-center bg-gray-800 px-6 py-4 rounded-xl shadow-2xl">
      <Pause className="w-10 h-10 mx-auto mb-2" />
      <p className="text-lg font-bold mb-3">PAUSED</p>
      <button
        onClick={() => onResume(counter.id)}
        className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
      >
        <Play className="w-5 h-5" />
        Resume
      </button>
    </div>
  </div>
)}

{/* Loading Overlay */}
{isLoading && (
  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex items-center justify-center rounded-2xl">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
      <p className="text-lg font-bold text-gray-900">Processing...</p>
      <p className="text-sm text-gray-600 mt-1">Confirming transaction</p>
    </div>
  </div>
)}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-2xl font-bold text-gray-900">
                {categoryLabel}
              </h3>
              {counter.longestStreak > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-sm font-semibold">
                  <Award className="w-4 h-4" />
                  {counter.longestStreak}d
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              Started {new Date(counter.startedAt * 1000).toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex gap-2">
            {!isPaused ? (
              <button
                onClick={() => onPause(counter.id)}
                className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Pause className="w-5 h-5 text-gray-600" />
              </button>
            ) : (
              <button
                onClick={() => onResume(counter.id)}
                className="p-2.5 hover:bg-green-50 rounded-lg transition-colors"
              >
                <Play className="w-5 h-5 text-green-600" />
              </button>
            )}

            <button
              onClick={() => onDelete(counter.id)}
              className="p-2.5 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5 text-gray-600 hover:text-red-600" />
            </button>
          </div>
        </div>

        {/* Timer */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-6 border border-gray-200">
          <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Time since you quit
          </p>
          <p className="text-4xl font-bold font-mono text-gray-900">
            {timeDisplay}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
            <p className="text-xs font-medium text-amber-700 mb-1">Longest</p>
            <p className="text-2xl font-bold text-amber-900">{counter.longestStreak}</p>
            <p className="text-xs text-amber-600">days</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <p className="text-xs font-medium text-blue-700 mb-1">Relapses</p>
            <p className="text-2xl font-bold text-blue-900">{counter.totalResets}</p>
            <p className="text-xs text-blue-600">times</p>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
            <p className="text-xs font-medium text-purple-700 mb-1">Paused</p>
            <p className="text-2xl font-bold text-purple-900">
              {Math.floor(counter.totalPausedTime / 3600)}
            </p>
            <p className="text-xs text-purple-600">hours</p>
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={() => onReset(counter.id)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Counter
        </button>
      </div>
    </div>
  )
}
import { useState, useEffect } from 'react'
import { Pause, Play, RotateCcw, Trash2, Loader2, ExternalLink, Share2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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
  const [showShareMenu, setShowShareMenu] = useState(false)

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
  const currentDays = Math.floor(currentStreak / 86400)

  // UI fix: If longestStreak is 0 (contract bug with custom date), use currentStreak instead
  const displayLongestStreak = counter.longestStreak > 0 
    ? counter.longestStreak 
    : currentStreak

  // Share functionality - URL from env or fallback
  const appUrl = import.meta.env.VITE_APP_URL || 'https://days-since-iquit.vercel.app'
  const shareText = `🎉 I've been ${counter.category}-free for ${currentDays} days!

Tracking my progress with Days Since I Quit on Base.

${appUrl}`

  const shareToBaseApp = () => {
    // Base App compose URL (Warpcast-compatible) - embeds will show OG card
    const text = `🎉 I've been ${counter.category}-free for ${currentDays} days!\n\nTracking my progress with Days Since I Quit on Base.`
    const url = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(appUrl)}`
    window.open(url, '_blank')
    setShowShareMenu(false)
  }

  const shareGeneric = async () => {
    if (navigator.share) {
      try {
        // Include URL in text for messengers that don't handle url separately
        await navigator.share({
          text: shareText,
        })
      } catch (err) {
        // User cancelled or error
        console.log('Share cancelled')
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText)
        alert('Copied to clipboard!')
      } catch (err) {
        console.error('Failed to copy')
      }
    }
    setShowShareMenu(false)
  }

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  return (
    <div 
      className={`relative rounded-2xl shadow-lg border-2 overflow-hidden transition-all backdrop-blur-sm ${
        isLoading ? 'opacity-50 pointer-events-none' : 'border-gray-200/50 dark:border-gray-700/50'
      }`}
      style={{
        background: `linear-gradient(135deg, ${hexToRgba(counter.color, 0.15)}, ${hexToRgba(counter.color, 0.05)})`,
      }}
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-500 dark:text-blue-400 animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Processing...</p>
          </div>
        </div>
      )}

      <div 
        className="p-6 border-l-4 transition-colors"
        style={{ 
          borderLeftColor: counter.color,
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {counter.category}
              </h3>
              {isPaused && (
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-600 dark:text-amber-300 text-xs font-semibold rounded-full border border-amber-500/30">
                  Paused
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Started {new Date(counter.startedAt * 1000).toLocaleDateString()}
              </p>
              <span className="text-gray-400 dark:text-gray-600">•</span>
              <a
                href={`https://basescan.org/address/0x6b38dD227700F01Dc9Ee2d6DfCCadfD33bFb4028`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 flex items-center gap-1 text-sm font-medium"
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
          <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
            {formatTime(currentStreak)}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Since you quit</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Longest Streak</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {Math.floor(displayLongestStreak / 86400)}d
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Total Resets</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{counter.totalResets}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Status</p>
            <p className={`text-lg font-bold ${isPaused ? 'text-amber-500 dark:text-amber-400' : 'text-green-500 dark:text-green-400'}`}>
              {isPaused ? 'Paused' : 'Active'}
            </p>
          </div>
        </div>

        {/* Action Buttons - min 44px touch targets */}
        <div className="mt-6 space-y-2">
          {/* Row 1: Pause/Resume + Reset */}
          <div className="flex gap-2">
            <button
              onClick={() => isPaused ? onResume(counter.id) : onPause(counter.id)}
              disabled={isLoading}
              className="flex-1 px-3 min-h-[44px] bg-blue-500/20 hover:bg-blue-500/30 text-blue-600 dark:text-blue-300 border border-blue-500/30 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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
              className="flex-1 px-3 min-h-[44px] bg-red-500/20 hover:bg-red-500/30 text-red-600 dark:text-red-300 border border-red-500/30 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>

          {/* Row 2: Share + Delete (right aligned) */}
          <div className="flex justify-end gap-2">
            {/* Share Button */}
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                disabled={isLoading}
                className="px-4 min-h-[44px] bg-green-500/20 hover:bg-green-500/30 text-green-600 dark:text-green-300 border border-green-500/30 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>

              {/* Share Menu Popup */}
              <AnimatePresence>
                {showShareMenu && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setShowShareMenu(false)}
                    />
                    
                    {/* Menu */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      className="absolute right-0 bottom-full mb-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
                    >
                      <div className="p-2">
                        <p className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                          Share your progress
                        </p>
                        
                        {/* Base App / Warpcast */}
                        <button
                          onClick={shareToBaseApp}
                          className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="2" stroke="currentColor" fill="none"/>
                            </svg>
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-gray-900 dark:text-white text-sm">Base / Warpcast</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Post to your feed</p>
                          </div>
                        </button>

                        {/* Generic Share / Copy */}
                        <button
                          onClick={shareGeneric}
                          className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center">
                            <Share2 className="w-4 h-4 text-white" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-gray-900 dark:text-white text-sm">More options</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Messengers & copy link</p>
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => onDelete(counter.id)}
              disabled={isLoading} 
              className="px-4 min-h-[44px] bg-gray-200/50 dark:bg-gray-700/50 hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-300 hover:border-red-500/30 text-gray-700 dark:text-gray-300 border border-gray-300/50 dark:border-gray-600/50 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div> 
    </div>
  )
}

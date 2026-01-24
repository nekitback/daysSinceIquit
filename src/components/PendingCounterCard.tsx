import { Loader2 } from 'lucide-react'

interface PendingCounterCardProps {
  category: string
  color: string
  customStartDate: number | null
}

export default function PendingCounterCard({ 
  category, 
  color,
  customStartDate 
}: PendingCounterCardProps) {
  // Вычисляем приблизительный streak для preview
  const previewStreak = customStartDate 
    ? Math.floor((Date.now() / 1000 - customStartDate) / 86400)
    : 0

  return (
    <div 
      className="relative bg-white rounded-2xl shadow-lg border-2 border-dashed border-blue-300 overflow-hidden animate-pulse-slow"
    >
      {/* Blur Overlay */}
      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-900">
            Creating counter onchain...
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Waiting for transaction confirmation
          </p>
        </div>
      </div>

      {/* Counter Preview (blurred behind) */}
      <div 
        className="p-6 border-l-4 transition-colors"
        style={{ 
          borderLeftColor: color,
          background: `linear-gradient(to right, ${color}08, transparent)`
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-gray-900">
                {category}
              </h3>
            </div>
            <p className="text-sm text-gray-500">Starting...</p>
          </div>
          
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>

        {/* Time Display */}
        <div className="mb-6">
          <div className="text-4xl font-bold text-gray-900 mb-1">
            {customStartDate ? `${previewStreak} days` : '0d 0h 0m 0s'}
          </div>
          <p className="text-sm text-gray-500">
            {customStartDate 
              ? `Started ${new Date(customStartDate * 1000).toLocaleDateString()}`
              : 'Since you quit'
            }
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div>
            <p className="text-xs text-gray-500 mb-1">Longest Streak</p>
            <p className="text-lg font-bold text-gray-900">
              {customStartDate ? `${previewStreak}d` : '0d'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Total Resets</p>
            <p className="text-lg font-bold text-gray-900">0</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Status</p>
            <p className="text-lg font-bold text-green-600">Active</p>
          </div>
        </div>

        {/* Buttons (disabled) */}
        <div className="flex gap-2 mt-4">
          <button
            disabled
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-400 rounded-lg font-medium cursor-not-allowed"
          >
            Pause
          </button>
          <button
            disabled
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-400 rounded-lg font-medium cursor-not-allowed"
          >
            Reset
          </button>
          <button
            disabled
            className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg font-medium cursor-not-allowed"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
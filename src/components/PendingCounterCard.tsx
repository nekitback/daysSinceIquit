import { ExternalLink, Loader2, CheckCircle, XCircle } from 'lucide-react'

interface Props {
  category: string
  color: string
  customStartDate: number | null
  txHash?: `0x${string}`
  status?: 'pending' | 'success' | 'error'
}

export default function PendingCounterCard({ 
  category, 
  color, 
  customStartDate,
  txHash,
  status = 'pending'
}: Props) {
  const startDate = customStartDate 
    ? new Date(customStartDate * 1000) 
    : new Date()

  // Calculate preview streak if custom date
  const previewStreak = customStartDate 
    ? Math.floor((Date.now() / 1000 - customStartDate) / 86400)
    : 0

  return (
    <div className="relative bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg border-2 border-blue-200 dark:border-blue-500/30 overflow-hidden animate-pulse-slow backdrop-blur-sm">
      <div 
        className="p-6 border-l-4 opacity-60"
        style={{ 
          borderLeftColor: color,
          background: `linear-gradient(to right, ${color}08, transparent)`
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {category}
              </h3>
              <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full flex items-center gap-1 border border-blue-200 dark:border-blue-500/30">
                {status === 'pending' && (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Creating...
                  </>
                )}
                {status === 'success' && (
                  <>
                    <CheckCircle className="w-3 h-3" />
                    Confirmed
                  </>
                )}
                {status === 'error' && (
                  <>
                    <XCircle className="w-3 h-3" />
                    Failed
                  </>
                )}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Started {startDate.toLocaleDateString()}
            </p>
          </div>
          
          <div 
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ backgroundColor: color }}
          />
        </div>

        {/* Pending Message */}
        <div className="mb-6 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin flex-shrink-0" />
            <p className="font-semibold text-gray-900 dark:text-white">
              {status === 'pending' && 'Waiting for confirmation...'}
              {status === 'success' && 'Transaction confirmed!'}
              {status === 'error' && 'Transaction failed'}
            </p>
          </div>
          
          {txHash && (
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-mono truncate">
                {txHash.slice(0, 10)}...{txHash.slice(-8)}
              </p>
              <a
                href={`https://basescan.org/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 text-sm font-medium whitespace-nowrap"
              >
                View
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>

        {/* Placeholder Stats - show preview streak if custom date */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700/50 opacity-40">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Current Streak</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {customStartDate ? `${previewStreak}d` : '--'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Longest Streak</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {customStartDate ? `${previewStreak}d` : '--'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Status</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">Pending</p>
          </div>
        </div>
      </div>
    </div>
  )
}

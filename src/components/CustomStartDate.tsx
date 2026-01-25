import { Calendar } from 'lucide-react'
import { useState } from 'react'

interface Props {
  selectedDate: number | null
  onDateChange: (timestamp: number | null) => void
}

export default function CustomStartDate({ selectedDate, onDateChange }: Props) {
  const [showPicker, setShowPicker] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateString = e.target.value
    
    if (!dateString) {
      onDateChange(null)
      setError(null)
      return
    }

    const [year, month, day] = dateString.split('-').map(Number)
    const date = new Date(year, month - 1, day, 12, 0, 0, 0)
    
    const timestampInSeconds = Math.floor(date.getTime() / 1000)
    const now = Math.floor(Date.now() / 1000)
    
    console.group('📅 Custom Date Debug')
    console.log('Input:', dateString)
    console.log('Parsed date:', date.toLocaleString())
    console.log('Timestamp (seconds):', timestampInSeconds)
    console.log('Current (seconds):', now)
    console.log('Difference (hours):', (now - timestampInSeconds) / 3600)
    console.log('Is in past?', timestampInSeconds < now)
    console.groupEnd()
    
    if (timestampInSeconds >= now) {
      setError('Cannot select future date!')
      console.error('❌ Selected date is in the future!')
      return
    }
    
    const oneYearAgo = now - (365 * 24 * 60 * 60)
    if (timestampInSeconds < oneYearAgo) {
      setError('Cannot select date more than 1 year ago')
      console.error('❌ Selected date is too old!')
      return
    }
    
    setError(null)
    onDateChange(timestampInSeconds)
  }

  const clearDate = () => {
    onDateChange(null)
    setError(null)
    setShowPicker(false)
  }

  const timestampToDateString = (timestamp: number | null): string => {
    if (!timestamp) return ''
    
    const date = new Date(timestamp * 1000)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    
    return `${year}-${month}-${day}`
  }

  const getMaxDate = (): string => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    
    const year = yesterday.getFullYear()
    const month = String(yesterday.getMonth() + 1).padStart(2, '0')
    const day = String(yesterday.getDate()).padStart(2, '0')
    
    return `${year}-${month}-${day}`
  }

  const getMinDate = (): string => {
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
    
    const year = oneYearAgo.getFullYear()
    const month = String(oneYearAgo.getMonth() + 1).padStart(2, '0')
    const day = String(oneYearAgo.getDate()).padStart(2, '0')
    
    return `${year}-${month}-${day}`
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-gray-300">
          Start Date
        </label>
        {!showPicker ? (
          <button
            onClick={() => setShowPicker(true)}
            className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            Set custom date
          </button>
        ) : (
          <button
            onClick={clearDate}
            className="text-sm text-gray-400 hover:text-gray-300 font-medium transition-colors"
          >
            Use today
          </button>
        )}
      </div>

      {showPicker && (
        <div className="p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>Choose your actual quit date</span>
          </div>
          
          <input
            type="date"
            value={timestampToDateString(selectedDate)}
            onChange={handleDateChange}
            max={getMaxDate()}
            min={getMinDate()}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
          />
          
          {error && (
            <p className="text-xs text-red-400 flex items-center gap-1">
              ⚠️ {error}
            </p>
          )}
          
          {selectedDate && !error && (
            <p className="text-xs text-green-400 flex items-center gap-1">
              ✓ Counter will start from {new Date(selectedDate * 1000).toLocaleDateString()}
            </p>
          )}
          
          <p className="text-xs text-gray-500">
            💡 Tip: Select a date up to 1 year ago
          </p>
        </div>
      )}
    </div>
  )
}
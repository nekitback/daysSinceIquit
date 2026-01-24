import { Calendar } from 'lucide-react'
import { useState } from 'react'

interface CustomStartDateProps {
  onDateChange: (timestamp: number | null) => void
  selectedDate: number | null
}

export default function CustomStartDate({ onDateChange, selectedDate }: CustomStartDateProps) {
  const [useCustomDate, setUseCustomDate] = useState(false)

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const date = new Date(e.target.value + 'T00:00:00')
      onDateChange(Math.floor(date.getTime() / 1000))
    } else {
      onDateChange(null)
    }
  }

  const handleToggle = () => {
    const newState = !useCustomDate
    setUseCustomDate(newState)
    if (!newState) {
      onDateChange(null) 
    }
  }

  const getDateValue = () => {
    if (!selectedDate) return ''
    const date = new Date(selectedDate * 1000)
    return date.toISOString().split('T')[0]
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-3">
      {/* Toggle */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
        <input
          type="checkbox"
          id="customDate"
          checked={useCustomDate}
          onChange={handleToggle}
          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="customDate" className="flex-1 cursor-pointer">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-semibold text-gray-900">
              Set custom start date
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-0.5">
            If you quit before today
          </p>
        </label>
      </div>

      {/* Date Picker */}
      {useCustomDate && (
        <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <label className="block">
            <span className="text-sm font-semibold text-gray-900 mb-2 block">
              When did you quit?
            </span>
            <input
              type="date"
              value={getDateValue()}
              onChange={handleDateChange}
              max={today}
              className="w-full px-4 py-3 bg-white border-2 border-blue-300 rounded-lg text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </label>

          {selectedDate && (
            <div className="flex items-start gap-2 p-3 bg-white rounded-lg border border-blue-200">
              <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  Counter will start from:
                </p>
                <p className="text-sm text-gray-700">
                  {new Date(selectedDate * 1000).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  ~{Math.floor((Date.now() / 1000 - selectedDate) / 86400)} days ago
                </p>
              </div>
            </div>
          )}

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>Note:</strong> This will be stored permanently on the blockchain. 
              Make sure the date is correct!
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { Calendar } from 'lucide-react'

interface Props {
  selectedDate: number | null
  onDateChange: (timestamp: number | null) => void
}

export default function CustomStartDate({ selectedDate, onDateChange }: Props) {
  const [useCustomDate, setUseCustomDate] = useState(false)

  const today = new Date()
  const maxDate = today.toISOString().split('T')[0]
  
  const minDateObj = new Date()
  minDateObj.setFullYear(minDateObj.getFullYear() - 100) 
  const minDate = minDateObj.toISOString().split('T')[0]

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={useCustomDate}
            onChange={(e) => {
              setUseCustomDate(e.target.checked)
              if (!e.target.checked) {
                onDateChange(null)
              }
            }}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <span className="text-sm font-medium text-gray-700">
            Set custom start date
          </span>
        </label>
      </div>

      {useCustomDate && (
        <div className="space-y-2 pl-6">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="date"
              min={minDate} 
              max={maxDate} 
              value={selectedDate ? new Date(selectedDate * 1000).toISOString().split('T')[0] : ''}
              onChange={(e) => {
                const timestamp = Math.floor(new Date(e.target.value).getTime() / 1000)
                onDateChange(timestamp)
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {selectedDate && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">
                  Started: {new Date(selectedDate * 1000).toLocaleDateString()}
                </span>
              </p>
              <p className="text-xs text-blue-600 mt-1">
                ~{Math.floor((Date.now() / 1000 - selectedDate) / 86400)} days ago
              </p>
              <p className="text-xs text-blue-600/70 mt-2">
                ⚠️ This date will be permanently recorded on the blockchain
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}


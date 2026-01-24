import { useState } from 'react'
import { useStore } from '../store/useStore'
import { DEFAULT_COLORS } from '../constants/categories'
import { Check, ChevronDown, ChevronUp, Palette } from 'lucide-react'

export default function ColorPicker() {
  const { selectedColor, setSelectedColor } = useStore()
  const [isOpen, setIsOpen] = useState(false)
  const [showCustomPicker, setShowCustomPicker] = useState(false)

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-3">
        Choose Color
      </label>
      
      {/* Collapsed View */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 hover:border-blue-600 rounded-xl transition-all"
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg shadow-sm border-2 border-white"
            style={{ backgroundColor: selectedColor }}
          />
          <div className="text-left">
            <p className="text-sm text-gray-600">Selected Color</p>
            <p className="font-mono font-semibold text-gray-900">{selectedColor.toUpperCase()}</p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* Expanded View */}
      <div 
  className={`overflow-visible transition-all duration-300 ease-in-out ${
    isOpen ? 'max-h-[600px] opacity-100 mt-3' : 'max-h-0 opacity-0'
  }`}
>
<div className="bg-white border-2 border-gray-200 rounded-xl p-4 overflow-visible">
          <p className="text-xs font-medium text-gray-600 mb-3">Choose Color</p>
          
          {/* Color Grid with Custom Button */}
          <div className="grid grid-cols-5 gap-3">
            {DEFAULT_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => {
                  setSelectedColor(color)
                  setIsOpen(false)
                }}
                className={`relative w-full aspect-square rounded-xl transition-all hover:scale-105 ${
                  selectedColor === color
                    ? 'ring-4 ring-blue-600 ring-offset-2 scale-105'
                    : 'hover:ring-2 hover:ring-gray-300'
                }`}
                style={{ backgroundColor: color }}
              >
                {selectedColor === color && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check className="w-6 h-6 text-white drop-shadow-lg" strokeWidth={3} />
                  </div>
                )}
              </button>
            ))}
            
            {/* Custom Color Button */}
            <button
              onClick={() => setShowCustomPicker(!showCustomPicker)}
              className="relative w-full aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-600 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-purple-50 transition-all hover:scale-105 flex items-center justify-center group"
            >
              <Palette className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </button>
          </div>

          {/* Custom Color Picker */}
          {showCustomPicker && (
            <div className="mt-4 pt-4 border-t border-gray-200 animate-fade-in">
              <p className="text-xs font-medium text-gray-600 mb-3">Custom Color</p>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-16 h-12 rounded-lg cursor-pointer border-2 border-gray-200"
                />
                <div className="flex-1 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm font-mono font-semibold text-gray-900">{selectedColor.toUpperCase()}</p>
                </div>
                <button
                  onClick={() => {
                    setShowCustomPicker(false)
                    setIsOpen(false)
                  }}
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
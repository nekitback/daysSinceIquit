import { useState } from 'react'
import { useStore } from '../store/useStore'
import { PRESET_CATEGORIES } from '../constants/categories'
import { Check } from 'lucide-react'

export default function CategorySelector() {
  const { selectedCategory, customName, setSelectedCategory, setCustomName } = useStore()
  const [showCustomInput, setShowCustomInput] = useState(false)

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    
    if (categoryId === 'custom') {
      setShowCustomInput(true)
    } else {
      setShowCustomInput(false)
      setCustomName('')
    }
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-3">
        What are you quitting?
      </label>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {PRESET_CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategorySelect(category.id)}
            className={`relative p-4 rounded-xl border-2 transition-all text-left hover:scale-[1.02] ${
              selectedCategory === category.id
                ? 'border-blue-600 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{category.emoji}</span>
              <div className="flex-1">
                <span className={`font-semibold ${
                  selectedCategory === category.id ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {category.label.replace(/[🚬🍺🍰📱🎮✏️]/g, '').trim()}
                </span>
              </div>
              {selectedCategory === category.id && (
                <Check className="w-5 h-5 text-blue-600" strokeWidth={3} />
              )}
            </div>
          </button>
        ))}
      </div>

      {showCustomInput && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <label className="block text-sm font-medium text-blue-900 mb-2">
            Enter your custom habit:
          </label>
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="e.g., Coffee, Fast Food..."
            className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-600 bg-white"
            maxLength={30}
          />
          <p className="text-xs text-blue-700 mt-2">
            {customName.length}/30 characters
          </p>
        </div>
      )}
    </div>
  )
}
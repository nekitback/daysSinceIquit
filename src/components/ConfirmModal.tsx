import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmColor?: 'red' | 'blue' | 'green'
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'blue',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const colorClasses = {
    red: 'bg-red-600 hover:bg-red-700',
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full pointer-events-auto overflow-hidden">
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                  </div>
                  <button
                    onClick={onCancel}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-5">
                <p className="text-gray-700 leading-relaxed">{message}</p>
              </div>

              {/* Actions */}
              <div className="px-6 py-4 bg-gray-50 flex gap-3 justify-end">
                <button
                  onClick={onCancel}
                  className="px-5 py-2.5 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm()
                    onCancel()
                  }}
                  className={`px-5 py-2.5 text-white rounded-lg font-semibold transition-colors ${colorClasses[confirmColor]}`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
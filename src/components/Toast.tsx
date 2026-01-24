import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, X, AlertCircle, Info } from 'lucide-react'
import { useEffect } from 'react'

export type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
  isOpen: boolean
  message: string
  type?: ToastType
  duration?: number
  onClose: () => void
}

export default function Toast({ 
  isOpen, 
  message, 
  type = 'success', 
  duration = 3000,
  onClose 
}: ToastProps) {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [isOpen, duration, onClose])

  const config = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-600',
      borderColor: 'border-green-700',
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-600',
      borderColor: 'border-red-700',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-600',
      borderColor: 'border-blue-700',
    },
  }

  const { icon: Icon, bgColor, borderColor } = config[type]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-4 right-4 z-[100] pointer-events-auto"
        >
          <div className={`${bgColor} ${borderColor} border-2 rounded-xl shadow-2xl p-4 pr-12 max-w-md`}>
            <div className="flex items-center gap-3 text-white">
              <Icon className="w-6 h-6 flex-shrink-0" />
              <p className="font-semibold leading-snug">{message}</p>
            </div>
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
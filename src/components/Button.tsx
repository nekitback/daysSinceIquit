import { ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'danger'
}

export default function Button({ 
  children, 
  loading, 
  variant = 'primary',
  className = '',
  disabled,
  ...props 
}: ButtonProps) {
  const baseStyles = 'px-6 py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 border-2 border-gray-200',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Processing...</span>
        </div>
      ) : (
        children
      )}
    </button>
  )
}
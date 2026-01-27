import { CONTRACT_ADDRESS } from '../constants/contract'
import { ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative mt-16 overflow-hidden">
      {/* Animated gradient background - Light theme */}
      <div 
        className="absolute inset-0 animate-gradient-x block dark:hidden"
        style={{
          background: 'linear-gradient(90deg, rgba(255,255,255,0.95), rgba(59,130,246,0.25), rgba(255,255,255,0.95), rgba(59,130,246,0.25))',
          backgroundSize: '300% 100%',
        }}
      />
      {/* Animated gradient background - Dark theme */}
      <div 
        className="absolute inset-0 animate-gradient-x hidden dark:block"
        style={{
          background: 'linear-gradient(90deg, rgba(17,24,39,0.98), rgba(59,130,246,0.12), rgba(17,24,39,0.98), rgba(59,130,246,0.12))',
          backgroundSize: '300% 100%',
        }}
      />
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <a
              href={`https://basescan.org/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <span className="font-mono">{CONTRACT_ADDRESS.slice(0, 6)}...{CONTRACT_ADDRESS.slice(-4)}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            
            <a
              href="https://base.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Built on <span className="font-semibold text-blue-600 dark:text-blue-400">Base</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

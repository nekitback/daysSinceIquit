import { CONTRACT_ADDRESS } from '../constants/contract'
import { Heart, ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left side */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-700 dark:text-gray-300">Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span className="text-gray-700 dark:text-gray-300">on</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">Base</span>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-6 text-sm">
              <a
                href="https://base.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="font-medium">Base Network</span>
              </a>
              <span className="text-gray-500">
                Contract: {CONTRACT_ADDRESS.slice(0, 6)}...{CONTRACT_ADDRESS.slice(-4)}
              </span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-xs text-gray-600 dark:text-gray-400">
 
            <p className="mt-2">
              All counter data is permanently stored onchain on Base L2
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
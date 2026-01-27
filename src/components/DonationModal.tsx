import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { useAccount } from 'wagmi'
import StarfieldBackground from './StarfieldBackground'
import SunRaysBackground from './SunRaysBackground'
import { useTheme } from '../hooks/useTheme'

declare global {
    interface Window {
      ethereum?: any
    }
  }

interface Props {
  isOpen: boolean
  onClose: () => void
  onDonationSuccess?: (message: string, type: 'success' | 'error' | 'info') => void
}

export default function DonationModal({ isOpen, onClose, onDonationSuccess }: Props) {
  const [copied, setCopied] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const { address } = useAccount()
  const { theme } = useTheme()
  const donationAddress = '0x585207f9B4C1FB59c5FC819411E0aCC60BdfFe69' 

  const copyAddress = () => {
    navigator.clipboard.writeText(donationAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDonate = async (amount: string) => {
    if (!address) {
      if (onDonationSuccess) {
        onDonationSuccess('⚠️ Please connect your wallet first', 'error')
      }
      return
    }

    if (!window.ethereum) {
      if (onDonationSuccess) {
        onDonationSuccess('⚠️ Wallet not detected', 'error')
      }
      return
    }

    try {
      setIsPending(true)
      
      const ethAmount = parseFloat(amount)
      const weiAmount = BigInt(Math.floor(ethAmount * 1e18))
      
      const tx = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address,
          to: donationAddress,
          value: '0x' + weiAmount.toString(16),
        }],
      })
      
      console.log('Transaction sent:', tx)
      
      if (onDonationSuccess) {
        onDonationSuccess('❤️ Thank you so much! Your support means everything to us! 🙏', 'success')
      }
      
      onClose()
      
    } catch (error: any) {
      console.error('Donation error:', error)
      
      if (error.code === 4001) {
        if (onDonationSuccess) {
          onDonationSuccess('Transaction cancelled', 'info')
        }
      } else {
        if (onDonationSuccess) {
          onDonationSuccess('❌ Transaction failed: ' + (error.message || 'Unknown error'), 'error')
        }
      }
    } finally {
      setIsPending(false)
    }
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
            onClick={onClose}
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl max-w-md w-full pointer-events-auto overflow-hidden border border-pink-200 dark:border-gray-700">
              {/* Background effects */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl">
                <StarfieldBackground isModal />
                {theme === 'light' && <SunRaysBackground isModal />}
              </div>

              {/* Content */}
              <div className="relative" style={{ zIndex: 2 }}>
                {/* Header */}
                <div className="bg-gradient-to-r from-pink-500/90 to-red-500/90 backdrop-blur-sm px-6 py-8 text-white relative border-b border-pink-500/30">
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-center gap-3 mb-2">
                    <Heart className="w-8 h-8" fill="white" />
                    <h2 className="text-2xl font-bold">Support the Project</h2>
                  </div>
                  <p className="text-pink-100 text-sm">
                    Help keep this app free and growing
                  </p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Message */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                      Why Your Support Matters
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      Days Since I Quit is built by one developer passionate about helping people break bad habits onchain. Your donation helps:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 dark:text-green-400 mt-0.5">✓</span>
                        <span>Keep the app free and accessible for everyone</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 dark:text-green-400 mt-0.5">✓</span>
                        <span>Add new features based on your feedback</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 dark:text-green-400 mt-0.5">✓</span>
                        <span>Cover blockchain and hosting costs</span>
                      </li>
                    </ul>
                    <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                      Every contribution, no matter how small, makes a difference! 🙏
                    </p>
                  </div>

                  {/* Donation amounts */}
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Quick Donate:</p>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => handleDonate('0.001')}
                        disabled={isPending}
                        className="px-4 py-3 bg-pink-100 dark:bg-pink-500/20 hover:bg-pink-200 dark:hover:bg-pink-500/30 border-2 border-pink-300 dark:border-pink-500/50 text-pink-700 dark:text-pink-200 rounded-xl font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
                      >
                        {isPending ? '...' : '0.001 ETH'}
                      </button>
                      <button
                        onClick={() => handleDonate('0.005')}
                        disabled={isPending}
                        className="px-4 py-3 bg-pink-100 dark:bg-pink-500/20 hover:bg-pink-200 dark:hover:bg-pink-500/30 border-2 border-pink-300 dark:border-pink-500/50 text-pink-700 dark:text-pink-200 rounded-xl font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
                      >
                        {isPending ? '...' : '0.005 ETH'}
                      </button>
                      <button
                        onClick={() => handleDonate('0.01')}
                        disabled={isPending}
                        className="px-4 py-3 bg-pink-100 dark:bg-pink-500/20 hover:bg-pink-200 dark:hover:bg-pink-500/30 border-2 border-pink-300 dark:border-pink-500/50 text-pink-700 dark:text-pink-200 rounded-xl font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
                      >
                        {isPending ? '...' : '0.01 ETH'}
                      </button>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Or send to address:</p>
                    <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-300 dark:border-gray-700">
                      <code className="flex-1 text-xs font-mono text-gray-800 dark:text-gray-200 truncate">
                        {donationAddress}
                      </code>
                      <button
                        onClick={copyAddress}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Copy address"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-500 dark:text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
                      Base
                    </p>
                  </div>

                  {/* Thank you note */}
                  <div className="p-4 bg-pink-100/80 dark:bg-pink-500/10 backdrop-blur-sm border border-pink-300 dark:border-pink-500/30 rounded-xl text-center">
                    <p className="text-sm font-medium text-pink-700 dark:text-pink-200">
                      Thank you for believing in this project! ❤️
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

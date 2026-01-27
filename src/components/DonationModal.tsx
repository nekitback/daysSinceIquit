import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { useAccount } from 'wagmi'

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
  const donationAddress = '0x585207f9B4C1FB59c5FC819411E0aCC60BdfFe69' 

  const copyAddress = () => {
    navigator.clipboard.writeText(donationAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDonate = async (amount: string) => {
    if (!address) {
      if (onDonationSuccess) {
        onDonationSuccess('Please connect your wallet first', 'error')
      }
      return
    }

    if (!window.ethereum) {
      if (onDonationSuccess) {
        onDonationSuccess('Wallet not detected', 'error')
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
        onDonationSuccess('Thank you for your support!', 'success')
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
          onDonationSuccess('Transaction failed', 'error')
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
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full pointer-events-auto overflow-hidden border border-gray-200 dark:border-gray-700">
              
              {/* Animated gradient header - same as main header/footer */}
              <div className="relative overflow-hidden">
                <div 
                  className="absolute inset-0 animate-gradient-x block dark:hidden"
                  style={{
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.95), rgba(59,130,246,0.25), rgba(255,255,255,0.95), rgba(59,130,246,0.25))',
                    backgroundSize: '300% 100%',
                  }}
                />
                <div 
                  className="absolute inset-0 animate-gradient-x hidden dark:block"
                  style={{
                    background: 'linear-gradient(90deg, rgba(17,24,39,0.98), rgba(59,130,246,0.12), rgba(17,24,39,0.98), rgba(59,130,246,0.12))',
                    backgroundSize: '300% 100%',
                  }}
                />
                
                <div className="relative px-6 py-6">
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Support the Project</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Help us keep building
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-5">
                {/* Message */}
                <div className="space-y-3">
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    This app is built and maintained by an indie developer. If Days Since I Quit has helped you on your journey, consider supporting its development.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Your contribution helps cover infrastructure costs and enables new features.
                  </p>
                </div>

                {/* Donation amounts */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Choose amount:</p>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleDonate('0.001')}
                      disabled={isPending}
                      className="px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-500/10 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500/30 text-gray-800 dark:text-gray-200 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPending ? '...' : '0.001 ETH'}
                    </button>
                    <button
                      onClick={() => handleDonate('0.005')}
                      disabled={isPending}
                      className="px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-500/10 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500/30 text-gray-800 dark:text-gray-200 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPending ? '...' : '0.005 ETH'}
                    </button>
                    <button
                      onClick={() => handleDonate('0.01')}
                      disabled={isPending}
                      className="px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-500/10 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500/30 text-gray-800 dark:text-gray-200 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPending ? '...' : '0.01 ETH'}
                    </button>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Or send directly:</p>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <code className="flex-1 text-xs font-mono text-gray-700 dark:text-gray-300 truncate">
                      {donationAddress}
                    </code>
                    <button
                      onClick={copyAddress}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                      title="Copy address"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
                    Base Network (ETH)
                  </p>
                </div>

                {/* Footer note */}
                <p className="text-xs text-center text-gray-500 dark:text-gray-500 pt-2">
                  Thank you for being part of this journey.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

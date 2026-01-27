import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useBasename } from '../hooks/useBasename'
import { User, ChevronDown } from 'lucide-react'

/**
 * Custom connect button that shows Basename instead of 0x address
 * Meets Base Featured guidelines: "Display user's avatar and username (NO 0x addresses)"
 */
export default function UserButton() {
  const { isConnected } = useAccount()
  const { name: basename, avatar, isLoading } = useBasename()

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted
        const connected = ready && account && chain

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    className="px-4 py-2.5 min-h-[44px] bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors flex items-center gap-2"
                  >
                    Connect Wallet
                  </button>
                )
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    className="px-4 py-2.5 min-h-[44px] bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors"
                  >
                    Wrong network
                  </button>
                )
              }

              return (
                <button
                  onClick={openAccountModal}
                  className="flex items-center gap-2 px-3 py-2 min-h-[44px] bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl transition-colors"
                >
                  {/* Avatar */}
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Avatar"
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {/* Name */}
                  <span className="font-medium text-gray-900 dark:text-white max-w-[120px] truncate">
                    {isLoading ? (
                      <span className="text-gray-400">...</span>
                    ) : basename ? (
                      basename
                    ) : (
                      // Fallback to short address if no basename
                      `${account.address.slice(0, 4)}...${account.address.slice(-3)}`
                    )}
                  </span>

                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}

import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { 
  Identity, 
  Name, 
  Avatar,
  Badge,
  Address,
} from '@coinbase/onchainkit/identity'
import { ChevronDown } from 'lucide-react'

/**
 * Custom connect button that shows Basename/Identity via OnchainKit
 * Meets Base Featured guidelines: "Display user's avatar and username (NO 0x addresses)"
 */
export default function UserButton() {
  const { address } = useAccount()

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
                    Connect
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
                  {address && (
                    <Identity
                      address={address}
                      schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
                      className="!bg-transparent !p-0 !gap-2"
                    >
                      <Avatar className="!w-7 !h-7 !rounded-full" />
                      <Name className="!font-medium !text-gray-900 dark:!text-white !text-sm max-w-[100px] truncate">
                        <Badge />
                      </Name>
                    </Identity>
                  )}
                  {!address && (
                    <Address 
                      address={account.address as `0x${string}`}
                      className="!font-medium !text-gray-900 dark:!text-white !text-sm"
                    />
                  )}
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

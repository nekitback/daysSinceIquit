import { 
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet'
import { 
  Identity, 
  Name, 
  Avatar, 
  Address,
  EthBalance,
} from '@coinbase/onchainkit/identity'
import { useAccount } from 'wagmi'

/**
 * Custom connect button using OnchainKit
 * Automatically shows Basename and avatar from Base profile
 * Transactions are sponsored when using Coinbase Smart Wallet in Base App
 */
export default function UserButton() {
  const { address } = useAccount()

  return (
    <Wallet>
      <ConnectWallet className="!min-h-[44px] !rounded-xl !font-semibold">
        {address ? (
          <Identity 
            address={address}
            className="!bg-transparent"
          >
            <Avatar className="!w-7 !h-7" />
            <Name className="!text-sm !font-medium" />
          </Identity>
        ) : (
          <span>Connect</span>
        )}
      </ConnectWallet>
      <WalletDropdown>
        <Identity 
          address={address}
          className="px-4 pt-3 pb-2"
        >
          <Avatar />
          <Name />
          <Address />
          <EthBalance />
        </Identity>
        <WalletDropdownDisconnect />
      </WalletDropdown>
    </Wallet>
  )
}

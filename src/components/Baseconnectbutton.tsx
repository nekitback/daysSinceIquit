import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useConnect } from 'wagmi'
import { useEffect } from 'react'

export default function BaseConnectButton() {
  const { connectors, connect } = useConnect()

  useEffect(() => {
    const isCoinbaseAvailable = connectors.some(c => 
      c.name.toLowerCase().includes('coinbase')
    )
    
    console.log('Available connectors:', connectors.map(c => c.name))
    
    if (isCoinbaseAvailable) {
      console.log('Coinbase Wallet detected (Base App ready)')
    }
  }, [connectors])

  return <ConnectButton />
}
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

// Base L2 Resolver contract
const L2_RESOLVER_ADDRESS = '0xC6d566A56A1aFf6508b41f6c90ff131615583BCD'
const BASENAME_L2_RESOLVER_ABI = [
  {
    inputs: [{ name: 'name', type: 'bytes32' }],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

// Basename registry for reverse lookup
const BASENAME_REVERSE_REGISTRAR = '0x79ea96012eea67a83431f1701b3dff7e37f9e282'

interface BasenameData {
  name: string | null
  avatar: string | null
  isLoading: boolean
  error: Error | null
}

/**
 * Hook to fetch Basename for connected wallet
 * Uses Base's onchain identity system
 */
export function useBasename(): BasenameData {
  const { address } = useAccount()
  const [data, setData] = useState<BasenameData>({
    name: null,
    avatar: null,
    isLoading: false,
    error: null,
  })

  useEffect(() => {
    if (!address) {
      setData({ name: null, avatar: null, isLoading: false, error: null })
      return
    }

    const fetchBasename = async () => {
      setData(prev => ({ ...prev, isLoading: true, error: null }))

      try {
        // Try Base Identity API first (faster)
        const response = await fetch(
          `https://api.wallet.coinbase.com/rpc/v3/resolve/addresses?addresses=${address}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )

        if (response.ok) {
          const result = await response.json()
          const identity = result?.results?.[address.toLowerCase()]
          
          if (identity?.name) {
            setData({
              name: identity.name,
              avatar: identity.avatar || null,
              isLoading: false,
              error: null,
            })
            return
          }
        }

        // Fallback: Try ENS-style reverse lookup on Base
        const reverseResponse = await fetch(
          `https://resolver-api.basename.app/v1/addresses/${address}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )

        if (reverseResponse.ok) {
          const reverseResult = await reverseResponse.json()
          
          if (reverseResult?.name) {
            setData({
              name: reverseResult.name,
              avatar: reverseResult.avatar || reverseResult.text_records?.avatar || null,
              isLoading: false,
              error: null,
            })
            return
          }
        }

        // No Basename found
        setData({
          name: null,
          avatar: null,
          isLoading: false,
          error: null,
        })

      } catch (error) {
        console.error('Failed to fetch Basename:', error)
        setData({
          name: null,
          avatar: null,
          isLoading: false,
          error: error as Error,
        })
      }
    }

    fetchBasename()
  }, [address])

  return data
}

/**
 * Format address with Basename fallback
 */
export function formatIdentity(
  address: string | undefined,
  basename: string | null
): string {
  if (basename) return basename
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

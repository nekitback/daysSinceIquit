import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

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

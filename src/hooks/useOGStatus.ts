import { useEffect, useState } from 'react'
import { useAccount, usePublicClient } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../constants/contract'

// Cache for OG users list
let ogUsersCache: string[] | null = null
let lastFetchTime = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export function useOGStatus() {
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const [isOG, setIsOG] = useState(false)
  const [ogRank, setOgRank] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkOGStatus() {
      if (!address || !publicClient) {
        setIsLoading(false)
        return
      }

      try {
        // Use cache if available and fresh
        if (ogUsersCache && Date.now() - lastFetchTime < CACHE_DURATION) {
          const rank = ogUsersCache.findIndex(
            (addr) => addr.toLowerCase() === address.toLowerCase()
          )
          if (rank !== -1 && rank < 100) {
            setIsOG(true)
            setOgRank(rank + 1)
          } else {
            setIsOG(false)
            setOgRank(null)
          }
          setIsLoading(false)
          return
        }

        // Fetch CounterStarted events to find first 100 unique users
        const logs = await publicClient.getLogs({
          address: CONTRACT_ADDRESS,
          event: {
            type: 'event',
            name: 'CounterStarted',
            inputs: [
              { indexed: true, name: 'user', type: 'address' },
              { indexed: true, name: 'counterId', type: 'uint256' },
              { indexed: false, name: 'category', type: 'string' },
              { indexed: false, name: 'color', type: 'string' },
            ],
          },
          fromBlock: 'earliest',
          toBlock: 'latest',
        })

        // Get unique users in order of first counter creation
        const uniqueUsers: string[] = []
        for (const log of logs) {
          const user = (log.args as any)?.user as string
          if (user && !uniqueUsers.some(u => u.toLowerCase() === user.toLowerCase())) {
            uniqueUsers.push(user)
          }
          if (uniqueUsers.length >= 100) break
        }

        // Update cache
        ogUsersCache = uniqueUsers
        lastFetchTime = Date.now()

        // Check if current user is OG
        const rank = uniqueUsers.findIndex(
          (addr) => addr.toLowerCase() === address.toLowerCase()
        )
        if (rank !== -1 && rank < 100) {
          setIsOG(true)
          setOgRank(rank + 1)
        } else {
          setIsOG(false)
          setOgRank(null)
        }
      } catch (error) {
        console.error('Error checking OG status:', error)
        setIsOG(false)
        setOgRank(null)
      }

      setIsLoading(false)
    }

    checkOGStatus()
  }, [address, publicClient])

  return { isOG, ogRank, isLoading }
}

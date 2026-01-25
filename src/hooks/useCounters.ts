import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useStore } from '@/store/useStore'
import { useCountersCount } from './useContract'

export function useCounters() {
  const { address } = useAccount()
  const { count, refetch: refetchCount } = useCountersCount()
  const { counters } = useStore()

  useEffect(() => {
    if (!address || count === 0) return

    const loadCounters = async () => {
      for (let i = 0; i < count; i++) {
    
      }
    }

    loadCounters()
  }, [address, count])

  return {
    counters,
    count,
    refetchCount,
  }
}
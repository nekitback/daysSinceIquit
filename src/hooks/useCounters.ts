import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useStore } from '@/store/useStore'
import { useCountersCount, useGetCounter } from './useContract'

export function useCounters() {
  const { address } = useAccount()
  const { count, refetch: refetchCount } = useCountersCount()
  const { addCounter, counters } = useStore()

  useEffect(() => {
    if (!address || count === 0) return

    // Загрузка всех счетчиков пользователя
    const loadCounters = async () => {
      for (let i = 0; i < count; i++) {
        // Здесь можно использовать useGetCounter для каждого ID
        // Но для простоты используем локальное хранилище
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
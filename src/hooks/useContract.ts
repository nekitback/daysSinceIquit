import { useWriteContract, useReadContract } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../constants/contract'
import { useAccount } from 'wagmi'

// START COUNTER (common)
export function useStartCounter() {
  const { writeContractAsync, isPending, isError } = useWriteContract()

  const startCounter = async (category: string, color: string) => {
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'startCounter',
        args: [category, color],
      })
      return hash
    } catch (error) {
      console.error('Start counter error:', error)
      throw error
    }
  }

  return { startCounter, isPending, isError }
}

// START COUNTER WITH CUSTOM TIME
export function useStartCounterWithCustomTime() {
  const { writeContractAsync, isPending, isError } = useWriteContract()

  const startCounterWithCustomTime = async (
    category: string, 
    color: string, 
    customStartDate: number 
  ) => {
    try {
      console.log('📅 Custom start date (seconds):', customStartDate)
      console.log('📅 Custom start date (readable):', new Date(customStartDate * 1000).toISOString())
      console.log('⏰ Current time (seconds):', Math.floor(Date.now() / 1000))
      
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'startCounterWithCustomTime',
        args: [category, color, BigInt(customStartDate)],  // ← Передаем как есть
      })
      return hash
    } catch (error) {
      console.error('Start counter with custom time error:', error)
      throw error
    }
  }

  return { startCounterWithCustomTime, isPending, isError }
}

// RESET COUNTER
export function useResetCounter() {
  const { writeContractAsync, isPending, isError } = useWriteContract()

  const resetCounter = async (counterId: number) => {
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'resetCounter',
        args: [BigInt(counterId)],
      })
      return hash
    } catch (error) {
      console.error('Reset counter error:', error)
      throw error
    }
  }

  return { resetCounter, isPending, isError }
}

// PAUSE COUNTER
export function usePauseCounter() {
  const { writeContractAsync, isPending, isError } = useWriteContract()

  const pauseCounter = async (counterId: number) => {
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'pauseCounter',
        args: [BigInt(counterId)],
      })
      return hash
    } catch (error) {
      console.error('Pause counter error:', error)
      throw error
    }
  }

  return { pauseCounter, isPending, isError }
}

// RESUME COUNTER
export function useResumeCounter() {
  const { writeContractAsync, isPending, isError } = useWriteContract()

  const resumeCounter = async (counterId: number) => {
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'resumeCounter',
        args: [BigInt(counterId)],
      })
      return hash
    } catch (error) {
      console.error('Resume counter error:', error)
      throw error
    }
  }

  return { resumeCounter, isPending, isError }
}

// DELETE COUNTER
export function useDeleteCounter() {
  const { writeContractAsync, isPending, isError } = useWriteContract()

  const deleteCounter = async (counterId: number) => {
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'deleteCounter',
        args: [BigInt(counterId)],
      })
      return hash
    } catch (error) {
      console.error('Delete counter error:', error)
      throw error
    }
  }

  return { deleteCounter, isPending, isError }
}

// GET ACTIVE COUNTERS
export function useGetActiveCounters() {
  const { address } = useAccount()

  const { data: counters, refetch, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getActiveCounters',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  return { counters, refetch, isLoading }
}

export function useCountersCount() {
  const { address } = useAccount()

  const { data: count, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'countersCount',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  return { 
    count: count ? Number(count) : 0, 
    refetch 
  }
}
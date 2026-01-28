import { useWriteContract, useReadContract, useAccount } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../constants/contract'

// All transactions use the built-in Base App Paymaster
// Base sponsors gas fees for users in their ecosystem - no cost to developer!

// START COUNTER
export function useStartCounter() {
  const { writeContractAsync, isPending, isError } = useWriteContract()

  const startCounter = async (category: string, color: string) => {
    const hash = await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'startCounter',
      args: [category, color],
    })
    return hash
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
    console.log('📅 Custom start date (seconds):', customStartDate)
    
    const hash = await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'startCounterWithCustomTime',
      args: [category, color, BigInt(customStartDate)],
    })
    return hash
  }

  return { startCounterWithCustomTime, isPending, isError }
}

// RESET COUNTER
export function useResetCounter() {
  const { writeContractAsync, isPending, isError } = useWriteContract()

  const resetCounter = async (counterId: number) => {
    const hash = await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'resetCounter',
      args: [BigInt(counterId)],
    })
    return hash
  }

  return { resetCounter, isPending, isError }
}

// PAUSE COUNTER
export function usePauseCounter() {
  const { writeContractAsync, isPending, isError } = useWriteContract()

  const pauseCounter = async (counterId: number) => {
    const hash = await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'pauseCounter',
      args: [BigInt(counterId)],
    })
    return hash
  }

  return { pauseCounter, isPending, isError }
}

// RESUME COUNTER
export function useResumeCounter() {
  const { writeContractAsync, isPending, isError } = useWriteContract()

  const resumeCounter = async (counterId: number) => {
    const hash = await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'resumeCounter',
      args: [BigInt(counterId)],
    })
    return hash
  }

  return { resumeCounter, isPending, isError }
}

// DELETE COUNTER
export function useDeleteCounter() {
  const { writeContractAsync, isPending, isError } = useWriteContract()

  const deleteCounter = async (counterId: number) => {
    const hash = await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'deleteCounter',
      args: [BigInt(counterId)],
    })
    return hash
  }

  return { deleteCounter, isPending, isError }
}

// GET ACTIVE COUNTERS (read-only)
export function useGetActiveCounters() {
  const { address } = useAccount()

  const { data: counters, refetch, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getActiveCounters',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      staleTime: 0, // Always consider data stale
      refetchOnMount: true,
      refetchOnWindowFocus: true,
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

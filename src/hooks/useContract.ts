import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../constants/contract'
import { useAccount } from 'wagmi'

// ========== WRITE FUNCTIONS ==========

export function useStartCounter() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()

  const startCounter = async (category: string, color: string) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'startCounter',
        args: [category, color],
      })
    } catch (err) {
      console.error('Error starting counter:', err)
    }
  }

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  return {
    startCounter,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  }
}

export function useUpdateMetadata() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()

  const updateMetadata = async (id: number, category: string, color: string) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'updateMetadata',
        args: [BigInt(id), category, color],
      })
    } catch (err) {
      console.error('Error updating metadata:', err)
    }
  }

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  return {
    updateMetadata,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  }
}

export function useResetCounter() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()

  const resetCounter = async (id: number) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'resetCounter',
        args: [BigInt(id)],
      })
    } catch (err) {
      console.error('Error resetting counter:', err)
    }
  }

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  return {
    resetCounter,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  }
}

export function usePauseCounter() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()

  const pauseCounter = async (id: number) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'pauseCounter',
        args: [BigInt(id)],
      })
    } catch (err) {
      console.error('Error pausing counter:', err)
    }
  }

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  return {
    pauseCounter,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}

export function useResumeCounter() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()

  const resumeCounter = async (id: number) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'resumeCounter',
        args: [BigInt(id)],
      })
    } catch (err) {
      console.error('Error resuming counter:', err)
    }
  }

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  return {
    resumeCounter,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}

/**
 * Hook for starting a counter with custom start time
 */
export function useStartCounterWithCustomTime() {
  const { writeContractAsync, isPending, isConfirming, isSuccess, ...rest } = useWriteContract()

  const startCounterWithCustomTime = async (
    category: string, 
    color: string,
    customStartTime: number
  ) => {
    try {
      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'startCounterWithCustomTime',
        args: [category, color, BigInt(customStartTime)],
      })
      return tx
    } catch (error) {
      console.error('Error starting counter with custom time:', error)
      throw error
    }
  }

  return { 
    startCounterWithCustomTime, 
    isPending, 
    isConfirming, 
    isSuccess,
    ...rest 
  }
}

export function useDeleteCounter() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()

  const deleteCounter = async (id: number) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'deleteCounter',
        args: [BigInt(id)],
      })
    } catch (err) {
      console.error('Error deleting counter:', err)
    }
  }

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  return {
    deleteCounter,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}

// ========== READ FUNCTIONS ==========

export function useGetCounter(id: number) {
  const { address } = useAccount()

  const { data, isLoading, error, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getCounter',
    args: address ? [address, BigInt(id)] : undefined,
  })

  return {
    counter: data,
    isLoading,
    error,
    refetch,
  }
}

export function useGetCurrentStreak(id: number) {
  const { address } = useAccount()

  const { data, isLoading, error, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getCurrentStreak',
    args: address ? [address, BigInt(id)] : undefined,
  })

  return {
    streak: data ? Number(data) : 0,
    isLoading,
    error,
    refetch,
  }
}

export function useGetRelapseHistory(id: number) {
  const { address } = useAccount()

  const { data, isLoading, error, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getRelapseHistory',
    args: address ? [address, BigInt(id)] : undefined,
  })

  return {
    history: data || [],
    isLoading,
    error,
    refetch,
  }
}

export function useGetActiveCounters() {
  const { address } = useAccount()

  const { data, isLoading, error, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getActiveCounters',
    args: address ? [address] : undefined,
  })

  return {
    counters: data,
    isLoading,
    error,
    refetch,
  }
}

export function useCountersCount() {
  const { address } = useAccount()

  const { data, isLoading, error, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'countersCount',
    args: address ? [address] : undefined,
  })

  return {
    count: data ? Number(data) : 0,
    isLoading,
    error,
    refetch,
  }
}
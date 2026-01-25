import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../constants/contract'
import { useAccount } from 'wagmi'

// ========== WRITE FUNCTIONS ==========

export function useStartCounter() {
  const { writeContractAsync, data: hash, isPending } = useWriteContract()

  const startCounter = async (category: string, color: string) => {
    const txHash = await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'startCounter',
      args: [category, color],
    })
    return txHash
  }

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  return {
    startCounter,
    isPending,
    isConfirming,
    isSuccess,
    hash,
  }
}

export function useStartCounterWithCustomTime() {
  const { writeContractAsync, data: hash, isPending } = useWriteContract()

  const startCounterWithCustomTime = async (
    category: string, 
    color: string,
    customStartTime: number
  ) => {
    const txHash = await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'startCounterWithCustomTime',
      args: [category, color, BigInt(customStartTime)],
    })
    return txHash
  }

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  return { 
    startCounterWithCustomTime, 
    isPending, 
    isConfirming, 
    isSuccess,
    hash,
  }
}

export function useResetCounter() {
  const { writeContractAsync, data: hash, isPending } = useWriteContract()

  const resetCounter = async (id: number) => {
    const txHash = await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'resetCounter',
      args: [BigInt(id)],
    })
    return txHash
  }

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  return {
    resetCounter,
    isPending,
    isConfirming,
    isSuccess,
    hash,
  }
}

export function usePauseCounter() {
  const { writeContractAsync, data: hash, isPending } = useWriteContract()

  const pauseCounter = async (id: number) => {
    const txHash = await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'pauseCounter',
      args: [BigInt(id)],
    })
    return txHash
  }

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  return {
    pauseCounter,
    isPending,
    isConfirming,
    isSuccess,
    hash,
  }
}

export function useResumeCounter() {
  const { writeContractAsync, data: hash, isPending } = useWriteContract()

  const resumeCounter = async (id: number) => {
    const txHash = await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'resumeCounter',
      args: [BigInt(id)],
    })
    return txHash
  }

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  return {
    resumeCounter,
    isPending,
    isConfirming,
    isSuccess,
    hash,
  }
}

export function useDeleteCounter() {
  const { writeContractAsync, data: hash, isPending } = useWriteContract()

  const deleteCounter = async (id: number) => {
    const txHash = await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'deleteCounter',
      args: [BigInt(id)],
    })
    return txHash
  }

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  return {
    deleteCounter,
    isPending,
    isConfirming,
    isSuccess,
    hash,
  }
}

export function useUpdateMetadata() {
  const { writeContractAsync, data: hash, isPending } = useWriteContract()

  const updateMetadata = async (id: number, category: string, color: string) => {
    const txHash = await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'updateMetadata',
      args: [BigInt(id), category, color],
    })
    return txHash
  }

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  return {
    updateMetadata,
    isPending,
    isConfirming,
    isSuccess,
    hash,
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

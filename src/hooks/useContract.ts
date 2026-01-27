import { useWriteContract, useReadContract, useAccount } from 'wagmi'
import { useSendCalls } from 'wagmi/experimental'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../constants/contract'
import { encodeFunctionData } from 'viem'
import { useState } from 'react'

// Paymaster URL for sponsored transactions
const PAYMASTER_URL = import.meta.env.VITE_PAYMASTER_URL || ''

// START COUNTER (with Paymaster support)
export function useStartCounter() {
  const { writeContractAsync, isPending: isPendingRegular, isError } = useWriteContract()
  const { sendCallsAsync } = useSendCalls()
  const [isPendingSponsored, setIsPendingSponsored] = useState(false)

  const startCounter = async (category: string, color: string) => {
    // Try sponsored transaction first
    if (PAYMASTER_URL) {
      try {
        setIsPendingSponsored(true)
        console.log('🎁 Attempting sponsored transaction...')
        
        const callData = encodeFunctionData({
          abi: CONTRACT_ABI,
          functionName: 'startCounter',
          args: [category, color],
        })

        const result = await sendCallsAsync({
          calls: [{
            to: CONTRACT_ADDRESS,
            data: callData,
          }],
          capabilities: {
            paymasterService: {
              url: PAYMASTER_URL,
            },
          },
        })
        
        console.log('✅ Sponsored transaction sent!', result)
        // sendCallsAsync returns an ID string
        const callId = typeof result === 'string' ? result : (result as { id?: string })?.id || String(result)
        return callId as `0x${string}`
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.log('⚠️ Sponsored failed, trying regular:', errorMessage)
      } finally {
        setIsPendingSponsored(false)
      }
    }

    // Fallback to regular transaction
    console.log('💰 Using regular transaction')
    const hash = await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'startCounter',
      args: [category, color],
    })
    return hash
  }

  return { startCounter, isPending: isPendingRegular || isPendingSponsored, isError }
}

// START COUNTER WITH CUSTOM TIME (with Paymaster support)
export function useStartCounterWithCustomTime() {
  const { writeContractAsync, isPending: isPendingRegular, isError } = useWriteContract()
  const { sendCallsAsync } = useSendCalls()
  const [isPendingSponsored, setIsPendingSponsored] = useState(false)

  const startCounterWithCustomTime = async (
    category: string, 
    color: string, 
    customStartDate: number 
  ) => {
    console.log('📅 Custom start date (seconds):', customStartDate)
    
    if (PAYMASTER_URL) {
      try {
        setIsPendingSponsored(true)
        console.log('🎁 Attempting sponsored transaction...')
        
        const callData = encodeFunctionData({
          abi: CONTRACT_ABI,
          functionName: 'startCounterWithCustomTime',
          args: [category, color, BigInt(customStartDate)],
        })

        const result = await sendCallsAsync({
          calls: [{
            to: CONTRACT_ADDRESS,
            data: callData,
          }],
          capabilities: {
            paymasterService: {
              url: PAYMASTER_URL,
            },
          },
        })
        
        console.log('✅ Sponsored transaction sent!')
        const callId = typeof result === 'string' ? result : (result as { id?: string })?.id || String(result)
        return callId as `0x${string}`
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.log('⚠️ Sponsored failed, trying regular:', errorMessage)
      } finally {
        setIsPendingSponsored(false)
      }
    }

    const hash = await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'startCounterWithCustomTime',
      args: [category, color, BigInt(customStartDate)],
    })
    return hash
  }

  return { startCounterWithCustomTime, isPending: isPendingRegular || isPendingSponsored, isError }
}

// RESET COUNTER (with Paymaster support)
export function useResetCounter() {
  const { writeContractAsync, isPending: isPendingRegular, isError } = useWriteContract()
  const { sendCallsAsync } = useSendCalls()
  const [isPendingSponsored, setIsPendingSponsored] = useState(false)

  const resetCounter = async (counterId: number) => {
    if (PAYMASTER_URL) {
      try {
        setIsPendingSponsored(true)
        const callData = encodeFunctionData({
          abi: CONTRACT_ABI,
          functionName: 'resetCounter',
          args: [BigInt(counterId)],
        })

        const result = await sendCallsAsync({
          calls: [{
            to: CONTRACT_ADDRESS,
            data: callData,
          }],
          capabilities: {
            paymasterService: {
              url: PAYMASTER_URL,
            },
          },
        })
        const callId = typeof result === 'string' ? result : (result as { id?: string })?.id || String(result)
        return callId as `0x${string}`
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.log('⚠️ Sponsored failed:', errorMessage)
      } finally {
        setIsPendingSponsored(false)
      }
    }

    const hash = await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'resetCounter',
      args: [BigInt(counterId)],
    })
    return hash
  }

  return { resetCounter, isPending: isPendingRegular || isPendingSponsored, isError }
}

// PAUSE COUNTER (with Paymaster support)
export function usePauseCounter() {
  const { writeContractAsync, isPending: isPendingRegular, isError } = useWriteContract()
  const { sendCallsAsync } = useSendCalls()
  const [isPendingSponsored, setIsPendingSponsored] = useState(false)

  const pauseCounter = async (counterId: number) => {
    if (PAYMASTER_URL) {
      try {
        setIsPendingSponsored(true)
        const callData = encodeFunctionData({
          abi: CONTRACT_ABI,
          functionName: 'pauseCounter',
          args: [BigInt(counterId)],
        })

        const result = await sendCallsAsync({
          calls: [{
            to: CONTRACT_ADDRESS,
            data: callData,
          }],
          capabilities: {
            paymasterService: {
              url: PAYMASTER_URL,
            },
          },
        })
        const callId = typeof result === 'string' ? result : (result as { id?: string })?.id || String(result)
        return callId as `0x${string}`
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.log('⚠️ Sponsored failed:', errorMessage)
      } finally {
        setIsPendingSponsored(false)
      }
    }

    const hash = await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'pauseCounter',
      args: [BigInt(counterId)],
    })
    return hash
  }

  return { pauseCounter, isPending: isPendingRegular || isPendingSponsored, isError }
}

// RESUME COUNTER (with Paymaster support)
export function useResumeCounter() {
  const { writeContractAsync, isPending: isPendingRegular, isError } = useWriteContract()
  const { sendCallsAsync } = useSendCalls()
  const [isPendingSponsored, setIsPendingSponsored] = useState(false)

  const resumeCounter = async (counterId: number) => {
    if (PAYMASTER_URL) {
      try {
        setIsPendingSponsored(true)
        const callData = encodeFunctionData({
          abi: CONTRACT_ABI,
          functionName: 'resumeCounter',
          args: [BigInt(counterId)],
        })

        const result = await sendCallsAsync({
          calls: [{
            to: CONTRACT_ADDRESS,
            data: callData,
          }],
          capabilities: {
            paymasterService: {
              url: PAYMASTER_URL,
            },
          },
        })
        const callId = typeof result === 'string' ? result : (result as { id?: string })?.id || String(result)
        return callId as `0x${string}`
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.log('⚠️ Sponsored failed:', errorMessage)
      } finally {
        setIsPendingSponsored(false)
      }
    }

    const hash = await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'resumeCounter',
      args: [BigInt(counterId)],
    })
    return hash
  }

  return { resumeCounter, isPending: isPendingRegular || isPendingSponsored, isError }
}

// DELETE COUNTER (with Paymaster support)
export function useDeleteCounter() {
  const { writeContractAsync, isPending: isPendingRegular, isError } = useWriteContract()
  const { sendCallsAsync } = useSendCalls()
  const [isPendingSponsored, setIsPendingSponsored] = useState(false)

  const deleteCounter = async (counterId: number) => {
    if (PAYMASTER_URL) {
      try {
        setIsPendingSponsored(true)
        const callData = encodeFunctionData({
          abi: CONTRACT_ABI,
          functionName: 'deleteCounter',
          args: [BigInt(counterId)],
        })

        const result = await sendCallsAsync({
          calls: [{
            to: CONTRACT_ADDRESS,
            data: callData,
          }],
          capabilities: {
            paymasterService: {
              url: PAYMASTER_URL,
            },
          },
        })
        const callId = typeof result === 'string' ? result : (result as { id?: string })?.id || String(result)
        return callId as `0x${string}`
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.log('⚠️ Sponsored failed:', errorMessage)
      } finally {
        setIsPendingSponsored(false)
      }
    }

    const hash = await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'deleteCounter',
      args: [BigInt(counterId)],
    })
    return hash
  }

  return { deleteCounter, isPending: isPendingRegular || isPendingSponsored, isError }
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

import { useWriteContract, useReadContract, useAccount } from 'wagmi'
import { useWriteContracts, useCapabilities } from 'wagmi/experimental'
import { useMemo } from 'react'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../constants/contract'

// Coinbase Paymaster URL from env
const PAYMASTER_URL = import.meta.env.VITE_PAYMASTER_URL || ''

/**
 * Hook to check if paymaster sponsorship is available
 */
export function usePaymasterCapabilities() {
  const { address } = useAccount()
  const { data: capabilities } = useCapabilities({
    account: address,
  })

  const paymasterCapable = useMemo(() => {
    if (!capabilities || !address) return false
    
    // Check if wallet supports paymaster on Base (chainId 8453)
    const baseCapabilities = capabilities[8453]
    return baseCapabilities?.paymasterService?.supported === true
  }, [capabilities, address])

  return { paymasterCapable, capabilities }
}

/**
 * Get paymaster service config for sponsored transactions
 */
function getPaymasterService() {
  if (!PAYMASTER_URL) {
    console.warn('⚠️ Paymaster URL not configured, transactions will not be sponsored')
    return undefined
  }
  
  return {
    url: PAYMASTER_URL,
  }
}

// START COUNTER (with paymaster support)
export function useStartCounter() {
  const { paymasterCapable } = usePaymasterCapabilities()
  
  // Use experimental writeContracts for paymaster support
  const { writeContractsAsync, isPending: isPendingSponsored } = useWriteContracts()
  
  // Fallback to regular writeContract
  const { writeContractAsync, isPending: isPendingRegular, isError } = useWriteContract()

  const startCounter = async (category: string, color: string) => {
    try {
      // Try sponsored transaction first if capable
      if (paymasterCapable && PAYMASTER_URL) {
        console.log('🎁 Using sponsored transaction via Paymaster')
        const id = await writeContractsAsync({
          contracts: [{
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'startCounter',
            args: [category, color],
          }],
          capabilities: {
            paymasterService: getPaymasterService(),
          },
        })
        // writeContractsAsync returns call ID, we need to track it differently
        // For now, return a placeholder - the actual hash will come from the wallet
        return id as unknown as `0x${string}`
      }
      
      // Fallback to regular transaction
      console.log('💰 Using regular transaction (user pays gas)')
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

  return { 
    startCounter, 
    isPending: isPendingSponsored || isPendingRegular, 
    isError,
    isSponsored: paymasterCapable && !!PAYMASTER_URL
  }
}

// START COUNTER WITH CUSTOM TIME (with paymaster support)
export function useStartCounterWithCustomTime() {
  const { paymasterCapable } = usePaymasterCapabilities()
  const { writeContractsAsync, isPending: isPendingSponsored } = useWriteContracts()
  const { writeContractAsync, isPending: isPendingRegular, isError } = useWriteContract()

  const startCounterWithCustomTime = async (
    category: string, 
    color: string, 
    customStartDate: number 
  ) => {
    try {
      console.log('📅 Custom start date (seconds):', customStartDate)
      console.log('📅 Custom start date (readable):', new Date(customStartDate * 1000).toISOString())
      
      if (paymasterCapable && PAYMASTER_URL) {
        console.log('🎁 Using sponsored transaction via Paymaster')
        const id = await writeContractsAsync({
          contracts: [{
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'startCounterWithCustomTime',
            args: [category, color, BigInt(customStartDate)],
          }],
          capabilities: {
            paymasterService: getPaymasterService(),
          },
        })
        return id as unknown as `0x${string}`
      }
      
      console.log('💰 Using regular transaction (user pays gas)')
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'startCounterWithCustomTime',
        args: [category, color, BigInt(customStartDate)],
      })
      return hash
    } catch (error) {
      console.error('Start counter with custom time error:', error)
      throw error
    }
  }

  return { 
    startCounterWithCustomTime, 
    isPending: isPendingSponsored || isPendingRegular, 
    isError,
    isSponsored: paymasterCapable && !!PAYMASTER_URL
  }
}

// RESET COUNTER (with paymaster support)
export function useResetCounter() {
  const { paymasterCapable } = usePaymasterCapabilities()
  const { writeContractsAsync, isPending: isPendingSponsored } = useWriteContracts()
  const { writeContractAsync, isPending: isPendingRegular, isError } = useWriteContract()

  const resetCounter = async (counterId: number) => {
    try {
      if (paymasterCapable && PAYMASTER_URL) {
        console.log('🎁 Using sponsored transaction via Paymaster')
        const id = await writeContractsAsync({
          contracts: [{
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'resetCounter',
            args: [BigInt(counterId)],
          }],
          capabilities: {
            paymasterService: getPaymasterService(),
          },
        })
        return id as unknown as `0x${string}`
      }
      
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

  return { resetCounter, isPending: isPendingSponsored || isPendingRegular, isError }
}

// PAUSE COUNTER (with paymaster support)
export function usePauseCounter() {
  const { paymasterCapable } = usePaymasterCapabilities()
  const { writeContractsAsync, isPending: isPendingSponsored } = useWriteContracts()
  const { writeContractAsync, isPending: isPendingRegular, isError } = useWriteContract()

  const pauseCounter = async (counterId: number) => {
    try {
      if (paymasterCapable && PAYMASTER_URL) {
        console.log('🎁 Using sponsored transaction via Paymaster')
        const id = await writeContractsAsync({
          contracts: [{
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'pauseCounter',
            args: [BigInt(counterId)],
          }],
          capabilities: {
            paymasterService: getPaymasterService(),
          },
        })
        return id as unknown as `0x${string}`
      }
      
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

  return { pauseCounter, isPending: isPendingSponsored || isPendingRegular, isError }
}

// RESUME COUNTER (with paymaster support)
export function useResumeCounter() {
  const { paymasterCapable } = usePaymasterCapabilities()
  const { writeContractsAsync, isPending: isPendingSponsored } = useWriteContracts()
  const { writeContractAsync, isPending: isPendingRegular, isError } = useWriteContract()

  const resumeCounter = async (counterId: number) => {
    try {
      if (paymasterCapable && PAYMASTER_URL) {
        console.log('🎁 Using sponsored transaction via Paymaster')
        const id = await writeContractsAsync({
          contracts: [{
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'resumeCounter',
            args: [BigInt(counterId)],
          }],
          capabilities: {
            paymasterService: getPaymasterService(),
          },
        })
        return id as unknown as `0x${string}`
      }
      
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

  return { resumeCounter, isPending: isPendingSponsored || isPendingRegular, isError }
}

// DELETE COUNTER (with paymaster support)
export function useDeleteCounter() {
  const { paymasterCapable } = usePaymasterCapabilities()
  const { writeContractsAsync, isPending: isPendingSponsored } = useWriteContracts()
  const { writeContractAsync, isPending: isPendingRegular, isError } = useWriteContract()

  const deleteCounter = async (counterId: number) => {
    try {
      if (paymasterCapable && PAYMASTER_URL) {
        console.log('🎁 Using sponsored transaction via Paymaster')
        const id = await writeContractsAsync({
          contracts: [{
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'deleteCounter',
            args: [BigInt(counterId)],
          }],
          capabilities: {
            paymasterService: getPaymasterService(),
          },
        })
        return id as unknown as `0x${string}`
      }
      
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

  return { deleteCounter, isPending: isPendingSponsored || isPendingRegular, isError }
}

// GET ACTIVE COUNTERS (read-only, no paymaster needed)
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

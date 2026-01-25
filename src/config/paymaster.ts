// Paymaster configuration for Coinbase Base
// URL loaded from environment variables for better security
export const PAYMASTER_URL = import.meta.env.VITE_PAYMASTER_URL || ''

if (!PAYMASTER_URL && import.meta.env.MODE !== 'test') {
  console.warn('⚠️ VITE_PAYMASTER_URL is not set in environment variables')
}

export const PAYMASTER_CONTEXT = {
  mode: 'SPONSOR',
}

/**
 * Request sponsorship for a user operation
 * @param userOp - The user operation to sponsor
 * @returns Paymaster data for the transaction
 */
export async function requestPaymasterSponsorship(userOp: {
  sender: string
  nonce: string
  initCode: string
  callData: string
  callGasLimit: string
  verificationGasLimit: string
  preVerificationGas: string
  maxFeePerGas: string
  maxPriorityFeePerGas: string
  paymasterAndData: string
  signature: string
}) {
  if (!PAYMASTER_URL) {
    throw new Error('Paymaster URL is not configured')
  }

  try {
    const response = await fetch(PAYMASTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'pm_sponsorUserOperation',
        params: [
          userOp,
          {
            entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
            context: PAYMASTER_CONTEXT,
          },
        ],
      }),
    })

    const data = await response.json()

    if (data.error) {
      console.error('❌ Paymaster error:', data.error)
      throw new Error(data.error.message || 'Paymaster sponsorship failed')
    }

    console.log('✅ Paymaster sponsorship approved:', data.result)
    return data.result

  } catch (error) {
    console.error('❌ Paymaster request failed:', error)
    throw error
  }
}

/**
 * Check if paymaster is available
 */
export async function checkPaymasterStatus(): Promise<boolean> {
  if (!PAYMASTER_URL) {
    return false
  }

  try {
    const response = await fetch(PAYMASTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'pm_paymasterStatus',
        params: [],
      }),
    })

    const data = await response.json()
    return !data.error

  } catch (error) {
    console.error('❌ Paymaster status check failed:', error)
    return false
  }
}
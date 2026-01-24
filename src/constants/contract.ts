export const CONTRACT_ADDRESS = (import.meta.env.VITE_CONTRACT_ADDRESS || '0xF6016fCb6653e4D351b976c0574C0359d5D209f4') as `0x${string}`

export const CONTRACT_ABI = [
  {
    type: 'function',
    name: 'startCounter',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'category', type: 'string' },
      { name: 'color', type: 'string' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    type: 'function',
    name: 'startCounterWithCustomTime',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'category', type: 'string' },
      { name: 'color', type: 'string' },
      { name: 'customStartTime', type: 'uint64' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    type: 'function',
    name: 'pauseCounter',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'id', type: 'uint256' }],
    outputs: []
  },
  {
    type: 'function',
    name: 'resumeCounter',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'id', type: 'uint256' }],
    outputs: []
  },
  {
    type: 'function',
    name: 'resetCounter',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'id', type: 'uint256' }],
    outputs: []
  },
  {
    type: 'function',
    name: 'deleteCounter',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'id', type: 'uint256' }],
    outputs: []
  },
  {
    type: 'function',
    name: 'updateMetadata',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'id', type: 'uint256' },
      { name: 'category', type: 'string' },
      { name: 'color', type: 'string' }
    ],
    outputs: []
  },
  {
    type: 'function',
    name: 'getCurrentStreak',
    stateMutability: 'view',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'id', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'uint64' }]
  },
  {
    type: 'function',
    name: 'getCounter',
    stateMutability: 'view',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'id', type: 'uint256' }
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'startedAt', type: 'uint64' },
          { name: 'pausedAt', type: 'uint64' },
          { name: 'totalPausedTime', type: 'uint64' },
          { name: 'longestStreak', type: 'uint64' },
          { name: 'totalResets', type: 'uint32' },
          { name: 'active', type: 'bool' },
          { name: 'category', type: 'string' },
          { name: 'color', type: 'string' }
        ]
      }
    ]
  },
  {
    type: 'function',
    name: 'getActiveCounters',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [
      { name: '', type: 'uint256[]' },
      {
        name: '',
        type: 'tuple[]',
        components: [
          { name: 'startedAt', type: 'uint64' },
          { name: 'pausedAt', type: 'uint64' },
          { name: 'totalPausedTime', type: 'uint64' },
          { name: 'longestStreak', type: 'uint64' },
          { name: 'totalResets', type: 'uint32' },
          { name: 'active', type: 'bool' },
          { name: 'category', type: 'string' },
          { name: 'color', type: 'string' }
        ]
      }
    ]
  },
  {
    type: 'function',
    name: 'getRelapseHistory',
    stateMutability: 'view',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'id', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'uint64[]' }]
  },
  {
    type: 'function',
    name: 'countersCount',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    type: 'event',
    name: 'CounterStarted',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'id', type: 'uint256', indexed: true },
      { name: 'startedAt', type: 'uint64', indexed: false },
      { name: 'category', type: 'string', indexed: false },
      { name: 'color', type: 'string', indexed: false }
    ]
  },
  {
    type: 'event',
    name: 'CounterPaused',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'id', type: 'uint256', indexed: true },
      { name: 'pausedAt', type: 'uint64', indexed: false }
    ]
  },
  {
    type: 'event',
    name: 'CounterResumed',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'id', type: 'uint256', indexed: true },
      { name: 'resumedAt', type: 'uint64', indexed: false }
    ]
  },
  {
    type: 'event',
    name: 'CounterReset',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'id', type: 'uint256', indexed: true },
      { name: 'resetAt', type: 'uint64', indexed: false },
      { name: 'previousStreak', type: 'uint64', indexed: false }
    ]
  },
  {
    type: 'event',
    name: 'CounterDeleted',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'id', type: 'uint256', indexed: true }
    ]
  },
  {
    type: 'event',
    name: 'MetadataUpdated',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'id', type: 'uint256', indexed: true },
      { name: 'category', type: 'string', indexed: false },
      { name: 'color', type: 'string', indexed: false }
    ]
  },
  {
    type: 'event',
    name: 'NewStreakRecord',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'id', type: 'uint256', indexed: true },
      { name: 'newRecord', type: 'uint64', indexed: false }
    ]
  }
] as const
export const CONTRACT_ADDRESS = (import.meta.env.VITE_CONTRACT_ADDRESS || '0xf4a1037F03aE7586213Cd0F03C50457fE156946d') as `0x${string}`

export const CONTRACT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" }
    ],
    "name": "CounterDeleted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": false, "internalType": "uint64", "name": "pausedAt", "type": "uint64" }
    ],
    "name": "CounterPaused",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": false, "internalType": "uint64", "name": "currentStreak", "type": "uint64" }
    ],
    "name": "CounterReset",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": false, "internalType": "uint64", "name": "pausedDuration", "type": "uint64" }
    ],
    "name": "CounterResumed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": false, "internalType": "uint64", "name": "startedAt", "type": "uint64" },
      { "indexed": false, "internalType": "string", "name": "category", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "color", "type": "string" }
    ],
    "name": "CounterStarted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "category", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "color", "type": "string" }
    ],
    "name": "MetadataUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": false, "internalType": "uint64", "name": "longestStreak", "type": "uint64" }
    ],
    "name": "NewStreakRecord",
    "type": "event"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "countersCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }],
    "name": "deleteCounter",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "getActiveCounters",
    "outputs": [
      { "internalType": "uint256[]", "name": "ids", "type": "uint256[]" },
      {
        "components": [
          { "internalType": "uint64", "name": "startedAt", "type": "uint64" },
          { "internalType": "uint64", "name": "pausedAt", "type": "uint64" },
          { "internalType": "uint64", "name": "totalPausedTime", "type": "uint64" },
          { "internalType": "uint64", "name": "longestStreak", "type": "uint64" },
          { "internalType": "uint32", "name": "totalResets", "type": "uint32" },
          { "internalType": "bool", "name": "active", "type": "bool" },
          { "internalType": "string", "name": "category", "type": "string" },
          { "internalType": "string", "name": "color", "type": "string" }
        ],
        "internalType": "struct DaysSinceQuitV4.Counter[]",
        "name": "counterData",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "user", "type": "address" },
      { "internalType": "uint256", "name": "id", "type": "uint256" }
    ],
    "name": "getCounter",
    "outputs": [
      {
        "components": [
          { "internalType": "uint64", "name": "startedAt", "type": "uint64" },
          { "internalType": "uint64", "name": "pausedAt", "type": "uint64" },
          { "internalType": "uint64", "name": "totalPausedTime", "type": "uint64" },
          { "internalType": "uint64", "name": "longestStreak", "type": "uint64" },
          { "internalType": "uint32", "name": "totalResets", "type": "uint32" },
          { "internalType": "bool", "name": "active", "type": "bool" },
          { "internalType": "string", "name": "category", "type": "string" },
          { "internalType": "string", "name": "color", "type": "string" }
        ],
        "internalType": "struct DaysSinceQuitV4.Counter",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "user", "type": "address" },
      { "internalType": "uint256", "name": "id", "type": "uint256" }
    ],
    "name": "getCurrentStreak",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "user", "type": "address" },
      { "internalType": "uint256", "name": "id", "type": "uint256" }
    ],
    "name": "getRelapseHistory",
    "outputs": [{ "internalType": "uint64[]", "name": "", "type": "uint64[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }],
    "name": "pauseCounter",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }],
    "name": "resetCounter",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }],
    "name": "resumeCounter",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "category", "type": "string" },
      { "internalType": "string", "name": "color", "type": "string" }
    ],
    "name": "startCounter",
    "outputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "id", "type": "uint256" },
      { "internalType": "string", "name": "category", "type": "string" },
      { "internalType": "string", "name": "color", "type": "string" }
    ],
    "name": "updateMetadata",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const
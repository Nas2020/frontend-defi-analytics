// // src/config/index.ts
// interface NetworkConfig {
//     name: string;
//     apiUrl: string;
//   }

//   interface Config {
//     networks: {
//       mainnet: NetworkConfig;
//       testnet: NetworkConfig;
//     };
//     defaultNetwork: 'mainnet' | 'testnet';
//     apiBaseUrl: string;
//   }

//   export const config: Config = {
//     networks: {
//       mainnet: {
//         name: 'Mainnet',
//         apiUrl: 'https://explorer.vscblockchain.org/api',
//       },
//       testnet: {
//         name: 'Testnet',
//         apiUrl: 'https://testnet-scan.vsgofficial.com/api',
//       },
//     },
//     defaultNetwork: 'mainnet',
//     apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002',
//   };

// src/config/index.ts
interface NetworkDefinition {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
}

/**
 * These two objects map directly to what MetaMask (and other wallets) expect
 * when you call `wallet_addEthereumChain` or `wallet_switchEthereumChain`.
 */
export const SUPPORTED_NETWORKS: Record<"mainnet" | "testnet", NetworkDefinition> = {
  mainnet: {
    chainId: import.meta.env.VITE_VSC_MAINNET_CHAIN_ID || "0x668ca",
    chainName: import.meta.env.VITE_VSC_MAINNET_NAME || "Vector Smart Chain",
    nativeCurrency: {
      name: import.meta.env.VITE_VSC_MAINNET_CURRENCY_NAME || "Vector Smart Chain",
      symbol: import.meta.env.VITE_VSC_MAINNET_CURRENCY_SYMBOL || "VSG",
      decimals: 18,
    },
    rpcUrls: [
      import.meta.env.VITE_VSC_MAINNET_RPC_URL || "https://rpc.vscblockchain.org",
    ],
    blockExplorerUrls: [
      import.meta.env.VITE_VSC_MAINNET_BLOCK_EXPLORER_URL || "https://explorer.vscblockchain.org",
    ],
  },
  testnet: {
    chainId: import.meta.env.VITE_VSC_TESTNET_CHAIN_ID || "0x668cc",
    chainName: import.meta.env.VITE_VSC_TESTNET_NAME || "Vector Smart Chain Testnet",
    nativeCurrency: {
      name: import.meta.env.VITE_VSC_TESTNET_CURRENCY_NAME || "Vector Smart Chain",
      symbol: import.meta.env.VITE_VSC_TESTNET_CURRENCY_SYMBOL || "VSG",
      decimals: 18,
    },
    rpcUrls: [
      import.meta.env.VITE_VSC_TESTNET_RPC_URL || "https://testnet-rpc.vsgofficial.com",
    ],
    blockExplorerUrls: [
      import.meta.env.VITE_VSC_TESTNET_BLOCK_EXPLORER_URL || "https://testnet-scan.vsgofficial.com",
    ],
  },
};

/**
 * If you want a default chain (e.g., mainnet) you can specify it here.
 */
export const DEFAULT_CHAIN_ID = SUPPORTED_NETWORKS.mainnet.chainId;

// (Optionally keep your other config here as well…)
interface NetworkConfig {
  name: string;
  apiUrl: string;
}

interface Config {
  networks: {
    mainnet: NetworkConfig;
    testnet: NetworkConfig;
  };
  defaultNetwork: "mainnet" | "testnet";
  apiBaseUrl: string;
}

export const config: Config = {
  networks: {
    mainnet: {
      name: "Mainnet",
      apiUrl: "https://explorer.vscblockchain.org/api",
    },
    testnet: {
      name: "Testnet",
      apiUrl: "https://testnet-scan.vsgofficial.com/api",
    },
  },
  defaultNetwork: "mainnet",
  // Already in your code:
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3002",
};
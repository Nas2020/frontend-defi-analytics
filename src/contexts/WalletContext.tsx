// // src/contexts/WalletContext.tsx

// import React, {
//   createContext,
//   useContext,
//   useState,
//   useCallback,
//   useEffect,
// } from "react";
// import { bech32 } from "bech32";
// import type { Web3BaseProvider } from "web3-types";
// import { DEFAULT_CHAIN_ID, SUPPORTED_NETWORKS } from "@/config";

// /**
//  * Extend window type to include an Ethereum provider
//  * that has a typed .request() method returning a Promise<any>.
//  */
// declare global {
//   interface Window {
//     ethereum?: Web3BaseProvider & {
//       request: <T = unknown>(args: {
//         method: string;
//         params?: any[];
//       }) => Promise<T>;
//       on: (event: string, callback: (...args: any[]) => void) => void;
//       removeListener: (
//         event: string,
//         callback: (...args: any[]) => void
//       ) => void;
//       selectedAddress: string | null;
//     };
//   }
// }

// interface WalletContextType {
//   isConnected: boolean;
//   walletAddress: string;
//   walletAddressEth: string;
//   connect: () => Promise<void>;
//   disconnect: () => Promise<void>;
//   error: string | null;
//   chainId: string | null;
//   switchNetwork: (chainId: string) => Promise<void>;
// }

// const WalletContext = createContext<WalletContextType>({
//   isConnected: false,
//   walletAddress: "",
//   walletAddressEth: "",
//   connect: async () => {},
//   disconnect: async () => {},
//   error: null,
//   chainId: null,
//   switchNetwork: async () => {},
// });

// function hexToBytes(hex: string) {
//   // Remove "0x" prefix, if present
//   const cleaned = hex.replace(/^0x/, "");
//   if (cleaned.length % 2 !== 0) {
//     throw new Error("Invalid hex string, length must be even");
//   }

//   const bytes = new Uint8Array(cleaned.length / 2);
//   for (let i = 0; i < cleaned.length; i += 2) {
//     bytes[i / 2] = parseInt(cleaned.substring(i, i + 2), 16);
//   }
//   return bytes;
// }

// /**
//  * If you need a bech32 "vsc..." address (Cosmos-style) from an EVM "0x" address,
//  * here is a helper. Otherwise, remove it if you don’t need it.
//  *
//  */
// const encodeToBech32 = (prefix: string, hexAddress: string) => {
//   const cleanHex = hexAddress.replace(/^0x/, "");
//   const addressBytes = hexToBytes(cleanHex);
//   const words = bech32.toWords(addressBytes);
//   return bech32.encode(prefix, words);
// };

// export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
//   const [isConnected, setIsConnected] = useState(false);
//   const [walletAddress, setWalletAddress] = useState("");
//   const [walletAddressEth, setWalletAddressEth] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [chainId, setChainId] = useState<string | null>(null);

//   /**
//    * When MetaMask emits "accountsChanged", update state accordingly.
//    */
//   const handleAccountsChanged = useCallback((accounts: string[]) => {
//     if (!accounts || accounts.length === 0) {
//       setIsConnected(false);
//       setWalletAddress("");
//       setWalletAddressEth("");
//       return;
//     }
//     const address = accounts[0];
//     setWalletAddressEth(address);

//     // Convert to a "vsc..." address, if desired
//     const cosmosAddress = encodeToBech32("vsc", address);
//     setWalletAddress(cosmosAddress);

//     setIsConnected(true);
//   }, []);

//   /**
//    * When chain changes, store it and (optionally) reload the page.
//    */
//   const handleChainChanged = useCallback((newChainId: string) => {
//     setChainId(newChainId);
//     // Recommended by MetaMask to ensure dApp re-initializes properly
//     window.location.reload();
//   }, []);

//   /**
//    * Attach "accountsChanged" and "chainChanged" listeners, return cleanup.
//    */
//   const setupEventListeners = useCallback(() => {
//     if (!window.ethereum) return;

//     window.ethereum.on("accountsChanged", handleAccountsChanged);
//     window.ethereum.on("chainChanged", handleChainChanged);

//     return () => {
//       window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
//       window.ethereum?.removeListener("chainChanged", handleChainChanged);
//     };
//   }, [handleAccountsChanged, handleChainChanged]);

//   /**
//    * On mount, if MetaMask is present:
//    * - Possibly detect an already selected address
//    * - Figure out the current chain ID
//    * - Setup event listeners
//    */
//   useEffect(() => {

//     if (window.ethereum) {
//       window.ethereum
//         .request<string[]>({ method: "eth_accounts" })
//         .then((accounts) => {
//           if (accounts?.length) {
//             handleAccountsChanged(accounts);
//           }
//         })
//         .catch(console.error);
//     }
//   }, [handleAccountsChanged, setupEventListeners]);

//   /**
//    * Switch to (or add) a chain if MetaMask doesn't know it.
//    */
//   const switchNetwork = async (targetChainId: string) => {
//     if (!window.ethereum) {
//       throw new Error("MetaMask is not installed");
//     }
//     try {
//       await window.ethereum.request({
//         method: "wallet_switchEthereumChain",
//         params: [{ chainId: targetChainId }],
//       });
//     } catch (err: any) {
//       if (err.code === 4902) {
//         // Chain not known to MetaMask, attempt to add it
//         const chainConfig = Object.values(SUPPORTED_NETWORKS).find(
//           (net) => net.chainId.toLowerCase() === targetChainId.toLowerCase()
//         );
//         if (!chainConfig) {
//           throw new Error("Unsupported chain ID: " + targetChainId);
//         }
//         await window.ethereum.request({
//           method: "wallet_addEthereumChain",
//           params: [chainConfig],
//         });
//       } else {
//         throw err;
//       }
//     }
//   };

//   /**
//    * "Connect" button logic:
//    * - If on the wrong chain, try switching to the default chain
//    * - Request accounts from MetaMask
//    */
//   const connect = useCallback(async () => {
//     if (!window.ethereum) {
//       throw new Error("MetaMask is not installed");
//     }
//     try {
//       setError(null);

//       // If user is on the wrong chain, switch first:
//       if (chainId?.toLowerCase() !== DEFAULT_CHAIN_ID.toLowerCase()) {
//         await switchNetwork(DEFAULT_CHAIN_ID);
//       }

//       // Request account access. Cast the result to string[] to fix the TS error.
//       const accounts = (await window.ethereum.request({
//         method: "eth_requestAccounts",
//       })) as string[];

//       handleAccountsChanged(accounts);
//       setupEventListeners();

//       localStorage.setItem("walletConnected", "true");
//     } catch (err: any) {
//       console.error("Failed to connect wallet:", err);
//       setError(err.message ?? "Failed to connect wallet");
//       throw err;
//     }
//   }, [chainId, handleAccountsChanged, setupEventListeners]);

//   /**
//    * "Disconnect" is just local cleanup, since MetaMask doesn't have an official disconnect.
//    */
//   const disconnect = useCallback(async () => {
//     setIsConnected(false);
//     setWalletAddress("");
//     setWalletAddressEth("");
//     localStorage.removeItem("walletConnected");

//     // Cleanup event listeners
//     if (window.ethereum) {
//       window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
//       window.ethereum.removeListener("chainChanged", handleChainChanged);
//     }
//   }, [handleAccountsChanged, handleChainChanged]);

//   /**
//    * If we were connected previously, attempt to connect on page load.
//    */
//   useEffect(() => {
//     const wasConnected = localStorage.getItem("walletConnected") === "true";
//     if (wasConnected) {
//       connect().catch((err) => console.error("Auto-connect failed:", err));
//     }
//   }, [connect]);

//   return (
//     <WalletContext.Provider
//       value={{
//         isConnected,
//         walletAddress,
//         walletAddressEth,
//         connect,
//         disconnect,
//         error,
//         chainId,
//         switchNetwork,
//       }}
//     >
//       {children}
//     </WalletContext.Provider>
//   );
// };

// export const useWallet = () => useContext(WalletContext);

// src/contexts/WalletContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { bech32 } from "bech32";
import type { Web3BaseProvider } from "web3-types";
import { DEFAULT_CHAIN_ID, SUPPORTED_NETWORKS } from "@/config";

/** Extend window type… */
declare global {
  interface Window {
    ethereum?: Web3BaseProvider & {
      request: (args: { method: string; params?: any[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (
        event: string,
        callback: (...args: any[]) => void
      ) => void;
      selectedAddress: string | null;
    };
  }
}

interface WalletContextType {
  isConnected: boolean;
  walletAddress: string;
  walletAddressEth: string;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  error: string | null;
  chainId: string | null;
  switchNetwork: (chainId: string) => Promise<void>;
}

const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  walletAddress: "",
  walletAddressEth: "",
  connect: async () => {},
  disconnect: async () => {},
  error: null,
  chainId: null,
  switchNetwork: async () => {},
});

/** Convert hex to a Uint8Array without using Buffer. */
function hexToBytes(hex: string) {
  const cleaned = hex.replace(/^0x/, "");
  if (cleaned.length % 2 !== 0) {
    throw new Error("Invalid hex string, length must be even");
  }
  const bytes = new Uint8Array(cleaned.length / 2);
  for (let i = 0; i < cleaned.length; i += 2) {
    bytes[i / 2] = parseInt(cleaned.substring(i, i + 2), 16);
  }
  return bytes;
}

/** Convert EVM "0x" address to bech32 (if needed). */
const encodeToBech32 = (prefix: string, hexAddress: string) => {
  const cleaned = hexAddress.replace(/^0x/, "");
  const bytes = hexToBytes(cleaned);
  const words = bech32.toWords(bytes);
  return bech32.encode(prefix, words);
};

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletAddressEth, setWalletAddressEth] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);

  const handleAccountsChanged = useCallback((accounts: string[]) => {
    if (!accounts || accounts.length === 0) {
      setIsConnected(false);
      setWalletAddress("");
      setWalletAddressEth("");
      return;
    }
    const address = accounts[0];
    setWalletAddressEth(address);

    const cosmosAddress = encodeToBech32("vsc", address);
    setWalletAddress(cosmosAddress);

    setIsConnected(true);
  }, []);

  const handleChainChanged = useCallback((newChainId: string) => {
    setChainId(newChainId);
    // Recommended by MetaMask
    window.location.reload();
  }, []);

  const setupEventListeners = useCallback(() => {
    if (!window.ethereum) return;

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, [handleAccountsChanged, handleChainChanged]);

  /** On mount, detect existing accounts. */
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((result) => {
          // Check that result is an array
          if (Array.isArray(result)) {
            const accounts = result as string[];
            if (accounts.length) {
              handleAccountsChanged(accounts);
            }
          } else {
            console.warn("eth_accounts did not return an array:", result);
          }
        })
        .catch(console.error);

      // Setup listeners, if you also want to do that here
      const cleanup = setupEventListeners();
      return cleanup;
    }
  }, [handleAccountsChanged, setupEventListeners]);

  const switchNetwork = async (targetChainId: string) => {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed");
    }
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: targetChainId }],
      });
    } catch (err: any) {
      // If the chain is unknown, add it
      if (err.code === 4902) {
        const chainConfig = Object.values(SUPPORTED_NETWORKS).find(
          (net) => net.chainId.toLowerCase() === targetChainId.toLowerCase()
        );
        if (!chainConfig) {
          throw new Error("Unsupported chain ID: " + targetChainId);
        }
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [chainConfig],
        });
      } else {
        throw err;
      }
    }
  };

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed");
    }
    try {
      setError(null);

      if (chainId?.toLowerCase() !== DEFAULT_CHAIN_ID.toLowerCase()) {
        await switchNetwork(DEFAULT_CHAIN_ID);
      }

      const result = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (!Array.isArray(result)) {
        throw new Error("MetaMask did not return an array of accounts.");
      }
      const accounts = result as string[];

      handleAccountsChanged(accounts);
      setupEventListeners();
      localStorage.setItem("walletConnected", "true");
    } catch (err: any) {
      console.error("Failed to connect wallet:", err);
      setError(err.message ?? "Failed to connect wallet");
      throw err;
    }
  }, [chainId, handleAccountsChanged, setupEventListeners]);

  const disconnect = useCallback( async () => {
    setIsConnected(false);
    setWalletAddress("");
    setWalletAddressEth("");
    localStorage.removeItem("walletConnected");

    if (window.ethereum) {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    }
  }, [handleAccountsChanged, handleChainChanged]);

  /** If we were connected previously, try to reconnect on page load. */
  useEffect(() => {
    const wasConnected = localStorage.getItem("walletConnected") === "true";
    if (wasConnected) {
      connect().catch((err) => console.error("Auto-connect failed:", err));
    }
  }, [connect]);

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        walletAddress,
        walletAddressEth,
        connect,
        disconnect,
        error,
        chainId,
        switchNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);

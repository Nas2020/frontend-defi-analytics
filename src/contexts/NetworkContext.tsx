// src/contexts/NetworkContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { config } from "@/config";
import { NetworkContextType } from "./NetworkContext.types";
import { Loading } from "@/components/ui/loading";

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [network, setNetworkState] = useState(
    () => localStorage.getItem("network") || config.defaultNetwork
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to set network both in frontend and backend
  const setNetwork = async (newNetwork: string) => {
    try {
      setError(null);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/network`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ network: newNetwork }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update network");
      }

      const data = await response.json();
      setNetworkState(data.network);
      localStorage.setItem("network", data.network);

      // Verify connection after network change
      const testResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/test`
      );
      if (!testResponse.ok) {
        throw new Error("Network connection test failed");
      }
    } catch (error) {
      console.error("Failed to update network:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update network"
      );
      // Revert to previous network on error
      setNetworkState(network);
    }
  };

  // Fetch initial network state from backend
  useEffect(() => {
    const initializeNetwork = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get current network from backend
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/network`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch network state");
        }

        const data = await response.json();
        setNetworkState(data.network);
        localStorage.setItem("network", data.network);
      } catch (error) {
        console.error("Failed to fetch network state:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch network state"
        );
        // Use local storage as fallback
        const savedNetwork = localStorage.getItem("network");
        if (savedNetwork) {
          setNetworkState(savedNetwork);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeNetwork();
  }, []);

  const contextValue = {
    network,
    setNetwork,
    isLoading,
    error,
  };

 
  if (isLoading) {
    return <Loading />;
  }

  return (
    <NetworkContext.Provider value={contextValue}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error("useNetwork must be used within a NetworkProvider");
  }
  return context;
}

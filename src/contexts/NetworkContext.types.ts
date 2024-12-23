// src/contexts/NetworkContext.types.ts
export interface NetworkContextType {
    network: string;
    setNetwork: (network: string) => Promise<void>;
    isLoading: boolean;
    error: string | null;
  }
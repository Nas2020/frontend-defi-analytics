import React from "react";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import NetworkSelector from "./NetworkSelector";
import { useNetwork } from "@/contexts/NetworkContext";
import { useWallet } from "@/contexts/WalletContext";
import { useToast } from "./ui/use-toast";

const Header: React.FC = () => {
  const { network, setNetwork, error: networkError } = useNetwork();
  const {
    isConnected,
    connect,
    disconnect,
    walletAddressEth,
    error: walletError,
  } = useWallet();
  const { toast } = useToast();
  const handleWalletClick = async () => {
    if (isConnected) {
      await disconnect();
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected successfully.",
      });
    } else {
      try {
        await connect();
        // Add success toast after successful connection
        toast({
          title: "Success",
          description: "Wallet connected successfully",
        });
      } catch (err) {
        console.error(err);
        toast({
          title: "Connection Failed",
          description:
            walletError || "Failed to connect wallet. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="flex justify-between items-center p-4 border-b dark:border-gray-800">
      <div className="flex items-center gap-3">
        <img
          src="/assets/logo.png"
          alt="VSG Logo"
          className="h-20 w-20 object-contain"
          width={32}
          height={32}
        />
        <div>
          <h1 className="text-xl font-bold dark:text-white">VSG Analytics</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            DeFi Insights Dashboard
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <NetworkSelector value={network} onNetworkChange={setNetwork} />
          {networkError && (
            <p className="absolute top-full left-0 mt-1 text-xs text-red-500">
              {networkError}
            </p>
          )}
        </div>
        <ThemeToggle />
        <div className="flex items-center gap-4">
          {/* Network info, if you want it displayed all the time */}
          {isConnected && (
            <div className="flex items-end flex-col mr-2">
              <span className="text-sm font-medium">
                {walletAddressEth.slice(0, 6)}...{walletAddressEth.slice(-4)}
              </span>
              <span className="text-xs text-gray-500">
                {network === "mainnet" ? "VSC Mainnet" : "VSC Testnet"}
              </span>
            </div>
          )}
          <Button
            onClick={handleWalletClick}
            className="flex items-center gap-2"
          >
            <Wallet className="h-4 w-4" />
            {isConnected ? (
              <>
                <span className="hidden sm:inline">Disconnect</span>
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full" />
              </>
            ) : (
              "Connect Wallet"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;

import React, { useState } from "react";
import { config } from "@/config";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useNetwork } from "@/contexts/NetworkContext";

interface NetworkSelectorProps {
  value: string;
  onNetworkChange: (network: string) => Promise<void>;
}

const NetworkSelector: React.FC<NetworkSelectorProps> = ({
  value,
  onNetworkChange,
}) => {
  const [isChanging, setIsChanging] = useState(false);
  const { error } = useNetwork();

  const handleNetworkChange = async (newNetwork: string) => {
    try {
      setIsChanging(true);
      await onNetworkChange(newNetwork);
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div>
      <Select
        value={value}
        onValueChange={handleNetworkChange}
        disabled={isChanging}
      >
        <SelectTrigger className="w-[140px] bg-white dark:bg-gray-800">
          <SelectValue placeholder="Select Network" />
          {isChanging && <span className="ml-2">...</span>}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="mainnet" className="cursor-pointer">
            {config.networks.mainnet.name}
          </SelectItem>
          <SelectItem value="testnet" className="cursor-pointer">
            {config.networks.testnet.name}
          </SelectItem>
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default NetworkSelector;

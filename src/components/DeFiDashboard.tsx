import { useState, useEffect } from "react";
import Header from "./Header";
import {
  BarChart3,
  CircleDollarSign,
  Coins,
  Trophy,
  Award,
  ArrowUpRight,
} from "lucide-react";
import { useNetwork } from "@/contexts/NetworkContext";
import { OverviewTab } from "./tabs/OverviewTab";
import { VSGInfo } from "@/types/vsg";
import { NftInfoResponse, BlockchainNFTDetails, GasDistributorDetails } from "@/types/nft";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { FinancialMetricsTab } from "./tabs/FinancialMetricsTab";
import { MetricCard } from "./shared/MetricCard";
import SupplyAnalysisTab from "./tabs/SupplyAnalysisTab";
import { NFTAnalysisTab } from "./tabs/NFTAnalysisTab";
import { RewardsTab } from "./tabs/RewardsTab";
import NetworkStatusTab from "./tabs/NetworkStatusTab";

const DeFiDashboard = () => {
  const [vsgData, setVsgData] = useState<VSGInfo | null>(null);
  const [nftData, setNftData] = useState<NftInfoResponse | null>(null);
  const [blockchainNftDetails, setBlockchainNftDetails] = useState<BlockchainNFTDetails[] | null>(null);
  const [distributorDetails, setDistributorDetails] = useState<GasDistributorDetails[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isNetworkSwitching, setIsNetworkSwitching] = useState<boolean>(false);
  const { network } = useNetwork();

  useEffect(() => {
    const fetchNftInfo = async () => {
      try {
        setIsNetworkSwitching(true);
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/nft-info`
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const response = await res.json();
        
        // Handle mainnet response structure
        if (network === 'mainnet' && response.nftInfo) {
          setNftData(response.nftInfo);
          setBlockchainNftDetails(response.nftDetails || null);
          setDistributorDetails(response.distributorDetails || null);
        } else {
          // Handle testnet response structure
          setNftData(response);
          setBlockchainNftDetails(null);
          setDistributorDetails(null);
        }
      } catch (err) {
        console.error("Failed to fetch NFT info:", err);
        setError(`Failed to load NFT info for ${network}`);
      } finally {
        setLoading(false);
        setIsNetworkSwitching(false);
      }
    };

    fetchNftInfo();
  }, [network]);

  useEffect(() => {
    const fetchVSGInfo = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/vsg-info`
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data: VSGInfo = await res.json();
        setVsgData(data);
      } catch (err) {
        console.error("Failed to fetch VSG info:", err);
        setError(`Failed to load VSG info for ${network}`);
      } finally {
        setLoading(false);
      }
    };

    fetchVSGInfo();
  }, [network]);

  // Add loading indicator for network changes
  const LoadingOverlay = () => (
    <div className="absolute inset-0 bg-gray-900/50 dark:bg-gray-900/70 flex items-center justify-center z-50 rounded-lg">
      <div className="flex flex-col items-center space-y-2">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="text-sm text-white">Switching to {network}...</p>
      </div>
    </div>
  );

  const totalEarningsAllTypes = distributorDetails?.reduce(
          (sum, dist) => sum + parseFloat(dist.totalTypeEarnings),
          0
        );

  const metrics = [
    {
      title: "Current VSG Price",
      value: vsgData ? `US$ ${vsgData.price.current.toFixed(6)}` : "Loading...",
      icon: Coins,
      trend:
        vsgData?.price.change24h && vsgData.price.change24h > 0 ? "up" : "down",
      change: vsgData ? `${vsgData.price.change24h.toFixed(2)}%` : "0%",
    },
    {
      title: "Market Cap",
      value: vsgData
        ? `$${(vsgData.market.marketCap / 1000000).toFixed(2)}M`
        : "Loading...",
      icon: CircleDollarSign,
      trend:
        vsgData?.market.marketCapChange24h &&
        vsgData.market.marketCapChange24h > 0
          ? "up"
          : "down",
      change: vsgData
        ? `${vsgData.market.marketCapChange24h.toFixed(2)}%`
        : "0%",
    },
    {
      title: "24h Volume",
      value: vsgData
        ? `$${(vsgData.market.volume24h / 1000).toFixed(2)}K`
        : "Loading...",
      icon: BarChart3,
      trend: "none",
      change: "24h",
    },
    {
      title: "Market Rank",
      value: vsgData ? `#${vsgData.market.marketCapRank}` : "Loading...",
      icon: Trophy,
      trend: "none",
      change: "Global Rank",
    },
    {
      title: "Total VSG NFTs",
      value: nftData
        ? nftData.data.reduce((sum, nft) => sum + nft.totalSupply, 0).toString()
        : "0",
      icon: Award,
      trend: "up",
      change: "3.2%",
    },
    {
      title: "Gas Distributed",
      value: distributorDetails 
        ? `${distributorDetails.reduce((sum, dist) => 
            sum + parseFloat(dist.totalDistributed), 0).toFixed(2)} VSG`
        : "0 VSG",
      icon: Coins,
      trend: "up",
      change: "24h",
    },
    {
      title: "Total Rewards",
      // value: "1,523.45",
      value: `${totalEarningsAllTypes?.toFixed(2)} VSG`,
      icon: Coins,
      trend: "up",
      change: "20.1%",
    },
    {
      title: "Average APY",
      value: "12.3%",
      icon: ArrowUpRight,
      trend: "up",
      change: "1.5%",
    },
    // {
    //   title: "Locked Supply",
    //   value: vsgData ? `${(vsgData.supply.locked / 1000000).toFixed(2)}M` : "Loading...",
    //   icon: Lock,
    //   trend: "none",
    //   change: `${vsgData ? ((vsgData.supply.locked / vsgData.supply.total) * 100).toFixed(2) : 0}% of total`,
    // },
    // {
    //   title: "30D Price Change",
    //   value: vsgData ? `${vsgData.price.change30d.toFixed(2)}%` : "Loading...",
    //   icon: Clock,
    //   trend: vsgData?.price.change30d && vsgData.price.change30d > 0 ? "up" : "down",
    //   change: "30 days",
    // }
    // ... rest of your metrics
  ];

  return (
    <div className="flex flex-col p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {isNetworkSwitching && <LoadingOverlay />}
      <Header />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} metric={metric} />
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="dark:bg-gray-800">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial-metrics">Metrics</TabsTrigger>
          <TabsTrigger value="supply-analysis">Supply Analysis</TabsTrigger>
          <TabsTrigger value="nft-analysis">NFT Analysis</TabsTrigger>
          <TabsTrigger value="rewards">Yield Optimization</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          {/* ... other triggers */}
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab
            vsgData={vsgData}
            nftData={nftData}
            blockchainNftDetails={blockchainNftDetails}
            distributorDetails={distributorDetails}
            loading={loading}
            error={error}
          />
        </TabsContent>
        <TabsContent value="financial-metrics">
          <FinancialMetricsTab vsgData={vsgData} />
        </TabsContent>
        <TabsContent value="supply-analysis">
          <SupplyAnalysisTab vsgData={vsgData} />
        </TabsContent>
        <TabsContent value="nft-analysis">
          <NFTAnalysisTab 
            nftData={nftData}
            blockchainNftDetails={blockchainNftDetails}
            distributorDetails={distributorDetails}
            loading={loading} 
            error={error} 
          />
        </TabsContent>

        <TabsContent value="rewards">
          <RewardsTab />
        </TabsContent>
        <TabsContent value="network">
        <NetworkStatusTab />
      </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeFiDashboard;
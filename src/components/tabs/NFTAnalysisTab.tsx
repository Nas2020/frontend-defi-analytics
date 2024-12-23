import React, { useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useNetwork } from "@/contexts/NetworkContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  NftInfoResponse,
  BlockchainNFTDetails,
  GasDistributorDetails,
} from "@/types/nft";

interface NFTAnalysisTabProps {
  nftData: NftInfoResponse | null;
  blockchainNftDetails: BlockchainNFTDetails[] | null;
  distributorDetails: GasDistributorDetails[] | null;
  loading: boolean;
  error: string | null;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

export const NFTAnalysisTab: React.FC<NFTAnalysisTabProps> = ({
  nftData,
  blockchainNftDetails,
  distributorDetails,
  loading,
  error,
}) => {
  const { network } = useNetwork();
  const isMainnet = network === "mainnet";

  const distributionData = useMemo(() => {
    if (!distributorDetails) return [];
    return distributorDetails.map((dist) => ({
      name: dist.name.replace(" Distributor", ""),
      value: parseFloat(dist.totalTypeEarnings),
    }));
  }, [distributorDetails]);

  const supplyHoldersData = useMemo(() => {
    if (!nftData) return [];
    return nftData.data.map((nft) => ({
      name: nft.name,
      supply: nft.totalSupply,
      holders: nft.holders,
    }));
  }, [nftData]);

  const renderDistributionChart = () => {
    if (!isMainnet || !distributorDetails) return null;

    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold dark:text-white mb-4">
          Rewards Distribution
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={distributionData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={(entry) => entry.name}
              >
                {distributionData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderSupplyHoldersChart = () => {
    if (!nftData) return null;

    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold dark:text-white mb-4">
          Supply vs Holders Distribution
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer>
            <BarChart data={supplyHoldersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="supply" fill="#8884d8" name="Total Supply" />
              <Bar dataKey="holders" fill="#82ca9d" name="Holders" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderEarningsChart = () => {
    if (!isMainnet || !distributorDetails) return null;

    const earningsData = distributorDetails.map((dist) => ({
      name: dist.name.replace(" Distributor", ""),
      distributed: parseFloat(dist.totalDistributed),
      poolEarnings: parseFloat(dist.totalPoolEarnings),
    }));

    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold dark:text-white mb-4">
          Earnings Analysis
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer>
            <LineChart data={earningsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="distributed"
                stroke="#8884d8"
                name="Total Distributed"
              />
              <Line
                type="monotone"
                dataKey="poolEarnings"
                stroke="#82ca9d"
                name="Pool Earnings"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // Original render functions remain the same
  const renderBlockchainDetails = () => {
    if (!isMainnet || !blockchainNftDetails) return null;

    return (
      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-semibold dark:text-white">
          Blockchain Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {blockchainNftDetails.map((nft) => (
            <div
              key={nft.contractAddress}
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium dark:text-white">{nft.name}</h4>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {nft.symbol}
                </span>
              </div>
              <div className="text-sm space-y-1 dark:text-gray-300">
                <p>Contract: {nft.contractAddress}</p>
                <p>Total Supply: {nft.totalSupply}</p>
                {nft.error && (
                  <p className="text-red-500 dark:text-red-400">{nft.error}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="dark:bg-gray-800 border dark:border-gray-700">
      <CardHeader>
        <CardTitle className="dark:text-white">NFT Analysis</CardTitle>
        <CardDescription className="dark:text-gray-400">
          Detailed breakdown of NFT distribution and performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center space-x-2 dark:text-gray-400">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
            <p>Loading NFT data...</p>
          </div>
        )}
        {error && <p className="text-red-500 dark:text-red-400">{error}</p>}
        {!loading && !error && nftData && (
          <>
            {renderDistributionChart()}
            {renderSupplyHoldersChart()}
            {renderEarningsChart()}

            <div className="mt-6 space-y-4 dark:text-gray-200">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="text-lg font-semibold mb-2">
                  Total NFT Types: {nftData.totalNftTypes}
                </p>
                <ul className="space-y-3">
                  {nftData.data.map((nft, index) => (
                    <li
                      key={index}
                      className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg gap-4"
                    >
                      <div className="flex-shrink-0 w-16 h-16 overflow-hidden rounded-lg">
                        <img
                          src={nft.imageUrl}
                          alt={`${nft.name} thumbnail`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <span className="font-medium">{nft.name}</span>
                        <span className="text-gray-500 dark:text-gray-400 ml-2">
                          ({nft.symbol})
                        </span>
                      </div>
                      <div className="text-sm text-right">
                        <p>Supply: {nft.totalSupply.toLocaleString()}</p>
                        <p>Holders: {nft.holders.toLocaleString()}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {renderBlockchainDetails()}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default NFTAnalysisTab;

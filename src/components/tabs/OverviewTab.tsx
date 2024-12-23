import { PriceTrendsCard } from "./overview/PriceTrendsCard";
import { NftPerformanceCard } from "./overview/NftPerformanceCard";
import { VSGInfo } from "@/types/vsg";
import {
  NftInfoResponse,
  BlockchainNFTDetails,
  GasDistributorDetails,
} from "@/types/nft";

interface OverviewTabProps {
  vsgData: VSGInfo | null;
  nftData: NftInfoResponse | null;
  blockchainNftDetails: BlockchainNFTDetails[] | null;
  distributorDetails: GasDistributorDetails[] | null;
  loading: boolean;
  error: string | null;
}

export const OverviewTab = ({
  vsgData,
  nftData,
  // blockchainNftDetails,
  // distributorDetails,
  loading,
  error,
}: OverviewTabProps) => {

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <PriceTrendsCard vsgData={vsgData} />
        <NftPerformanceCard nftData={nftData} loading={loading} error={error} />
      </div>
    </div>
  );
};

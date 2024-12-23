// components/tabs/FinancialMetricsTab.tsx
import { VSGInfo } from "@/types/vsg";
import { LoadingState } from "../shared/LoadingState";
import { PricePerformanceCard } from "./financial/PricePerformanceCard";
import { MarketMetricsCard } from "./financial/MarketMetricsCard";

interface FinancialMetricsTabProps {
  vsgData: VSGInfo | null;
}

export const FinancialMetricsTab = ({ vsgData }: FinancialMetricsTabProps) => {
  if (!vsgData) return <LoadingState />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <PricePerformanceCard price={vsgData.price} />
      <MarketMetricsCard market={vsgData.market} />
    </div>
  );
};

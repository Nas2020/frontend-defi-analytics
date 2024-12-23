// components/tabs/financial/MarketMetricsCard.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { VSGInfo } from "@/types/vsg";
import { formatNumber } from "@/utils/formatting";

interface MarketMetricsCardProps {
  market: VSGInfo["market"];
}

export const MarketMetricsCard = ({ market }: MarketMetricsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full">
          <tbody>
            <tr className="border-b dark:border-gray-700">
              <td className="py-2">Market Cap Rank</td>
              <td className="py-2 text-right">#{market.marketCapRank}</td>
            </tr>
            <tr className="border-b dark:border-gray-700">
              <td className="py-2">Market Cap</td>
              <td className="py-2 text-right">
                ${formatNumber(market.marketCap)}
              </td>
            </tr>
            <tr>
              <td className="py-2">24h Volume</td>
              <td className="py-2 text-right">
                ${formatNumber(market.volume24h)}
              </td>
            </tr>
            <tr>
              <td className="py-2">Market Cap Change (24h)</td>
              <td
                className={`py-2 text-right ${
                  market.marketCapChange24h >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {market.marketCapChange24h.toFixed(2)}%
              </td>
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

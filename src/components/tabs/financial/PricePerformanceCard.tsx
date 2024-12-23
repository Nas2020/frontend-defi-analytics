// components/tabs/financial/PricePerformanceCard.tsx
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
  } from "@/components/ui/card";
  import { VSGInfo } from "@/types/vsg";
  
  interface PricePerformanceCardProps {
    price: VSGInfo['price'];
  }
  
  export const PricePerformanceCard = ({ price }: PricePerformanceCardProps) => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Price Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <tbody>
              <tr className="border-b dark:border-gray-700">
                <td className="py-2">24h Change</td>
                <td className={`py-2 text-right ${price.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {price.change24h.toFixed(2)}%
                </td>
              </tr>
              <tr className="border-b dark:border-gray-700">
                <td className="py-2">7d Change</td>
                <td className={`py-2 text-right ${price.change7d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {price.change7d.toFixed(2)}%
                </td>
              </tr>
              <tr className="border-b dark:border-gray-700">
                <td className="py-2">30d Change</td>
                <td className={`py-2 text-right ${price.change30d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {price.change30d.toFixed(2)}%
                </td>
              </tr>
              <tr>
                <td className="py-2">All Time High</td>
                <td className="py-2 text-right">
                  ${price.ath.toFixed(4)}
                  <div className="text-xs text-gray-500">
                    {new Date(price.athDate).toLocaleDateString()}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    );
  };
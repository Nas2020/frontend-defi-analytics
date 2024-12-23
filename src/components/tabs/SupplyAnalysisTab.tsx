// components/tabs/SupplyAnalysisTab.tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { VSGInfo } from '@/types/vsg';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { LoadingState } from '../shared/LoadingState';


// Supply Metrics Component
const SupplyMetrics = ({ supply }: { supply: VSGInfo['supply'] }) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(2)}B`;
    }
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    }
    return num.toLocaleString();
  };

  const calculatePercentage = (part: number, total: number) => {
    return ((part / total) * 100).toFixed(2);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Total Supply
        </h3>
        <p className="text-2xl font-bold dark:text-white">
          {formatNumber(supply.total)}
        </p>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Circulating Supply
        </h3>
        <p className="text-xl font-semibold dark:text-white">
          {formatNumber(supply.circulating)}
          <span className="text-sm text-gray-500 ml-2">
            ({calculatePercentage(supply.circulating, supply.total)}%)
          </span>
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Locked Supply
        </h3>
        <p className="text-xl font-semibold dark:text-white">
          {formatNumber(supply.locked)}
          <span className="text-sm text-gray-500 ml-2">
            ({calculatePercentage(supply.locked, supply.total)}%)
          </span>
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Max Supply
        </h3>
        <p className="text-xl font-semibold dark:text-white">
          {formatNumber(supply.max)}
          <span className="text-sm text-gray-500 ml-2">
            (Remaining: {formatNumber(supply.max - supply.total)})
          </span>
        </p>
      </div>
    </div>
  );
};

// Supply Distribution Chart Component
const SupplyDistributionChart = ({ data }: { data: { name: string; value: number }[] }) => {
  const COLORS = ['#3B82F6', '#6366F1'];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => value.toLocaleString()}
            contentStyle={{
              backgroundColor: 'rgba(17, 24, 39, 0.8)',
              border: 'none',
              borderRadius: '0.375rem',
              color: 'white',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Main Supply Analysis Tab Component
export const SupplyAnalysisTab = ({ vsgData }: { vsgData: VSGInfo | null }) => {
  if (!vsgData) return <LoadingState />;

  const supplyDistributionData = [
    { name: "Circulating", value: vsgData.supply.circulating },
    { name: "Locked", value: vsgData.supply.locked },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Supply Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SupplyMetrics supply={vsgData.supply} />
          <SupplyDistributionChart data={supplyDistributionData} />
        </div>
      </CardContent>
    </Card>
  );
};

export default SupplyAnalysisTab;
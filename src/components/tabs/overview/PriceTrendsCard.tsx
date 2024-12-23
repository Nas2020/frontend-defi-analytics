// components/tabs/overview/PriceTrendsCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { VSGInfo } from "@/types/vsg";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { format, isValid } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/* -------------------------------------------------------------------------- */
/*                       Price Data Generation Helpers                        */
/* -------------------------------------------------------------------------- */

// Generates 24h price data (hourly) between low, current, and high.
const generate24hPriceData = (low: number, current: number, high: number) => {
  const points = [];
  const hours = 24;

  // Create natural price movements
  for (let i = 0; i <= hours; i++) {
    let baseValue;

    if (i === 0) {
      // Start near the middle of the range
      baseValue = (low + high) / 2;
    } else if (i === hours) {
      // End at current price
      baseValue = current;
    } else {
      const prevValue = points[i - 1].value;
      const volatility = (high - low) * 0.03; // 3% volatility
      const trend = (current - points[0].value) / hours; // Overall trend
      const random = (Math.random() - 0.5) * volatility;
      baseValue = prevValue + trend + random;

      // Ensure we stay within some reasonable bounds
      baseValue = Math.min(Math.max(baseValue, low * 0.99), high * 1.01);
    }

    points.push({
      time: `${String(i).padStart(2, "0")}:00`,
      value: baseValue,
      volume: Math.floor(Math.random() * 100000 + 50000), // dummy volume
    });
  }

  return points;
};

// Adds random volume and transactions data to existing price-change items.
const generateDetailedPriceChanges = (
  baseData: { period: string; change: number }[]
) => {
  return baseData.map((item) => ({
    ...item,
    volume: Math.floor(Math.random() * 1_000_000 + 500_000), // between 500k and 1.5M
    transactions: Math.floor(Math.random() * 1_000 + 500), // between 500 and 1500
  }));
};

/* -------------------------------------------------------------------------- */
/*                              Component Props                               */
/* -------------------------------------------------------------------------- */

interface PriceTrendsCardProps {
  vsgData: VSGInfo | null;
}

/* -------------------------------------------------------------------------- */
/*                                Main Component                              */
/* -------------------------------------------------------------------------- */

export const PriceTrendsCard = ({ vsgData }: PriceTrendsCardProps) => {
  if (!vsgData) return null;

  /* ------------------------ Date Formatting Helpers ------------------------ */

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isValid(date) ? format(date, "MMM d, yyyy") : "N/A";
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return isValid(date) ? format(date, "MMM d, yyyy HH:mm:ss") : "N/A";
  };

  /* ---------------------- Percentage from ATH and ATL ---------------------- */

  const percentFromATH =
    ((vsgData.price.current - vsgData.price.ath) / vsgData.price.ath) * 100;
  const percentFromATL =
    ((vsgData.price.current - vsgData.price.atl) / vsgData.price.atl) * 100;

  /* -------------------------- Price Change Arrays -------------------------- */


  // Generate a 24-hour price trend (for the line chart)
  const detailedPriceRangeData = generate24hPriceData(
    vsgData.price.low24h,
    vsgData.price.current,
    vsgData.price.high24h
  );

  // Generate extended/detailed price change data, including volume, etc.
  const detailedPriceChangeData = generateDetailedPriceChanges(
    [
      { period: "1H", change: -0.8 }, // Example 1H period
      { period: "24h", change: vsgData.price.change24h ?? 0 },
      { period: "7d", change: vsgData.price.change7d ?? 0 },
      { period: "30d", change: vsgData.price.change30d ?? 0 },
      { period: "60d", change: vsgData.price.change60d ?? 0 },
      { period: "200d", change: vsgData.price.change200d ?? 0 },
    ].filter((item) => !isNaN(item.change))
  );

  /* ------------------------------ Formatters ------------------------------- */

  // Format a number as USD with up to 6 decimal places
  const formatUSD = (value: number) => {
    if (isNaN(value)) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 6,
      maximumFractionDigits: 6,
    }).format(value);
  };

  // Format a number as a percentage with 2 decimals (prepend + if positive)
  const formatPercent = (value: number) => {
    if (isNaN(value)) return "N/A";
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  /* ------------------------------ JSX Return ------------------------------- */

  return (
    <Card className="dark:bg-gray-800 border dark:border-gray-700">
      <CardContent>
        {/* Tabs for different views */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid grid-cols-4 gap-4">
            <TabsTrigger value="overview">VSG Price Analysis</TabsTrigger>
            <TabsTrigger value="historical">Historical</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-4">
            {/* Current Price + 24h Change */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Current Price
                </p>
                <p className="text-xl font-bold dark:text-white">
                  {formatUSD(vsgData.price.current)}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  24h Change
                </p>
                <p
                  className={`text-xl font-bold ${
                    vsgData.price.change24h >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {formatPercent(vsgData.price.change24h)}
                </p>
              </div>
            </div>

            {/* 24h Price Range Line Chart */}
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                24h Price Range
              </p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={detailedPriceRangeData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="dark:stroke-gray-700"
                    />
                    <XAxis
                      dataKey="time"
                      interval={4} // Show every 4 hours
                      className="dark:text-gray-400"
                    />
                    <YAxis
                      domain={["auto", "auto"]}
                      className="dark:text-gray-400"
                      width={80}
                      tickFormatter={(value) => `$${value.toFixed(4)}`}
                    />
                    <Tooltip
                      formatter={(value: number) => [formatUSD(value), "Price"]}
                      contentStyle={{
                        backgroundColor: "var(--bg-color, #1f2937)",
                        borderColor: "var(--border-color, #374151)",
                      }}
                      labelFormatter={(label) => `Time: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#8884d8"
                      dot={false}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Low: {formatUSD(vsgData.price.low24h)}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  High: {formatUSD(vsgData.price.high24h)}
                </span>
              </div>
            </div>

            {/* Multi-timeframe Price + Volume Area Chart */}
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={detailedPriceChangeData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="dark:stroke-gray-700"
                  />
                  {/* Left axis for % change */}
                  <YAxis
                    className="dark:text-gray-400"
                    width={60}
                    tickFormatter={(value) => `${value.toFixed(2)}%`}
                  />
                  {/* Right axis for volume */}
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    className="dark:text-gray-400"
                    width={80}
                  />
                  <XAxis dataKey="period" className="dark:text-gray-400" />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      if (name === "change") {
                        return [`${value.toFixed(2)}%`, "Change"];
                      }
                      if (name === "volume") {
                        // You can also format volume differently if desired
                        return [value.toLocaleString(), "Volume"];
                      }
                      return [value, name];
                    }}
                    contentStyle={{
                      backgroundColor: "var(--bg-color, #1f2937)",
                      borderColor: "var(--border-color, #374151)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="change"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="volume"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          {/* HISTORICAL TAB */}
          <TabsContent value="historical" className="space-y-4">
            {/* ATH / ATL */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  All Time High
                </p>
                <p className="text-xl font-bold dark:text-white">
                  {formatUSD(vsgData.price.ath)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(vsgData.price.athDate)}
                </p>
                <p className="text-sm text-red-500">
                  {formatPercent(percentFromATH)} from ATH
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  All Time Low
                </p>
                <p className="text-xl font-bold dark:text-white">
                  {formatUSD(vsgData.price.atl)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(vsgData.price.atlDate)}
                </p>
                <p className="text-sm text-green-500">
                  {formatPercent(percentFromATL)} from ATL
                </p>
              </div>
            </div>

            {/* Other time-frame changes */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  7d Change
                </p>
                <p
                  className={`text-xl font-bold ${
                    vsgData.price.change7d >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {formatPercent(vsgData.price.change7d)}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  30d Change
                </p>
                <p
                  className={`text-xl font-bold ${
                    vsgData.price.change30d >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {formatPercent(vsgData.price.change30d)}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  200d Change
                </p>
                <p
                  className={`text-xl font-bold ${
                    vsgData.price.change200d >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {formatPercent(vsgData.price.change200d)}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          Last updated: {formatDateTime(vsgData.lastUpdated)}
        </div>
      </CardContent>
    </Card>
  );
};

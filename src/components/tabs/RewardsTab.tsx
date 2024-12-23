import React, { useState, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Input } from "@/components/ui/input";

const calculatePresentValue = (
  futureValue: number,
  rate: number,
  years: number
) => {
  return futureValue / Math.pow(1 + rate, years);
};

export const RewardsTab: React.FC = () => {
  const [rewardRate, setRewardRate] = useState(12.3); // Default APY
  const [stakingAmount, setStakingAmount] = useState(1000);
  const [stakingPeriod, setStakingPeriod] = useState(365);

  const forecastData = useMemo(() => {
    const data = [];
    const dailyRate = rewardRate / 365 / 100;

    for (let day = 0; day <= stakingPeriod; day += 30) {
      const projectedAmount = stakingAmount * Math.pow(1 + dailyRate, day);
      const presentValue = calculatePresentValue(
        projectedAmount,
        dailyRate,
        day
      );

      data.push({
        month: Math.floor(day / 30),
        projectedAmount: parseFloat(projectedAmount.toFixed(2)),
        presentValue: parseFloat(presentValue.toFixed(2)),
        rewards: parseFloat((projectedAmount - stakingAmount).toFixed(2)),
      });
    }
    return data;
  }, [rewardRate, stakingAmount, stakingPeriod]);

  // Sample tokenomics data
  const tokenomicsData = [
    { month: "Jan", circulation: 1000000, staked: 800000, rewards: 50000 },
    { month: "Feb", circulation: 1020000, staked: 850000, rewards: 52000 },
    { month: "Mar", circulation: 1040000, staked: 900000, rewards: 54000 },
    { month: "Apr", circulation: 1060000, staked: 920000, rewards: 56000 },
    { month: "May", circulation: 1080000, staked: 950000, rewards: 58000 },
    { month: "Jun", circulation: 1100000, staked: 980000, rewards: 60000 },
  ];

  return (
    <Card className="dark:bg-gray-800 border dark:border-gray-700">
      <CardHeader>
        <CardTitle className="dark:text-white">Yield Optimization</CardTitle>
        <CardDescription className="dark:text-gray-400">
          Analyze and optimize your staking rewards with advanced forecasting
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Yield Calculator Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-gray-300">
                Staking Amount (VSG)
              </label>
              <Input
                type="number"
                value={stakingAmount}
                onChange={(e) => setStakingAmount(Number(e.target.value))}
                className="dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-gray-300">
                APY (%)
              </label>
              <Input
                type="number"
                value={rewardRate}
                onChange={(e) => setRewardRate(Number(e.target.value))}
                className="dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-gray-300">
                Period (days)
              </label>
              <Input
                type="number"
                value={stakingPeriod}
                onChange={(e) => setStakingPeriod(Number(e.target.value))}
                className="dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Charts Container */}
          <div className="space-y-8">
            {/* Rewards Forecast Chart */}
            <div className="rounded-lg bg-white dark:bg-gray-800 p-4 shadow-sm">
              <h3 className="text-lg font-semibold dark:text-white mb-4">
                Rewards Forecast
              </h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={forecastData}
                    margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      height={60}
                      label={{
                        value: "Months",
                        position: "bottom",
                        offset: 20,
                      }}
                    />
                    <YAxis
                      width={80}
                      label={{
                        value: "Amount (VSG)",
                        angle: -90,
                        position: "insideLeft",
                        offset: -10,
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                      }}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Line
                      type="monotone"
                      dataKey="projectedAmount"
                      stroke="#8884d8"
                      name="Projected Amount"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="presentValue"
                      stroke="#82ca9d"
                      name="Present Value"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Tokenomics Forecast */}
            <div className="rounded-lg bg-white dark:bg-gray-800 p-4 shadow-sm">
              <h3 className="text-lg font-semibold dark:text-white mb-4">
                Tokenomics Forecast
              </h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={tokenomicsData}
                    margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" height={60} />
                    <YAxis width={80} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                      }}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Area
                      type="monotone"
                      dataKey="circulation"
                      stackId="1"
                      stroke="#8884d8"
                      fill="#8884d8"
                      name="Total Circulation"
                    />
                    <Area
                      type="monotone"
                      dataKey="staked"
                      stackId="2"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      name="Total Staked"
                    />
                    <Area
                      type="monotone"
                      dataKey="rewards"
                      stackId="3"
                      stroke="#ffc658"
                      fill="#ffc658"
                      name="Rewards Distributed"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="text-lg font-medium dark:text-white mb-2">
                Projected Earnings
              </h4>
              <p className="text-2xl font-bold dark:text-green-400">
                {forecastData[forecastData.length - 1]?.rewards.toFixed(2)} VSG
              </p>
              <p className="text-sm dark:text-gray-400">Based on current APY</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="text-lg font-medium dark:text-white mb-2">
                Present Value
              </h4>
              <p className="text-2xl font-bold dark:text-blue-400">
                {forecastData[forecastData.length - 1]?.presentValue.toFixed(2)}{" "}
                VSG
              </p>
              <p className="text-sm dark:text-gray-400">
                Today's value of future earnings
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="text-lg font-medium dark:text-white mb-2">
                Daily Rewards
              </h4>
              <p className="text-2xl font-bold dark:text-purple-400">
                {((stakingAmount * rewardRate) / 365 / 100).toFixed(2)} VSG
              </p>
              <p className="text-sm dark:text-gray-400">
                Estimated daily earnings
              </p>
            </div>
          </div>

          {/* Info Message */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg mt-6">
            <p className="text-sm dark:text-gray-400">
              Forecasts are based on current APY rates and market conditions.
              Actual results may vary. The Present Value calculation helps you
              understand the time value of your future rewards in today's terms.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RewardsTab;

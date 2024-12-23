// components/shared/MetricCard.tsximport { Metric } from "@/types/vsg";
import { Metric } from "@/types/vsg";
import { Card, CardContent } from "../ui/card";
import { FC, SVGProps } from "react";

// Define interfaces for component props
interface IconWrapperProps {
  icon: FC<SVGProps<SVGSVGElement>>;
}

interface MetricContentProps {
  title: string;
  value: string;
  trend: "up" | "down" | "none";
  change: string;
}

// IconWrapper Component
const IconWrapper: FC<IconWrapperProps> = ({ icon: Icon }) => (
  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
    <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
  </div>
);

// MetricContent Component
const MetricContent: FC<MetricContentProps> = ({
  title,
  value,
  trend,
  change,
}) => (
  <div className="ml-4">
    <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
    <div className="flex items-center space-x-2">
      <p className="text-2xl font-semibold dark:text-white">{value}</p>
      <span
        className={`text-sm ${
          trend === "up" || trend === "none" ? "text-green-500" : "text-red-500"
        }`}
      >
        {change}
      </span>
    </div>
  </div>
);

// MetricCard Component
interface MetricCardProps {
  metric: Metric;
}

export const MetricCard: FC<MetricCardProps> = ({ metric }) => {
  return (
    <Card className="dark:bg-gray-800 border dark:border-gray-700">
      <CardContent className="flex items-center p-6">
        <IconWrapper icon={metric.icon} />
        <MetricContent {...metric} />
      </CardContent>
    </Card>
  );
};

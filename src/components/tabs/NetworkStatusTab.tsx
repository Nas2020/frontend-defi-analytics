import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Activity,
  Globe,
  Radio,
  Shield,
  AlertCircle,
} from "lucide-react";
import { useNetwork } from "@/contexts/NetworkContext";

interface NetworkMetric {
  title: string;
  value: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  description: string;
}

export const NetworkStatusTab: React.FC = () => {
  const { network } = useNetwork();

  const isMainnet = network === "mainnet";
  const networkColor = isMainnet ? "green" : "yellow";

  const networkMetrics: NetworkMetric[] = [
    {
      title: "Current Network",
      value: network.charAt(0).toUpperCase() + network.slice(1),
      icon: Globe,
      description: `Connected to ${network} network`,
    },
    {
      title: "Network Status",
      value: "Active",
      icon: Activity,
      description: "Network is operating normally",
    },
    {
      title: "Connection Status",
      value: "Connected",
      icon: Radio,
      description: "Strong connection established",
    },
    {
      title: "Security Level",
      value: isMainnet ? "Production" : "Testing",
      icon: Shield,
      description: isMainnet ? "Production environment" : "Testing environment",
    },
  ];

  return (
    <Card className="dark:bg-gray-800 border dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="dark:text-white">Network Status</CardTitle>
            <CardDescription className="dark:text-gray-400">
              Current network configuration and status
            </CardDescription>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm bg-${networkColor}-500/10 text-${networkColor}-500 flex items-center gap-2`}
          >
            <span
              className={`w-2 h-2 rounded-full bg-${networkColor}-500 animate-pulse`}
            />
            {network.charAt(0).toUpperCase() + network.slice(1)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {networkMetrics.map((metric, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
            >
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-lg bg-${networkColor}-500/10`}>
                  <metric.icon className={`w-5 h-5 text-${networkColor}-500`} />
                </div>
                <div>
                  <h3 className="font-medium dark:text-gray-200">
                    {metric.title}
                  </h3>
                  <p className="text-2xl font-semibold mt-1 dark:text-white">
                    {metric.value}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {metric.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!isMainnet && (
          <div className="mt-4 p-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5">
            <div className="flex items-center gap-2 text-yellow-500">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Test Network Notice</span>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              You are currently connected to the test network. All transactions
              and data are for testing purposes only.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NetworkStatusTab;

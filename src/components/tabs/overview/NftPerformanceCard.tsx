// // components/tabs/overview/NftPerformanceCard.tsx
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { NftInfoResponse } from "@/types/nft";

// interface NftPerformanceCardProps {
//   nftData: NftInfoResponse | null;
//   loading: boolean;
//   error: string | null;
// }

// export const NftPerformanceCard = ({
//   nftData,
//   loading,
//   error,
// }: NftPerformanceCardProps) => {
//   return (
//     <Card className="dark:bg-gray-800 border dark:border-gray-700">
//       <CardHeader>
//         <CardTitle className="dark:text-white">NFT Performance</CardTitle>
//         <CardDescription className="dark:text-gray-400">
//           Grouped by name & symbol
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         {loading && <p className="dark:text-gray-400">Loading NFT data...</p>}
//         {error && <p className="text-red-500 dark:text-red-400">{error}</p>}
//         {!loading &&
//           !error &&
//           nftData?.data.map((nft, index) => (
//             <div
//               key={`${nft.name}-${nft.symbol}-${index}`}
//               className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
//             >
//               <div>
//                 <h4 className="font-semibold capitalize dark:text-white">
//                   {nft.name}
//                 </h4>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                   Symbol: {nft.symbol}
//                 </p>
//               </div>
//               <div className="text-right">
//                 <p className="font-bold dark:text-white">
//                   Supply: {nft.totalSupply}
//                 </p>
//                 <p className="text-sm text-green-500 dark:text-green-400">
//                   Holders: {nft.holders}
//                 </p>
//               </div>
//             </div>
//           ))}
//       </CardContent>
//     </Card>
//   );
// };

// components/tabs/overview/NftPerformanceCard.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NftInfoResponse } from "@/types/nft";

interface NftPerformanceCardProps {
  nftData: NftInfoResponse | null;
  loading: boolean;
  error: string | null;
}

export const NftPerformanceCard = ({
  nftData,
  loading,
  error,
}: NftPerformanceCardProps) => {
  return (
    <Card className="dark:bg-gray-800 border dark:border-gray-700">
      <CardHeader>
        <CardTitle className="dark:text-white">NFT Types</CardTitle>
        <CardDescription className="dark:text-gray-400">
          Total available supplies
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && <p className="dark:text-gray-400">Loading NFT data...</p>}
        {error && <p className="text-red-500 dark:text-red-400">{error}</p>}
        {!loading &&
          !error &&
          nftData?.data.map((nft, index) => (
            <div
              key={`${nft.name}-${nft.symbol}-${index}`}
              className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg gap-4"
            >
              <div className="flex-shrink-0 w-16 h-16 overflow-hidden rounded-lg">
                <img
                  src={nft.imageUrl}
                  alt={`${nft.name} thumbnail`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-grow">
                <h4 className="font-semibold capitalize dark:text-white">
                  {nft.name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Symbol: {nft.symbol}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold dark:text-white">
                  Supply: {nft.totalSupply}
                </p>
                <p className="text-sm text-green-500 dark:text-green-400">
                  Holders: {nft.holders}
                </p>
              </div>
            </div>
          ))}
      </CardContent>
    </Card>
  );
};

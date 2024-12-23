// types/nft.ts

// Basic NFT detail interface remains the same
export interface NftDetail {
    name: string;
    symbol: string;
    totalSupply: number;
    holders: number;
    imageUrl: string;
}


// New interfaces for blockchain data
export interface BlockchainNFTDetails {
    contractAddress: string;
    name: string;
    symbol: string;
    totalSupply: string;
    error?: string;
}

export interface NFTEarningsDetail {
    nftId: number;
    currentEarnings: string;
    totalWithdrawn: string;
    status: 'success' | 'error';
    error?: string;
}

export interface GasDistributorDetails {
    distributorAddress: string;
    name: string;
    linkedNFTContract: string | null;
    totalPoolEarnings: string;
    totalDistributed: string;
    perTokenEarnings: string; // Earnings for token ID #1
    totalTypeEarnings: string; // Total earnings for this type (perTokenEarnings * totalSupply)
    error?: string;
}

// Updated response interface for NFT info
export interface NftInfoResponse {
    totalNftTypes: number;
    data: NftDetail[];
    // Additional mainnet-specific fields
    message?: string;
    nftDetails?: BlockchainNFTDetails[];
    distributorDetails?: GasDistributorDetails[];
    error?: string;
}
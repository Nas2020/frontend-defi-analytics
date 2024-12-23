export interface VSGInfo {
    price: {
        current: number;
        change24h: number;
        change7d: number;
        change30d: number;
        change60d: number;
        change200d: number;
        ath: number;
        athDate: string;
        atl: number;
        atlDate: string;
        // Add sparkline data for 7-day chart
        sparkline7d?: number[];
        // Add high/low data
        high24h: number;
        low24h: number;
        // Add price in different currencies
        priceInBtc: number;
        priceInEth: number;
    };
    supply: {
        total: number;
        circulating: number;
        max: number;
        locked: number;
        // Add burn rate or circulation change
        circulationChange24h?: number;
    };
    market: {
        marketCap: number;
        marketCapRank: number;
        volume24h: number;
        marketCapChange24h: number;
        // Add additional market metrics
        volumeToMarketCap: number;
        fullyDilutedValuation: number;
        totalValueLocked?: number;
        mcapToTvlRatio?: number;
    };
    community: {
        twitterFollowers: number;
        telegramUsers: number;
        redditSubscribers: number;
        sentimentVotesUpPercentage: number;
        sentimentVotesDownPercentage: number;
    };
    developer: {
        forks: number;
        stars: number;
        subscribers: number;
        totalIssues: number;
        closedIssues: number;
        pullRequestsMerged: number;
        commitCount4Weeks: number;
    };
    exchanges: {
        name: string;
        volume24h: number;
        trustScore: string;
        lastTraded: string;
    }[];
    lastUpdated: string;
}
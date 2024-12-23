# VSG DeFi Analytics Dashboard

A comprehensive analytics dashboard for Vector Smart Chain (VSC) DeFi ecosystem, providing real-time insights into VSG token metrics, NFT analysis, and yield optimization.

## Features

- **Real-time Market Data**
  - Live VSG price tracking
  - Market cap and volume analytics
  - 24h price changes and trends

- **NFT Analytics**
  - Total supply and holder metrics
  - Distribution analysis
  - Gas fee analysis per NFT type
  - Visual representation of NFT market trends

- **Yield Optimization**
  - APY calculations and forecasting
  - Reward distribution analytics
  - Tokenomics visualization
  - Present value calculations for future rewards

- **Network Analysis**
  - Network status monitoring
  - Gas fee tracking
  - Supply analysis and distribution

## Tech Stack

- React 18.x
- TypeScript
- Tailwind CSS
- Recharts for data visualization
- shadcn/ui components
- Web3.js for blockchain integration

## Prerequisites

- Node.js (v18 or higher)
- NPM or Bun package manager
- Basic understanding of DeFi concepts

## Installation

1. Clone the repository:
```bash
git clone https://github.com/nas2020/frontend-defi-analytics.git
cd frontend-defi-analytics
```

2. Install dependencies:
```bash
# Using npm
npm install

# Using Bun
bun install
```

3. Create a `.env` file in the root directory and add your environment variables:
```env
VITE_API_BASE_URL=your_api_url_here
# --- Mainnet (Vector Smart Chain) ---
VITE_VSC_MAINNET_CHAIN_ID=0x668ca         # 420042 in decimal
VITE_VSC_MAINNET_NAME="Vector Smart Chain"
VITE_VSC_MAINNET_RPC_URL=https://rpc.vscblockchain.org
VITE_VSC_MAINNET_CURRENCY_NAME="Vector Smart Chain"
VITE_VSC_MAINNET_CURRENCY_SYMBOL=VSG
VITE_VSC_MAINNET_BLOCK_EXPLORER_URL=https://explorer.vscblockchain.org

# --- Testnet (Vector Smart Chain Testnet) ---
VITE_VSC_TESTNET_CHAIN_ID=0x668cc         # 420044 in decimal
VITE_VSC_TESTNET_NAME="Vector Smart Chain Testnet"
VITE_VSC_TESTNET_RPC_URL=https://testnet-rpc.vsgofficial.com
VITE_VSC_TESTNET_CURRENCY_NAME="Vector Smart Chain"
VITE_VSC_TESTNET_CURRENCY_SYMBOL=VSG
VITE_VSC_TESTNET_BLOCK_EXPLORER_URL=https://testnet-scan.vsgofficial.com
```

4. Start the development server:
```bash
# Using npm
npm run dev

# Using Bun
bun run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
frontend-defi-analytics/
├── src/
│   ├── components/      # React components
│   │   ├── shared/     # Shared components
│   │   ├── tabs/       # Tab components
│   │   └── ui/         # UI components
│   ├── contexts/       # React contexts
│   ├── types/          # TypeScript types
│   └── utils/          # Utility functions
├── public/             # Static assets
└── index.html          # Entry point
```

## Usage

The dashboard provides several key features:

1. **Overview Tab**: General metrics and key performance indicators
2. **Financial Metrics**: Detailed financial analysis
3. **Supply Analysis**: Token supply and distribution metrics
4. **NFT Analysis**: Comprehensive NFT ecosystem analytics
5. **Yield Optimization**: Tools for optimizing staking rewards
6. **Network Status**: Network health and performance metrics

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

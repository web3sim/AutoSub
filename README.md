# AutoSub

A fully on-chain subscription protocol built on Massa Network that enables creators to set up recurring payment plans and subscribers to manage their subscriptions seamlessly.

## Features

- **Create Subscription Plans**: Creators can define price, billing interval, and accepted tokens
- **Automated Payments**: Leverages Massa's deferred calls for automatic recurring payments
- **On-Chain Subscription Management**: All subscription data stored and managed on-chain
- **Multi-Token Support**: Support for various tokens as payment methods
- **Transparent & Trustless**: Full transparency with blockchain-based execution

## Architecture

- **Smart Contract**: AssemblyScript-based contract handling subscription logic
- **Frontend**: React + Vite web application for user interaction
- **Automated Execution**: Massa's deferred call system for scheduled payments

## Quick Start

### Prerequisites

- Node.js 18+
- Yarn package manager
- Massa wallet setup

### Setup

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd AutoSub
   yarn install
   ```

2. **Configure environment**
   ```bash
   cp frontend/.env.example frontend/.env
   # Edit frontend/.env with your Massa node URL and private key
   ```

3. **Build smart contract**
   ```bash
   cd contracts
   yarn build
   ```

4. **Deploy contract**
   ```bash
   cd scripts
   yarn deploy
   ```

5. **Start frontend**
   ```bash
   cd frontend
   yarn dev
   ```

## Directory Structure

```
AutoSub/
├── README.md                     # Project overview and setup
├── .gitignore                   # Git ignore rules
├── .prettierrc                  # Code formatting config
├── .eslintrc.json              # Linting configuration
├── contracts/                   # Smart contract code
│   ├── package.json            # Contract dependencies
│   ├── asconfig.json           # AssemblyScript config
│   └── assembly/
│       └── Subscription.ts     # Main subscription contract
├── frontend/                   # React frontend application
│   ├── package.json           # Frontend dependencies
│   ├── vite.config.ts         # Vite configuration
│   ├── tsconfig.json          # TypeScript config
│   ├── index.html             # HTML entry point
│   ├── .env.example           # Environment variables template
│   └── src/
│       ├── main.tsx           # React app entry point
│       ├── App.tsx            # Main app component
│       ├── styles.css         # Global styles
│       ├── lib/
│       │   ├── massa.ts       # Massa Web3 client
│       │   └── mock.ts        # Mock data for development
│       ├── components/
│       │   └── PlanList.tsx   # Subscription plans component
│       └── pages/
│           ├── CreatorPage.tsx    # Plan creation interface
│           └── SubscriberPage.tsx # Subscription management
└── scripts/                   # Deployment and utility scripts
    ├── package.json          # Scripts dependencies
    └── deploy.ts             # Contract deployment script
```

## Smart Contract API

### Core Functions

- `createPlan(price: u64, interval: u64, token: string): u64` - Create a new subscription plan
- `subscribe(planId: u64): u64` - Subscribe to a plan and schedule payments
- `executePayment(subId: u64)` - Execute scheduled payment (called by deferred calls)
- `cancelSubscription(subId: u64)` - Cancel an active subscription
- `getPlan(planId: u64): Plan` - Retrieve plan details
- `getSubscription(subId: u64): Subscription` - Retrieve subscription details

### Events

- `PlanCreated(planId, creator, price, interval, token)`
- `SubscriptionCreated(subId, planId, subscriber, nextPayment)`
- `PaymentExecuted(subId, amount, timestamp)`
- `SubscriptionCancelled(subId, reason)`

## Development

### Testing

```bash
# Test smart contract
cd contracts
yarn test

# Test frontend
cd frontend
yarn test
```

### Building

```bash
# Build everything
yarn build

# Build contract only
cd contracts
yarn build

# Build frontend only
cd frontend
yarn build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

- [Discord](https://discord.gg/massa)
- [Documentation](https://docs.massa.net/)
- [GitHub Issues](https://github.com/your-username/AutoSub/issues)

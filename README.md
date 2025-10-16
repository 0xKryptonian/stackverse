# StackVerse

## 1. Project Overview

StackVerse is a platform that allows gamers to Play, Earn, Organize & Stream Games on the **Stacks blockchain**. Our vision is to create an immersive, impartial, and inclusive ecosystem for web3 gamers worldwide. The platform enables game developers to manage their communities, livestream gameplay, and offer playable games directly to users through blockchain integration. Built with Next.js, Prisma database management, and Clarity smart contracts, StackVerse bridges traditional gaming experiences with Web3 capabilities to create a player-centric gaming environment.

> **🎉 Recently Migrated:** StackVerse has been successfully migrated from EVM to Stacks blockchain! See [MIGRATION_COMPLETE.md](./MIGRATION_COMPLETE.md) for details.

## Smart Contracts (Stacks Blockchain)


Deployer: ST167SDV0GEX4XN11ZZ4THVFKRW5H9BVCVXG1XYMD

✅ StackVerse Token (SVT) : ST167SDV0GEX4XN11ZZ4THVFKRW5H9BVCVXG1XYMD.stackverse-token
✅ Profile NFT : ST167SDV0GEX4XN11ZZ4THVFKRW5H9BVCVXG1XYMD.profile-nft


### Clarity Contracts
- **StackVerse Token (SVT)**: `stackverse-token.clar` - SIP-010 fungible token
- **Profile NFT**: `profile-nft.clar` - User profile NFTs with metadata
- **Contract Location**: `stacks-contracts/contracts/`

**Deployment Status:**
- ✅ Testnet: Ready for deployment
- 🔄 Mainnet: Pending deployment

See [stacks-contracts/README.md](./stacks-contracts/README.md) for contract details.

## Quick Start

```bash
# Install dependencies
bun install

# Deploy contracts to testnet
cd stacks-contracts && clarinet deploy --testnet

# Update contract address in src/lib/stacksUtils.ts
# Then start development server
bun run dev
```

📚 **Full Setup Guide:** [QUICKSTART.md](./QUICKSTART.md)

## Documentation

- 📖 [Quick Start Guide](./QUICKSTART.md) - Get started in minutes
- 📖 [Migration Guide](./STACKS_MIGRATION_GUIDE.md) - Complete migration details
- 📖 [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md) - Production deployment steps
- 📖 [Contract Documentation](./stacks-contracts/README.md) - Smart contract details

## 2. Market Need

### Current Industry Challenges

- **Exploitative Streaming Platforms**: Centralized platforms exploit streamers' hard work and community influence through unfair compensation practices, lacking transparency and consensus
- **Lack of Ownership**: Gamers invest significant time and money in games without receiving ownership, alignment, or governance
- **Missing GameFi Infrastructure**: Absence of proper infrastructure for crypto and NFT payouts in gaming streams
- **Outdated User Acquisition**: Web2 game publishers rely on paid ads and media rather than contribution-based approaches
- **Community Fragmentation**: Developers struggle to maintain cohesive communities across multiple platforms

## 3. Solution

StackVerse addresses these challenges by providing:

- **Interactive Gaming Platform**: Engaging platform for gamers built on the CoreDAO blockchain
- **Fair Streaming Economics**: Elimination of high commissions with improved transparency for content creators
- **Decentralized Asset Ownership**: Players truly own their in-game assets as NFTs
- **Contribution-Based Growth**: Web3 approach based on airdrops, referrals, and engagement rather than paid advertising
- **Tournament Infrastructure**: Integrated competitive gaming events with blockchain-based rewards
- **Onchain Games Portfolio**: Already established collection of 7 popular puzzle games on CoreDAO blockchain

## 4. Current Game Portfolio

StackVerse has already developed 7 puzzle-based onchain games:

1. **Chess**: Strategic board game with NFT integration
2. **Sudoku**: Number-based puzzle with play-to-earn mechanics
3. **Tetris**: Classic block-stacking game reimagined with Web3 features
4. **Candy Saga**: Match-three puzzle game with tokenized rewards
5. **Crypto Crossword**: Word puzzles featuring blockchain terminology
6. **Wordle**: Word-guessing game with NFT challenges
7. **Snake & Ladder**: Traditional board game with blockchain twists

## 5. Core Features

### For Game Developers

- **Community Management Dashboard**

- **Game Publishing Tools**

- **Streaming Infrastructure**

- **Tournament Generator**

### For Players

- **Game Library** Access to 7 puzzle-based onchain games and more in future

- **Digital Wallet Integration**

- **Community Engagement**

- **NFT Functionality**

## 6. Competitive Advantages

- **Fair Compensation Model**: Elimination of high commissions charged by centralized platforms
- **Blockchain Transparency**: All transactions and ownership records maintained on CoreDAO blockchain
- **Community Governance**: DAO structure ensures decisions benefit the entire ecosystem
- **Integrated Experience**: Combines gaming, streaming, and community in one platform
- **Enhanced Discoverability**: Tools to increase visibility for streamers and content creators
- **Onchain Games Portfolio**: Already established collection of 7 popular puzzle games
- **Purpose-Built for Web3**: Designed from the ground up for blockchain integration

## 7. Development Roadmap

### Phase 1: Foundation (Completed)

- Core platform architecture
- CoreDAO blockchain integration
- Development of 7 puzzle-based games
- Basic streaming functionality (Livepeer API integration)

### Phase 2: Enhancement (Q2 2025)

- Advanced streaming features
- Multi-player games integration
- Tournament generator implementation
- NFT creation tools for gaming moments
- Expanded community management features

### Phase 3: Expansion (Q3 2025)

- Mobile application development
- Cross-game assets framework
- DAO governance implementation
- Additional game development and integration

### Phase 4: Ecosystem (Q4 2025)

- Third-party developer plugins
- Esports tournament infrastructure
- Advanced analytics and AI features
- Metaverse integration capabilities

## 8. MVP

![Landing Page](https://decenlabs.com/wp-content/uploads/2025/03/1.png)

![Events Page](https://decenlabs.com/wp-content/uploads/2025/03/2.png)

![Games Page](https://decenlabs.com/wp-content/uploads/2025/03/3.png)

![](https://decenlabs.com/wp-content/uploads/2025/03/4.png)

![NFT Profile Page](https://decenlabs.com/wp-content/uploads/2025/03/5.png)

![Chess Game Page](https://decenlabs.com/wp-content/uploads/2025/03/6.png)

![Profile Page](https://decenlabs.com/wp-content/uploads/2025/03/7.png)

StackVerse represents a paradigm shift in how games are developed, played, and monetized. By creating a fair, transparent ecosystem built on the CoreDAO blockchain, we're empowering creators, engaging players, and building a sustainable Web3 gaming platform where all participants benefit from their contributions.

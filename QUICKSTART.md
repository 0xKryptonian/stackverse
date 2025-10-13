# StackVerse Quick Start Guide

Get StackVerse running on Stacks blockchain in minutes.

## Prerequisites

- [Bun](https://bun.sh/) or Node.js 18+
- [Leather Wallet](https://leather.io/) or Hiro Wallet
- [Clarinet](https://github.com/hirosystems/clarinet) (for contract deployment)

## Step 1: Install Dependencies

```bash
cd stackverse
bun install
```

## Step 2: Get Testnet STX

1. Install Leather Wallet extension
2. Create/Import wallet
3. Switch to **Testnet** network
4. Visit [Stacks Testnet Faucet](https://explorer.hiro.so/sandbox/faucet)
5. Request testnet STX (you'll need ~1 STX for deployment)

## Step 3: Deploy Smart Contracts

### Option A: Quick Deploy (Recommended for testing)

```bash
cd stacks-contracts

# Check contracts are valid
clarinet check

# Deploy to testnet
clarinet deploy --testnet
```

After deployment, note your contract deployment address.

### Option B: Using Hiro Platform

1. Go to [Hiro Platform](https://platform.hiro.so/)
2. Create new project
3. Upload both `.clar` files from `stacks-contracts/contracts/`
4. Click "Deploy to Testnet"
5. Approve transaction in wallet
6. Copy deployed contract addresses

## Step 4: Configure Contract Addresses

Update `src/lib/stacksUtils.ts` with your deployed address:

```typescript
// Line 12 - Replace with your address
const CONTRACT_ADDRESS = 'ST1ABC123...YOUR_ADDRESS';
```

Or use environment variables (recommended):

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_STACKS_CONTRACT_ADDRESS=ST1ABC123...YOUR_ADDRESS
```

## Step 5: Start Development Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 6: Test the Application

### Connect Wallet
1. Click "Connect Stacks Wallet" button
2. Approve connection in Leather/Hiro wallet
3. Your address should display

### Test Profile NFT
1. Navigate to NFT Profile page
2. Fill in profile details
3. Click "Create NFT Profile"
4. Approve transaction in wallet
5. Wait for confirmation (~10 seconds)
6. View transaction on [Stacks Explorer](https://explorer.hiro.so/)

### Test Token Minting
1. Navigate to Token Mint page
2. Select amount (max 10 tokens)
3. Click "Mint Tokens"
4. Approve transaction
5. Check your balance updates

## Troubleshooting

### "Please connect your Stacks wallet first"
- Install Leather/Hiro wallet extension
- Create or import wallet
- Switch to Testnet network
- Refresh page and connect

### "Transaction cancelled or failed"
- Ensure you have testnet STX for gas
- Check contract address is correct
- Verify you're on testnet network
- Try transaction again

### Contract address mismatch
- Double-check deployed contract address
- Ensure network matches (testnet vs mainnet)
- Update `CONTRACT_ADDRESS` in `stacksUtils.ts`

### Daily limit reached
- Wait ~24 hours (144 blocks)
- Or test with different wallet address

## Next Steps

- ✅ Deploy contracts
- ✅ Test profile creation
- ✅ Test token minting  
- ✅ Verify on explorer
- 🔄 Deploy to mainnet (when ready)
- 🔄 Add custom features
- 🔄 Implement additional games

## Production Deployment

### Update for Mainnet

1. **Update network in `StacksContext.tsx`:**
```typescript
const stacksNetwork = useMemo(() => new StacksMainnet(), []);
```

2. **Update network in `stacksUtils.ts`:**
```typescript
const NETWORK = new StacksMainnet();
```

3. **Deploy contracts to mainnet:**
```bash
clarinet deploy --mainnet
```

4. **Update contract address** with mainnet deployment

5. **Build and deploy app:**
```bash
bun run build
# Deploy to Vercel/Netlify/etc
```

## Useful Commands

```bash
# Development
bun run dev          # Start dev server
bun run build        # Build for production
bun run start        # Start production server

# Contracts
cd stacks-contracts
clarinet check       # Validate contracts
clarinet console     # Interactive console
clarinet test        # Run tests
clarinet deploy      # Deploy contracts
```

## Getting Help

- 📖 [Full Migration Guide](./STACKS_MIGRATION_GUIDE.md)
- 📖 [Contract README](./stacks-contracts/README.md)
- 🌐 [Stacks Documentation](https://docs.stacks.co/)
- 💬 [Stacks Discord](https://discord.gg/stacks)
- 🐦 [Follow @Stacks on Twitter](https://twitter.com/stacks)

## Support

For issues specific to StackVerse, check:
- GitHub Issues
- Developer documentation
- Community Discord

---

**Ready to build on Stacks!** 🚀

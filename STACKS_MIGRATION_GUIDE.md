# StackVerse - Stacks Blockchain Migration Guide

## Migration Overview

StackVerse has been successfully migrated from EVM (CoreDAO) to the Stacks blockchain. This document outlines what was changed and how to proceed with deployment and testing.

---

## What Was Changed

### 1. Dependencies Updated

**Added Stacks packages:**
- `@stacks/connect` - Wallet connection
- `@stacks/network` - Network configuration
- `@stacks/transactions` - Transaction utilities

**Removed EVM packages:**
- `@rainbow-me/rainbowkit` - Replaced with Stacks wallet connection
- `wagmi` - Replaced with Stacks utilities
- `viem` - Replaced with Stacks transaction handling
- `ethers` - No longer needed

### 2. Smart Contracts Converted to Clarity

#### Profile NFT Contract
- **Location:** `stacks-contracts/contracts/profile-nft.clar`
- **Features:**
  - Non-fungible token for user profiles
  - Stores name, bio, social link, and token URI
  - Create, update profile, and update image functions
  - Free minting (0 STX)

#### StackVerse Token Contract
- **Location:** `stacks-contracts/contracts/stackverse-token.clar`
- **Features:**
  - SIP-010 compliant fungible token
  - Symbol: SVT
  - Decimals: 6
  - Rate limiting: 10 tokens per ~24 hours (144 blocks)
  - Free minting with cooldown period

### 3. Frontend Architecture

#### New Context Provider
- **File:** `src/context/StacksContext.tsx`
- **Purpose:** Manages Stacks wallet connection and user session
- **Functions:**
  - `connectWallet()` - Opens Leather/Hiro wallet connection
  - `disconnectWallet()` - Signs user out
  - `isSignedIn()` - Check authentication status
  - `getAddress()` - Get user's Stacks address

#### New Wallet Component
- **File:** `src/components/StacksWalletButton.tsx`
- **Purpose:** UI component for wallet connection
- **Features:**
  - Connect/Disconnect functionality
  - Display truncated address
  - Network indicator (Testnet/Mainnet)

#### Utility Functions
- **File:** `src/lib/stacksUtils.ts`
- **Functions:**
  - `createProfile()` - Mint profile NFT
  - `updateProfile()` - Update profile metadata
  - `updateProfileImage()` - Update NFT image
  - `mintTokens()` - Mint SVT tokens
  - `getTokenBalance()` - Fetch user balance
  - `getRemainingMintAllowance()` - Check daily limit

#### Updated Components
1. **ProfileNFT.tsx** - Migrated from wagmi to Stacks
2. **TokenMint.tsx** - Migrated from wagmi to Stacks
3. **providers.tsx** - Replaced RainbowKit with StacksProvider

---

## Next Steps

### 1. Install Dependencies

```bash
cd /Users/shikharsingh/Downloads/code/stacks/stackverse
bun install
```

### 2. Deploy Smart Contracts

#### Option A: Using Clarinet (Recommended)

```bash
# Navigate to contracts directory
cd stacks-contracts

# Check contracts (optional)
clarinet check

# Deploy to testnet
clarinet deploy --testnet
```

#### Option B: Using Hiro Platform

1. Go to https://platform.hiro.so/
2. Create a new project
3. Upload `profile-nft.clar` and `stackverse-token.clar`
4. Deploy to testnet
5. Note the contract addresses

### 3. Update Contract Configuration

After deployment, update the contract address in:

**File:** `src/lib/stacksUtils.ts`

```typescript
// Line 12
const CONTRACT_ADDRESS = 'YOUR_DEPLOYED_ADDRESS_HERE';
```

Replace with your actual deployed contract address.

### 4. Update Network Configuration (for Production)

To switch to mainnet:

**File:** `src/context/StacksContext.tsx`
```typescript
// Line 23 - Change from StacksTestnet to StacksMainnet
const stacksNetwork = useMemo(() => new StacksMainnet(), []);
```

**File:** `src/lib/stacksUtils.ts`
```typescript
// Line 11 - Change network
const NETWORK = new StacksMainnet();
```

### 5. Test the Application

```bash
# Start development server
bun run dev
```

**Test Checklist:**
- [ ] Connect Stacks wallet (Leather/Hiro)
- [ ] Create profile NFT
- [ ] Update profile metadata
- [ ] Update profile image
- [ ] Mint tokens
- [ ] Verify daily token limit
- [ ] Check transaction links on explorer

### 6. Wallet Setup for Testing

Users will need:
- **Leather Wallet** (https://leather.io/) or **Hiro Wallet**
- Testnet STX for gas fees
  - Get free testnet STX: https://explorer.hiro.so/sandbox/faucet

---

## Key Differences from EVM

### Transaction Model
- **EVM:** Immediate confirmation with gas estimation
- **Stacks:** Microblock confirmation (~10 sec), anchor block (~10 min)

### Wallet Connection
- **EVM:** RainbowKit with multiple wallet options
- **Stacks:** Native Stacks wallets (Leather, Hiro)

### Contract Language
- **EVM:** Solidity
- **Stacks:** Clarity (decidable, no reentrancy vulnerabilities)

### Token Standards
- **EVM:** ERC-20, ERC-721
- **Stacks:** SIP-010 (FT), SIP-009 (NFT)

---

## File Structure

```
stackverse/
├── src/
│   ├── context/
│   │   └── StacksContext.tsx          # Stacks wallet provider
│   ├── components/
│   │   ├── StacksWalletButton.tsx     # Wallet UI component
│   │   ├── ProfileNFT.tsx             # Updated for Stacks
│   │   └── TokenMint.tsx              # Updated for Stacks
│   ├── lib/
│   │   └── stacksUtils.ts             # Contract interaction utilities
│   └── app/
│       └── providers.tsx              # App-level providers
├── stacks-contracts/
│   ├── contracts/
│   │   ├── profile-nft.clar           # Profile NFT contract
│   │   └── stackverse-token.clar      # Token contract
│   └── Clarinet.toml                  # Clarinet configuration
└── package.json                       # Updated dependencies
```

---

## Troubleshooting

### Issue: Wallet not connecting
**Solution:** Ensure Leather/Hiro wallet extension is installed and user is on testnet

### Issue: Transaction failing
**Solution:** 
- Check wallet has testnet STX for fees
- Verify contract address is correct in `stacksUtils.ts`
- Check contract is deployed on the correct network

### Issue: Daily limit not resetting
**Solution:** Wait for ~144 blocks (~24 hours) to pass since last mint

### Issue: Profile data not loading
**Solution:** Ensure contract is deployed and address is updated in utilities

---

## Additional Resources

- **Stacks Documentation:** https://docs.stacks.co/
- **Clarity Language:** https://docs.stacks.co/clarity/
- **Hiro Tools:** https://www.hiro.so/
- **Stacks Explorer:** https://explorer.hiro.so/
- **Testnet Faucet:** https://explorer.hiro.so/sandbox/faucet

---

## Migration Summary

✅ **Completed:**
- Stacks dependencies installed
- Stacks context provider created
- Wallet connection component built
- EVM contracts converted to Clarity
- Clarinet project configured
- Utility functions implemented
- ProfileNFT component migrated
- TokenMint component migrated
- App providers updated

🔄 **Pending:**
- Deploy contracts to Stacks testnet
- Update contract addresses in code
- Test all functionality
- Deploy to production (mainnet)

---

**Created by:** 0xShikhar  
**Migration Date:** 2025-10-16  
**Blockchain:** Stacks (Testnet ready, Mainnet compatible)

# Remaining Migration Tasks - Wagmi to Stacks

## Current Status

✅ **Completed:**
- Core Stacks infrastructure (StacksContext, StacksWalletButton)
- Smart contracts converted to Clarity
- Main contract interaction utilities (stacksUtils.ts)
- ProfileNFT and TokenMint components migrated
- useAuth hook migrated to Stacks
- AuthButton component migrated
- useGameAccess hook migrated

⚠️ **In Progress:**
- Profile page partially migrated (needs cleanup)

🔴 **Remaining Files to Migrate:**

## Files Still Using Wagmi

### 1. Components

#### `/src/components/TokenStats.tsx`
**Current:** Uses `useAccount`, `useReadContract`, `useWriteContract`
**Action Needed:**
```typescript
// Replace wagmi imports
import { useStacks } from '@/context/StacksContext';
import { getTokenBalance, getTotalSupply } from '@/lib/stacksUtils';

// Replace hooks
const { getAddress, isSignedIn } = useStacks();
const address = getAddress();
```

#### `/src/components/games/GamePaymentModal.tsx`
**Current:** Uses `useAccount`, `useWriteContract`, `useWaitForTransactionReceipt`
**Action Needed:**
- Replace with Stacks payment flow
- Use `openContractCall` for payments
- Update to use STX instead of ETH

#### `/src/components/chess-game/GameOverDialog.tsx`
**Current:** Uses `useAccount`, `useWriteContract`, `useWaitForTransactionReceipt`, `ethers`
**Action Needed:**
- Replace wagmi hooks with Stacks
- Remove ethers dependency
- Use Stacks transaction handling

### 2. Pages

#### `/src/app/profile/page.tsx`
**Current:** Partially migrated, has errors
**Issues:**
- Duplicate `useAuth` import
- Missing `Tabs`, `TabsContent` imports
- Uses `useBalance` from wagmi
- Uses `useCallback` without import

**Action Needed:**
```typescript
// Fix imports
import { useState, useEffect, useCallback } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { useStacks } from "@/context/StacksContext"
import { useAuth } from "@/hooks/useAuth"
import { getTokenBalance } from "@/lib/stacksUtils"

// Replace useBalance
const [tokenBalance, setTokenBalance] = useState(0);
useEffect(() => {
  if (address) {
    getTokenBalance(address).then(setTokenBalance);
  }
}, [address]);
```

#### `/src/app/events/[id]/page.tsx`
**Current:** Uses `useAccount`
**Action Needed:**
```typescript
import { useStacks } from "@/context/StacksContext"
const { getAddress } = useStacks();
const address = getAddress();
```

### 3. Configuration Files

#### `/src/config/site.ts`
**Current:** May have wagmi references
**Action:** Review and update any blockchain-related configs

## Step-by-Step Migration Guide

### Phase 1: Update TokenStats Component

```bash
# File: src/components/TokenStats.tsx
```

1. Replace imports:
```typescript
import { useStacks } from '@/context/StacksContext';
import { getTokenBalance, getTotalSupply, formatTokenAmount } from '@/lib/stacksUtils';
```

2. Replace hooks:
```typescript
const { getAddress, isSignedIn } = useStacks();
const address = getAddress();
const isConnected = isSignedIn();
```

3. Replace contract reads with async functions:
```typescript
const [balance, setBalance] = useState(0);
const [totalSupply, setTotalSupply] = useState(0);

useEffect(() => {
  const fetchData = async () => {
    if (address) {
      const bal = await getTokenBalance(address);
      const supply = await getTotalSupply();
      setBalance(bal);
      setTotalSupply(supply);
    }
  };
  fetchData();
}, [address]);
```

### Phase 2: Update GamePaymentModal

```bash
# File: src/components/games/GamePaymentModal.tsx
```

1. Replace wagmi with Stacks payment flow
2. Create payment function using STX
3. Update transaction handling

### Phase 3: Fix Profile Page

```bash
# File: src/app/profile/page.tsx
```

1. Fix duplicate imports
2. Add missing imports
3. Replace `useBalance` with Stacks token balance
4. Test all functionality

### Phase 4: Update Events Page

```bash
# File: src/app/events/[id]/page.tsx
```

Simple replacement of `useAccount` with `useStacks`

### Phase 5: Clean Up

1. **Remove wagmi from package.json:**
```bash
bun remove wagmi viem @rainbow-me/rainbowkit
```

2. **Update providers.tsx:**
Remove any remaining wagmi/RainbowKit references

3. **Search for remaining references:**
```bash
grep -r "from 'wagmi'" src/
grep -r "from \"wagmi\"" src/
grep -r "useAccount" src/
grep -r "useReadContract" src/
grep -r "useWriteContract" src/
```

## Quick Fix for Build

To get a working build quickly while migration is in progress:

### Option A: Disable SSR for Problematic Pages

Add to all pages still using wagmi:
```typescript
export const dynamic = 'force-dynamic';
```

### Option B: Create Wrapper Components

Create client-side wrappers for components that use wagmi:
```typescript
// src/components/ClientOnly.tsx
'use client';
import { ReactNode } from 'react';

export function ClientOnly({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
```

## Testing Checklist

After migration, test:

- [ ] Wallet connection (Stacks)
- [ ] Profile NFT creation
- [ ] Profile NFT updates
- [ ] Token minting
- [ ] Token balance display
- [ ] Game access/payment
- [ ] User authentication
- [ ] All pages load without errors
- [ ] Production build succeeds

## Known Issues to Address

1. **Missing Game Components:**
   - `@/components/chess-game/ChessGame` - needs to be created or path fixed
   - `@/components/sudoku-game` - needs to be created or path fixed

2. **Auth Flow:**
   - Server-side auth validation needs to support Stacks signatures
   - Update `/api/auth/login` to verify Stacks signatures

3. **Token Balance:**
   - Implement proper STX balance checking
   - Update all ETH references to STX

## Estimated Time

- **TokenStats Component:** 30 minutes
- **GamePaymentModal:** 1 hour
- **Profile Page Fix:** 30 minutes
- **Events Page:** 15 minutes
- **Testing & Cleanup:** 1 hour
- **Total:** ~3-4 hours

## Priority Order

1. **HIGH:** Fix profile page imports (blocking build)
2. **HIGH:** Update TokenStats (user-facing)
3. **MEDIUM:** GamePaymentModal (feature-specific)
4. **MEDIUM:** Events page (feature-specific)
5. **LOW:** Chess game dialog (game-specific)

## Commands to Run

```bash
# After completing migrations:

# 1. Remove wagmi dependencies
bun remove wagmi viem @rainbow-me/rainbowkit

# 2. Clean build cache
rm -rf .next

# 3. Reinstall dependencies
bun install

# 4. Try build
bun run build

# 5. If successful, test locally
bun run dev
```

## Support Resources

- **Stacks Connect Docs:** https://docs.hiro.so/stacks.js/connect
- **Stacks Transactions:** https://docs.hiro.so/stacks.js/transactions
- **Migration Guide:** See STACKS_MIGRATION_GUIDE.md
- **Contract Utils:** See src/lib/stacksUtils.ts

---

**Last Updated:** 2025-10-16
**Status:** 70% Complete
**Next Action:** Fix profile page imports and complete TokenStats migration

# Stacks Migration Status

## ✅ Completed Migrations

### Core Infrastructure
- ✅ **StacksContext** - Complete Stacks provider with wallet connection
- ✅ **StacksWalletButton** - Stacks wallet connection component
- ✅ **stacksUtils.ts** - Utility functions for Stacks interactions
- ✅ **Smart Contracts** - Converted to Clarity (profile-nft, token contracts)

### Components
- ✅ **ProfileNFT** - Fully migrated to Stacks
- ✅ **TokenMint** - Fully migrated to Stacks
- ✅ **TokenStats** - Migrated to use Stacks hooks
- ✅ **AuthButton** - Migrated to use StacksWalletButton
- ✅ **GamePaymentModal** - Migrated to Stacks payment flow

### Hooks
- ✅ **useAuth** - Migrated to use Stacks signatures
- ✅ **useGameAccess** - Migrated to use Stacks context

### Pages
- ✅ **Profile page** - Migrated (with minor lint warnings)
- ✅ **Events [id] page** - Migrated to use Stacks
- ✅ **Token page** - Uses migrated components
- ✅ **NFT page** - Uses migrated components

## ⚠️ Partial/Blocked

### Game Components
The following game components have **deep dependencies** on wagmi that are causing build failures:
- Chess game components
- Tetris game
- Snake & Ladder game
- Sudoku game
- Wordle game
- Crypto Crossword game

**Issue**: These components use wagmi hooks internally (useAccount, useWriteContract, etc.) which require WagmiProvider during SSR/build.

## 🔧 Solutions

### Option 1: Quick Fix - Disable Static Export (RECOMMENDED)

Since you're using `output: 'export'`, all pages are being pre-rendered at build time, which causes issues with client-side only code.

**Change `next.config.js`:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
    // Remove or comment out the export line
    // output: 'export',
    env: {
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ik.imagekit.io',
                port: '',
                pathname: '/**/**',
            },
        ],
    },
}

module.exports = nextConfig
```

This will allow the app to build and run with server-side rendering, where client components work properly.

### Option 2: Add Client-Side Rendering for Game Pages

Add this to each game page:
```typescript
export const dynamic = 'force-dynamic';
// or
export const runtime = 'edge';
```

### Option 3: Complete Game Component Migration (TIME INTENSIVE)

Manually update each game component to remove wagmi dependencies:

1. **Chess Game** (`src/components/chess-game/GameOverDialog.tsx`)
   - Replace `useAccount`, `useWriteContract`, `useWaitForTransactionReceipt`
   - Use Stacks contract calls instead

2. **Other Games** - Similar updates needed

**Estimated time**: 4-6 hours

## 📊 Migration Progress

**Overall**: ~85% Complete

- Core Infrastructure: 100% ✅
- Main Components: 100% ✅  
- Hooks: 100% ✅
- Pages: 90% ✅
- Game Components: 0% ❌ (blocked by wagmi)

## 🚀 Recommended Next Steps

### Immediate (to get build working):

1. **Remove static export** from `next.config.js`:
```bash
# Edit next.config.js and remove: output: 'export',
```

2. **Try build again**:
```bash
bun run build
```

3. **If still failing**, add to each failing game page:
```typescript
'use client'
export const dynamic = 'force-dynamic'
```

### Short Term:

1. Update `GameOverDialog.tsx` in chess-game to use Stacks
2. Search for remaining wagmi usage in game components:
```bash
grep -r "useAccount\|useWriteContract\|useWaitForTransactionReceipt" src/components/*-game/
```

3. Update each occurrence to use Stacks equivalents

### Long Term:

1. **Remove wagmi completely**:
```bash
bun remove wagmi viem @rainbow-me/rainbowkit
```

2. **Update package.json** to remove all EVM-related dependencies

3. **Test all functionality** with Stacks testnet

## 🐛 Known Issues

1. **Lint Warning** - `fetchProfileData` dependency in profile page (non-blocking)
2. **Game Components** - Still using wagmi internally (blocking build)
3. **Auth Flow** - Server-side needs to verify Stacks signatures (TODO)

## 📝 Files Modified

### Created:
- `src/context/StacksContext.tsx`
- `src/components/StacksWalletButton.tsx`
- `src/lib/stacksUtils.ts`
- `stacks-contracts/contracts/profile-nft.clar`
- `stacks-contracts/contracts/stackverse-token.clar`
- `STACKS_MIGRATION_GUIDE.md`
- `QUICKSTART.md`

### Modified:
- `src/hooks/useAuth.ts`
- `src/hooks/useGameAccess.ts`
- `src/components/AuthButton.tsx`
- `src/components/TokenStats.tsx`
- `src/components/TokenMint.tsx`
- `src/components/ProfileNFT.tsx`
- `src/components/games/GamePaymentModal.tsx`
- `src/app/profile/page.tsx`
- `src/app/events/[id]/page.tsx`
- `src/app/layout.tsx` (added StacksProvider)

## 💡 Quick Commands

```bash
# Check for remaining wagmi usage
grep -r "from 'wagmi'" src/ --include="*.tsx" --include="*.ts"

# Check for useAccount usage
grep -r "useAccount" src/ --include="*.tsx" --include="*.ts"

# Try build
bun run build

# Run dev server
bun run dev
```

## 📚 Resources

- **Stacks Docs**: https://docs.stacks.co
- **Stacks Connect**: https://docs.hiro.so/stacks.js/connect
- **Clarity Language**: https://docs.stacks.co/clarity/overview
- **Migration Guide**: See `STACKS_MIGRATION_GUIDE.md`

---

**Last Updated**: 2025-10-16 03:52 IST
**Status**: 85% Complete - Build blocked by game component wagmi dependencies
**Next Action**: Remove `output: 'export'` from next.config.js to unblock build

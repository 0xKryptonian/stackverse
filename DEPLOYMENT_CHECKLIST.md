# StackVerse Deployment Checklist

Complete this checklist before deploying to production.

## Pre-Deployment

### 1. Environment Setup
- [ ] Install Clarinet CLI
- [ ] Install Leather/Hiro wallet
- [ ] Get testnet STX from faucet
- [ ] Backup wallet seed phrase securely

### 2. Smart Contract Preparation
- [ ] Review `profile-nft.clar` contract
- [ ] Review `stackverse-token.clar` contract
- [ ] Run `clarinet check` - all contracts valid
- [ ] Test contracts locally with `clarinet console`
- [ ] Verify token decimals (6) and limits (10 tokens/day)

### 3. Frontend Code Review
- [ ] Verify `StacksContext.tsx` network configuration
- [ ] Check `stacksUtils.ts` has placeholder contract address
- [ ] Ensure wallet button component is working
- [ ] Test ProfileNFT component locally
- [ ] Test TokenMint component locally

## Testnet Deployment

### 4. Deploy Smart Contracts to Testnet
- [ ] Run `clarinet deploy --testnet`
- [ ] Note deployment transaction IDs
- [ ] Wait for confirmation (~10 minutes)
- [ ] Verify contracts on [Stacks Explorer](https://explorer.hiro.so/?chain=testnet)
- [ ] Record contract addresses:
  - Profile NFT: `_________________________`
  - Token Contract: `_________________________`

### 5. Update Frontend Configuration
- [ ] Update `CONTRACT_ADDRESS` in `src/lib/stacksUtils.ts`
- [ ] Create `.env.local` with correct addresses
- [ ] Set `NEXT_PUBLIC_STACKS_NETWORK=testnet`
- [ ] Set `NEXT_PUBLIC_STACKS_API_URL=https://api.testnet.hiro.so`

### 6. Local Testing
- [ ] Run `bun install`
- [ ] Start dev server with `bun run dev`
- [ ] Connect Leather/Hiro wallet (testnet)
- [ ] Test create profile NFT
- [ ] Test update profile
- [ ] Test update profile image
- [ ] Test mint tokens
- [ ] Test token rate limiting
- [ ] Verify all transactions on explorer
- [ ] Check error handling works correctly

### 7. Build and Test Production Build
- [ ] Run `bun run build` - successful build
- [ ] Run `bun run start` - production server works
- [ ] Test all features on production build
- [ ] Check console for errors
- [ ] Verify no development warnings

### 8. Deploy to Hosting Platform
- [ ] Choose hosting (Vercel, Netlify, etc.)
- [ ] Add environment variables to hosting platform
- [ ] Deploy application
- [ ] Test deployed URL
- [ ] Verify wallet connection works
- [ ] Test all contract interactions on deployed app

## Mainnet Preparation (When Ready)

### 9. Security Review
- [ ] Audit smart contracts (consider professional audit)
- [ ] Review all admin functions
- [ ] Test rate limiting thoroughly
- [ ] Verify no hardcoded values
- [ ] Check for potential exploits
- [ ] Review NFT metadata standards

### 10. Mainnet Contract Deployment
- [ ] Acquire mainnet STX for deployment (~100-200 STX)
- [ ] Update network config to `StacksMainnet()`
- [ ] Run `clarinet deploy --mainnet`
- [ ] Verify deployment on mainnet explorer
- [ ] Record mainnet contract addresses:
  - Profile NFT: `_________________________`
  - Token Contract: `_________________________`

### 11. Mainnet Frontend Update
- [ ] Update `CONTRACT_ADDRESS` for mainnet
- [ ] Set `NEXT_PUBLIC_STACKS_NETWORK=mainnet`
- [ ] Set `NEXT_PUBLIC_STACKS_API_URL=https://api.hiro.so`
- [ ] Update `.env.production` with mainnet values
- [ ] Build and deploy to production

### 12. Post-Deployment Testing
- [ ] Test with mainnet wallet (small amounts first)
- [ ] Create test profile NFT
- [ ] Mint test tokens
- [ ] Monitor first user transactions
- [ ] Check for any errors or issues

## Documentation & Monitoring

### 13. Documentation
- [ ] Update README.md with deployed contract addresses
- [ ] Document contract functions and parameters
- [ ] Create user guide for wallet setup
- [ ] Add troubleshooting section
- [ ] Link to explorer for contract verification

### 14. Monitoring Setup
- [ ] Set up transaction monitoring
- [ ] Monitor contract calls and errors
- [ ] Track daily minting statistics
- [ ] Set up alerts for unusual activity

### 15. User Support
- [ ] Create FAQ for common issues
- [ ] Set up support channel (Discord/Telegram)
- [ ] Prepare wallet connection guides
- [ ] Document gas fee estimates
- [ ] Create video tutorials (optional)

## Security & Maintenance

### 16. Security Measures
- [ ] Never expose private keys
- [ ] Use environment variables for sensitive data
- [ ] Implement rate limiting on frontend
- [ ] Add transaction signing verification
- [ ] Monitor for suspicious activity

### 17. Ongoing Maintenance
- [ ] Plan for contract upgrades (if needed)
- [ ] Monitor Stacks network updates
- [ ] Keep dependencies updated
- [ ] Regular security reviews
- [ ] Backup all deployment data

## Launch Checklist

### 18. Pre-Launch
- [ ] All contracts deployed and verified
- [ ] Frontend fully tested
- [ ] Documentation complete
- [ ] Support channels ready
- [ ] Marketing materials prepared

### 19. Launch Day
- [ ] Monitor transactions closely
- [ ] Respond to user issues quickly
- [ ] Track contract interaction metrics
- [ ] Announce on social media
- [ ] Engage with early users

### 20. Post-Launch
- [ ] Gather user feedback
- [ ] Fix any reported issues
- [ ] Plan feature updates
- [ ] Monitor contract performance
- [ ] Celebrate successful migration! 🎉

---

## Quick Reference

**Testnet Resources:**
- Explorer: https://explorer.hiro.so/?chain=testnet
- Faucet: https://explorer.hiro.so/sandbox/faucet
- API: https://api.testnet.hiro.so

**Mainnet Resources:**
- Explorer: https://explorer.hiro.so/
- API: https://api.hiro.so

**Important Files:**
- Contract Config: `stacks-contracts/Clarinet.toml`
- Frontend Config: `src/lib/stacksUtils.ts`
- Environment: `.env.local` or `.env.production`
- Context Provider: `src/context/StacksContext.tsx`

**Deployment Commands:**
```bash
# Check contracts
clarinet check

# Deploy testnet
clarinet deploy --testnet

# Deploy mainnet
clarinet deploy --mainnet

# Build frontend
bun run build
```

---

**Status Tracking:**

Date Started: __________
Testnet Deployed: __________
Mainnet Deployed: __________
Launch Date: __________

**Team Sign-off:**
- [ ] Developer
- [ ] Security Reviewer
- [ ] Project Manager
- [ ] Product Owner

---

*Keep this checklist updated as you complete each step!*

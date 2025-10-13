# StackVerse Smart Contracts

Clarity smart contracts for StackVerse on Stacks blockchain.

## Contracts

### 1. Profile NFT (`profile-nft.clar`)

A non-fungible token contract for user profiles with metadata storage.

**Features:**
- Mint profile NFTs with name, bio, social link, and image URI
- Update profile metadata
- Update profile images
- Free minting (0 STX mint price)
- Owner-only admin functions

**Key Functions:**

```clarity
;; Create a new profile NFT
(create-profile (name (string-ascii 50))
                (bio (string-utf8 256))
                (social-link (string-utf8 256))
                (token-uri (string-utf8 256)))

;; Update profile information
(update-profile (token-id uint)
                (name (string-ascii 50))
                (bio (string-utf8 256))
                (social-link (string-utf8 256)))

;; Update profile image
(update-profile-image (token-id uint)
                      (new-token-uri (string-utf8 256)))

;; Read profile data
(get-profile (token-id uint))
```

### 2. StackVerse Token (`stackverse-token.clar`)

A SIP-010 compliant fungible token with rate limiting.

**Features:**
- Symbol: **SVT**
- Decimals: **6**
- Daily mint limit: 10 tokens per user
- Cooldown period: ~24 hours (144 blocks)
- Free minting with rate limits
- Full SIP-010 compliance

**Key Functions:**

```clarity
;; Mint tokens (rate limited)
(mint (amount uint))

;; Transfer tokens
(transfer (amount uint)
          (sender principal)
          (recipient principal)
          (memo (optional (buff 34))))

;; Check remaining mint allowance
(get-remaining-mint-allowance (user principal))

;; Get token balance
(get-balance (account principal))
```

## Setup

### Prerequisites

- [Clarinet](https://github.com/hirosystems/clarinet) >= 2.0
- [Node.js](https://nodejs.org/) >= 18
- [Stacks Wallet](https://leather.io/) for deployment

### Installation

```bash
# Install dependencies
npm install

# or
bun install
```

### Testing Contracts

```bash
# Check contract syntax
clarinet check

# Run unit tests (when available)
clarinet test

# Start local devnet
clarinet integrate
```

## Deployment

### Deploy to Testnet

1. **Setup wallet:**
   ```bash
   # Import your wallet
   stx make_keychain -t > wallet.json
   ```

2. **Get testnet STX:**
   - Visit https://explorer.hiro.so/sandbox/faucet
   - Request testnet STX for deployment

3. **Deploy contracts:**
   ```bash
   # Deploy using Clarinet
   clarinet deploy --testnet

   # Or deploy manually
   clarinet deployments generate --testnet
   clarinet deployments apply -p deployments/default.testnet-plan.yaml
   ```

4. **Note your contract addresses** - You'll need these for frontend integration.

### Deploy to Mainnet

```bash
# Generate deployment plan
clarinet deployments generate --mainnet

# Review the plan
cat deployments/default.mainnet-plan.yaml

# Deploy (requires STX in wallet)
clarinet deployments apply -p deployments/default.mainnet-plan.yaml
```

## Contract Interactions

### Using Clarinet Console

```bash
# Start console
clarinet console

# Mint a profile NFT
(contract-call? .profile-nft create-profile 
  "Alice" 
  u"Web3 Developer" 
  u"https://twitter.com/alice" 
  u"https://example.com/alice.jpg")

# Mint tokens
(contract-call? .stackverse-token mint u1000000)

# Check balance
(contract-call? .stackverse-token get-balance tx-sender)
```

### Using Stacks CLI

```bash
# Call create-profile function
stx call_contract_func \
  ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM \
  profile-nft \
  create-profile \
  -e Alice \
  -e "Web3 Developer" \
  -e "https://twitter.com/alice" \
  -e "https://example.com/alice.jpg"
```

## Testing

### Manual Testing Checklist

- [ ] Deploy both contracts to testnet
- [ ] Mint profile NFT
- [ ] Update profile metadata
- [ ] Update profile image
- [ ] Mint tokens (check rate limiting)
- [ ] Transfer tokens between accounts
- [ ] Verify daily limit resets after cooldown
- [ ] Test with multiple users

### Expected Gas Costs (Testnet)

- Create Profile NFT: ~0.01 STX
- Update Profile: ~0.005 STX
- Mint Tokens: ~0.005 STX
- Transfer Tokens: ~0.003 STX

## Security Considerations

✅ **Implemented:**
- No reentrancy vulnerabilities (Clarity language guarantee)
- Rate limiting on token minting
- Ownership checks on all update functions
- Input validation on all public functions

⚠️ **Notes:**
- Testnet only - audit before mainnet deployment
- Rate limits are per-address, not per-user
- Profile data is immutable after creation date

## Frontend Integration

After deployment, update the contract address in your frontend:

```typescript
// src/lib/stacksUtils.ts
const CONTRACT_ADDRESS = 'YOUR_DEPLOYED_ADDRESS';
const PROFILE_NFT_CONTRACT = 'profile-nft';
const TOKEN_CONTRACT = 'stackverse-token';
```

## Resources

- [Clarity Language Reference](https://docs.stacks.co/clarity/)
- [SIP-010 Token Standard](https://github.com/stacksgov/sips/blob/main/sips/sip-010/sip-010-fungible-token-standard.md)
- [SIP-009 NFT Standard](https://github.com/stacksgov/sips/blob/main/sips/sip-009/sip-009-nft-standard.md)
- [Clarinet Documentation](https://docs.hiro.so/clarinet/)
- [Stacks Explorer](https://explorer.hiro.so/)

## License

MIT

## Author

0xShikhar - StackVerse Team

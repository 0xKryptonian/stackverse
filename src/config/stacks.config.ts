/**
 * Stacks Blockchain Configuration
 * 
 * Deployed Contracts on Testnet:
 * - Profile NFT: ST167SDV0GEX4XN11ZZ4THVFKRW5H9BVCVXG1XYMD.profile-nft
 * - StackVerse Token: ST167SDV0GEX4XN11ZZ4THVFKRW5H9BVCVXG1XYMD.stackverse-token
 */

import { StacksTestnet, StacksMainnet } from '@stacks/network';

export const STACKS_CONFIG = {
  // Network configuration
  NETWORK: new StacksTestnet(), // Change to StacksMainnet() for production
  
  // Deployed contract addresses
  CONTRACT_ADDRESS: 'ST167SDV0GEX4XN11ZZ4THVFKRW5H9BVCVXG1XYMD', // Testnet deployer address
  
  // Contract names
  CONTRACTS: {
    PROFILE_NFT: 'profile-nft',
    STACKVERSE_TOKEN: 'stackverse-token',
  },
  
  // Full contract identifiers
  FULL_CONTRACTS: {
    PROFILE_NFT: 'ST167SDV0GEX4XN11ZZ4THVFKRW5H9BVCVXG1XYMD.profile-nft',
    STACKVERSE_TOKEN: 'ST167SDV0GEX4XN11ZZ4THVFKRW5H9BVCVXG1XYMD.stackverse-token',
  },
  
  // Token configuration
  TOKEN: {
    NAME: 'StackVerse Token',
    SYMBOL: 'SVT',
    DECIMALS: 6,
    MAX_MINT_PER_DAY: 10000000, // 10 tokens with 6 decimals
    MINT_COOLDOWN: 144, // ~24 hours in blocks
  },
  
  // Explorer URLs
  EXPLORER: {
    TESTNET: 'https://explorer.hiro.so',
    MAINNET: 'https://explorer.hiro.so',
    getTxUrl: (txId: string, isMainnet = false) => 
      `https://explorer.hiro.so/txid/${txId}?chain=${isMainnet ? 'mainnet' : 'testnet'}`,
    getAddressUrl: (address: string, isMainnet = false) => 
      `https://explorer.hiro.so/address/${address}?chain=${isMainnet ? 'mainnet' : 'testnet'}`,
    getContractUrl: (contractId: string, isMainnet = false) => 
      `https://explorer.hiro.so/txid/${contractId}?chain=${isMainnet ? 'mainnet' : 'testnet'}`,
  },
  
  // API endpoints
  API: {
    TESTNET: 'https://api.testnet.hiro.so',
    MAINNET: 'https://api.mainnet.hiro.so',
  },
};

// Export individual values for convenience
export const { NETWORK, CONTRACT_ADDRESS, CONTRACTS, TOKEN, EXPLORER, API } = STACKS_CONFIG;

export default STACKS_CONFIG;

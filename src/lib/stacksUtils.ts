import { openContractCall } from '@stacks/connect';
import { 
  StacksTestnet, 
  StacksMainnet 
} from '@stacks/network';
import {
  AnchorMode,
  PostConditionMode,
  stringAsciiCV,
  stringUtf8CV,
  uintCV,
  principalCV,
  callReadOnlyFunction,
  cvToJSON,
  cvToValue,
  Cl,
} from '@stacks/transactions';
import type { UserSession } from '@stacks/connect';

// Contract configuration
const NETWORK = new StacksTestnet(); // Change to StacksMainnet() for production
const CONTRACT_ADDRESS = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'; // Update with deployed address
const PROFILE_NFT_CONTRACT = 'profile-nft';
const TOKEN_CONTRACT = 'stackverse-token';

export interface ProfileData {
  name: string;
  bio: string;
  socialLink: string;
  tokenUri: string;
}

export interface TokenMintData {
  amount: number;
  remainingAllowance: number;
  lastMintBlock: number;
}

// Profile NFT Functions
export async function createProfile(
  userSession: UserSession,
  profileData: ProfileData,
  onFinish?: (data: any) => void,
  onCancel?: (error?: any) => void
) {
  try {
    const functionArgs = [
      stringAsciiCV(profileData.name),
      stringUtf8CV(profileData.bio),
      stringUtf8CV(profileData.socialLink),
      stringUtf8CV(profileData.tokenUri),
    ];

    const options = {
      network: NETWORK,
      anchorMode: AnchorMode.Any,
      contractAddress: CONTRACT_ADDRESS,
      contractName: PROFILE_NFT_CONTRACT,
      functionName: 'create-profile',
      functionArgs,
      postConditionMode: PostConditionMode.Allow,
      onFinish,
      onCancel,
    };

    return await openContractCall(options);
  } catch (error) {
    console.error('Error creating profile:', error);
    if (onCancel) onCancel(error);
    throw error;
  }
}

export async function updateProfile(
  userSession: UserSession,
  tokenId: number,
  profileData: Omit<ProfileData, 'tokenUri'>,
  onFinish?: (data: any) => void,
  onCancel?: (error?: any) => void
) {
  try {
    const functionArgs = [
      uintCV(tokenId),
      stringAsciiCV(profileData.name),
      stringUtf8CV(profileData.bio),
      stringUtf8CV(profileData.socialLink),
    ];

    const options = {
      network: NETWORK,
      anchorMode: AnchorMode.Any,
      contractAddress: CONTRACT_ADDRESS,
      contractName: PROFILE_NFT_CONTRACT,
      functionName: 'update-profile',
      functionArgs,
      postConditionMode: PostConditionMode.Allow,
      onFinish,
      onCancel,
    };

    return await openContractCall(options);
  } catch (error) {
    console.error('Error updating profile:', error);
    if (onCancel) onCancel(error);
    throw error;
  }
}

export async function updateProfileImage(
  userSession: UserSession,
  tokenId: number,
  newTokenUri: string,
  onFinish?: (data: any) => void,
  onCancel?: (error?: any) => void
) {
  try {
    const functionArgs = [
      uintCV(tokenId),
      stringUtf8CV(newTokenUri),
    ];

    const options = {
      network: NETWORK,
      anchorMode: AnchorMode.Any,
      contractAddress: CONTRACT_ADDRESS,
      contractName: PROFILE_NFT_CONTRACT,
      functionName: 'update-profile-image',
      functionArgs,
      postConditionMode: PostConditionMode.Allow,
      onFinish,
      onCancel,
    };

    return await openContractCall(options);
  } catch (error) {
    console.error('Error updating profile image:', error);
    if (onCancel) onCancel(error);
    throw error;
  }
}

export async function getProfile(tokenId: number) {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: PROFILE_NFT_CONTRACT,
      functionName: 'get-profile',
      functionArgs: [uintCV(tokenId)],
      network: NETWORK,
      senderAddress: CONTRACT_ADDRESS,
    });

    return cvToJSON(result);
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
}

export async function getProfileOwner(tokenId: number) {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: PROFILE_NFT_CONTRACT,
      functionName: 'get-owner',
      functionArgs: [uintCV(tokenId)],
      network: NETWORK,
      senderAddress: CONTRACT_ADDRESS,
    });

    return cvToJSON(result);
  } catch (error) {
    console.error('Error fetching profile owner:', error);
    throw error;
  }
}

// Token Functions
export async function mintTokens(
  userSession: UserSession,
  amount: number,
  onFinish?: (data: any) => void,
  onCancel?: (error?: any) => void
) {
  try {
    const functionArgs = [
      uintCV(amount),
    ];

    const options = {
      network: NETWORK,
      anchorMode: AnchorMode.Any,
      contractAddress: CONTRACT_ADDRESS,
      contractName: TOKEN_CONTRACT,
      functionName: 'mint',
      functionArgs,
      postConditionMode: PostConditionMode.Allow,
      onFinish,
      onCancel,
    };

    return await openContractCall(options);
  } catch (error) {
    console.error('Error minting tokens:', error);
    if (onCancel) onCancel(error);
    throw error;
  }
}

export async function getTokenBalance(address: string) {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: TOKEN_CONTRACT,
      functionName: 'get-balance',
      functionArgs: [principalCV(address)],
      network: NETWORK,
      senderAddress: address,
    });

    const jsonResult = cvToJSON(result);
    return jsonResult.value ? Number(jsonResult.value) : 0;
  } catch (error) {
    console.error('Error fetching token balance:', error);
    return 0;
  }
}

export async function getRemainingMintAllowance(address: string) {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: TOKEN_CONTRACT,
      functionName: 'get-remaining-mint-allowance',
      functionArgs: [principalCV(address)],
      network: NETWORK,
      senderAddress: address,
    });

    const jsonResult = cvToJSON(result);
    return jsonResult.value ? Number(jsonResult.value) : 0;
  } catch (error) {
    console.error('Error fetching remaining mint allowance:', error);
    return 0;
  }
}

export async function getTotalSupply() {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: TOKEN_CONTRACT,
      functionName: 'get-total-supply',
      functionArgs: [],
      network: NETWORK,
      senderAddress: CONTRACT_ADDRESS,
    });

    const jsonResult = cvToJSON(result);
    return jsonResult.value ? Number(jsonResult.value) : 0;
  } catch (error) {
    console.error('Error fetching total supply:', error);
    return 0;
  }
}

// Helper to format token amounts (6 decimals)
export function formatTokenAmount(amount: number): string {
  return (amount / 1000000).toFixed(2);
}

// Helper to parse token amounts to microunits
export function parseTokenAmount(amount: number): number {
  return Math.floor(amount * 1000000);
}

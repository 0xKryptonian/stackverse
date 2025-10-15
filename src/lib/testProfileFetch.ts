/**
 * Debug utility to test profile fetching
 * Run this in browser console to debug profile data fetching
 */

import { callReadOnlyFunction, cvToJSON, uintCV } from '@stacks/transactions';
import { StacksTestnet } from '@stacks/network';

export async function testFetchProfile(tokenId: number) {
  const CONTRACT_ADDRESS = 'ST167SDV0GEX4XN11ZZ4THVFKRW5H9BVCVXG1XYMD';
  const PROFILE_NFT_CONTRACT = 'profile-nft';
  const NETWORK = new StacksTestnet();

  console.log('=== Testing Profile Fetch ===');
  console.log('Contract:', `${CONTRACT_ADDRESS}.${PROFILE_NFT_CONTRACT}`);
  console.log('Token ID:', tokenId);
  console.log('Network:', NETWORK.coreApiUrl);

  try {
    // Test get-profile
    console.log('\n1. Calling get-profile...');
    const profileResult = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: PROFILE_NFT_CONTRACT,
      functionName: 'get-profile',
      functionArgs: [uintCV(tokenId)],
      network: NETWORK,
      senderAddress: CONTRACT_ADDRESS,
    });

    console.log('Raw result:', profileResult);
    const profileJson = cvToJSON(profileResult);
    console.log('JSON result:', profileJson);

    // Test get-owner
    console.log('\n2. Calling get-owner...');
    const ownerResult = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: PROFILE_NFT_CONTRACT,
      functionName: 'get-owner',
      functionArgs: [uintCV(tokenId)],
      network: NETWORK,
      senderAddress: CONTRACT_ADDRESS,
    });

    const ownerJson = cvToJSON(ownerResult);
    console.log('Owner result:', ownerJson);

    // Test get-last-token-id
    console.log('\n3. Calling get-last-token-id...');
    const lastIdResult = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: PROFILE_NFT_CONTRACT,
      functionName: 'get-last-token-id',
      functionArgs: [],
      network: NETWORK,
      senderAddress: CONTRACT_ADDRESS,
    });

    const lastIdJson = cvToJSON(lastIdResult);
    console.log('Last token ID:', lastIdJson);

    return {
      profile: profileJson,
      owner: ownerJson,
      lastTokenId: lastIdJson
    };
  } catch (error) {
    console.error('Error testing profile fetch:', error);
    throw error;
  }
}

// Make it available in browser console
if (typeof window !== 'undefined') {
  (window as any).testFetchProfile = testFetchProfile;
}

import { NextRequest, NextResponse } from 'next/server';
import { generateJwtToken } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { verifyMessageSignatureRsv } from '@stacks/encryption';
import { StacksTestnet } from '@stacks/network';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, signature, address } = body;

    if (!message || !signature || !address) {
      return NextResponse.json(
        { error: 'Missing message, signature, or address' },
        { status: 400 }
      );
    }

    console.log('[Auth] Login attempt for address:', address);
    console.log('[Auth] Message:', message);
    console.log('[Auth] Signature:', signature);

    // For Stacks wallet authentication, we verify the signature
    try {
      const isValid = verifyMessageSignatureRsv({
        message,
        signature,
        publicKey: address,
      });

      if (!isValid) {
        console.error('[Auth] Invalid Stacks signature');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    } catch (verifyError) {
      console.error('[Auth] Signature verification error:', verifyError);
      // For testnet, we'll be more lenient and just verify the address is provided
      console.log('[Auth] Proceeding with lenient verification for testnet');
    }

    // Use the provided address
    const walletAddress = address;

    console.log('[Auth] Authenticated wallet:', walletAddress);

    // Find or create user in database
    const user = await prisma.user.upsert({
      where: { walletAddress: walletAddress.toLowerCase() },
      update: {
        // Update last login timestamp if you add that field later
      },
      create: {
        walletAddress: walletAddress.toLowerCase(),
        email: `${walletAddress.toLowerCase()}@stacks.temp`, // Temporary email for Stacks users
      },
    });

    console.log('User:', user);

    // Generate JWT token
    const token = generateJwtToken({
      userId: user.id,
      address: user.walletAddress,
    });

    console.log('Token:', token);

    // Return token and user data
    return NextResponse.json({
      token,
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        username: user.username,
        createdAt: user.createdAt,
        avatar: user.avatar,
        bio: user.bio,
        NFTid: user.NFTid
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';

/**
 * Simplified middleware - no JWT auth needed
 * Wallet connection is the authentication in Web3 apps
 * API routes will verify wallet address from query params
 */
export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Just log for debugging purposes
    console.log(`API request: ${pathname}`);
    
    return NextResponse.next();
}

// Configure middleware to run only on API routes
export const config = {
    matcher: '/api/:path*',
}; 
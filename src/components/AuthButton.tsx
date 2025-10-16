"use client"
import { StacksWalletButton } from '@/components/StacksWalletButton';

/**
 * Simple authentication button - wallet connection is the authentication
 * No need for additional sign-in steps in a Web3 app
 */
export function AuthButton() {
    return <StacksWalletButton />;
}

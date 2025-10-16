"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useStacks } from "@/context/StacksContext";
import { Button } from "@/components/ui/button";

export function StacksWalletButton() {
  console.log('[StacksWalletButton] Component rendering');
  
  const context = useStacks();
  console.log('[StacksWalletButton] Context received:', {
    hasStacksUser: !!context.stacksUser,
    hasConnectWallet: typeof context.connectWallet === 'function',
    hasDisconnectWallet: typeof context.disconnectWallet === 'function',
  });
  
  const { stacksUser, connectWallet, disconnectWallet } = context;
  const [stacksAddress, setStacksAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<boolean>(false);

  useEffect(() => {
    console.log('[StacksWalletButton] stacksUser changed:', stacksUser);
    if (stacksUser?.profile?.stxAddress?.testnet) {
      setStacksAddress(stacksUser.profile.stxAddress.testnet);
      console.log('[StacksWalletButton] Address set to:', stacksUser.profile.stxAddress.testnet);
    } else {
      setStacksAddress(null);
      console.log('[StacksWalletButton] Address cleared');
    }
  }, [stacksUser]);

  const handleConnect = () => {
    console.log('[StacksWalletButton] handleConnect called');
    console.log('[StacksWalletButton] connectWallet function:', connectWallet);
    console.log('[StacksWalletButton] typeof connectWallet:', typeof connectWallet);
    
    setConnecting(true);
    try {
      console.log('[StacksWalletButton] Calling connectWallet...');
      connectWallet();
      console.log('[StacksWalletButton] connectWallet called');
    } catch (error) {
      console.error('[StacksWalletButton] Connection error:', error);
      console.error('[StacksWalletButton] Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
    } finally {
      setTimeout(() => setConnecting(false), 1000);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setStacksAddress(null);
  };

  if (!stacksAddress) {
    return (
      <Button
        onClick={handleConnect}
        disabled={connecting}
        className="bg-[#98ee2c] hover:bg-[#f0f0f0] text-black font-semibold"
      >
        {connecting ? "Connecting..." : "Connect Stacks Wallet"}
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col items-end bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg">
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {stacksAddress.slice(0, 6)}...{stacksAddress.slice(-4)}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">Testnet</span>
      </div>
      <Button
        onClick={handleDisconnect}
        variant="destructive"
        size="sm"
      >
        Disconnect
      </Button>
    </div>
  );
}

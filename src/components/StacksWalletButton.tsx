"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useStacks } from "@/context/StacksContext";
import { Button } from "@/components/ui/button";

export function StacksWalletButton() {
  const { stacksUser, connectWallet, disconnectWallet } = useStacks();
  const [stacksAddress, setStacksAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<boolean>(false);

  useEffect(() => {
    if (stacksUser?.profile?.stxAddress?.testnet) {
      setStacksAddress(stacksUser.profile.stxAddress.testnet);
    } else {
      setStacksAddress(null);
    }
  }, [stacksUser]);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      connectWallet();
    } catch (error) {
      console.error("Connection error:", error);
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
        className="bg-orange-600 hover:bg-orange-700 text-white font-semibold"
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

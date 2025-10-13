"use client";

import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { STACKS_TESTNET, STACKS_MAINNET, StacksNetwork } from '@stacks/network';
import type { UserData } from '@stacks/connect';

interface StacksContextType {
  stacksUser: UserData | null;
  stacksNetwork: StacksNetwork;
  connectWallet: () => void;
  disconnectWallet: () => void;
  userSession: UserSession;
  isSignedIn: () => boolean;
  getAddress: () => string | null;
  getNetwork: () => StacksNetwork;
}

const StacksContext = createContext<StacksContextType | undefined>(undefined);

export function StacksProvider({ children }: { children: ReactNode }) {
  const [stacksUser, setStacksUser] = useState<UserData | null>(null);
  const stacksNetwork = useMemo(() => STACKS_TESTNET, []); // Change to StacksMainnet() for production
  const appConfig = useMemo(() => new AppConfig(['store_write', 'publish_data']), []);
  const userSession = useMemo(() => new UserSession({ appConfig }), [appConfig]);

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      setStacksUser(userSession.loadUserData());
    }
  }, [userSession]);

  const connectWallet = () => {
    showConnect({
      appDetails: {
        name: 'StackVerse',
        icon: typeof window !== 'undefined' ? window.location.origin + '/favicon.ico' : '',
      },
      redirectTo: '/',
      onFinish: () => {
        const userData = userSession.loadUserData();
        setStacksUser(userData);
        console.log('Connected to Stacks:', userData.profile.stxAddress.testnet);
      },
      userSession,
    });
  };

  const disconnectWallet = () => {
    userSession.signUserOut();
    setStacksUser(null);
    console.log('Disconnected from Stacks');
  };

  const value: StacksContextType = {
    stacksUser,
    stacksNetwork,
    connectWallet,
    disconnectWallet,
    userSession,
    isSignedIn: () => userSession.isUserSignedIn(),
    getAddress: () => stacksUser?.profile?.stxAddress?.testnet || null,
    getNetwork: () => stacksNetwork,
  };

  return (
    <StacksContext.Provider value={value}>
      {children}
    </StacksContext.Provider>
  );
}

export const useStacks = () => {
  const context = useContext(StacksContext);
  if (context === undefined) {
    throw new Error('useStacks must be used within a StacksProvider');
  }
  return context;
};

export const useStacksAddress = () => {
  const { stacksUser } = useStacks();
  return stacksUser?.profile?.stxAddress?.testnet || null;
};

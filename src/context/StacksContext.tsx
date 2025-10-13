"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import type { UserData } from '@stacks/connect';

interface StacksContextType {
  stacksUser: UserData | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
  userSession: UserSession;
  isSignedIn: () => boolean;
  getAddress: () => string | null;
}

const StacksContext = createContext<StacksContextType | undefined>(undefined);

export function StacksProvider({ children }: { children: ReactNode }) {
  const [stacksUser, setStacksUser] = useState<UserData | null>(null);
  
  // Initialize app config and user session directly (not using useMemo to avoid SSR issues)
  const appConfig = new AppConfig(['store_write', 'publish_data']);
  const userSession = new UserSession({ appConfig });

  useEffect(() => {
    console.log('[StacksProvider] Initializing...');
    console.log('[StacksProvider] UserSession created:', userSession);
    // console.log('[StacksProvider] Is user signed in?', userSession.isUserSignedIn());
    
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      setStacksUser(userData);
      console.log('[StacksProvider] User already signed in:', userData.profile.stxAddress.testnet);
    }
  }, []);

  const connectWallet = () => {
    console.log('[StacksProvider] connectWallet called');
    console.log('[StacksProvider] showConnect function:', showConnect);
    console.log('[StacksProvider] typeof showConnect:', typeof showConnect);
    
    try {
      console.log('[StacksProvider] Calling showConnect with config...');
      
      showConnect({
        appDetails: {
          name: 'StackVerse',
          icon: window.location.origin + '/core.png',
        },
        redirectTo: '/',
        onFinish: () => {
          console.log('[StacksProvider] onFinish callback triggered');
          const userData = userSession.loadUserData();
          setStacksUser(userData);
          console.log('[StacksProvider] Connected to Stacks:', userData.profile.stxAddress.testnet);
        },
        onCancel: () => {
          console.log('[StacksProvider] User cancelled connection');
        },
        userSession,
      });
      
      console.log('[StacksProvider] showConnect called successfully');
    } catch (error) {
      console.error('[StacksProvider] Error calling showConnect:', error);
      console.error('[StacksProvider] Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
  };

  const disconnectWallet = () => {
    console.log('[StacksProvider] disconnectWallet called');
    userSession.signUserOut();
    setStacksUser(null);
    console.log('[StacksProvider] Disconnected from Stacks');
  };

  const value: StacksContextType = {
    stacksUser,
    connectWallet,
    disconnectWallet,
    userSession,
    isSignedIn: () => userSession.isUserSignedIn(),
    getAddress: () => stacksUser?.profile?.stxAddress?.testnet || null,
  };

  console.log('[StacksProvider] Rendering with value:', {
    hasUser: !!stacksUser,
    address: stacksUser?.profile?.stxAddress?.testnet,
    isSignedIn: userSession.isUserSignedIn(),
  });

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

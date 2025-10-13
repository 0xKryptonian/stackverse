'use client';

import * as React from 'react';
import {
    QueryClientProvider,
    QueryClient,
} from "@tanstack/react-query";
import { StacksProvider } from '@/context/StacksContext';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    console.log('[Providers] Component rendering');
    const [mounted, setMounted] = React.useState(false);
    
    React.useEffect(() => {
        console.log('[Providers] Mounting...');
        setMounted(true);
        console.log('[Providers] Mounted');
    }, []);
    
    console.log('[Providers] Mounted state:', mounted);
    
    return (
        <QueryClientProvider client={queryClient}>
            <StacksProvider>
                {mounted ? (
                    children
                ) : (
                    <div style={{ visibility: "hidden" }}>
                        {children}
                    </div>
                )}
            </StacksProvider>
        </QueryClientProvider>
    );
}

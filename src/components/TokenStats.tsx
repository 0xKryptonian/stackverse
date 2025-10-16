"use client";

import { useState, useEffect } from "react";
import { useStacks } from "@/context/StacksContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoIcon, CoinsIcon, RefreshCwIcon, CheckCircleIcon, AlertCircleIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const STACKS_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_STACKS_TOKEN_CONTRACT || 'ST167SDV0GEX4XN11ZZ4THVFKRW5H9BVCVXG1XYMD.stackverse-token';

export default function TokenMintPage() {
    const [amount, setAmount] = useState<number>(1);
    const { getAddress, isSignedIn } = useStacks();
    const address = getAddress();
    const isConnected = isSignedIn();
    const { isAuthenticated } = useAuth();

    // State for contract data
    const [mintPrice, setMintPrice] = useState<number>(0);
    const [remainingAllowance, setRemainingAllowance] = useState<number>(0);
    const [tokenSymbol, setTokenSymbol] = useState<string>("STKV");
    const [tokenBalance, setTokenBalance] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch contract data
    useEffect(() => {
        const fetchData = async () => {
            if (!address) return;
            
            setIsLoading(true);
            try {
                // TODO: Implement Stacks contract reads
                // const balance = await getTokenBalance(address);
                // const allowance = await getRemainingAllowance(address);
                // setTokenBalance(balance);
                // setRemainingAllowance(allowance);
                
                // Placeholder values
                setTokenBalance(0);
                setRemainingAllowance(100);
                setMintPrice(0.001); // STX
            } catch (error) {
                console.error('Error fetching token data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [address]);

    const formattedBalance = tokenBalance;

    // Add this right before the return statement
    useEffect(() => {
        console.log("Mint state:", {
            address,
            isConnected,
            isAuthenticated,
            remainingAllowance: Number(remainingAllowance || 0),
            mintPrice,
            amount
        });
    }, [address, isConnected, isAuthenticated, remainingAllowance, mintPrice, amount]);

    return (
        <div className="container max-w-4xl py-2">
            <h1 className="text-4xl font-bold text-center mb-8 text-white bg-clip-text text-transparent">
                Get your $Game token to play
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 text-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                            <CoinsIcon className="mr-2 h-5 w-5" />
                            Token Balance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{formattedBalance.toLocaleString()}</p>
                        <p className="text-sm text-slate-400">{tokenSymbol as string ?? "Tokens"}</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 text-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                            <RefreshCwIcon className="mr-2 h-5 w-5" />
                            Daily Allowance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{Number(remainingAllowance ?? 0).toString()}</p>
                        <p className="text-sm text-slate-400">Tokens available today</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 text-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                            <InfoIcon className="mr-2 h-5 w-5" />
                            Mint Price
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">
                            {mintPrice ? mintPrice.toFixed(4) : "0"} STX
                        </p>
                        <p className="text-sm text-slate-400">Per token</p>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8 text-center text-sm text-muted-foreground">
                <p>
                    Contract Address:{" "}
                    <span className="font-mono text-xs">
                        {STACKS_CONTRACT_ADDRESS}
                    </span>
                </p>
            </div>
        </div>
    );
} 
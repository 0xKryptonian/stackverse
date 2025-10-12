"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RefreshCwIcon, CheckCircleIcon, AlertCircleIcon } from "lucide-react";
import { useStacks } from "@/context/StacksContext";
import { 
    mintTokens, 
    getTokenBalance, 
    getRemainingMintAllowance,
    formatTokenAmount,
    parseTokenAmount
} from "@/lib/stacksUtils";

function TokenMint() {
    const [amount, setAmount] = useState<number>(1);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [txId, setTxId] = useState<string | null>(null);

    const { stacksUser, userSession, isSignedIn } = useStacks();
    const address = stacksUser?.profile?.stxAddress?.testnet || null;
    const isConnected = isSignedIn();

    // Token data state
    const [remainingAllowance, setRemainingAllowance] = useState<number>(10);
    const [balance, setBalance] = useState<number>(0);
    const tokenSymbol = "SVT";
    const tokenName = "StackVerse Token";

    // Reset states when transaction completes
    const resetStates = () => {
        setTimeout(() => {
            setIsSuccess(false);
            setError(null);
        }, 5000);
    };

    // Fetch token data
    useEffect(() => {
        const fetchTokenData = async () => {
            if (!address) return;

            try {
                const allowance = await getRemainingMintAllowance(address);
                const userBalance = await getTokenBalance(address);
                setRemainingAllowance(allowance);
                setBalance(userBalance);
            } catch (err) {
                console.error("Error fetching token data:", err);
            }
        };

        fetchTokenData();
        const interval = setInterval(fetchTokenData, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, [address]);

    const isDisabled = !isConnected || isPending || remainingAllowance <= 0;

    // Handle mint function
    const handleMint = async () => {
        try {
            setError(null);

            if (!address || !isConnected) {
                setError("Please connect your Stacks wallet first");
                return;
            }

            if (amount <= 0) {
                setError("Amount must be greater than 0");
                return;
            }

            if (amount > remainingAllowance) {
                setError("Amount exceeds daily limit");
                return;
            }

            setIsPending(true);

            // Convert amount to microunits (6 decimals)
            const microAmount = parseTokenAmount(amount);

            await mintTokens(
                userSession,
                microAmount,
                async (data) => {
                    console.log("Mint successful:", data);
                    setTxId(data.txId);
                    setIsSuccess(true);
                    setIsPending(false);
                    
                    // Refresh token data
                    if (address) {
                        const allowance = await getRemainingMintAllowance(address);
                        const userBalance = await getTokenBalance(address);
                        setRemainingAllowance(allowance);
                        setBalance(userBalance);
                    }
                    
                    resetStates();
                },
                (error) => {
                    console.error("Mint cancelled or failed:", error);
                    setError("Transaction cancelled or failed");
                    setIsPending(false);
                }
            );
        } catch (err) {
            console.error("Error minting tokens:", err);
            setError(err instanceof Error ? err.message : "Failed to mint tokens");
            setIsPending(false);
        }
    };

    return (
        <div className="container max-w-4xl py-8">
            <Card className="border-slate-200 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl">Mint {tokenName}</CardTitle>
                    <CardDescription>
                        Mint up to {formatTokenAmount(remainingAllowance * 1000000)} tokens per day • Balance: {formatTokenAmount(balance)} {tokenSymbol}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label htmlFor="amount">Amount to Mint</Label>
                                <Badge variant="outline" className="font-mono">
                                    {amount} {tokenSymbol}
                                </Badge>
                            </div>

                            <div className="pt-4 pb-2">
                                <Slider
                                    id="amount"
                                    value={[amount]}
                                    max={Math.floor(remainingAllowance / 1000000) || 10}
                                    min={1}
                                    step={1}
                                    onValueChange={(value) => setAmount(value[0])}
                                    disabled={!isConnected || remainingAllowance <= 0}
                                />
                            </div>

                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>1</span>
                                <span>{Math.floor(remainingAllowance / 1000000) || 10}</span>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <Label>Total Cost</Label>
                            <div className="text-2xl font-bold">
                                Free
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Transaction fees apply
                            </p>
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertCircleIcon className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {isSuccess && (
                            <Alert className="bg-green-50 border-green-200">
                                <CheckCircleIcon className="h-4 w-4 text-green-600" />
                                <AlertTitle className="text-green-800">Success!</AlertTitle>
                                <AlertDescription className="text-green-700">
                                    Tokens minted successfully!{" "}
                                    {txId && (
                                        <a
                                            href={`https://explorer.hiro.so/txid/${txId}?chain=testnet`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="underline font-medium"
                                        >
                                            View transaction
                                        </a>
                                    )}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </CardContent>

                <CardFooter>
                    <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        size="lg"
                        onClick={handleMint}
                        disabled={isDisabled}
                    >
                        {isPending ? (
                            <>
                                <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />
                                Confirm in Wallet
                            </>
                        ) : remainingAllowance <= 0 ? (
                            <>Daily Limit Reached</>
                        ) : (
                            <>Mint Tokens</>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

export default TokenMint;
"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useStacks } from "@/context/StacksContext"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { openContractCall } from "@stacks/connect"
import { StacksTestnet } from "@stacks/network"
import { uintCV, principalCV, noneCV, AnchorMode, PostConditionMode } from "@stacks/transactions"
import { recordGamePayment } from "@/lib/services/game-service"

interface GamePaymentModalProps {
    isOpen: boolean
    onClose: () => void
    gamePath: string
    gameName: string
}

// Stacks configuration
const NETWORK = new StacksTestnet()
const CONTRACT_ADDRESS = 'ST167SDV0GEX4XN11ZZ4THVFKRW5H9BVCVXG1XYMD'
const TOKEN_CONTRACT_NAME = 'stackverse-token'

// Platform wallet that receives the fees (Stacks address)
const PLATFORM_WALLET = CONTRACT_ADDRESS // Use deployer address as platform wallet for now

// Payment amount: 1 SVT = 1,000,000 micro-SVT (6 decimals)
const PAYMENT_AMOUNT = 1000000

export function GamePaymentModal({ isOpen, onClose, gamePath, gameName }: GamePaymentModalProps) {
    const router = useRouter()
    const { getAddress, isSignedIn, userSession } = useStacks()
    const address = getAddress()
    const isConnected = isSignedIn()
    const [isPaying, setIsPaying] = useState(false)
    const [redirecting, setRedirecting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [hash, setHash] = useState<string | null>(null)
    const [isConfirmed, setIsConfirmed] = useState(false)

    const gameId = gamePath.split('/').pop() || ""

    // Handle payment with Stacks SVT Token
    const handlePayment = async () => {
        if (!address) {
            setError("Please connect your wallet")
            return
        }

        setIsPaying(true)
        setError(null)

        try {
            console.log('[GamePayment] Initiating payment:', {
                from: address,
                to: PLATFORM_WALLET,
                amount: PAYMENT_AMOUNT,
                contract: `${CONTRACT_ADDRESS}.${TOKEN_CONTRACT_NAME}`
            })

            await openContractCall({
                network: NETWORK,
                anchorMode: AnchorMode.Any,
                contractAddress: CONTRACT_ADDRESS,
                contractName: TOKEN_CONTRACT_NAME,
                functionName: 'transfer',
                functionArgs: [
                    uintCV(PAYMENT_AMOUNT), // amount: 1 SVT (1,000,000 micro-SVT)
                    principalCV(address), // sender: current user
                    principalCV(PLATFORM_WALLET), // recipient: platform wallet
                    noneCV(), // memo: none
                ],
                postConditionMode: PostConditionMode.Allow,
                onFinish: (data) => {
                    console.log('[GamePayment] Payment successful:', data)
                    setHash(data.txId)
                    setIsConfirmed(true)
                    setIsPaying(false)
                },
                onCancel: () => {
                    console.log('[GamePayment] Payment cancelled by user')
                    setError("Payment cancelled")
                    setIsPaying(false)
                },
                userSession,
            })
        } catch (err) {
            console.error("[GamePayment] Payment failed:", err)
            setError(err instanceof Error ? err.message : "Payment failed. Please try again.")
            setIsPaying(false)
        }
    }

    // Redirect to game page after successful payment
    useEffect(() => {
        if (isConfirmed && !redirecting) {
            // Record the transaction
            if (address) {
                recordGamePayment({
                    gameId: gameId,
                    txHash: hash || "",
                    amount: 1,
                    address: address,
                }).catch(err => {
                    console.error("Failed to record payment:", err)
                })
            }

            setRedirecting(true)
            router.push(gamePath)
            onClose()
        }
    }, [isConfirmed, redirecting, router, gamePath, onClose, hash, gameId, address])

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-[#202020] border-gray-700 text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">Play {gameName}</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        To play this game, you need to pay 1 SVT token for each play session.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col space-y-4 py-4">
                    <div className="bg-[#151515] p-4 rounded-md">
                        <p className="text-sm text-gray-400 mb-2">Payment details:</p>
                        <div className="flex justify-between">
                            <span>Game play fee</span>
                            <span className="font-semibold">1 SVT Token</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 italic">
                            Note: Each play session requires a separate payment
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Token: StackVerse Token (SVT)
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-900/20 border border-red-800 p-3 rounded-md text-red-300 text-sm">
                            {error || "Transaction failed. Please try again."}
                        </div>
                    )}
                </div>

                <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-4">
                    {!isConnected ? (
                        <div className="w-full flex justify-center">
                            <p className="text-gray-400">Please connect your Stacks wallet to continue</p>
                        </div>
                    ) : (
                        <>
                            <Button
                                variant="outline"
                                onClick={onClose}
                                className="border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
                                disabled={isPaying}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handlePayment}
                                className="bg-[#98ee2c] text-black hover:bg-[#7bc922] font-bold"
                                disabled={isPaying}
                            >
                                {isPaying ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Confirm in Wallet
                                    </>
                                ) : (
                                    "Pay & Play Now"
                                )}
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 
"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useStacks } from "@/context/StacksContext"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { openContractCall } from "@stacks/connect"
import { recordGamePayment } from "@/lib/services/game-service"

interface GamePaymentModalProps {
    isOpen: boolean
    onClose: () => void
    gamePath: string
    gameName: string
}

// Stacks token contract address
const STACKS_TOKEN_CONTRACT = process.env.NEXT_PUBLIC_STACKS_TOKEN_CONTRACT || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.stackverse-token'
// ERC20 transfer function signature
const ERC20_ABI = [
    {
        name: "transfer",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
            { name: "to", type: "address" },
            { name: "amount", type: "uint256" }
        ],
        outputs: [{ name: "", type: "bool" }]
    }
]

// Platform wallet that receives the fees
const PLATFORM_WALLET = "0x043Bb2629766bB4375c8EC3d0CbbfA77bC7e7BC9"

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

    // Handle payment with Stacks
    const handlePayment = async () => {
        if (!address) return

        setIsPaying(true)
        setError(null)

        try {
            // TODO: Implement Stacks token transfer
            // For now, simulate payment
            await openContractCall({
                contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
                contractName: 'stackverse-token',
                functionName: 'transfer',
                functionArgs: [
                    // Add proper Clarity values here
                ],
                onFinish: (data) => {
                    setHash(data.txId)
                    setIsConfirmed(true)
                    setIsPaying(false)
                },
                onCancel: () => {
                    setIsPaying(false)
                },
                userSession,
            })
        } catch (err) {
            console.error("Payment failed:", err)
            setError(err instanceof Error ? err.message : "Payment failed")
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
                        To play this game, you need to pay 1 REALM token for each play session.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col space-y-4 py-4">
                    <div className="bg-[#151515] p-4 rounded-md">
                        <p className="text-sm text-gray-400 mb-2">Payment details:</p>
                        <div className="flex justify-between">
                            <span>Game play fee</span>
                            <span className="font-semibold">1 REALM Token</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 italic">
                            Note: Each play session requires a separate payment
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
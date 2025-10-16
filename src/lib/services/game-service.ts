"use client"

import { toast } from "sonner"

interface GamePaymentParams {
    gameId: string
    txHash: string
    amount: number
    address: string
}

interface GamePlayParams {
    gameSlug: string
    duration?: number
    completed?: boolean
    address: string
}

interface GameScoreParams {
    gameSlug: string
    score: number
    metadata?: Record<string, any>
    address: string
}

export async function recordGamePayment(params: GamePaymentParams) {
    try {
        console.log('[GameService] Recording payment:', params)
        
        const response = await fetch(`/api/profile/transactions?address=${params.address}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type: "GAME_PAYMENT",
                amount: params.amount,
                txHash: params.txHash,
                status: "COMPLETED",
                description: `Payment for playing game: ${params.gameId}`,
                tokenSymbol: "SVT",
            }),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            console.error('[GameService] Failed to record payment:', response.status, errorData)
            throw new Error(`Failed to record payment: ${response.status}`)
        }

        const result = await response.json()
        console.log('[GameService] Payment recorded successfully:', result)
        return result
    } catch (error) {
        console.error("[GameService] Error recording game payment:", error)
        // Don't show toast - this is non-critical since blockchain payment succeeded
        throw error
    }
}

export async function recordGamePlay(params: GamePlayParams) {
    try {
        const response = await fetch(`/api/profile/games/play?address=${params.address}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                gameSlug: params.gameSlug,
                duration: params.duration,
                completed: params.completed,
            }),
        })

        if (!response.ok) {
            throw new Error("Failed to record game play")
        }

        return await response.json()
    } catch (error) {
        console.error("Error recording game play:", error)
        // Silent failure - don't disrupt the user experience
        return null
    }
}

export async function recordGameScore(params: GameScoreParams) {
    try {
        const response = await fetch(`/api/profile/games/score?address=${params.address}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                gameSlug: params.gameSlug,
                score: params.score,
                metadata: params.metadata,
            }),
        })

        if (!response.ok) {
            throw new Error("Failed to record game score")
        }

        return await response.json()
    } catch (error) {
        console.error("Error recording game score:", error)
        toast.error("Failed to save your score. Please try again.")
        throw error
    }
} 
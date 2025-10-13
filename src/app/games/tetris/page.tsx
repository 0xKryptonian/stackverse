import React from 'react'
import TetrisGame from '@/components/tetris-game'
import { Toaster } from "sonner"

export const dynamic = 'force-dynamic';

const TetrisPage = () => {
    return (
        <div className="container mx-auto py-8">
            <TetrisGame />
            <Toaster position="top-center" />
        </div>
    )
}

export default TetrisPage
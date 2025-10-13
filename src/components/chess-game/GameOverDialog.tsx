import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose
} from '@/components/ui';
import { Button } from '@/components/ui';
import { Trophy, Handshake, Award, Loader2 } from 'lucide-react';
import { Chessboard } from 'react-chessboard';
import { GameStatus, PieceColor } from './ChessTypes';
import { GameSettings } from './GameFunctions';
import { useStacks } from '@/context/StacksContext';
import { openContractCall } from '@stacks/connect';

// Define interface for component props
interface GameOverDialogProps {
    showGameOverModal: boolean;
    setShowGameOverModal: (show: boolean) => void;
    gameStatus: GameStatus;
    playerColor: PieceColor;
    result: string;
    fen: string;
    settings: GameSettings;
    resetGame: () => void;
    moves: string; // PGN or move history as string
    opponent: string; // Opponent address
    moveCount: number; // Number of moves in the game
}

const STACKS_CHESS_CONTRACT = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.chess-winner-nft';

const GameOverDialog: React.FC<GameOverDialogProps> = ({
    showGameOverModal,
    setShowGameOverModal,
    gameStatus,
    playerColor,
    result,
    fen,
    settings,
    resetGame,
    moves,
    opponent,
    moveCount
}) => {
    const [mintingStatus, setMintingStatus] = useState('idle'); // 'idle', 'minting', 'success', 'error'
    const [txHash, setTxHash] = useState('');

    // Get account information using Stacks
    const { getAddress, userSession } = useStacks();
    const address = getAddress();

    const isWinner = gameStatus.winner && gameStatus.winner === playerColor;
    const [isMinting, setIsMinting] = useState(false);

    // Function to mint the NFT using Stacks
    const mintWinnerNFT = async () => {
        if (!address) {
            alert("Please connect your Stacks wallet to mint NFTs!");
            return;
        }

        try {
            setMintingStatus('minting');
            setIsMinting(true);

            // Determine win type from result text
            let winType = "checkmate";
            if (result.includes("resign")) {
                winType = "resignation";
            } else if (result.includes("time")) {
                winType = "timeout";
            }

            console.log("Minting Chess Winner NFT with Stacks:", {
                winner: address,
                fen,
                opponent,
                isWhite: playerColor === 'w',
                moveCount,
                winType
            });

            // TODO: Implement Stacks contract call for chess NFT minting
            // For now, show success message
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate transaction
            
            setMintingStatus('success');
            setTxHash('simulated-tx-hash');
            console.log("NFT minted successfully (simulated)");
            
        } catch (error) {
            console.error("Error minting NFT:", error);
            setMintingStatus('error');
        } finally {
            setIsMinting(false);
        }
    };

    return (
        <Dialog
            open={showGameOverModal}
            onOpenChange={(open) => {
                console.log("Dialog open state changing to:", open);
                setShowGameOverModal(open);
            }}
        >
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-center text-2xl gap-2">
                        {gameStatus.winner ? (
                            <>
                                <Trophy className="h-6 w-6 text-yellow-500" />
                                {gameStatus.winner === playerColor ? "Victory!" : "Defeat!"}
                            </>
                        ) : (
                            <>
                                <Handshake className="h-6 w-6" />
                                Draw!
                            </>
                        )}
                    </DialogTitle>
                    <DialogDescription className="text-center text-base">
                        {result}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex justify-center my-4">
                    <div className="w-64 h-64">
                        <Chessboard
                            position={fen}
                            boardOrientation={settings.orientation}
                            arePiecesDraggable={false}
                        />
                    </div>
                </div>

                {mintingStatus === 'success' && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg p-3 mb-3 text-center">
                        <p className="text-green-700 dark:text-green-400 flex items-center justify-center gap-2">
                            <Award className="h-5 w-5" />
                            NFT minted successfully!
                        </p>
                        {txHash && (
                            <a
                                href={`https://scan.test2.btcs.network//tx/${txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 dark:text-blue-400 underline mt-1 inline-block"
                            >
                                View on Core Testnet Explorer
                            </a>
                        )}
                    </div>
                )}

                {mintingStatus === 'error' && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg p-3 mb-3">
                        <p className="text-red-700 dark:text-red-400 text-center">
                            Failed to mint NFT. Please try again.
                        </p>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between gap-3">
                    <div className="flex gap-2">
                        <DialogClose asChild>
                            <Button variant="outline" onClick={() => {
                                console.log("Review Game button clicked");
                                setShowGameOverModal(false);
                            }}>
                                Review Game
                            </Button>
                        </DialogClose>

                        <Button onClick={() => {
                            console.log("New Game button clicked");
                            resetGame();
                            setShowGameOverModal(false);
                        }}>
                            New Game
                        </Button>
                    </div>

                    {/* Only show mint button if player won and hasn't already minted */}
                    {isWinner && mintingStatus !== 'success' && (
                        <Button
                            onClick={mintWinnerNFT}
                            disabled={isMinting}
                            className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white"
                        >
                            {isMinting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Minting...
                                </>
                            ) : (
                                <>
                                    <Trophy className="mr-2 h-4 w-4" />
                                    Mint Winner NFT
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default GameOverDialog;

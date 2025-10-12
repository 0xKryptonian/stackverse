import { nftABI } from "../../contract/abi/nftABI";
import { tokenMintABI } from "../../contract/abi/tokenMintABI";

// core blockchain testnet
export const contractAddresses = {
    nft: "0x0b3a2D73D07eA2D5D0D0FB4Db09004f74D92767a",
    tokenMint: "0xcd34A2d8fFC72E3d587cfAEe3d1B0BdB11859501",
};

export const chessWinnerNFT = "0x19D45938fD3C9f4847745d6068697C786515Ad43"

// block explorer - blockscout
export const blockExplorer = {
    nft: "https://scan.test2.btcs.network/address/0x0b3a2D73D07eA2D5D0D0FB4Db09004f74D92767a",
    tokenMint: "https://scan.test2.btcs.network/address/0xcd34A2d8fFC72E3d587cfAEe3d1B0BdB11859501",
};

export const contractABIs = {
    nft: nftABI,
    tokenMint: tokenMintABI,
};

export const streamKey = process.env.LIVEPEER_STREAM_KEY;
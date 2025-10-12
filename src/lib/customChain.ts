import { createPublicClient, http } from 'viem';


export const agentChain = ({
    id: 1114,
    name: 'CoreDAO Testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'tCORE2',
        symbol: 'tCore',
    },
    rpcUrls: {
        default: { http: ['https://rpc.test2.btcs.network'] },
    },
    blockExplorers: {
        default: {
            name: 'Agent Chain Explorer',
            url: 'https://scan.test2.btcs.network/',
            apiUrl: 'https://scan.test2.btcs.network/api',
        },
    },
    testnet: true,
});

const publicClient = createPublicClient({
    chain: agentChain,
    transport: http(),
});

export default publicClient;
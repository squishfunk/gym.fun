import { createConfig, http } from 'wagmi'
import { mainnet, sepolia, base } from 'wagmi/chains'
import { createClient } from 'viem'

export const config = createConfig({
  chains: [mainnet, sepolia, base],
  client({ chain }) {
    return createClient({ chain, transport: http() })
  },
})
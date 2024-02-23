export function getRpcUrl(): string {
	if (!import.meta.env.VITE_BSC_TESTNET_RPC_URL) {
		throw new Error('VITE_BSC_TESTNET_RPC_URL not found in .env file')
	}

	return import.meta.env.VITE_BSC_TESTNET_RPC_URL
}

import { ethers } from 'ethers'

import { ETHEREUM_OBJECT_NOT_FOUND } from '@/utils/variables/constants'

export function getRpcUrl(): string {
	if (!import.meta.env.VITE_BSC_TESTNET_RPC_URL) {
		throw new Error('VITE_BSC_TESTNET_RPC_URL not found in .env file')
	}

	return import.meta.env.VITE_BSC_TESTNET_RPC_URL
}

export async function getFrontendSigner(): Promise<ethers.JsonRpcSigner> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const ethereum = (window as any).ethereum

	if (!ethereum) {
		alert(ETHEREUM_OBJECT_NOT_FOUND)
		return Promise.reject(ETHEREUM_OBJECT_NOT_FOUND)
	}

	const web3Provider: ethers.BrowserProvider = new ethers.BrowserProvider(
		ethereum
	)
	await web3Provider.send('eth_requestAccounts', [])
	const web3Signer: ethers.JsonRpcSigner = await web3Provider.getSigner()

	return web3Signer
}

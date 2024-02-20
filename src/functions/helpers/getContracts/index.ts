import { ethers } from 'ethers'

import contractsJson from '@/assets/json/deployments/bsctestnet/deployments.json'

export function getContracts(): any {
	function getRpcUrl(): string {
		if (!import.meta.env.VITE_BSC_TESTNET_RPC_URL) {
			throw new Error('VITE_BSC_TESTNET_RPC_URL not found in .env file')
		}

		return import.meta.env.VITE_PINATA_API
	}

	const rpcUrl: string = getRpcUrl()
	const provider: ethers.JsonRpcProvider = new ethers.JsonRpcProvider(rpcUrl)

	const daiMockContract: any = new ethers.Contract(
		contractsJson.daiMock.address,
		contractsJson.daiMock.abi,
		provider
	)

	const alloContract: any = new ethers.Contract(
		contractsJson.alloInstance.address,
		contractsJson.alloInstance.abi,
		provider
	)

	return { daiMockContract, alloContract }
}

import { ethers } from 'ethers'

import {
	Allo,
	// eslint-disable-next-line camelcase
	Allo__factory,
	DAIMock,
	// eslint-disable-next-line camelcase
	DAIMock__factory,
	QVSimpleStrategy,
	// eslint-disable-next-line camelcase
	QVSimpleStrategy__factory
} from '@/@types/typechain-types'
import contractsJson from '@/assets/json/deployments/bsctestnet/deployments.json'
import { Contracts } from '@/models/contracts.model'

import { getRpcUrl } from '..'

export function getContracts(): Contracts {
	const rpcUrl: string = getRpcUrl()
	const provider: ethers.JsonRpcProvider = new ethers.JsonRpcProvider(rpcUrl)

	// eslint-disable-next-line camelcase
	const daiMock: DAIMock = DAIMock__factory.connect(
		contractsJson.daiMock.address,
		provider
	)

	// eslint-disable-next-line camelcase
	const allo: Allo = Allo__factory.connect(
		contractsJson.alloInstance.address,
		provider
	)

	const qVSimpleStrategy: (address: string) => QVSimpleStrategy = (
		address: string
	) => {
		// eslint-disable-next-line camelcase
		return QVSimpleStrategy__factory.connect(address, provider)
	}

	return { allo, daiMock, qVSimpleStrategy }
}

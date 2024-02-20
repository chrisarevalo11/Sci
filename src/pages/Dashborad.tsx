import { useEffect, useState } from 'react'
import { BytesLike, ethers, MaxUint256 } from 'ethers'
import { useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'

import { getContracts } from '@/helpers/getContracts'
import { profilesApiFirebase } from '@/middlewares/firebase/profile.firebase.middleware'
import { roundsApiFirebase } from '@/middlewares/firebase/round.firebase.middleware'
import { InitializeData } from '@/models/initialize-data.mode'
import { Profile } from '@/models/profile.model'
import { Round } from '@/models/round.model'
import { toAbiCoder, toDecimal, toTimestamp } from '@/utils/functions'
import {
	GAS_LIMIT,
	INITIALIZE_DATA_STRUCT_TYPES,
	ROUND_ADDRESS,
	SCI_ADMIN_ADDRESS
} from '@/utils/variables/constants'

export default function Dashboard(): JSX.Element {
	const { address } = useAccount()
	const { addRound, getStrategiesLength } = roundsApiFirebase()
	const { daiMockContract, alloContract } = getContracts()
	const { getProfileByAddress } = profilesApiFirebase()

	const [profile, setProfile] = useState<Profile | null>(null)
	const [loading, setLoading] = useState<boolean>(true)

	const navigate = useNavigate()

	const onCreatePoolWithCustomStrategy = async () => {
		try {
			setLoading(true)
			const ethereum = (window as any).ethereum

			if (!ethereum) {
				alert('Ethereum object not found')
				return
			}

			const web3Provider: ethers.BrowserProvider = new ethers.BrowserProvider(
				ethereum
			)
			await web3Provider.send('eth_requestAccounts', [])
			const web3Signer: ethers.JsonRpcSigner = await web3Provider.getSigner()

			if (!profile) return

			const profileId: string = profile?.id

			const reviewThresholdTimestamp: number = toTimestamp(
				'2024-02-21T13:30:00Z'
			)
			const registrationStartTimestamp: number = toTimestamp(
				'2024-02-21T14:00:00Z'
			)
			const registrationEndTimestamp: number = toTimestamp(
				'2024-02-21T14:30:00Z'
			)
			const allocationStartTimestamp: number = toTimestamp(
				'2024-02-21T15:00:00Z'
			)

			const allocationEndTimestamp: number = toTimestamp('2024-02-21T15:30:00Z')

			const roundInitStrategyDataObject: InitializeData = {
				registryGating: false,
				metadataRequired: true,
				reviewThreshold: reviewThresholdTimestamp,
				registrationStartTime: registrationStartTimestamp,
				registrationEndTime: registrationEndTimestamp,
				allocationStartTime: allocationStartTimestamp,
				allocationEndTime: allocationEndTimestamp
			}

			const roundInitStrategyDataArray: any[] = [
				MaxUint256,
				[
					roundInitStrategyDataObject.registryGating,
					roundInitStrategyDataObject.metadataRequired,
					roundInitStrategyDataObject.reviewThreshold,
					roundInitStrategyDataObject.registrationStartTime,
					roundInitStrategyDataObject.registrationEndTime,
					roundInitStrategyDataObject.allocationStartTime,
					roundInitStrategyDataObject.allocationEndTime
				]
			]

			const initRoundData: BytesLike = toAbiCoder(
				INITIALIZE_DATA_STRUCT_TYPES,
				roundInitStrategyDataArray
			)

			const daiMockContractAddress: string = daiMockContract.target

			const poolFundingAmount: bigint = toDecimal(1000)

			const metadata: any[] = [BigInt(1), 'https://ipfs.io/ipfs/QmX3J']

			const poolManagersAddresses: string[] = []

			const createPoolWithCustomStrategyTx = await alloContract
				.connect(web3Signer)
				.createPoolWithCustomStrategy(
					profileId,
					ROUND_ADDRESS,
					initRoundData,
					daiMockContractAddress,
					poolFundingAmount,
					metadata,
					poolManagersAddresses,
					{
						gasLimit: GAS_LIMIT
					}
				)
			await createPoolWithCustomStrategyTx.wait()

			const roundsLegth: number = await getStrategiesLength()
			const id: number = roundsLegth + 1
			const idString: string = id.toString()

			const round: Round = {
				id: idString,
				address: ROUND_ADDRESS
			}

			await addRound(round)
			setLoading(false)
		} catch (error) {
			console.error(error)
			alert('Error: Look at console')
			setLoading(false)
		}
	}

	useEffect(() => {
		if (address === SCI_ADMIN_ADDRESS) {
			;(async () => {
				setProfile(await getProfileByAddress(address))
				setLoading(false)
			})()
		} else {
			navigate('/')
		}
	}, [address])

	return (
		<div>
			<h1>Dashboard</h1>
			{loading ? (
				<h1>Loading...</h1>
			) : (
				<div>
					<br />
					<p>Anchor: {profile?.anchor}</p>
					<p>Id: {profile?.id}</p>
					<p>Name: {profile?.name}</p>
					<p>Nonce: {profile?.nonce}</p>
					<p>Owener: {profile?.owner}</p>
					<br />
					<button onClick={onCreatePoolWithCustomStrategy}>
						createPoolWithCustomStrategy
					</button>
				</div>
			)}
		</div>
	)
}

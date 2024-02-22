import { useEffect, useState } from 'react'
import { BytesLike, ethers, MaxUint256 } from 'ethers'
import { useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'

import { getContracts } from '@/helpers/getContracts'
import { profilesApiFirebase } from '@/middlewares/firebase/profile.firebase.middleware'
import { roundsApiFirebase } from '@/middlewares/firebase/round.firebase.middleware'
import { InitializeData } from '@/models/initialize-data.model'
import { Profile } from '@/models/profile.model'
import { Round } from '@/models/round.model'
import { toAbiCoder, toDecimal, toTimestamp } from '@/utils'
import {
	GAS_LIMIT,
	INITIALIZE_DATA_STRUCT_TYPES,
	ROUND_ADDRESS,
	SCI_ADMIN_ADDRESS
} from '@/utils/variables/constants'

export default function Dashboard(): JSX.Element {
	const { address } = useAccount()
	const { addRound, getRoundsLength } = roundsApiFirebase()
	const { daiMockContract, alloContract, qVSimpleStrategyContract } =
		getContracts()
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

			const nowTime: Date = new Date()

			const reviewThresholdTimestamp: number = toTimestamp(
				addMinutesToDate(nowTime, 0).toISOString()
			)
			const registrationStartTimestamp: number = toTimestamp(
				addMinutesToDate(nowTime, 2).toISOString()
			)
			const registrationEndTimestamp: number = toTimestamp(
				addMinutesToDate(nowTime, 30).toISOString()
			)
			const allocationStartTimestamp: number = toTimestamp(
				addMinutesToDate(nowTime, 60).toISOString()
			)
			const allocationEndTimestamp: number = toTimestamp(
				addMinutesToDate(nowTime, 90).toISOString()
			)

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

			const currentQvSimpleStrategyContract =
				qVSimpleStrategyContract(ROUND_ADDRESS).connect(web3Signer)

			const poolId: bigint = await currentQvSimpleStrategyContract.getPoolId()
			const poolIdNumber: number = Number(poolId)

			const roundsLegth: number = await getRoundsLength()
			const id: number = roundsLegth + 1

			const round: Round = {
				address: ROUND_ADDRESS,
				allocationEndTime: roundInitStrategyDataObject.allocationEndTime,
				allocationStartTime: roundInitStrategyDataObject.allocationStartTime,
				donations: 0,
				donators: 0,
				id,
				image:
					'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fep01.epimg.net%2Fcultura%2Fimagenes%2F2016%2F09%2F09%2Fbabelia%2F1473420066_993651_1473430939_noticia_normal.jpg&f=1&nofb=1&ipt=65fb6ff7f54bb2df9ed64412dac43ca6f3c9a1921e591cc4eb66e84165793eac&ipo=images',
				machingPool: 1000,
				metadataRequired: roundInitStrategyDataObject.metadataRequired,
				name: 'round: Ecology for Everyone',
				poolId: poolIdNumber,
				profileId,
				registrationEndTime: roundInitStrategyDataObject.registrationEndTime,
				registrationStartTime:
					roundInitStrategyDataObject.registrationStartTime,
				registryGating: roundInitStrategyDataObject.registryGating,
				reviewThreshold: roundInitStrategyDataObject.reviewThreshold
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
			navigate('/app/projects')
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

function addMinutesToDate(date: Date, minutes: number): Date {
	return new Date(date.getTime() + minutes * 60000)
}

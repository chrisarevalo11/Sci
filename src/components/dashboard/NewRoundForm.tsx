import { useState } from 'react'
import { BytesLike, ethers, MaxUint256 } from 'ethers'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import { getContracts } from '@/helpers/getContracts'
import { roundsApiFirebase } from '@/middlewares/firebase/round.firebase.middleware'
import { InitializeData } from '@/models/initialize-data.model'
import { Profile } from '@/models/profile.model'
import { Round } from '@/models/round.model'
import { formatAddress, toAbiCoder, toDecimal, toTimestamp } from '@/utils'
import {
	GAS_LIMIT,
	INITIALIZE_DATA_STRUCT_TYPES,
	ROUND_ADDRESS
} from '@/utils/variables/constants'
import { zodResolver } from '@hookform/resolvers/zod'

type Props = {
	profile: Profile
}

const formSchema = z.object({
	name: z.string().min(1, { message: 'Name is required' }),
	banner: z.string().min(1, { message: 'Banner is required' }),
	amount: z.string().min(1, { message: 'Amount is required' }),
	registrationDeadline: z
		.string()
		.min(1, { message: 'Registration deadline is required' }),
	allocationDeadline: z
		.string()
		.min(1, { message: 'Allocation deadline is required' })
})

export default function NewRoundForm(props: Props): JSX.Element {
	const { profile } = props
	const [loading, setLoading] = useState<boolean>(false)
	const { addRound, getRoundsLength } = roundsApiFirebase()
	const { daiMockContract, alloContract, qVSimpleStrategyContract } =
		getContracts()

	const form = useForm<z.infer<typeof formSchema>>({
		defaultValues: {
			name: '',
			banner: '',
			amount: '',
			registrationDeadline: '',
			allocationDeadline: ''
		},
		resolver: zodResolver(formSchema)
	})

	const onCreatePoolWithCustomStrategy = async (
		values: z.infer<typeof formSchema>
	) => {
		console.log(values)

		try {
			setLoading(true)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

	return (
		<div className='rounded-3xl border-2 border-customBlack gap-5 items-center flex flex-col bg-customWhite md:min-w-[400px] max-w-[500px] p-3 text-center'>
			<h4>New Round</h4>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onCreatePoolWithCustomStrategy)}
					className='space-y-4 flex flex-col items-center'
				>
					<div className='flex flex-col items-start w-full'>
						<FormLabel className='mr-2 font-bold mb-2'>Profile Id</FormLabel>
						<FormControl>
							<input
								disabled
								type='text'
								className='w-full'
								placeholder='Test'
								value={formatAddress(profile?.id)}
							/>
						</FormControl>
					</div>
					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem className='flex flex-col items-start w-full'>
								<FormLabel className='mr-2 font-bold'>Round Name</FormLabel>
								<FormControl>
									<input
										type='text'
										className='w-full'
										placeholder='My round'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='banner'
						render={({ field }) => (
							<FormItem className='flex flex-col items-start w-full'>
								<FormLabel className='mr-2 font-bold'>Banner</FormLabel>
								<FormControl>
									<input type='file' className='w-full' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='amount'
						render={({ field }) => (
							<FormItem className='flex flex-col items-start w-full'>
								<FormLabel className='mr-2 font-bold'>
									Initial amount (DAI)
								</FormLabel>
								<FormControl>
									<input
										type='number'
										className='w-full'
										placeholder='1880'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='registrationDeadline'
						render={({ field }) => (
							<FormItem className='flex flex-col items-start w-full'>
								<FormLabel className='mr-2 font-bold'>Round Name</FormLabel>
								<FormControl>
									<input type='datetime-local' className='w-full' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='allocationDeadline'
						render={({ field }) => (
							<FormItem className='flex flex-col items-start w-full'>
								<FormLabel className='mr-2 font-bold'>Round Name</FormLabel>
								<FormControl>
									<input type='datetime-local' className='w-full' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<button
						className='btn btn-green !mt-5'
						type='submit'
						disabled={loading}
					>
						{loading ? 'Loading...' : 'Create Round'}
					</button>
				</form>
			</Form>
		</div>
	)
}

function addMinutesToDate(date: Date, minutes: number): Date {
	return new Date(date.getTime() + minutes * 60000)
}

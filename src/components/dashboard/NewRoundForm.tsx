import { useState } from 'react'
import { AddressLike, BytesLike, ethers, MaxUint256 } from 'ethers'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { z } from 'zod'

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import { getFrontendSigner } from '@/helpers'
import { getContracts } from '@/helpers/contracts'
import { roundsApiFirebase } from '@/middlewares/firebase/round.firebase.middleware'
import { InitializeData } from '@/models/initialize-data.model'
import { Metadata } from '@/models/metadata.model'
import { Round } from '@/models/round.model'
import { AppDispatch } from '@/store'
import { setRoundFetched } from '@/store/slides/roundslice'
import {
	convertFileToBase64,
	toAbiCoder,
	toDecimal,
	toTimestamp
} from '@/utils'
import {
	ALLO_PROFILE_ID,
	ERROR_MESSAGE,
	GAS_LIMIT,
	INITIALIZE_DATA_STRUCT_TYPES,
	ROUND_ADDRESS
} from '@/utils/variables/constants'
import { zodResolver } from '@hookform/resolvers/zod'

const formSchema = z.object({
	name: z.string().min(1, { message: 'Name is required' }),
	banner: z.string().min(1, { message: 'Banner is required' }),
	amount: z.string().min(1, { message: 'Amount is required' }),
	registrationBegin: z
		.string()
		.min(1, { message: 'Registration begin is required' }),
	registrationDeadline: z
		.string()
		.min(1, { message: 'Registration deadline is required' }),
	allocationBegin: z
		.string()
		.min(1, { message: 'Allocation begin is required' }),
	allocationDeadline: z
		.string()
		.min(1, { message: 'Allocation deadline is required' })
})

export default function NewRoundForm(): JSX.Element {
	const [loading, setLoading] = useState<boolean>(false)
	const [banner, setBanner] = useState<string | ArrayBuffer | null>('')
	const { addRound, getRoundsLength } = roundsApiFirebase()
	const { allo, daiMock, qVSimpleStrategy } = getContracts()
	const dispatch = useDispatch<AppDispatch>()

	const form = useForm<z.infer<typeof formSchema>>({
		defaultValues: {
			name: '',
			banner: '',
			amount: '',
			registrationBegin: '',
			registrationDeadline: '',
			allocationBegin: '',
			allocationDeadline: ''
		},
		resolver: zodResolver(formSchema)
	})

	const onCreatePoolWithCustomStrategy = async (
		values: z.infer<typeof formSchema>
	) => {
		console.log(values)

		try {
			const web3Signer: ethers.JsonRpcSigner = await getFrontendSigner()

			// const name: string = values.name
			// const bannerBase64: string = banner as string
			// const fundingAmount: number = Number(values.amount)
			// const registrationDeadline: number = toTimestamp(
			// 	values.registrationDeadline
			// )
			// const allocationDeadline: number = toTimestamp(values.allocationDeadline)

			const profileId: BytesLike = ALLO_PROFILE_ID
			const roundAddress: AddressLike = ROUND_ADDRESS

			const nowTime: Date = new Date()

			const reviewThresholdTimestamp: number = toTimestamp(
				addMinutesToDate(nowTime, 0).toISOString()
			)
			const registrationStartTimestamp: number = toTimestamp(
				addMinutesToDate(nowTime, 2).toISOString()
			)
			const registrationEndTimestamp: number = toTimestamp(
				addMinutesToDate(nowTime, 3).toISOString()
			)
			const allocationStartTimestamp: number = toTimestamp(
				addMinutesToDate(nowTime, 6).toISOString()
			)
			const allocationEndTimestamp: number = toTimestamp(
				addMinutesToDate(nowTime, 9).toISOString()
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

			const daiMockContractAddress: AddressLike = await daiMock.getAddress()

			const poolFundingAmount: bigint = toDecimal(1000)

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const metadata: Metadata = {
				protocol: BigInt(1),
				pointer: 'https://ipfs.io/ipfs/QmX8z3Z'
			}

			const poolManagersAddresses: AddressLike[] = []

			const createPoolWithCustomStrategyTx = await allo
				.connect(web3Signer)
				.createPoolWithCustomStrategy(
					profileId,
					roundAddress,
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
				qVSimpleStrategy(ROUND_ADDRESS).connect(web3Signer)

			const poolId: bigint = await currentQvSimpleStrategyContract.getPoolId()
			const poolIdNumber: number = Number(poolId)

			const roundsLegth: number = await getRoundsLength()
			const id: number = roundsLegth + 1

			const round: Round = {
				address: ROUND_ADDRESS,
				allocationEndTime: roundInitStrategyDataObject.allocationEndTime,
				allocationStartTime: roundInitStrategyDataObject.allocationStartTime,
				distributed: false,
				donations: 0,
				donators: [],
				id,
				image:
					'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fep01.epimg.net%2Fcultura%2Fimagenes%2F2016%2F09%2F09%2Fbabelia%2F1473420066_993651_1473430939_noticia_normal.jpg&f=1&nofb=1&ipt=65fb6ff7f54bb2df9ed64412dac43ca6f3c9a1921e591cc4eb66e84165793eac&ipo=images',
				machingPool: 1000,
				metadataRequired: roundInitStrategyDataObject.metadataRequired,
				name: 'round: Ecology for Everyone',
				poolId: poolIdNumber,
				profileId,
				projects: [],
				registrationEndTime: roundInitStrategyDataObject.registrationEndTime,
				registrationStartTime:
					roundInitStrategyDataObject.registrationStartTime,
				registryGating: roundInitStrategyDataObject.registryGating,
				reviewThreshold: roundInitStrategyDataObject.reviewThreshold,
				totalPool: 1000
			}

			await addRound(round)
			dispatch(setRoundFetched(false))
			setLoading(false)
			toast.success('Round created successfully!')
		} catch (error) {
			console.error(error)
			toast.error(ERROR_MESSAGE)
			setLoading(false)
		}
	}

	return (
		<div className='rounded-3xl border-2 border-customBlack gap-5 items-center flex flex-col bg-customWhite md:min-w-[400px] max-w-[500px] p-3 lg:p-5 text-center'>
			<h4>New Round</h4>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onCreatePoolWithCustomStrategy)}
					className='space-y-4 flex flex-col items-center'
				>
					<div className='flex flex-col items-start w-full'>
						<FormLabel className='mr-2 font-bold mb-2'>Profile ID</FormLabel>
						<FormControl>
							<input
								disabled
								type='text'
								className='w-full opacity-70'
								placeholder='Test'
								value={`${ALLO_PROFILE_ID.slice(0, 33)}...`}
							/>
						</FormControl>
					</div>
					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem className='flex flex-col items-start w-full'>
								<FormLabel className='mr-2 font-bold'>Round name</FormLabel>
								<FormControl>
									<input
										type='text'
										className='w-full'
										placeholder='Grants Citizens Round: Archimedes’ Lever'
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
									<input
										{...field}
										type='file'
										className='w-full'
										onChange={event => {
											field.onChange(event)
											convertFileToBase64(event, setBanner)
										}}
									/>
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
								<FormLabel className='mr-2 font-bold'>Funding amount</FormLabel>
								<FormControl>
									<input
										type='number'
										className='w-full'
										placeholder='10,000 DAI'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='registrationBegin'
						render={({ field }) => (
							<FormItem className='flex flex-col items-start w-full'>
								<FormLabel className='mr-2 font-bold'>
									Registration Beginning
								</FormLabel>
								<FormControl>
									<input type='datetime-local' className='w-full' {...field} />
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
								<FormLabel className='mr-2 font-bold'>
									Registration deadline
								</FormLabel>
								<FormControl>
									<input type='datetime-local' className='w-full' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='allocationBegin'
						render={({ field }) => (
							<FormItem className='flex flex-col items-start w-full'>
								<FormLabel className='mr-2 font-bold'>
									Allocation Beginning
								</FormLabel>
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
								<FormLabel className='mr-2 font-bold'>
									Allocation deadline
								</FormLabel>
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

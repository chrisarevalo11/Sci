import { useState } from 'react'
import { AddressLike, BytesLike, ethers, MaxUint256 } from 'ethers'
import { useForm } from 'react-hook-form'
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
import { storeObject } from '@/helpers/pinata'
import { roundsApiFirebase } from '@/middlewares/firebase/round.firebase.middleware'
import { AppThunkDispatch } from '@/models/dispatch.model'
import { InitializeData } from '@/models/initialize-data.model'
import { Metadata } from '@/models/metadata.model'
import { Round, RoundMetadata } from '@/models/round.model'
import { setRound, setRoundFetched } from '@/store/slides/roundslice'
import { setIsLoading } from '@/store/slides/uiSlice'
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
import { createRoundFormSchema } from '@/utils/variables/constants/zod-schemas'
import { zodResolver } from '@hookform/resolvers/zod'

type Props = {
	dispatch: AppThunkDispatch
	isLoading: boolean
}

export default function NewRoundForm(props: Props): JSX.Element {
	const { dispatch, isLoading } = props

	const [banner, setBanner] = useState<string | ArrayBuffer | null>('')

	const { allo, daiMock, qVSimpleStrategy } = getContracts()
	const { addRound, getRoundsLength } = roundsApiFirebase()

	const form = useForm<z.infer<typeof createRoundFormSchema>>({
		defaultValues: {
			name: '',
			banner: '',
			amount: '',
			registrationBegin: '',
			registrationDeadline: '',
			allocationBegin: '',
			allocationDeadline: ''
		},
		resolver: zodResolver(createRoundFormSchema)
	})

	const onCreatePoolWithCustomStrategy = async (
		values: z.infer<typeof createRoundFormSchema>
	) => {
		try {
			dispatch(setIsLoading(true))
			dispatch(setRoundFetched(false))
			const web3Signer: ethers.JsonRpcSigner = await getFrontendSigner()

			const profileId: BytesLike = ALLO_PROFILE_ID
			const roundAddress: AddressLike = ROUND_ADDRESS

			const registrationStartTime: number = toTimestamp(
				values.registrationBegin
			)
			const registrationEndTime: number = toTimestamp(
				values.registrationDeadline
			)
			const allocationStartTime: number = toTimestamp(values.allocationBegin)
			const allocationEndTime: number = toTimestamp(values.allocationDeadline)

			const nowTime: Date = new Date()

			const reviewThreshold: number = toTimestamp(
				addMinutesToDate(nowTime, 0).toISOString()
			)

			const roundInitStrategyDataObject: InitializeData = {
				registryGating: false,
				metadataRequired: true,
				reviewThreshold,
				registrationStartTime,
				registrationEndTime,
				allocationStartTime,
				allocationEndTime
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

			let poolFundingAmount: bigint | number | string = values.amount
			poolFundingAmount = Number(poolFundingAmount)
			poolFundingAmount = toDecimal(poolFundingAmount)

			const roundMetadata: RoundMetadata = {
				name: values.name,
				banner: banner as string
			}

			// const ipfsUrl: string = await storeObject(roundMetadata)

			const metadata: Metadata = {
				protocol: BigInt(1),
				pointer: 'ipfs://QmX3'
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
				image: roundMetadata.banner,
				machingPool: Number(values.amount),
				metadataRequired: roundInitStrategyDataObject.metadataRequired,
				name: roundMetadata.name,
				poolId: poolIdNumber,
				profileId,
				projects: [],
				registrationEndTime: roundInitStrategyDataObject.registrationEndTime,
				registrationStartTime:
					roundInitStrategyDataObject.registrationStartTime,
				registryGating: roundInitStrategyDataObject.registryGating,
				reviewThreshold: roundInitStrategyDataObject.reviewThreshold,
				totalPool: Number(values.amount)
			}

			await addRound(round)
			dispatch(setRound(round))
			dispatch(setRoundFetched(true))
			dispatch(setIsLoading(false))
			toast.success('Round created successfully!')
			form.reset()
		} catch (error) {
			console.error(error)
			dispatch(setRoundFetched(true))
			dispatch(setIsLoading(false))
			toast.error(ERROR_MESSAGE)
		}
	}

	return (
		<div className='rounded-3xl border-2 border-customBlack gap-5 items-center flex flex-col bg-customWhite md:min-w-[400px] max-w-[500px] p-3 lg:p-5 text-center'>
			<h4>New Round</h4>

			<Form {...form}>
				<form
					className='space-y-4 flex flex-col items-center'
					onSubmit={form.handleSubmit(onCreatePoolWithCustomStrategy)}
				>
					<div className='flex flex-col items-start w-full'>
						<FormLabel className='mr-2 font-bold mb-2'>Profile ID</FormLabel>
						<FormControl>
							<input
								className='w-full opacity-70'
								disabled
								placeholder='Test'
								type='text'
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
										{...field}
										className='w-full'
										disabled={isLoading}
										placeholder='Grants Citizens Round: Archimedes’ Lever'
										type='text'
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
										className='w-full'
										disabled={isLoading}
										onChange={event => {
											field.onChange(event)
											convertFileToBase64(event, setBanner)
										}}
										type='file'
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
										{...field}
										disabled={isLoading}
										className='w-full'
										placeholder='10,000 DAI'
										type='number'
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
									<input
										{...field}
										className='w-full'
										disabled={isLoading}
										type='datetime-local'
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
								<FormLabel className='mr-2 font-bold'>
									Registration deadline
								</FormLabel>
								<FormControl>
									<input
										{...field}
										className='w-full'
										disabled={isLoading}
										type='datetime-local'
									/>
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
									<input
										{...field}
										className='w-full'
										disabled={isLoading}
										type='datetime-local'
									/>
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
									<input
										{...field}
										className='w-full'
										disabled={isLoading}
										type='datetime-local'
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<button
						className='btn btn-green !mt-5'
						type='submit'
						disabled={isLoading}
					>
						{isLoading ? 'Loading...' : 'Create Round'}
					</button>
				</form>
			</Form>
		</div>
	)
}

function addMinutesToDate(date: Date, minutes: number): Date {
	return new Date(date.getTime() + minutes * 60000)
}

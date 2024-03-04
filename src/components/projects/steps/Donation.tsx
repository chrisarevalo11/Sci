import { BytesLike, ethers } from 'ethers'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { useAccount } from 'wagmi'
import { z } from 'zod'

import {
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
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
import { Project } from '@/models/project.model'
import { Round } from '@/models/round.model'
import { AppDispatch, useAppSelector } from '@/store'
import { setRound } from '@/store/slides/roundslice'
import { setIsLoading } from '@/store/slides/uiSlice'
import { toAbiCoder, toDecimal } from '@/utils'
import {
	ALLOCATE_STRUCT_TYPES,
	ERROR_MESSAGE,
	GAS_LIMIT
} from '@/utils/variables/constants'
import { donateFormSchema } from '@/utils/variables/constants/zod-schemas'
import { zodResolver } from '@hookform/resolvers/zod'

type Props = {
	round: Round
	project: Project
	setCurrentStep: React.Dispatch<React.SetStateAction<number>>
}

export default function Donation(props: Props): JSX.Element {
	const { round, project, setCurrentStep } = props
	const { address } = useAccount()
	const dispatch = useDispatch<AppDispatch>()

	const isLoading: boolean = useAppSelector(state => state.ui.isLoading)

	const { allo } = getContracts()
	const { updateRound } = roundsApiFirebase()

	const form = useForm<z.infer<typeof donateFormSchema>>({
		defaultValues: {
			amount: ''
		},
		resolver: zodResolver(donateFormSchema)
	})

	const onFundPool = async (values: z.infer<typeof donateFormSchema>) => {
		try {
			if (!address) return

			dispatch(setIsLoading(true))
			const web3Signer: ethers.JsonRpcSigner = await getFrontendSigner()

			const amount: number = Number(values.amount)
			const donation: bigint = toDecimal(amount)

			const fundPoolTx = await allo
				.connect(web3Signer)
				.fundPool(round.poolId, donation, { gasLimit: GAS_LIMIT })
			await fundPoolTx.wait()

			setCurrentStep(prev => prev + 1)

			const voiceCredits: number = amount

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const allocateDataArray: any[] = [project.recipientId, voiceCredits]

			const allocateDataBytes: BytesLike = toAbiCoder(
				ALLOCATE_STRUCT_TYPES,
				allocateDataArray
			)

			const allocateFundsTx = await allo
				.connect(web3Signer)
				.allocate(round.poolId, allocateDataBytes, { gasLimit: GAS_LIMIT })
			await allocateFundsTx.wait()

			round.donations = round.donations + amount
			round.totalPool = round.totalPool + amount

			const isDonator: boolean = round.donators.some(
				donator => donator === address
			)

			if (!isDonator) {
				round.donators.push(address)
			}

			await updateRound(round)
			dispatch(setRound(round))
			dispatch(setIsLoading(false))
			toast.success('Thank you for your donation!')
		} catch (error) {
			console.error(error)
			dispatch(setIsLoading(false))
			toast.error(ERROR_MESSAGE)
		}
	}

	return (
		<>
			<DialogHeader>
				<DialogTitle>Contribute to this project</DialogTitle>
				<DialogDescription>
					Specify the amount you would like to contribute to this round. Note
					that this amount is going to fund the pool of the round and is not
					going to be directly allocated to the project. The next step is very
					important because you will allocate voting tokens to this project that
					will actually help the project.
				</DialogDescription>
				<br />
			</DialogHeader>
			<Form {...form}>
				<form
					className='space-y-4 flex flex-col items-center'
					onSubmit={form.handleSubmit(onFundPool)}
				>
					<FormField
						control={form.control}
						name='amount'
						render={({ field }) => (
							<FormItem className='flex flex-col items-start w-full'>
								<FormLabel className='mr-2 font-bold'>
									Donation amount
								</FormLabel>
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
					<DialogFooter>
						<button
							className='btn btn-green !mt-5'
							type='submit'
							disabled={isLoading}
						>
							{isLoading ? 'Loading...' : 'Donate'}
						</button>
					</DialogFooter>
				</form>
			</Form>
		</>
	)
}

import { useState } from 'react'
import { BytesLike, ethers } from 'ethers'
import { toast } from 'react-toastify'
import { useAccount } from 'wagmi'

import {
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import { getContracts } from '@/helpers/contracts'
import { roundsApiFirebase } from '@/middlewares/firebase/round.firebase.middleware'
import { Project } from '@/models/project.model'
import { Round } from '@/models/round.model'
import { toAbiCoder, toDecimal } from '@/utils'
import {
	ALLOCATE_STRUCT_TYPES,
	ERROR_MESSAGE,
	GAS_LIMIT
} from '@/utils/variables/constants'

type Props = {
	round: Round
	project: Project
	setCurrentStep: React.Dispatch<React.SetStateAction<number>>
}

export default function Donation(props: Props): JSX.Element {
	const { round, project, setCurrentStep } = props
	const { address } = useAccount()
	const { allo, qVSimpleStrategy } = getContracts()
	const { updateRound } = roundsApiFirebase()

	const [loading, setLoading] = useState<boolean>(false)

	const onFundPool = async () => {
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

			if (!address) return

			const amount: bigint = toDecimal(100)

			console.log('Este es el monto que se va a enviar: ', amount)

			const fundPoolTx = await allo
				.connect(web3Signer)
				.fundPool(round.poolId, amount, { gasLimit: GAS_LIMIT })
			await fundPoolTx.wait()

			// TODO: Stepeer

			const votes: bigint = await qVSimpleStrategy(round.address)
				.connect(web3Provider)
				.calculateAdditionalEffectiveVotes(address, project.recipientId, 100)

			setCurrentStep(prev => prev + 1)
			console.log('Votes: ', votes)

			const voiceCredits: number = 100

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

			console.log(
				await qVSimpleStrategy(round.address)
					.connect(web3Provider)
					.getRecipient(project.recipientId)
			)

			round.donations = round.donations + 100
			round.donators = round.donators + 1
			await updateRound(round)
			setLoading(false)
			toast.success('Thank you for your donation!')
		} catch (error) {
			console.error(error)
			toast.error(ERROR_MESSAGE)
			setLoading(false)
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
			</DialogHeader>
			<DialogFooter>
				<button
					className='btn btn-green'
					onClick={onFundPool}
					disabled={loading}
				>
					{loading ? 'Loading...' : 'Donate'}
				</button>
			</DialogFooter>
		</>
	)
}

import { ethers } from 'ethers'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { useAccount } from 'wagmi'

import { getFrontendSigner } from '@/helpers'
import { getContracts } from '@/helpers/contracts'
import { roundsApiFirebase } from '@/middlewares/firebase/round.firebase.middleware'
import { Project } from '@/models/project.model'
import { Round } from '@/models/round.model'
import { AppDispatch, useAppSelector } from '@/store'
import { setRound } from '@/store/slides/roundslice'
import { setIsLoading } from '@/store/slides/uiSlice'
import { ERROR_MESSAGE, GAS_LIMIT } from '@/utils/variables/constants'

type Props = {
	projects: Project[]
	round: Round
}

export default function DistributeCard(props: Props): JSX.Element {
	const { projects, round } = props

	const { address } = useAccount()
	const dispatch = useDispatch<AppDispatch>()

	const isLoading: boolean = useAppSelector(state => state.ui.isLoading)

	const { updateRound } = roundsApiFirebase()
	const { allo } = getContracts()

	const onDistribute = async () => {
		try {
			if (!round) return
			if (!address) return

			dispatch(setIsLoading(true))
			const web3Signer: ethers.JsonRpcSigner = await getFrontendSigner()

			const recipientIds: string[] = projects.map(
				(project: Project) => project.recipientId
			)

			const distributeTx = await allo
				.connect(web3Signer)
				.distribute(
					round?.poolId,
					recipientIds,
					ethers.encodeBytes32String(''),
					{ gasLimit: GAS_LIMIT }
				)
			await distributeTx.wait()

			const updatedRound = { ...round, distributed: true }
			await updateRound(updatedRound)
			dispatch(setRound(updatedRound))
			dispatch(setIsLoading(false))
			toast.success('Distributed funds')
		} catch (error) {
			console.error(error)
			dispatch(setIsLoading(false))
			toast.error(ERROR_MESSAGE)
		}
	}

	return (
		<div className='rounded-tl-3xl rounded-br-3xl w-full max-w-[290px] h-full min-h-[300px] max-h-[300px] flex items-center p-4 text-center justify-between flex-col border-2 border-customBlack'>
			<h3>Distribute funds</h3>
			<p>
				Finalize Impact: Allocate the pooled funds to projects as determined by
				community preference.
			</p>
			<button
				onClick={() => onDistribute()}
				className='btn btn-green'
				disabled={isLoading}
			>
				{isLoading ? 'Loading...' : 'Distribute'}
			</button>
		</div>
	)
}

import { useState } from 'react'
import { ethers } from 'ethers'
import { useAccount } from 'wagmi'

import { getContracts } from '@/helpers/contracts'
import { roundsApiFirebase } from '@/middlewares/firebase/round.firebase.middleware'
import { Project } from '@/models/project.model'
import { Round } from '@/models/round.model'
import { GAS_LIMIT } from '@/utils/variables/constants'

type Props = {
	projects: Project[]
	round: Round
}

export default function DistributeCard(props: Props): JSX.Element {
	const { projects, round } = props
	const [loading, setLoading] = useState<boolean>(false)
	const { address } = useAccount()
	const { updateRound } = roundsApiFirebase()
	const { allo } = getContracts()

	const onDistribute = async () => {
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

			const recipientIds: string[] = projects.map(
				(project: Project) => project.recipientId
			)

			console.log('RecipientIds: ', recipientIds)

			if (!round) return

			if (!address) return

			const distributeTx = await allo
				.connect(web3Signer)
				.distribute(
					round?.poolId,
					recipientIds,
					ethers.encodeBytes32String(''),
					{ gasLimit: GAS_LIMIT }
				)

			const tx = await distributeTx.wait()

			if (!round?.distributed) {
				round.distributed = true
			}

			await updateRound(round)
			setLoading(false)
		} catch (error) {
			console.error(error)
			alert('Error: Look at console')
			setLoading(false)
		}
	}

	return (
		<div className='rounded-tl-3xl rounded-br-3xl w-full max-w-[290px] h-full min-h-[300px] max-h-[300px] flex items-center p-4 text-center justify-between flex-col border-2 border-customBlack'>
			<h3>Distribute funds</h3>
			<p>
				Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quos
				repellendus corrupti distinctio sint
			</p>
			<button
				onClick={() => onDistribute()}
				className='btn btn-green'
				disabled={loading}
			>
				{loading ? 'Loading...' : 'Distribute'}
			</button>
		</div>
	)
}

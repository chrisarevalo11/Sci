import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { Link } from 'react-router-dom'
import { useAccount } from 'wagmi'

import { getContracts } from '@/helpers/getContracts'
import { roundsApiFirebase } from '@/middlewares/firebase/round.firebase.middleware'
import { Project } from '@/models/project.model'
import { Round } from '@/models/round.model'
import { GAS_LIMIT, SCI_ADMIN_ADDRESS } from '@/utils/variables/constants'

export default function Projects(): JSX.Element {
	const { getLastRound, updateRound } = roundsApiFirebase()

	const { alloContract, qVSimpleStrategyContract } = getContracts()

	const { address } = useAccount()

	const [loading, setLoading] = useState<boolean>(true)
	const [projects, setProjects] = useState<Project[]>([])
	const [round, setRound] = useState<Round | null>(null)
	const [syncronized, setSyncronized] = useState<boolean>(false)

	const getStates = async () => {
		try {
			const lastRound: Round = await getLastRound()
			setRound(lastRound)

			if (lastRound.projects) {
				setProjects(lastRound.projects)
			}

			setSyncronized(true)
			setLoading(false)
		} catch (error) {
			alert('Error: Look at console')
			console.error(error)
			setLoading(false)
		}
	}

	const onDistribute = async () => {
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

			const recipientIds: string[] = projects.map(
				(project: Project) => project.recipientId
			)

			console.log('RecipientIds: ', recipientIds)

			if (!round) return

			if (!address) return

			const distributeTx = await alloContract
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

	useEffect(() => {
		;(async () => {
			await getStates()
		})()
	}, [])

	return (
		<div>
			<h1>Projects</h1>
			{loading ? (
				<h1>Loading...</h1>
			) : (
				<div>
					{projects.map((project: Project) => (
						<div key={project.name}>
							<h2>{project.name}</h2>
							<p>{project.description}</p>
							<Link
								to={`/app/projects/${project.recipientId}`}
								state={{ round, project }}
							>
								Details
							</Link>
						</div>
					))}
					{address === SCI_ADMIN_ADDRESS && (
						<button onClick={onDistribute}>distribute</button>
					)}
				</div>
			)}
		</div>
	)
}

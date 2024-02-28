import { useEffect, useState } from 'react'
import { BytesLike, ethers, toBigInt, toNumber } from 'ethers'
import { useLocation, useParams } from 'react-router-dom'
import { useAccount } from 'wagmi'

import { getContracts } from '@/helpers/contracts'
import { roundsApiFirebase } from '@/middlewares/firebase/round.firebase.middleware'
import { Project } from '@/models/project.model'
import { Round } from '@/models/round.model'
import { toAbiCoder, toDecimal } from '@/utils'
import { ALLOCATE_STRUCT_TYPES, GAS_LIMIT } from '@/utils/variables/constants'

export default function ProjectComponent(): JSX.Element {
	const location = useLocation()
	const { recipientId } = useParams()

	const { round, project }: { round: Round; project: Project } = location.state

	const { address } = useAccount()
	const { allo, qVSimpleStrategy } = getContracts()
	const { getLastRound, updateRound } = roundsApiFirebase()

	const [loading, setLoading] = useState<boolean>(true)
	const [syncronized, setSyncronized] = useState<boolean>(false)

	const onFundPool = async () => {
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

			console.log('Votes: ', votes)

			const voiceCredits: number = 100

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
		} catch (error) {
			console.error(error)
			alert('Error: Look at console')
			setLoading(false)
		}
	}
	useEffect(() => {
		setLoading(false)
	}, [])

	return (
		<>
			{loading ? (
				<p>Loading...</p>
			) : (
				<div>
					<h2>Project Details</h2>
					<p>Project ID: {recipientId}</p>
					<p>Project Name: {project?.name}</p>
					<p>Project Description: {project?.description}</p>
					<p>Project Github: {project?.github}</p>
					<img src={project?.logo} alt='Project Logo' />
					<img src={project?.banner} alt='Project Banner' />
					<p>Project Tags: {project?.tags}</p>
					<p>Project Twitter: {project?.twitter}</p>
					<p>Project Website: {project?.website}</p>
					<p>Pool ID: {round.poolId}</p>
					<button onClick={onFundPool}>Fund Pool</button>
				</div>
			)}
		</>
	)
}

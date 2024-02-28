import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { Link } from 'react-router-dom'
import { useAccount } from 'wagmi'

import CreateCard from '@/components/projects/CreateCard'
import ProjectCard from '@/components/projects/ProjectCard'
import { Skeleton } from '@/components/ui/skeleton'
import { getContracts } from '@/helpers/contracts'
import { roundsApiFirebase } from '@/middlewares/firebase/round.firebase.middleware'
import { Project } from '@/models/project.model'
import { Round } from '@/models/round.model'
import { GAS_LIMIT, SCI_ADMIN_ADDRESS } from '@/utils/variables/constants'

export default function Projects(): JSX.Element {
	const { getLastRound, updateRound } = roundsApiFirebase()

	const { allo: alloContract, qVSimpleStrategy: qVSimpleStrategyContract } =
		getContracts()

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<section className='w-full h-[max(100%, fit-content)] p-4 md:p-10 relative md:overflow-hidden'>
			<header className='flex justify-end pb-3 border-b-4 items-center border-customBlack border-dashed'>
				<h2>Projects</h2>
			</header>
			<div className='grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 mt-10 justify-items-center'>
				<CreateCard />
				{loading ? (
					Array.from({ length: 12 }).map((_, index) => (
						<Skeleton
							key={index}
							className='!w-[290px] !h-[300px] rounded-tl-xl rounded-br-xl'
						/>
					))
				) : (
					<>
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
						{Array.from({ length: 12 }).map((_, index) => (
							<ProjectCard round={round} key={index} project={projectTest} />
						))}
						{address === SCI_ADMIN_ADDRESS && (
							<button onClick={onDistribute}>distribute</button>
						)}
					</>
				)}
			</div>
		</section>
	)
}

const projectTest: Project = {
	banner:
		'https://www.brightidea.com/wp-content/uploads/Who_Participates_in_a_Hackathon.png',
	description:
		'This is a mock description for a mock project that I created for testing purposes of the Sci protocol',
	github: 'https://github.com',
	logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/LEGO_logo.svg/512px-LEGO_logo.svg.png',
	name: 'DeSci Colombia',
	recipientId: '0x7753E5f36f20B14fFb6b6a61319Eb66f63abdb0b',
	slogan: 'This is a slogan',
	tags: [],
	twitter: '@comoes',
	website: 'https://www.lego.com'
}

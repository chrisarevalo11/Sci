import { useEffect, useState } from 'react'
import { BytesLike, ethers } from 'ethers'
import { useDispatch } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import { useAccount } from 'wagmi'

import Github from '@/components/icons/Github'
import Globe from '@/components/icons/Globe'
import Twitter from '@/components/icons/Twitter'
import Clipboard from '@/components/ui/Clipboard'
import { Skeleton } from '@/components/ui/skeleton'
import { getContracts } from '@/helpers/contracts'
import { roundsApiFirebase } from '@/middlewares/firebase/round.firebase.middleware'
import { Project } from '@/models/project.model'
import { Round } from '@/models/round.model'
import { AppDispatch, useAppSelector } from '@/store'
import { getRound } from '@/store/thunks/round.thunk'
import {
	convertTimestampToDate,
	formatAddress,
	toAbiCoder,
	toDecimal
} from '@/utils'
import { ALLOCATE_STRUCT_TYPES, GAS_LIMIT } from '@/utils/variables/constants'

export default function ProjectComponent(): JSX.Element {
	const location = useLocation()
	const { recipientId } = useParams()

	const { round, project }: { round: Round; project: Project } = location.state

	const { address } = useAccount()
	const { allo, qVSimpleStrategy } = getContracts()
	const { updateRound } = roundsApiFirebase()

	const [loading, setLoading] = useState<boolean>(true)
	const dispatch = useDispatch<AppDispatch>()

	const lastRound: Round = useAppSelector(state => state.round.lastRound)
	const lastRoundFetched = useAppSelector(state => state.round.lastRoundFetched)

	const [allocationStartTime, setAllocationStartTime] = useState<Date>(
		new Date()
	)
	const [allocationEndTime, setAllocationEndTime] = useState<Date>(new Date())

	const getStates = async () => {
		setAllocationStartTime(
			new Date(convertTimestampToDate(lastRound.allocationStartTime))
		)
		setAllocationEndTime(
			new Date(convertTimestampToDate(lastRound.allocationEndTime))
		)

		const { qVSimpleStrategy } = getContracts()

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const recipientContract: any = await qVSimpleStrategy(
			round.address
		).getRecipient('0x9d19c41De1D71Be072FAeCE30E5AB6519382E23C')
		console.table(recipientContract)
	}

	useEffect(() => {
		getStates()
		if (!lastRoundFetched) {
			dispatch(getRound())
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lastRoundFetched])

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
		} catch (error) {
			console.error(error)
			alert('Error: Look at console')
			setLoading(false)
		}
	}

	useEffect(() => {
		setLoading(false)
	}, [])

	console.log(round.poolId)

	return (
		<section className='p-2 md:p-10 h-[max(100%, fit-content)] w-full'>
			{loading ? (
				<>
					<Skeleton className='w-full h-[220px] rounded-xl' />
					<div className='grid md:grid-cols-2 gap-4 mt-7'>
						<div className='flex flex-col gap-4'>
							<Skeleton className='h-[100px] w-full' />
							<Skeleton className='h-[100px] w-full' />
						</div>
						<Skeleton className='h-[150px]' />
					</div>
				</>
			) : (
				<>
					<div className='relative w-full'>
						<img
							src={project.banner}
							alt={`${project.name} banner`}
							className='h-[220px] w-full object-cover rounded-xl'
						/>
						<img
							src={project.logo}
							alt={`${project.name} logo`}
							className='size-28 object-cover absolute -bottom-8 left-14'
						/>
					</div>
					<div className='mt-12 px-2 flex gap-10 w-full mx-auto'>
						<div className='space-y-8 grow'>
							<header>
								<h2>{project.name}</h2>
								<h5 className='text-customGray'>{project.slogan}</h5>
							</header>
							<div className='lg:hidden flex flex-col'>
								<button
									className='btn btn-green  text-lg px-20'
									onClick={onFundPool}
								>
									Donate
								</button>
								<div className='mt-6 flex gap-3 justify-center flex-col items-start'>
									<h5>Media</h5>
									<a
										href={project.website}
										target='_blank'
										rel='noreferrer'
										className='flex gap-2'
									>
										<Globe className='size-5' />
										{project.website}
									</a>
									<a
										href={project.twitter}
										target='_blank'
										rel='noreferrer'
										className='flex gap-2'
									>
										<Twitter className='size-5' />
										{project.twitter}
									</a>
									<a
										href={project.github}
										target='_blank'
										rel='noreferrer'
										className='flex gap-2'
									>
										<Github className='size-5' />
										{project.github}
									</a>
								</div>
							</div>
							<div>
								<h5>About the project</h5>
								<p className='mt-2'>{project.description}</p>
							</div>
							<div>
								<h5>Tags</h5>
								<div className='flex mt-2 gap-3 flex-wrap'>
									{project.tags.map(tag => (
										<span
											className='px-2 rounded-xl bg-customBlack text-customWhite'
											key={tag}
										>
											{tag}
										</span>
									))}
								</div>
							</div>
							<div className='bg-customBlack text-customWhite p-2 w-fit'>
								<h5>Recipient address</h5>
								<Clipboard
									className='text-customWhite mt-2'
									text={project.recipientId}
								>
									<span className='hidden md:block'>{recipientId}</span>
									<span className='md:hidden'>
										{formatAddress(recipientId as string)}
									</span>
								</Clipboard>
							</div>
						</div>
						<div className='hidden lg:block'>
							{new Date() > allocationStartTime &&
								new Date() < allocationEndTime && (
									<button
										className='btn btn-green text-lg md:px-16'
										onClick={onFundPool}
									>
										Donate
									</button>
								)}

							{round.distributed && (
								<header>
									<h4 className=''>Distributed:</h4>
									<h5>1000 DAI 💸</h5>
								</header>
							)}
							<div className='mt-6 flex gap-3 justify-center flex-col items-start'>
								<h5>Media</h5>
								<a
									href={project.website}
									target='_blank'
									rel='noreferrer'
									className='flex gap-2'
								>
									<Globe className='size-5' />
									{project.website}
								</a>
								<a
									href={project.twitter}
									target='_blank'
									rel='noreferrer'
									className='flex gap-2'
								>
									<Twitter className='size-5' />
									{project.twitter}
								</a>
								<a
									href={project.github}
									target='_blank'
									rel='noreferrer'
									className='flex gap-2'
								>
									<Github className='size-5' />
									{project.github}
								</a>
							</div>
						</div>
					</div>
				</>
			)}
		</section>
	)
}

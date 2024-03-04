import { Suspense, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import { useAccount } from 'wagmi'

import Github from '@/components/icons/Github'
import Globe from '@/components/icons/Globe'
import Twitter from '@/components/icons/Twitter'
import DonateModal from '@/components/projects/DonateModal'
import Clipboard from '@/components/ui/Clipboard'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { getContracts } from '@/helpers/contracts'
import { Project } from '@/models/project.model'
import { Round } from '@/models/round.model'
import { AppDispatch, useAppSelector } from '@/store'
import { getLastRound } from '@/store/thunks/round.thunk'
import { convertTimestampToDate, formatAddress } from '@/utils'
import { ROUND_ADDRESS } from '@/utils/variables/constants'

export default function ProjectComponent(): JSX.Element {
	const { address } = useAccount()

	const dispatch = useDispatch<AppDispatch>()
	const location = useLocation()
	const { recipientId } = useParams()

	const { round, project }: { round: Round; project: Project } = location.state

	const [allocationEndTime, setAllocationEndTime] = useState<Date>(new Date())
	const [allocationStartTime, setAllocationStartTime] = useState<Date>(
		new Date()
	)

	const lastRoundFetched = useAppSelector(state => state.round.lastRoundFetched)

	const { qVSimpleStrategy } = getContracts()

	const getStates = async () => {
		if (!recipientId) return

		setAllocationEndTime(
			new Date(convertTimestampToDate(round.allocationEndTime))
		)
		setAllocationStartTime(
			new Date(convertTimestampToDate(round.allocationStartTime))
		)

		const recipientData: any[] = await qVSimpleStrategy(
			ROUND_ADDRESS
		).getRecipient(project.recipientId)

		console.table(recipientData)
	}

	useEffect(() => {
		getStates()
		if (!lastRoundFetched) {
			dispatch(getLastRound())
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [address])
	return (
		<section className='p-2 md:p-10 h-[max(100%, fit-content)] w-full'>
			<Suspense
				fallback={
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
				}
			>
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
								<button className='btn btn-green text-lg px-20'>Donate</button>
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
							{round.distributed && (
								<header>
									<h4 className=''>Distributed:</h4>
									<h5>1000 DAI 💸</h5>
								</header>
							)}
							{!round.distributed &&
								Date.now() > allocationEndTime.getTime() && (
									<p className='font-bold p-1 text-center rounded-xl bg-customGreen/70 text-white'>
										Waiting distribution
									</p>
								)}
							{recipientId !== address &&
								Date.now() > allocationStartTime.getTime() &&
								Date.now() < allocationEndTime.getTime() && (
									<Dialog>
										<DialogTrigger>
											<button className='btn btn-green text-lg md:px-16'>
												Donate
											</button>
										</DialogTrigger>
										<DonateModal round={round} project={project} />
									</Dialog>
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
			</Suspense>
		</section>
	)
}

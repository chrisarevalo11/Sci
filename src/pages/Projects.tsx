import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useAccount } from 'wagmi'

import CreateCard from '@/components/projects/CreateCard'
import DistributeCard from '@/components/projects/DistributeCard'
import ProjectCard from '@/components/projects/ProjectCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Project } from '@/models/project.model'
import { Round } from '@/models/round.model'
import { AppDispatch, useAppSelector } from '@/store'
import { getRound } from '@/store/thunks/round.thunk'
import { convertTimestampToDate } from '@/utils'
import { SCI_ADMIN_ADDRESS } from '@/utils/variables/constants'

export default function Projects(): JSX.Element {
	const dispatch = useDispatch<AppDispatch>()

	const { address } = useAccount()
	const lastRound: Round = useAppSelector(state => state.round.lastRound)
	const lastRoundFetched = useAppSelector(state => state.round.lastRoundFetched)

	const projects: Project[] = lastRound.projects

	const [registraionStartTime, setRegistrationStartTime] = useState<Date>(
		new Date()
	)
	const [registraionEndTime, setRegistrationEndTime] = useState<Date>(
		new Date()
	)

	const [allocationStartTime, setAllocationStartTime] = useState<Date>(
		new Date()
	)
	const [allocationEndTime, setAllocationEndTime] = useState<Date>(new Date())

	const getStates = async () => {
		setRegistrationStartTime(
			new Date(convertTimestampToDate(lastRound.registrationStartTime))
		)
		setRegistrationEndTime(
			new Date(convertTimestampToDate(lastRound.registrationEndTime))
		)
		setAllocationStartTime(
			new Date(convertTimestampToDate(lastRound.allocationStartTime))
		)
		setAllocationEndTime(
			new Date(convertTimestampToDate(lastRound.allocationEndTime))
		)
	}

	useEffect(() => {
		getStates()
		if (!lastRoundFetched) {
			dispatch(getRound())
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lastRoundFetched])

	return (
		<section className='w-full h-[max(100%, fit-content)] p-4 md:p-10 relative md:overflow-hidden'>
			<header className='flex justify-end pb-3 border-b-4 items-center border-customBlack border-dashed'>
				<h2>Projects</h2>
			</header>
			<div className='grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 mt-10 justify-items-center'>
				{new Date() > allocationEndTime && address === SCI_ADMIN_ADDRESS ? (
					<DistributeCard projects={projects} round={lastRound} />
				) : (
					new Date() > registraionStartTime &&
					new Date() < registraionEndTime && <CreateCard />
				)}
				{!lastRoundFetched ? (
					Array.from({ length: 12 }).map((_, index) => (
						<Skeleton
							key={index}
							className='!w-[290px] !h-[300px] rounded-tl-xl rounded-br-xl'
						/>
					))
				) : (
					<>
						{projects.map((project: Project) => (
							<ProjectCard
								project={project}
								round={lastRound}
								key={project.name}
							/>
						))}
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

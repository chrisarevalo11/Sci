import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useAccount } from 'wagmi'

import CreateCard from '@/components/projects/CreateCard'
import DistributeCard from '@/components/projects/DistributeCard'
import ProjectCard from '@/components/projects/ProjectCard'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Project } from '@/models/project.model'
import { Round } from '@/models/round.model'
import { AppDispatch, useAppSelector } from '@/store'
import { setRound } from '@/store/slides/roundslice'
import { getLastRound, getRounds } from '@/store/thunks/round.thunk'
import { convertTimestampToDate } from '@/utils'
import { SCI_ADMIN_ADDRESS } from '@/utils/variables/constants'

export default function Projects(): JSX.Element {
	const { address } = useAccount()

	const dispatch = useDispatch<AppDispatch>()

	const [allocationEndTime, setAllocationEndTime] = useState<Date>(new Date())
	const [registrationEndTime, setRegistrationEndTime] = useState<Date>(
		new Date()
	)
	const [registrationStartTime, setRegistrationStartTime] = useState<Date>(
		new Date()
	)

	const lastRound: Round = useAppSelector(state => state.round.lastRound)
	const lastRoundFetched = useAppSelector(state => state.round.lastRoundFetched)
	const rounds: Round[] = useAppSelector(state => state.round.rounds)
	const roundsFetched = useAppSelector(state => state.round.roundsFetched)

	const projects: Project[] = lastRound.projects

	const getStates = async () => {
		setRegistrationStartTime(
			new Date(convertTimestampToDate(lastRound.registrationStartTime))
		)
		setRegistrationEndTime(
			new Date(convertTimestampToDate(lastRound.registrationEndTime))
		)

		setAllocationEndTime(
			new Date(convertTimestampToDate(lastRound.allocationEndTime))
		)
	}

	// TODO: function isn't work
	const changeRound = async (id: number) => {
		const roundSelected: Round | undefined = rounds.find(
			round => round.id === id
		)

		if (roundSelected) {
			dispatch(setRound(roundSelected))
		}
	}

	useEffect(() => {
		getStates()
		if (!lastRoundFetched) {
			dispatch(getLastRound())
		}

		if (!roundsFetched) {
			dispatch(getRounds())
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [address, lastRoundFetched, roundsFetched])

	return (
		<section className='w-full h-[max(100%, fit-content)] p-4 md:p-10 relative md:overflow-hidden'>
			<header className='flex md:justify-between justify-end pb-3 border-b-4 items-center border-customBlack border-dashed'>
				<Select>
					<SelectTrigger className='w-[180px]'>
						<SelectValue placeholder='Rounds' />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{rounds.map(round => (
								<SelectItem
									key={round.id}
									value={round.id.toString()}
									onClick={() => changeRound(round.id)}
									disabled={!roundsFetched}
								>
									{`Round ${round.id}`}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
				<h2>Projects</h2>
			</header>
			<div className='grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 mt-10 justify-items-center'>
				{roundsFetched ? (
					<>
						{!lastRound.distributed &&
							new Date() > allocationEndTime &&
							address === SCI_ADMIN_ADDRESS && (
								<DistributeCard projects={projects} round={lastRound} />
							)}
						{!lastRound.projects.some(
							projects => projects.recipientId === address
						) &&
							new Date() > registrationStartTime &&
							new Date() < registrationEndTime &&
							address !== SCI_ADMIN_ADDRESS && <CreateCard />}
						{lastRoundFetched &&
							projects.map((project: Project) => (
								<ProjectCard
									project={project}
									round={lastRound}
									key={project.name}
								/>
							))}
					</>
				) : (
					Array.from({ length: 9 }).map((_, index) => (
						<Skeleton
							key={index}
							className='!w-[290px] !h-[300px] rounded-tl-xl rounded-br-xl'
						/>
					))
				)}
			</div>
		</section>
	)
}

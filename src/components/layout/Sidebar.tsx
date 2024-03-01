import { useEffect, useState } from 'react'

import Countdown from '@/components/layout/Countdown'
import StatCard from '@/components/layout/StatCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Round } from '@/models/round.model'
import { useAppSelector } from '@/store'
import { convertTimestampToDate } from '@/utils'

export default function Sidebar(): JSX.Element {
	const lastRound: Round = useAppSelector(state => state.round.lastRound)

	const lastRoundFetched: boolean = useAppSelector(
		state => state.round.lastRoundFetched
	)

	const [allocationEndTime, setAllocationEndTime] = useState<Date>(new Date())
	const [registraionStartTime, setRegistrationStartTime] = useState<Date>(
		new Date()
	)
	const [registraionEndTime, setRegistrationEndTime] = useState<Date>(
		new Date()
	)

	const getStates = async () => {
		setAllocationEndTime(
			new Date(convertTimestampToDate(lastRound.allocationEndTime))
		)
		setRegistrationEndTime(
			new Date(convertTimestampToDate(lastRound.registrationEndTime))
		)
		setRegistrationStartTime(
			new Date(convertTimestampToDate(lastRound.registrationStartTime))
		)
	}

	useEffect(() => {
		getStates()

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lastRoundFetched])

	return (
		<>
			<div className='h-full bg-black md:flex hidden flex-col justify-around xl:justify-start pb-1 2xl:pb-3 xl:gap-6 px-4 text-customWhite text-left'>
				{!lastRoundFetched ? (
					<div className='flex flex-col space-y-3'>
						<Skeleton className='h-[200px] w-full rounded-xl' />
						<div className='space-y-4'>
							<Skeleton className='h-4 w-full rounded-xl' />
							<Skeleton className='h-4 w-full rounded-xl' />
							<div className='mt-10 space-y-4'>
								<Skeleton className='h-10 w-full' />
								<Skeleton className='h-10 w-full' />
								<Skeleton className='h-10 w-full' />
								<Skeleton className='h-10 w-full' />
							</div>
						</div>
					</div>
				) : (
					<>
						<img
							src={lastRound.image}
							alt='Round Thumbnail'
							className='h-[150px] w-full rounded-xl'
						/>
						<header>
							<h5>{lastRound.name}</h5>
							<div className='flex items-center gap-2 mt-2'>
								<div
									className={`size-2 rounded-full ${
										new Date() > registraionStartTime &&
										new Date() < registraionEndTime
											? 'bg-green-700'
											: 'bg-red-700'
									}`}
								></div>
								{new Date() > registraionStartTime &&
								new Date() < registraionEndTime
									? ' Opened'
									: ' Closed'}
							</div>
						</header>
						{lastRound.distributed ? (
							<section className='space-2 2xl:space-y-4'>
								<StatCard title='Round completed' stat={''} />
							</section>
						) : null}
						{Date.now() < registraionEndTime.getTime() ? (
							<div className='flex items-center justify-between px-2 gap-4'>
								<h5 className='flex flex-col text-left'>
									<span>Registra...</span> <span>time</span>
								</h5>
								<Countdown targetDate={registraionEndTime} />
							</div>
						) : Date.now() < allocationEndTime.getTime() ? (
							<div className='flex items-center justify-between px-2 gap-4'>
								<h5 className='flex flex-col text-left'>
									<span>Votin...</span> <span>time</span>
								</h5>
								<Countdown targetDate={allocationEndTime} />
							</div>
						) : null}
						<section className='space-y-2 2xl:space-y-4'>
							<StatCard
								title='Total in pool'
								stat={`${lastRound.totalPool} DAI`}
							/>
							<StatCard
								title='Matching pool'
								stat={`${lastRound.machingPool} DAI`}
							/>
							<StatCard
								title='Total donations'
								stat={`${lastRound.donations} DAI`}
							/>
							<StatCard
								title='Total donators'
								stat={`${lastRound.donators.length ? lastRound.donators.length : 0}`}
							/>
						</section>
					</>
				)}
			</div>
		</>
	)
}
